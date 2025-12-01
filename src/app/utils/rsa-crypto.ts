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
      // Many backends default to SHA-1 for OAEP; use SHA-1 for compatibility.
      hash: 'SHA-256',
    },
    false,
    ['encrypt']
  );
}

async function importRsaPrivateKey(
  pem: string,
  hash: 'SHA-1' | 'SHA-256'
): Promise<CryptoKey> {
  if (!pem) throw new Error('Missing RSA private key');

  const normalized = stripPemMarkers(pem);
  const keyBuffer = base64ToArrayBuffer(normalized);

  // Try to import as PKCS#8 first. If that fails, assume it's PKCS#1 and wrap it.
  try {
    return await crypto.subtle.importKey(
      'pkcs8',
      keyBuffer,
      {
        name: 'RSA-OAEP',
        hash,
      },
      false,
      ['decrypt']
    );
  } catch {
    const pkcs8Wrapped = convertPkcs1ToPkcs8(keyBuffer);

    return crypto.subtle.importKey(
      'pkcs8',
      pkcs8Wrapped,
      {
        name: 'RSA-OAEP',
        hash,
      },
      false,
      ['decrypt']
    );
  }
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

  return encryptedParts.join('|');
}

export async function rsaDecryptWithPrivateKey(
  cipherBase64: string | null | any,
  privateKeyPem: string
): Promise<any> {
  if (!privateKeyPem) throw new Error('RSA private key is not configured');
  if (!cipherBase64 || typeof cipherBase64 !== 'string') {
    throw new Error('Missing or invalid RSA cipher text');
  }

  // Support both "."-separated and "|"-separated cipher formats and strip whitespace.
  const separator = cipherBase64.includes('|') ? '|' : '.';
  const segments = cipherBase64
    .split(separator)
    .map((segment: string) => segment.replace(/\s+/g, '').trim())
    .filter(Boolean);

  const decryptedChunks: Uint8Array[] = [];

  for (const segment of segments) {
    const cipherBuffer = base64ToArrayBuffer(segment);

    let decryptedBuffer: ArrayBuffer;
    try {
      // Try OAEP with SHA-1 first (very common default).
      const privateKeySha1 = await importRsaPrivateKey(privateKeyPem, 'SHA-1');
      decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'RSA-OAEP' },
        privateKeySha1,
        cipherBuffer
      );
    } catch (eSha1) {
      console.warn(
        'RSA-OAEP SHA-1 decryption failed, trying SHA-256...',
        eSha1
      );

      try {
        const privateKeySha256 = await importRsaPrivateKey(
          privateKeyPem,
          'SHA-256'
        );
        decryptedBuffer = await crypto.subtle.decrypt(
          { name: 'RSA-OAEP' },
          privateKeySha256,
          cipherBuffer
        );
      } catch (eSha256) {
        console.error('RSA decryption failed for segment', {
          segmentLength: segment.length,
          cipherByteLength: cipherBuffer.byteLength,
          errorSha1: eSha1,
          errorSha256: eSha256,
        });
        throw new Error(
          'RSA decryption failed with both SHA-1 and SHA-256. Cipher text or key/algorithm mismatch.'
        );
      }
    }

    decryptedChunks.push(new Uint8Array(decryptedBuffer));
  }

  const combinedBytes = concatUint8Arrays(decryptedChunks);
  const decoded = new TextDecoder().decode(combinedBytes);

  try {
    console.log(JSON.parse(decoded));
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

// Encode ASN.1 length
function encodeAsn1Length(length: number): number[] {
  if (length < 0x80) return [length];

  const bytes: number[] = [];
  let temp = length;
  while (temp > 0) {
    bytes.unshift(temp & 0xff);
    temp >>= 8;
  }

  return [0x80 | bytes.length, ...bytes];
}

// Wrap a PKCS#1 RSA private key (RSAPrivateKey) into a PKCS#8 PrivateKeyInfo
function convertPkcs1ToPkcs8(pkcs1: ArrayBuffer): ArrayBuffer {
  const pkcs1Bytes = new Uint8Array(pkcs1);

  // rsaEncryption OID 1.2.840.113549.1.1.1
  const rsaOid = [0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01];

  // AlgorithmIdentifier ::= SEQUENCE { algorithm OBJECT IDENTIFIER, parameters ANY DEFINED BY algorithm OPTIONAL }
  const algIdBody = [
    0x06,
    rsaOid.length,
    ...rsaOid,
    0x05,
    0x00, // NULL
  ];

  const algIdSeq = [0x30, ...encodeAsn1Length(algIdBody.length), ...algIdBody];

  // privateKey OCTET STRING wrapping the PKCS#1 key
  const privateKeyOctetString = [
    0x04,
    ...encodeAsn1Length(pkcs1Bytes.length),
    ...Array.from(pkcs1Bytes),
  ];

  // PrivateKeyInfo ::= SEQUENCE { version INTEGER, privateKeyAlgorithm AlgorithmIdentifier, privateKey OCTET STRING }
  const version = [0x02, 0x01, 0x00]; // INTEGER 0

  const pkcs8Body = [...version, ...algIdSeq, ...privateKeyOctetString];

  const pkcs8Seq = [0x30, ...encodeAsn1Length(pkcs8Body.length), ...pkcs8Body];

  return new Uint8Array(pkcs8Seq).buffer;
}

function cloneBuffer(view: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(view.length);
  copy.set(view);
  return copy.buffer;
}
