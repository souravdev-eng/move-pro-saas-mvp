import { useState } from 'react';
import { http } from '../../api/http';

export interface TenantFormData {
    tenantId: string;
    name: string;
    displayName: string;
    plan: 'trial' | 'basic' | 'professional' | 'enterprise';
    timezone: string;
    billingEmail: string;
    taxId: string;
}

export interface BranchFormData {
    branchId: string;
    name: string;
    displayName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    managerName: string;
    email: string;
    phone: string;
}

const initialTenantData: TenantFormData = {
    tenantId: '',
    name: '',
    displayName: '',
    plan: 'professional',
    timezone: 'America/Chicago',
    billingEmail: '',
    taxId: '',
};

const initialBranchData: BranchFormData = {
    branchId: '',
    name: '',
    displayName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    managerName: '',
    email: '',
    phone: '',
};

export function useTenantOnboarding() {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState(false);

    const [tenantData, setTenantData] = useState<TenantFormData>(initialTenantData);
    const [branchData, setBranchData] = useState<BranchFormData>(initialBranchData);

    const validateStep = (step: number): string | null => {
        if (step === 0) {
            if (!tenantData.tenantId) return 'Company ID is required';
            if (tenantData.tenantId.length < 3) return 'Company ID must be at least 3 characters';
            if (!/^[a-z0-9_-]+$/.test(tenantData.tenantId)) return 'Company ID must be lowercase alphanumeric with dashes/underscores';
            if (!tenantData.name) return 'Company Name is required';
            if (!tenantData.plan) return 'Please select a subscription plan';
        }

        if (step === 1) {
            if (!branchData.branchId) return 'Branch ID is required';
            if (branchData.branchId.length < 3) return 'Branch ID must be at least 3 characters';
            if (!/^[a-z0-9_-]+$/.test(branchData.branchId)) return 'Branch ID must be lowercase alphanumeric with dashes/underscores';
            if (!branchData.name) return 'Branch Name is required';
            if (!branchData.city) return 'City is required';
            if (!branchData.state) return 'State is required';
        }

        return null;
    };

    const handleNext = async () => {
        setError('');

        // Validate current step
        const validationError = validateStep(activeStep);
        if (validationError) {
            setError(validationError);
            return;
        }

        // If last step, submit the form
        if (activeStep === 2) {
            await handleSubmit();
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
        setError('');
    };

    const handleReset = () => {
        setActiveStep(0);
        setTenantData(initialTenantData);
        setBranchData(initialBranchData);
        setError('');
        setSuccess(false);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            // Step 1: Create tenant
            const tenantPayload = {
                tenantId: tenantData.tenantId,
                name: tenantData.name,
                displayName: tenantData.displayName || tenantData.name,
                subscription: {
                    plan: tenantData.plan,
                },
                billing: {
                    billingEmail: tenantData.billingEmail || undefined,
                    taxId: tenantData.taxId || undefined,
                },
                settings: {
                    timezone: tenantData.timezone,
                    currency: 'USD',
                    features: {
                        jobCreation: true,
                        rulesEngine: true,
                        analytics: true,
                    },
                },
            };

            const tenantResponse = await http.post('/api/tenants', tenantPayload);

            if (!tenantResponse.data.tenant) {
                throw new Error('Failed to create tenant');
            }

            // Step 2: Create first branch
            const branchPayload = {
                branchId: `branch_${branchData.branchId}`,
                tenantId: tenantData.tenantId,
                name: branchData.name,
                displayName: branchData.displayName || branchData.name,
                address: {
                    street: branchData.street || undefined,
                    city: branchData.city,
                    state: branchData.state,
                    zipCode: branchData.zipCode || undefined,
                    country: 'USA',
                },
                contact: {
                    phone: branchData.phone || undefined,
                    email: branchData.email || undefined,
                    managerName: branchData.managerName || undefined,
                },
                timezone: tenantData.timezone,
            };

            const branchResponse = await http.post('/api/branches', branchPayload);

            if (!branchResponse.data.branch) {
                throw new Error('Failed to create branch');
            }

            // Success!
            setSuccess(true);
        } catch (err: unknown) {
            console.error('Onboarding error:', err);
            const error = err as { response?: { data?: { error?: { message?: string } } }; message?: string };
            const message = error.response?.data?.error?.message || error.message || 'Failed to complete onboarding';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return {
        activeStep,
        loading,
        error,
        success,
        tenantData,
        branchData,
        setTenantData,
        setBranchData,
        handleNext,
        handleBack,
        handleReset,
    };
}

