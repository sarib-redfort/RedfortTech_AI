import { apiClient, TOKEN_STORAGE_KEY, toItem, USER_STORAGE_KEY } from '../lib/http';
import type { UserProfile } from '../types';

interface LoginResult {
  token: string;
  user: UserProfile;
}

/**
 * Reads the signed-in user's id from whatever source is available.
 *
 * Falls back through the persisted user object and then the JWT claims,
 * because the profile screen can mount before the user object is rehydrated.
 */
export function resolveCurrentUserId(): string | undefined {
  try {
    const saved = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null');
    const candidate = saved?.id ?? saved?._id ?? saved?.userId;
    if (candidate != null && String(candidate).trim() !== '') return String(candidate);
  } catch {
    // A malformed stored user is not fatal; fall through to the token.
  }

  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const parts = token ? token.split('.') : [];
    if (parts.length === 3) {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const claims = JSON.parse(atob(base64));
      const candidate = claims?.id ?? claims?._id ?? claims?.userId ?? claims?.sub;
      if (candidate != null && String(candidate).trim() !== '') return String(candidate);
    }
  } catch {
    // An unreadable token means "not signed in", which the caller handles.
  }

  return undefined;
}

export const authService = {
  /**
   * Exchanges credentials for a JWT and persists it.
   *
   * Nothing here is logged: an earlier version wrote the submitted password to
   * the browser console on every attempt.
   */
  login: async (email: string, password: string): Promise<LoginResult> => {
    const response = await apiClient.post('/auth/login', { email, password });
    const payload = toItem<any>(response.data);

    const token =
      payload?.accessToken ?? payload?.token ?? payload?.jwt ?? payload?.authToken;

    if (!token) {
      throw new Error('Login failed: the server did not return a token.');
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, token);

    const rawUser = payload?.user ?? payload?.profile ?? {};
    const rawId = rawUser?.id ?? rawUser?._id ?? rawUser?.userId ?? rawUser?.sub;
    const user = (rawId != null ? { ...rawUser, id: String(rawId) } : rawUser) as UserProfile;

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

    return { token, user };
  },

  logout: (): void => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  getStoredToken: (): string | null => localStorage.getItem(TOKEN_STORAGE_KEY),
};
