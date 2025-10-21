import { http } from './http';

export interface Branch {
    _id: string;
    branchId: string;
    tenantId: string;
    name: string;
    displayName?: string;
    status: 'active' | 'inactive' | 'archived';
    address: {
        street?: string;
        city: string;
        state: string;
        zipCode?: string;
        country?: string;
    };
    contact?: {
        phone?: string;
        email?: string;
        managerName?: string;
    };
    timezone?: string;
    settings?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBranchPayload {
    branchId: string;
    tenantId: string;
    name: string;
    displayName?: string;
    address: {
        street?: string;
        city: string;
        state: string;
        zipCode?: string;
        country?: string;
    };
    contact?: {
        phone?: string;
        email?: string;
        managerName?: string;
    };
    timezone?: string;
    settings?: Record<string, unknown>;
}

export const branchesApi = {
    create: async (payload: CreateBranchPayload) => {
        const response = await http.post<{ branch: Branch }>('/api/branches', payload);
        return response.data;
    },

    getById: async (branchId: string, tenantId?: string) => {
        const response = await http.get<{ branch: Branch }>(`/api/branches/${branchId}`, {
            params: tenantId ? { tenantId } : undefined,
        });
        return response.data;
    },

    list: async (params: { tenantId: string; status?: string; page?: number; limit?: number; search?: string }) => {
        const response = await http.get<{
            data: Branch[];
            page: number;
            limit: number;
            total: number;
        }>('/api/branches', { params });
        return response.data;
    },

    update: async (branchId: string, tenantId: string, payload: Partial<CreateBranchPayload>) => {
        const response = await http.put<{ branch: Branch }>(`/api/branches/${branchId}?tenantId=${tenantId}`, payload);
        return response.data;
    },
};

