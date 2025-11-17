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
      //@ts-ignore
      salt: key,
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
