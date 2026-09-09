/**
 * Services that do not fit the plain CRUD shape: the dashboard aggregate, the
 * contacts inbox (status updates instead of edits), and the signed-in user's
 * own profile.
 */
import { apiClient, toItem, toList } from '../lib/http';
import type { Blog, Contact, UserProfile } from '../types';
import { normalizeContact } from './normalizers';
import { resolveCurrentUserId } from './auth';

export interface DashboardStats {
  counts: Record<string, number | string | undefined>;
  recentActivity: {
    contacts: Contact[];
    blogs: Blog[];
  };
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get('/admin/dashboard/stats');
    const payload = toItem<any>(data);

    return {
      counts: payload?.counts ?? {},
      recentActivity: {
        contacts: Array.isArray(payload?.recentActivity?.contacts)
          ? payload.recentActivity.contacts.map(normalizeContact)
          : [],
        blogs: Array.isArray(payload?.recentActivity?.blogs)
          ? payload.recentActivity.blogs
          : [],
      },
    };
  },
};

export const contactService = {
  getContacts: async (): Promise<Contact[]> => {
    const { data } = await apiClient.get('/admin/contacts');
    return toList<any>(data).map(normalizeContact);
  },

  updateStatus: async (id: string, status: Contact['status']): Promise<Contact> => {
    const { data } = await apiClient.patch(`/admin/contacts/${id}/status`, { status });
    return normalizeContact(toItem<any>(data));
  },

  deleteContact: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/contacts/${id}`);
  },
};

/**
 * The signed-in user's own record.
 *
 * These use the self-service `/auth/me` routes rather than `/admin/users/:id`,
 * which is Admin-only — content writers could not previously view or edit
 * their own profile, or change their own password, without a 403.
 *
 * The server identifies the user from the JWT, so no id is sent.
 */
export const profileService = {
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await apiClient.get('/auth/me');
    return toItem<UserProfile>(data);
  },

  updateProfile: async (
    payload: Pick<UserProfile, 'name' | 'email' | 'avatar'>,
  ): Promise<UserProfile> => {
    const { data } = await apiClient.patch('/auth/me', payload);
    return toItem<UserProfile>(data);
  },

  /**
   * The current password is verified server-side, so a stolen token alone
   * cannot be used to lock the real owner out of their account.
   */
  changePassword: async (
    currentPassword: string,
    newPassword: string,
  ): Promise<void> => {
    await apiClient.patch('/auth/me/password', { currentPassword, newPassword });
  },
};
