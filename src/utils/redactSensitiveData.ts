// src/shared/utils/redactSensitiveData.ts (New file)

// Define sensitive keys to be redacted
const SENSITIVE_KEYS = [
  "password",
  "oldPassword",
  "newPassword",
  "confirmPassword",
  "token",
  "accessToken",
  "refreshToken",
  "clientSecret",
  "apiKey",
  // Add any other sensitive keys you might use
];

export function redactSensitiveData<T>(data: T): T {
  if (data === null || typeof data !== "object") {
    return data;
  }

  // Handle Arrays
  if (Array.isArray(data)) {
    return data.map((item) => redactSensitiveData(item)) as T;
  }

  // Handle Objects
  const redactedData: any = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      if (SENSITIVE_KEYS.includes(key as string)) {
        redactedData[key] = "[REDACTED]";
      } else if (typeof data[key] === "object") {
        redactedData[key] = redactSensitiveData(data[key]);
      } else {
        redactedData[key] = data[key];
      }
    }
  }
  return redactedData as T;
}
