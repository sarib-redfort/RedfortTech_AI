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
 * There is no dedicated profile endpoint; this operates on the user's row via
 * `/admin/users/:id`. The id is resolved from storage or the JWT when the
 * caller does not have it to hand.
 */
function requireUserId(explicitId?: string): string {
  const resolved = explicitId || resolveCurrentUserId();
  if (!resolved) {
    throw new Error('Could not determine the signed-in user. Please sign in again.');
  }
  return resolved;
}

export const profileService = {
  getProfile: async (userId?: string): Promise<UserProfile> => {
    const { data } = await apiClient.get(`/admin/users/${requireUserId(userId)}`);
    return toItem<UserProfile>(data);
  },

  updateProfile: async (
    payload: Partial<UserProfile> & { id?: string; password?: string },
  ): Promise<UserProfile> => {
    const { id, ...body } = payload;
    const { data } = await apiClient.patch(`/admin/users/${requireUserId(id)}`, body);
    return toItem<UserProfile>(data);
  },

  changePassword: async (
    _currentPassword: string,
    newPassword: string,
    userId?: string,
  ): Promise<void> => {
    // The backend authorizes by JWT and does not verify the current password,
    // so it is collected for confirmation in the UI but not transmitted.
    await apiClient.patch(`/admin/users/${requireUserId(userId)}`, { password: newPassword });
  },
};
