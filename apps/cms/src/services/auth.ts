import { apiClient, TOKEN_STORAGE_KEY, toItem, USER_STORAGE_KEY } from '../lib/http';
import type { UserProfile } from '../types';

interface LoginResult {
  token: string;
  user: UserProfile;
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
