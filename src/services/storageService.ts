/**
 * storageService.ts
 * AsyncStorage wrapper — hides async complexity from consumers.
 * Drop-in replacement for localStorage patterns used in the web version.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Generic Helpers ──────────────────────────────────────────────────────────

/**
 * Get a string value. Returns null if not found or on error.
 */
export async function getItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Set a string value. Returns true on success.
 */
export async function setItem(key: string, value: string): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Remove a key. Returns true on success.
 */
export async function removeItem(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get a parsed JSON value. Returns null if not found, not parseable, or on error.
 */
export async function getJSON<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Set a JSON-serializable value. Returns true on success.
 */
export async function setJSON<T>(key: string, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear all keys. Use with caution.
 */
export async function clearAll(): Promise<boolean> {
  try {
    await AsyncStorage.clear();
    return true;
  } catch {
    return false;
  }
}

// ─── User ID ──────────────────────────────────────────────────────────────────

const USER_ID_KEY = 'ai-chat-user-id';

/**
 * Returns the persistent user ID, creating one if it doesn't exist.
 * Equivalent to the web version's getPersistentUserId() but async.
 */
export async function getPersistentUserId(): Promise<string> {
  const existing = await getItem(USER_ID_KEY);
  if (existing) return existing;

  const created = 'guest-' + Math.random().toString(36).slice(2, 8);
  await setItem(USER_ID_KEY, created);
  return created;
}

// ─── Typed Storage Sections ───────────────────────────────────────────────────

const KEYS = {
  userId: 'ai-chat-user-id',
  lastConversationId: 'ai-chat-last-conversation-id',
  draftMessage: 'ai-chat-draft-message',
} as const;

export const Storage = {
  /**
   * Get or create the persistent user ID.
   */
  getUserId: getPersistentUserId,

  /**
   * Save the last active conversation ID so we can restore it on next launch.
   */
  saveLastConversationId: (id: string) => setItem(KEYS.lastConversationId, id),

  /**
   * Get the last active conversation ID.
   */
  getLastConversationId: () => getItem(KEYS.lastConversationId),

  /**
   * Save a draft message (e.g. if user closes app mid-typing).
   */
  saveDraft: (text: string) => setItem(KEYS.draftMessage, text),

  /**
   * Get the saved draft message.
   */
  getDraft: () => getItem(KEYS.draftMessage),

  /**
   * Clear the draft message.
   */
  clearDraft: () => removeItem(KEYS.draftMessage),
} as const;
