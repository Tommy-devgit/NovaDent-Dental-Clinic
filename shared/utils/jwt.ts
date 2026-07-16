type JwtPayload = Record<string, unknown> & {
  exp?: number;
  iat?: number;
};

function base64UrlEncode(input: ArrayBuffer | Uint8Array | string): string {
  const bytes =
    typeof input === "string"
      ? new TextEncoder().encode(input)
      : input instanceof Uint8Array
        ? input
        : new Uint8Array(input);

  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/u, "");
}

function base64UrlDecode(input: string): Uint8Array {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function importHmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function signJwt(payload: JwtPayload, secret: string, expiresInSeconds = 60 * 60 * 24 * 7) {
  const header = { alg: "HS256", typ: "JWT" };
  const issuedAt = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    ...payload,
    iat: issuedAt,
    exp: issuedAt + expiresInSeconds,
  } satisfies JwtPayload;

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = await crypto.subtle.sign(
    "HMAC",
    await importHmacKey(secret),
    new TextEncoder().encode(data),
  );

  return `${data}.${base64UrlEncode(signature)}`;
}

export async function verifyJwt<TPayload extends JwtPayload>(token: string, secret: string) {
  const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");

  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    return null;
  }

  const data = `${encodedHeader}.${encodedPayload}`;
  const key = await importHmacKey(secret);
  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlDecode(encodedSignature).buffer as ArrayBuffer,
    new TextEncoder().encode(data),
  );

  if (!isValid) {
    return null;
  }

  const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(encodedPayload))) as TPayload;

  if (typeof payload.exp === "number" && payload.exp * 1000 < Date.now()) {
    return null;
  }

  return payload;
}