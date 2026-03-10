import * as Crypto from 'expo-crypto';

/**
 * Generate a UUID v4 using Expo Crypto
 * This works in Expo Go without custom native code
 */
export function generateUUID(): string {
  return Crypto.randomUUID();
}

export default generateUUID;
