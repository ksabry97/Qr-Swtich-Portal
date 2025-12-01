const pemHeaderRegex = /-----BEGIN [\w\s]+-----/;
const pemFooterRegex = /-----END [\w\s]+-----/;

function stripPemMarkers(pem: string): string {
  return pem.replace(pemHeaderRegex, '').replace(pemFooterRegex, '').replace(/\s+/g, '');
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const sanitized = base64.replace(/\s+/g, '');
  const binaryString = atob(sanitized);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes.buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

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
  const jsonPayload = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const encodedPayload = new TextEncoder().encode(jsonPayload);

  const encrypted = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, encodedPayload);

  return arrayBufferToBase64(encrypted);
}

export async function rsaDecryptWithPrivateKey(
  cipherBase64: string,
  privateKeyPem: string
): Promise<any> {
  if (!privateKeyPem) throw new Error('RSA private key is not configured');

  const privateKey = await importRsaPrivateKey(privateKeyPem);
  const cipherBuffer = base64ToArrayBuffer(cipherBase64);

  const decrypted = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, cipherBuffer);
  const decoded = new TextDecoder().decode(decrypted);

  try {
    return JSON.parse(decoded);
  } catch {
    return decoded;
  }
}

