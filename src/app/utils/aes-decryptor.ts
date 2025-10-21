function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++)
    binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export async function decryptBackendResponse(
  base64Cipher: string,
  base64Key: string
): Promise<any> {
  // Convert base64 → bytes
  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  };

  const combined = new Uint8Array(base64ToArrayBuffer(base64Cipher));

  // Split by your backend’s order
  const iv = combined.slice(0, 12);
  const tag = combined.slice(12, 28);
  const ciphertext = combined.slice(28);

  // Merge ciphertext + tag (WebCrypto expects them together)
  const cipherWithTag = new Uint8Array(ciphertext.length + tag.length);
  cipherWithTag.set(ciphertext);
  cipherWithTag.set(tag, ciphertext.length);

  // Import key
  const rawKey = base64ToArrayBuffer(base64Key);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    cipherWithTag
  );

  const decoder = new TextDecoder();
  const json = decoder.decode(decrypted);
  return JSON.parse(json);
}

export async function encryptBackendRequest(data: any, base64Key: string) {
  const base64ToArrayBuffer = (base64: string) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++)
      binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const rawKey = base64ToArrayBuffer(base64Key);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const encoder = new TextEncoder();
  const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
  const encodedData = encoder.encode(jsonData);

  // Generate random IV (12 bytes)
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encodedData
  );

  const encryptedBytes = new Uint8Array(encryptedBuffer);

  // Split into ciphertext + tag (last 16 bytes)
  const tag = encryptedBytes.slice(encryptedBytes.length - 16);
  const ciphertext = encryptedBytes.slice(0, encryptedBytes.length - 16);

  // Combine IV + TAG + CIPHERTEXT (same order as backend)
  const combined = new Uint8Array(iv.length + tag.length + ciphertext.length);
  combined.set(iv, 0);
  combined.set(tag, iv.length);
  combined.set(ciphertext, iv.length + tag.length);

  return arrayBufferToBase64(combined.buffer);
}
