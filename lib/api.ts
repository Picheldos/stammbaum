/**
 * Централизованный слой доступа к бэкенду Stammbaum.
 *
 * Правило проекта: ВСЕ запросы к бэку формируются только здесь.
 * Компоненты не должны импортировать axios/fetch напрямую.
 *
 * Контракт: https://stammbaum.ru/api/openapi.json (v0.2.0).
 * - Base: API_URL + /api/v1 (по умолчанию https://stammbaum.ru)
 * - Публичный JSON — camelCase, кроме TreeUpdate.root_person_id (snake_case).
 * - Авторизация: Bearer accessToken; refresh — HttpOnly cookie stammbaum_refresh.
 * - Ошибки: StandardError { error: { code, message, details } } или HTTPValidationError.
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import indexPage from '../data/index.json';
import type { Person, PersonRelation, Tree } from './family/types';

export const getIndexPage = () => indexPage;

/* ------------------------------ Base ------------------------------ */

// Нормализуем API_URL: срезаем хвостовые слэши и уже присутствующий суффикс /api/v1,
// чтобы не задваивать префикс, независимо от того, задан он в env или нет.
// Примеры:
//   https://api.stammbaum.ru        -> origin, base = .../api/v1
//   https://api.stammbaum.ru/api/v1 -> origin, base = .../api/v1 (без дублирования)
const rawApiUrl = (process.env.API_URL || 'https://stammbaum.ru')
    .replace(/\/+$/, '')
    .replace(/\/api\/v1$/, '');
export const API_BASE_URL = `${rawApiUrl}/api/v1`;
export const API_ORIGIN = rawApiUrl;

export const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
    timeout: 20000
});
/* ------------------------------ Types ------------------------------ */

export type AccessRole = 'owner' | 'editor' | 'viewer';
export type TreeMembershipRole = 'viewer' | 'editor';
export type BackendGender = 'male' | 'female';
export type BackendRelationType = 'spouse' | 'parent' | 'sibling';
export type RelativeKind =
    | 'parent' | 'mother' | 'father' | 'child' | 'son' | 'daughter'
    | 'brother' | 'sister' | 'sibling' | 'spouse';

export interface AccessTokenResponse {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
}

export interface RegisteredUser {
    id: string;
    email: string;
    displayName: string;
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
}

export interface UserRead {
    id: string;
    email: string;
    displayName: string;
    isActive: boolean;
    isVerified: boolean;
    lastLogin: string | null;
    locale: string;
    timezone: string;
    createdAt: string;
    updatedAt: string;
}

export interface MessageResponse {
    message: string;
}

export interface BackendTree {
    id: string;
    userId: string;
    title: string;
    rootPersonId: string | null;
    revision: number;
    createdAt: string;
    updatedAt: string;
    accessRole?: AccessRole | null;
}

export interface TreeSnapshotTree {
    id: string;
    ownerId: string;
    title: string;
    rootPersonId: string | null;
    accessRole: AccessRole;
    revision: number;
    createdAt: string;
    updatedAt: string;
}

export interface BackendPerson {
    id: string;
    treeId: string;
    firstName: string;
    lastName: string;
    middleName?: string | null;
    maidenName?: string | null;
    gender: BackendGender;
    birthDate?: string | null;
    birthPlace?: string | null;
    deathDate?: string | null;
    deathPlace?: string | null;
    nationality?: string | null;
    occupation?: string | null;
    biography?: string | null;
    photo?: string | null;
    isHidden: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface BackendRelation {
    id: string;
    treeId: string;
    fromId: string;
    toId: string;
    type: BackendRelationType;
    marriageDate?: string | null;
    divorceDate?: string | null;
    createdAt: string;
}

export interface TreeSnapshot {
    tree: TreeSnapshotTree;
    persons: BackendPerson[];
    relations: BackendRelation[];
}

export interface TreeGraph {
    treeId: string;
    rootPersonId: string | null;
    nodes: Array<{
        id: string;
        gender: BackendGender;
        firstName: string;
        lastName: string;
        birthDate?: string | null;
        deathDate?: string | null;
        photo?: string | null;
    }>;
    edges: Array<{ fromId: string; toId: string; type: BackendRelationType }>;
    revision: number;
}

export interface RelativeResult {
    person: BackendPerson;
    relations: BackendRelation[];
}

export interface TreeMember {
    userId: string;
    treeId: string;
    role: AccessRole;
    email?: string | null;
    displayName?: string | null;
}

export interface MediaPresign {
    mediaId: string;
    uploadUrl: string;
    uploadHeaders: Record<string, string>;
    expiresIn: number;
}

export interface MediaRead {
    id: string;
    treeId: string;
    personId: string | null;
    contentType: string;
    sizeBytes: number;
    url: string;
    previewUrl: string | null;
}

export interface Page<T> {
    total: number;
    limit: number;
    offset: number;
    items: T[];
}

export interface RegisterInput {
    email: string;
    password: string;
    displayName: string;
    locale?: string;
    timezone?: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface PersonInput {
    firstName: string;
    lastName: string;
    gender: BackendGender;
    middleName?: string | null;
    maidenName?: string | null;
    birthDate?: string | null;
    birthPlace?: string | null;
    deathDate?: string | null;
    deathPlace?: string | null;
    nationality?: string | null;
    occupation?: string | null;
    biography?: string | null;
    photo?: string | null;
    setAsRoot?: boolean;
}

export type PersonPatch = Partial<Omit<PersonInput, 'setAsRoot'>>;

export interface RelationInput {
    fromId: string;
    toId: string;
    type: BackendRelationType;
    marriageDate?: string | null;
    divorceDate?: string | null;
}

export interface RelativePersonInput {
    firstName: string;
    lastName: string;
    gender: BackendGender;
    middleName?: string | null;
    maidenName?: string | null;
    birthDate?: string | null;
    birthPlace?: string | null;
    deathDate?: string | null;
    deathPlace?: string | null;
    nationality?: string | null;
    occupation?: string | null;
    biography?: string | null;
    photo?: string | null;
}

export interface AddRelativeInput {
    relativeOfId: string;
    kind: RelativeKind;
    sharedParentIds?: string[];
    person: RelativePersonInput;
    setAsRoot?: boolean;
}

/* ------------------------------ Errors ------------------------------ */

export interface ApiValidationIssue {
    loc: Array<string | number>;
    msg: string;
    type: string;
}

export class ApiError extends Error {
    status?: number;
    code: string;
    validation?: ApiValidationIssue[];
    raw?: unknown;

    constructor(details: { status?: number; code: string; message: string; validation?: ApiValidationIssue[]; raw?: unknown }) {
        super(details.message);
        this.name = 'ApiError';
        this.status = details.status;
        this.code = details.code;
        this.validation = details.validation;
        this.raw = details.raw;
    }
}

const toApiError = (error: unknown): ApiError => {
    if (error instanceof ApiError) return error;
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<unknown>;
        const status = axiosError.response?.status;
        const data = axiosError.response?.data as
            | { error?: { code?: string; message?: string }; detail?: Array<{ loc?: Array<string | number>; msg?: string; type?: string }> }
            | undefined;
        if (data && typeof data === 'object' && 'detail' in data && Array.isArray(data.detail)) {
            return new ApiError({
                status,
                code: 'validation_error',
                message: 'Request validation failed.',
                validation: data.detail.map((d) => ({ loc: d.loc ?? [], msg: d.msg ?? '', type: d.type ?? '' })),
                raw: data
            });
        }
        const rawCode = data && typeof data === 'object' && data.error && typeof data.error.code === 'string' ? data.error.code : '';
        const code = rawCode || 'request_failed';
        const message = data && typeof data === 'object' && data.error && typeof data.error.message === 'string' && data.error.message
            ? data.error.message
            : axiosError.message || 'Request failed.';
        return new ApiError({ status, code, message, raw: data ?? axiosError.message });
    }
    return new ApiError({ code: 'server_error', message: error instanceof Error ? error.message : 'Request failed.', raw: error });
};

export const formatBackendError = (error: unknown, fallback: string): string => {
    if (error instanceof ApiError) {
        if (error.code === 'validation_error' && error.validation?.length) {
            const first = error.validation[0];
            const field = first.loc.filter((p) => typeof p === 'string' && p !== 'body').join('.');
            return field ? `${field}: ${first.msg}` : first.msg || fallback;
        }
        return error.message || fallback;
    }
    return error instanceof Error ? error.message : fallback;
};

/* ------------------------------ Tokens ------------------------------ */

const ACCESS_KEY = 'stammbaum_access_token';
const ACCESS_EXP_KEY = 'stammbaum_access_expires_at';

const isBrowser = (): boolean => typeof window !== 'undefined';

export const getAccessToken = (): string | null => {
    if (!isBrowser()) return null;
    try {
        return window.localStorage.getItem(ACCESS_KEY);
    } catch {
        return null;
    }
};

export const setAccessSession = (token: AccessTokenResponse): void => {
    if (!isBrowser()) return;
    try {
        window.localStorage.setItem(ACCESS_KEY, token.accessToken);
        window.localStorage.setItem(ACCESS_EXP_KEY, String(Date.now() + token.expiresIn * 1000));
        window.dispatchEvent(new Event('stammbaum:session'));
    } catch {
        // ignore storage errors (private mode etc.)
    }
};

export const clearAccessSession = (): void => {
    if (!isBrowser()) return;
    try {
        window.localStorage.removeItem(ACCESS_KEY);
        window.localStorage.removeItem(ACCESS_EXP_KEY);
        window.dispatchEvent(new Event('stammbaum:session'));
    } catch {
        // ignore
    }
};

let refreshPromise: Promise<AccessTokenResponse> | null = null;

const AUTH_FREE_PATHS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/forgot-password', '/auth/reset-password'];

api.interceptors.request.use((config) => {
    const token = getAccessToken();
    const url = config.url || '';
    const isFree = AUTH_FREE_PATHS.some((p) => url.includes(p));
    if (token && !isFree) {
        config.headers = config.headers ?? {};
        (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return config;
});

const rawRefresh = async (): Promise<AccessTokenResponse> => {
    const res = await axios.post<AccessTokenResponse>(`${API_BASE_URL}/auth/refresh`, undefined, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
};

export const refreshAccessToken = async (): Promise<AccessTokenResponse> => {
    if (!refreshPromise) {
        refreshPromise = rawRefresh()
            .then((data) => {
                setAccessSession(data);
                return data;
            })
            .catch((error: unknown) => {
                clearAccessSession();
                throw toApiError(error);
            })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
};

api.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
        const axiosError = error as AxiosError & { config?: AxiosRequestConfig & { _retried?: boolean } };
        const status = axiosError.response?.status;
        const config = axiosError.config;
        const url = config?.url || '';
        if (status !== 401 || !config || config._retried || AUTH_FREE_PATHS.some((p) => url.includes(p))) {
            throw toApiError(error);
        }
        config._retried = true;
        try {
            const refreshed = await refreshAccessToken();
            config.headers = config.headers ?? {};
            (config.headers as Record<string, string>).Authorization = `Bearer ${refreshed.accessToken}`;
            return api.request(config);
        } catch (refreshError) {
            throw toApiError(refreshError);
        }
    }
);

const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
    try {
        const res = await api.request<T>(config);
        return res.data;
    } catch (error) {
        throw toApiError(error);
    }
};

/* ------------------------------ Auth ------------------------------ */

export const registerUser = (input: RegisterInput): Promise<RegisteredUser> =>
    request<RegisteredUser>({ method: 'POST', url: '/auth/register', data: input });

export const verifyEmail = (token: string): Promise<RegisteredUser> =>
    request<RegisteredUser>({ method: 'GET', url: '/auth/verify-email', params: { token } });

export const resendVerification = (email: string): Promise<MessageResponse> =>
    request<MessageResponse>({ method: 'POST', url: '/auth/resend-verification', data: { email } });

export const loginUser = async (input: LoginInput): Promise<AccessTokenResponse> => {
    const data = await request<AccessTokenResponse>({ method: 'POST', url: '/auth/login', data: input });
    setAccessSession(data);
    return data;
};

export const logoutUser = async (): Promise<void> => {
    try {
        await request<void>({ method: 'POST', url: '/auth/logout' });
    } finally {
        clearAccessSession();
    }
};

export const requestPasswordReset = (email: string): Promise<MessageResponse> =>
    request<MessageResponse>({ method: 'POST', url: '/auth/forgot-password', data: { email } });

export const resetPassword = (token: string, newPassword: string): Promise<MessageResponse> =>
    request<MessageResponse>({ method: 'POST', url: '/auth/reset-password', data: { token, password: newPassword } });

/* ------------------------------ Users ------------------------------ */

export const getCurrentUser = (): Promise<UserRead> => request<UserRead>({ method: 'GET', url: '/users/me' });

export const updateCurrentUser = (patch: { displayName?: string; locale?: string; timezone?: string }): Promise<UserRead> =>
    request<UserRead>({ method: 'PATCH', url: '/users/me', data: patch });

/* ------------------------------ Trees ------------------------------ */

export const listTrees = (limit = 50, offset = 0): Promise<Page<BackendTree>> =>
    request<Page<BackendTree>>({ method: 'GET', url: '/trees', params: { limit, offset } });

export const createTree = (title: string): Promise<BackendTree> =>
    request<BackendTree>({ method: 'POST', url: '/trees', data: { title } });

export const getTreeSnapshot = (treeId: string): Promise<TreeSnapshot> =>
    request<TreeSnapshot>({ method: 'GET', url: `/trees/${treeId}/snapshot` });

export const getTreeGraph = (treeId: string): Promise<TreeGraph> =>
    request<TreeGraph>({ method: 'GET', url: `/trees/${treeId}` });

export const updateTree = (treeId: string, patch: { title?: string; rootPersonId?: string | null }): Promise<BackendTree> => {
    const data: { title?: string; root_person_id?: string | null } = {};
    if (typeof patch.title !== 'undefined') data.title = patch.title;
    if (typeof patch.rootPersonId !== 'undefined') data.root_person_id = patch.rootPersonId;
    return request<BackendTree>({ method: 'PATCH', url: `/trees/${treeId}`, data });
};

export const deleteTree = (treeId: string): Promise<void> => request<void>({ method: 'DELETE', url: `/trees/${treeId}` });

export const addRelative = (treeId: string, input: AddRelativeInput): Promise<RelativeResult> =>
    request<RelativeResult>({ method: 'POST', url: `/trees/${treeId}/relatives`, data: input });

/* ------------------------------ Persons ------------------------------ */

export const listPersons = (treeId: string, limit = 100, offset = 0): Promise<Page<BackendPerson>> =>
    request<Page<BackendPerson>>({ method: 'GET', url: `/trees/${treeId}/persons`, params: { limit, offset } });

export const getPerson = (personId: string): Promise<BackendPerson> =>
    request<BackendPerson>({ method: 'GET', url: `/persons/${personId}` });

export const createPerson = (treeId: string, input: PersonInput): Promise<BackendPerson> =>
    request<BackendPerson>({ method: 'POST', url: `/trees/${treeId}/persons`, data: input });

export const updatePerson = (personId: string, patch: PersonPatch): Promise<BackendPerson> =>
    request<BackendPerson>({ method: 'PATCH', url: `/persons/${personId}`, data: patch });

export const deletePerson = (personId: string): Promise<void> =>
    request<void>({ method: 'DELETE', url: `/persons/${personId}` });

export const updatePersonPreferences = (treeId: string, personId: string, isHidden: boolean): Promise<{ treeId: string; personId: string; isHidden: boolean }> =>
    request({ method: 'PATCH', url: `/trees/${treeId}/persons/${personId}/preferences`, data: { isHidden } });

/* ------------------------------ Relations ------------------------------ */

export const listRelations = (treeId: string, limit = 100, offset = 0): Promise<Page<BackendRelation>> =>
    request<Page<BackendRelation>>({ method: 'GET', url: `/trees/${treeId}/relations`, params: { limit, offset } });

export const createRelation = (treeId: string, input: RelationInput): Promise<BackendRelation> =>
    request<BackendRelation>({ method: 'POST', url: `/trees/${treeId}/relations`, data: input });

export const updateRelation = (
    relationId: string,
    patch: Partial<Pick<RelationInput, 'type' | 'marriageDate' | 'divorceDate'>>
): Promise<BackendRelation> => request<BackendRelation>({ method: 'PATCH', url: `/relations/${relationId}`, data: patch });

export const deleteRelation = (relationId: string): Promise<void> =>
    request<void>({ method: 'DELETE', url: `/relations/${relationId}` });

/* ------------------------------ Sharing ------------------------------ */

export const listTreeMembers = (treeId: string): Promise<Page<TreeMember>> =>
    request<Page<TreeMember>>({ method: 'GET', url: `/trees/${treeId}/members` });

export const grantTreeAccess = (treeId: string, input: { email: string; role: TreeMembershipRole }): Promise<TreeMember> =>
    request<TreeMember>({ method: 'POST', url: `/trees/${treeId}/members`, data: input });

export const updateTreeMemberRole = (treeId: string, userId: string, role: AccessRole): Promise<TreeMember> =>
    request<TreeMember>({ method: 'PATCH', url: `/trees/${treeId}/members/${userId}`, data: { role } });

export const revokeTreeAccess = (treeId: string, userId: string): Promise<void> =>
    request<void>({ method: 'DELETE', url: `/trees/${treeId}/members/${userId}` });

/* ------------------------------ Media ------------------------------ */

export const presignMedia = (input: { treeId: string; personId?: string | null; filename: string; contentType: string; sizeBytes: number }): Promise<MediaPresign> =>
    request<MediaPresign>({ method: 'POST', url: '/media/presign', data: input });

export const uploadPresignedMedia = async (uploadUrl: string, headers: Record<string, string>, file: File | Blob): Promise<void> => {
    const res = await fetch(uploadUrl, { method: 'PUT', headers, body: file });
    if (!res.ok) {
        throw new ApiError({ code: 'media_invalid', message: `Media upload failed with status ${res.status}.` });
    }
};

export const finalizeMedia = (mediaId: string): Promise<MediaRead> =>
    request<MediaRead>({ method: 'POST', url: `/media/${mediaId}/finalize` });

export const deleteMedia = (mediaId: string): Promise<void> =>
    request<void>({ method: 'DELETE', url: `/media/${mediaId}` });

export const uploadPersonPhoto = async (treeId: string, personId: string | null, file: File): Promise<MediaRead> => {
    const presigned = await presignMedia({
        treeId,
        personId,
        filename: file.name || 'photo.jpg',
        contentType: file.type || 'image/jpeg',
        sizeBytes: file.size
    });
    await uploadPresignedMedia(presigned.uploadUrl, presigned.uploadHeaders, file);
    return finalizeMedia(presigned.mediaId);
};

/* ------------------------------ Health ------------------------------ */

export const checkLiveness = async (): Promise<unknown> => {
    const res = await axios.get(`${API_ORIGIN}/health/live`, { timeout: 10000 });
    return res.data;
};

export const checkReadiness = async (): Promise<unknown> => {
    const res = await axios.get(`${API_ORIGIN}/health/ready`, { timeout: 10000 });
    return res.data;
};

/* ------------------------------ Domain adapters ------------------------------ */

const nullToUndefined = <T>(value: T | null | undefined): T | undefined => (value === null ? undefined : value);

export const toLocalTree = (tree: BackendTree | TreeSnapshotTree): Tree => ({
    id: tree.id,
    userId: 'userId' in tree ? tree.userId : tree.ownerId,
    name: tree.title,
    rootPersonId: tree.rootPersonId ?? undefined,
    createdAt: tree.createdAt,
    updatedAt: tree.updatedAt
});

export const toLocalPerson = (person: BackendPerson): Person => ({
    id: person.id,
    treeId: person.treeId,
    firstName: person.firstName,
    lastName: person.lastName,
    middleName: nullToUndefined(person.middleName),
    maidenName: nullToUndefined(person.maidenName),
    gender: person.gender,
    birthDate: nullToUndefined(person.birthDate),
    birthPlace: nullToUndefined(person.birthPlace),
    deathDate: nullToUndefined(person.deathDate),
    deathPlace: nullToUndefined(person.deathPlace),
    nationality: nullToUndefined(person.nationality),
    occupation: nullToUndefined(person.occupation),
    biography: nullToUndefined(person.biography),
    photo: nullToUndefined(person.photo),
    isHidden: person.isHidden,
    createdAt: person.createdAt,
    updatedAt: person.updatedAt
});

export const toLocalRelation = (relation: BackendRelation): PersonRelation => ({
    id: relation.id,
    treeId: relation.treeId,
    fromId: relation.fromId,
    toId: relation.toId,
    type: relation.type,
    marriageDate: nullToUndefined(relation.marriageDate),
    divorceDate: nullToUndefined(relation.divorceDate),
    createdAt: relation.createdAt
});

export const toBackendPersonInput = (values: {
    gender: BackendGender;
    firstName: string;
    lastName: string;
    middleName?: string;
    maidenName?: string;
    birthDate?: string;
    birthPlace?: string;
    deathDate?: string;
    deathPlace?: string;
    nationality?: string;
    occupation?: string;
    biography?: string;
    photo?: string;
}): PersonInput => {
    const clean = (value?: string): string | null | undefined => {
        if (typeof value === 'undefined') return undefined;
        const trimmed = value.trim();
        return trimmed ? trimmed : null;
    };
    return {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        gender: values.gender,
        middleName: clean(values.middleName),
        maidenName: clean(values.maidenName),
        birthDate: clean(values.birthDate),
        birthPlace: clean(values.birthPlace),
        deathDate: clean(values.deathDate),
        deathPlace: clean(values.deathPlace),
        nationality: clean(values.nationality),
        occupation: clean(values.occupation),
        biography: values.biography ? values.biography : null,
        photo: values.photo ? values.photo : null
    };
};

