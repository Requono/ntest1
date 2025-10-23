export const deriveMasterPassword = async (
  password: string,
  email: string,
  iterations: number
) => {
  const passwordBuffer = new TextEncoder().encode(password);
  const emailBuffer = new TextEncoder().encode(email);

  const importedKey = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    {
      name: "PBKDF2",
    },
    false,
    ["deriveKey"]
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: emailBuffer,
      iterations,
      hash: { name: "SHA-256" },
    },
    importedKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  return Buffer.from(await crypto.subtle.exportKey("raw", derivedKey));
};

export const deriveEncryptionKeyFromMasterPassword = async (
  password: string,
  email: string,
  iterations: number
) => {
  const passwordBuffer = new TextEncoder().encode(password);
  const emailBuffer = new TextEncoder().encode(email);

  const importedKey = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    {
      name: "PBKDF2",
    },
    false,
    ["deriveKey"]
  );

  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: emailBuffer,
      iterations,
      hash: { name: "SHA-256" },
    },
    importedKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
};

export const deriveLoginHash = async (
  password: string,
  email: string,
  iterations: number
) => {
  const key = await deriveMasterPassword(password, email, iterations);

  const passwordBuffer = new TextEncoder().encode(password);

  const importedKey = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    {
      name: "PBKDF2",
    },
    false,
    ["deriveKey"]
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: new Uint8Array(key),
      iterations,
      hash: { name: "SHA-256" },
    },
    importedKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  const loginHashBuffer = Buffer.from(
    await crypto.subtle.exportKey("raw", derivedKey)
  );

  return btoa(String.fromCharCode(...new Uint8Array(loginHashBuffer)));
};

export function base64ToArray(data: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
}

export const encryptData = async (object: Object, encryptionKey: CryptoKey) => {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // Generate a random 96-bit initialization vector (IV)

  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(object));

  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    encryptionKey,
    data
  );

  const encryptedDataToBase64 = btoa(
    String.fromCharCode(...new Uint8Array(encryptedData))
  );

  const ivToBase64 = btoa(String.fromCharCode(...new Uint8Array(iv)));

  return `${encryptedDataToBase64}|${ivToBase64}`;
};

export const decryptData = async (
  rawEncryptedData: string,
  encryptionKey: CryptoKey
) => {
  if (!rawEncryptedData.includes("|")) {
    throw new Error("Invalid encrypted data!");
  }

  const [encryptedDataToBase64, ivBase64] = rawEncryptedData.split("|");

  const encryptedData = base64ToArray(encryptedDataToBase64);

  const iv = base64ToArray(ivBase64);

  const decryptedData = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    encryptionKey,
    encryptedData
  );

  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(decryptedData));
};
