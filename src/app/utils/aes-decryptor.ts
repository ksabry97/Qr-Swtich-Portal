export async function decryptBackendResponse(
  base64Cipher: string,
  base64Key: string
): Promise<any> {
  // Helper: convert base64 to ArrayBuffer
  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  };

  // Convert inputs
  const combinedBuffer = new Uint8Array(base64ToArrayBuffer(base64Cipher));
  const iv = combinedBuffer.slice(0, 12); // first 12 bytes = IV
  const ciphertext = combinedBuffer.slice(12);

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
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    ciphertext
  );

  // Decode result back to JSON
  const decoder = new TextDecoder();
  const jsonString = decoder.decode(decryptedBuffer);
  return JSON.parse(jsonString);
}
