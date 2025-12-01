const pemHeaderRegex = /-----BEGIN [\w\s]+-----/;
const pemFooterRegex = /-----END [\w\s]+-----/;

function stripPemMarkers(pem: string): string {
  return pem
    .replace(pemHeaderRegex, '')
    .replace(pemFooterRegex, '')
    .replace(/\s+/g, '');
}

function base64ToArrayBuffer(base64url: string): ArrayBuffer {
  if (!base64url) return new ArrayBuffer(0);

  // Convert from Base64URL → Base64
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) base64 += '=';

  try {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    console.log(bytes.buffer);
    return bytes.buffer;
  } catch (e) {
    console.error('Invalid Base64 input:', e);
    return new ArrayBuffer(0);
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++)
    binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

const MAX_RSA_CHUNK_SIZE = 190;

async function importRsaPublicKey(pem: string): Promise<CryptoKey> {
  if (!pem) throw new Error('Missing RSA public key');

  const normalized = stripPemMarkers(pem);
  const keyBuffer = base64ToArrayBuffer(normalized);

  return crypto.subtle.importKey(
    'spki',
    keyBuffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    ['encrypt']
  );
}

async function importRsaPrivateKey(pem: string): Promise<CryptoKey> {
  if (!pem) throw new Error('Missing RSA private key');

  const normalized = stripPemMarkers(pem);
  const keyBuffer = base64ToArrayBuffer(normalized);

  return crypto.subtle.importKey(
    'pkcs8',
    keyBuffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    ['decrypt']
  );
}

export async function rsaEncryptWithPublicKey<T = unknown>(
  payload: T,
  publicKeyPem: string
): Promise<string> {
  if (!publicKeyPem) throw new Error('RSA public key is not configured');

  const publicKey = await importRsaPublicKey(publicKeyPem);
  const jsonPayload =
    typeof payload === 'string' ? payload : JSON.stringify(payload);
  const encodedPayload = new TextEncoder().encode(jsonPayload);

  const chunks = chunkUint8Array(encodedPayload, MAX_RSA_CHUNK_SIZE);
  const encryptedParts: string[] = [];

  for (const chunk of chunks) {
    const chunkBuffer = cloneBuffer(chunk);
    const encrypted = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      chunkBuffer
    );
    encryptedParts.push(arrayBufferToBase64(encrypted));
  }

  return encryptedParts.join('.');
}

export async function rsaDecryptWithPrivateKey(
  cipherBase64: string | null | any,
  privateKeyPem: string
): Promise<any> {
  if (!privateKeyPem) throw new Error('RSA private key is not configured');

  const privateKey = await importRsaPrivateKey(privateKeyPem);
  const segments = cipherBase64
    .split('.')
    .map((segment: any) => segment.trim())
    .filter(Boolean);
  const decryptedChunks: Uint8Array[] = [];

  for (const segment of segments) {
    console.log(base64ToArrayBuffer(segment), '222222222222222222');
    const cipherBuffer = base64ToArrayBuffer(segment);

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateKey,
      cipherBuffer
    );

    decryptedChunks.push(new Uint8Array(decryptedBuffer));
  }

  const combinedBytes = concatUint8Arrays(decryptedChunks);
  const decoded = new TextDecoder().decode(combinedBytes);

  try {
    return JSON.parse(decoded);
  } catch {
    return decoded;
  }
}

function chunkUint8Array(bytes: Uint8Array, size: number): Uint8Array[] {
  const chunks: Uint8Array[] = [];
  for (let i = 0; i < bytes.length; i += size) {
    chunks.push(bytes.slice(i, i + size));
  }
  return chunks;
}

function concatUint8Arrays(chunks: Uint8Array[]): Uint8Array {
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

function cloneBuffer(view: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(view.length);
  copy.set(view);
  return copy.buffer;
}
