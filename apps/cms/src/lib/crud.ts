import { apiClient, getAllPages, isFormData, toItem } from './http';
import { logger } from './logger';

/**
 * Builds a standard CRUD client for one admin resource.
 *
 * Every resource in this CMS exposed the same four operations against
 * `/admin/<resource>`, each hand-written with its own payload unwrapping and
 * console logging. They are generated from this factory instead, so a change
 * to error handling or response shape happens in one place.
 *
 * `normalize` maps a raw API record onto the shape the views expect, filling
 * defaults for fields the backend may omit.
 */
export interface CrudService<T, TCreate = unknown, TUpdate = TCreate> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T>;
  create(payload: TCreate): Promise<T>;
  update(id: string, payload: TUpdate): Promise<T>;
  remove(id: string): Promise<void>;
}

export interface CrudOptions<T> {
  /** Path segment under /admin, e.g. "blogs" for /admin/blogs. */
  resource: string;
  /** Maps one raw record to the view model. Defaults to identity. */
  normalize?: (raw: any) => T;
}

/** Records arrive with `id` or Mongo-style `_id`; views always expect `id`. */
export function withId<T extends { id?: string }>(raw: any): T {
  return { ...raw, id: raw?.id ?? raw?._id } as T;
}

export function createCrudService<T, TCreate = unknown, TUpdate = TCreate>({
  resource,
  normalize = withId as (raw: any) => T,
}: CrudOptions<T>): CrudService<T, TCreate, TUpdate> {
  const base = `/admin/${resource}`;

  // FormData must go out as multipart; JSON bodies use the axios default.
  const bodyConfig = (payload: unknown) =>
    isFormData(payload)
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : undefined;

  return {
    async getAll() {
      return (await getAllPages<any>(base)).map(normalize);
    },

    async getById(id: string) {
      const { data } = await apiClient.get(`${base}/${id}`);
      return normalize(toItem<any>(data));
    },

    async create(payload: TCreate) {
      const { data } = await apiClient.post(base, payload, bodyConfig(payload));
      return normalize(toItem<any>(data));
    },

    async update(id: string, payload: TUpdate) {
      const { data } = await apiClient.patch(`${base}/${id}`, payload, bodyConfig(payload));
      return normalize(toItem<any>(data));
    },

    async remove(id: string) {
      await apiClient.delete(`${base}/${id}`);
      logger.debug(`[api] deleted ${resource}/${id}`);
    },
  };
}

/**
 * Builds a client for a single-record resource (homepage, about, settings).
 *
 * These have no id and no list. The backend only creates the row on POST, so
 * `save` falls back from PATCH to POST when the record does not exist yet —
 * otherwise the editors are unusable against a freshly migrated database.
 */
export interface SingletonService<T> {
  get(): Promise<T | null>;
  save(payload: unknown): Promise<T>;
}

export function createSingletonService<T>(
  resource: string,
  normalize: (raw: any) => T = (raw) => raw as T,
): SingletonService<T> {
  const base = `/admin/${resource}`;

  const bodyConfig = (payload: unknown) =>
    isFormData(payload)
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : undefined;

  return {
    async get() {
      try {
        const { data } = await apiClient.get(base);
        return normalize(toItem<any>(data));
      } catch (error: any) {
        // No record configured yet is an empty form, not an error.
        if (error?.response?.status === 404) return null;
        throw error;
      }
    },

    async save(payload: unknown) {
      const exists = await this.get().catch(() => null);
      const { data } = exists
        ? await apiClient.patch(base, payload, bodyConfig(payload))
        : await apiClient.post(base, payload, bodyConfig(payload));
      return normalize(toItem<any>(data));
    },
  };
}
