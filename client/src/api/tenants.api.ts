import { http } from './http';

export interface Tenant {
    _id: string;
    tenantId: string;
    name: string;
    displayName?: string;
    status: 'active' | 'suspended' | 'inactive';
    subscription: {
        plan: 'trial' | 'basic' | 'professional' | 'enterprise';
        startDate: string;
        endDate?: string;
        maxBranches?: number;
        maxUsers?: number;
    };
    billing?: {
        companyName?: string;
        taxId?: string;
        billingEmail?: string;
        billingAddress?: {
            street?: string;
            city?: string;
            state?: string;
            zipCode?: string;
            country?: string;
        };
    };
    settings?: {
        timezone?: string;
        currency?: string;
        dateFormat?: string;
        features?: {
            jobCreation?: boolean;
            rulesEngine?: boolean;
            analytics?: boolean;
        };
    };
    createdAt: string;
    updatedAt: string;
}

export interface CreateTenantPayload {
    tenantId: string;
    name: string;
    displayName?: string;
    subscription: {
        plan: 'trial' | 'basic' | 'professional' | 'enterprise';
        maxBranches?: number;
        maxUsers?: number;
    };
    billing?: {
        companyName?: string;
        taxId?: string;
        billingEmail?: string;
        billingAddress?: {
            street?: string;
            city?: string;
            state?: string;
            zipCode?: string;
            country?: string;
        };
    };
    settings?: {
        timezone?: string;
        currency?: string;
        dateFormat?: string;
        features?: {
            jobCreation?: boolean;
            rulesEngine?: boolean;
            analytics?: boolean;
        };
    };
}

export const tenantsApi = {
    create: async (payload: CreateTenantPayload) => {
        const response = await http.post<{ tenant: Tenant }>('/api/tenants', payload);
        return response.data;
    },

    getById: async (tenantId: string) => {
        const response = await http.get<{ tenant: Tenant }>(`/api/tenants/${tenantId}`);
        return response.data;
    },

    list: async (params?: { status?: string; plan?: string; page?: number; limit?: number; search?: string }) => {
        const response = await http.get<{
            data: Tenant[];
            page: number;
            limit: number;
            total: number;
        }>('/api/tenants', { params });
        return response.data;
    },

    update: async (tenantId: string, payload: Partial<CreateTenantPayload>) => {
        const response = await http.put<{ tenant: Tenant }>(`/api/tenants/${tenantId}`, payload);
        return response.data;
    },
};

