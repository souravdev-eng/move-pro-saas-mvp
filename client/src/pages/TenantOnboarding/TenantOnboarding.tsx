import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { useTenantOnboarding } from './TenantOnboarding.hook';
import type { TenantFormData, BranchFormData } from './TenantOnboarding.hook';

const steps = ['Company Information', 'First Branch', 'Review & Complete'];

export default function TenantOnboarding() {
    const {
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
    } = useTenantOnboarding();

    return (
        <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto', p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Welcome to MovePro! 🚀
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {success ? (
                <Paper sx={{ p: 4 }}>
                    <Alert severity="success" sx={{ mb: 3 }}>
                        🎉 Congratulations! Your account has been set up successfully.
                    </Alert>
                    <Typography variant="h6" gutterBottom>
                        What's Next?
                    </Typography>
                    <Typography paragraph>
                        Your company <strong>{tenantData.displayName}</strong> and first branch <strong>{branchData.displayName}</strong> are now ready to use.
                    </Typography>
                    <Typography paragraph>
                        You can now:
                    </Typography>
                    <ul>
                        <li>Create custom forms and rulesets</li>
                        <li>Add more branches</li>
                        <li>Start creating jobs</li>
                        <li>Invite team members</li>
                    </ul>
                    <Box sx={{ mt: 3 }}>
                        <Button variant="contained" size="large" href="/dashboard">
                            Go to Dashboard
                        </Button>
                        <Button sx={{ ml: 2 }} onClick={handleReset}>
                            Create Another Tenant
                        </Button>
                    </Box>
                </Paper>
            ) : (
                <>
                    {activeStep === 0 && (
                        <CompanyInfoStep data={tenantData} onChange={setTenantData} />
                    )}
                    {activeStep === 1 && (
                        <BranchInfoStep data={branchData} onChange={setBranchData} tenantId={tenantData.tenantId} />
                    )}
                    {activeStep === 2 && (
                        <ReviewStep tenantData={tenantData} branchData={branchData} />
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button
                            disabled={activeStep === 0 || loading}
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={24} />
                            ) : activeStep === steps.length - 1 ? (
                                'Complete Setup'
                            ) : (
                                'Next'
                            )}
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
}

// Step 1: Company Information
function CompanyInfoStep({ data, onChange }: { data: TenantFormData; onChange: (data: TenantFormData) => void }) {
    return (
        <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
                Tell us about your company
            </Typography>
            <Grid container spacing={3}>
                {/* @ts-ignore - MUI v7 Grid typing issue */}
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        label="Company Name"
                        value={data.name}
                        onChange={(e) => onChange({ ...data, name: e.target.value })}
                        helperText="This will be displayed across the platform"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Display Name (Optional)"
                        value={data.displayName}
                        onChange={(e) => onChange({ ...data, displayName: e.target.value })}
                        helperText="e.g., 'MovePro Dallas' - defaults to Company Name if empty"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        label="Company ID"
                        value={data.tenantId}
                        onChange={(e) => onChange({ ...data, tenantId: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                        helperText="Unique identifier (lowercase, numbers, dashes, underscores only)"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                        <InputLabel>Subscription Plan</InputLabel>
                        <Select
                            value={data.plan}
                            onChange={(e) => onChange({ ...data, plan: e.target.value as 'trial' | 'basic' | 'professional' | 'enterprise' })}
                        >
                            <MenuItem value="trial">Trial (1 branch, 5 users)</MenuItem>
                            <MenuItem value="basic">Basic (3 branches, 20 users)</MenuItem>
                            <MenuItem value="professional">Professional (10 branches, 100 users)</MenuItem>
                            <MenuItem value="enterprise">Enterprise (100 branches, 1000 users)</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel>Timezone</InputLabel>
                        <Select
                            value={data.timezone}
                            onChange={(e) => onChange({ ...data, timezone: e.target.value })}
                        >
                            <MenuItem value="America/New_York">Eastern Time</MenuItem>
                            <MenuItem value="America/Chicago">Central Time</MenuItem>
                            <MenuItem value="America/Denver">Mountain Time</MenuItem>
                            <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Billing Email"
                        type="email"
                        value={data.billingEmail}
                        onChange={(e) => onChange({ ...data, billingEmail: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Tax ID (Optional)"
                        value={data.taxId}
                        onChange={(e) => onChange({ ...data, taxId: e.target.value })}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
}

// Step 2: Branch Information
function BranchInfoStep({ data, onChange }: { data: BranchFormData; onChange: (data: BranchFormData) => void; tenantId: string }) {
    return (
        <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
                Set up your first branch
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                You can add more branches later from your dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        label="Branch Name"
                        value={data.name}
                        onChange={(e) => onChange({ ...data, name: e.target.value })}
                        helperText="e.g., 'Dallas', 'Houston'"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Display Name (Optional)"
                        value={data.displayName}
                        onChange={(e) => onChange({ ...data, displayName: e.target.value })}
                        helperText="e.g., 'MovePro Dallas'"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        label="Branch ID"
                        value={data.branchId}
                        onChange={(e) => onChange({ ...data, branchId: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                        helperText={`Unique identifier - will be: branch_${data.branchId || 'your_id'}`}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Street Address"
                        value={data.street}
                        onChange={(e) => onChange({ ...data, street: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        required
                        fullWidth
                        label="City"
                        value={data.city}
                        onChange={(e) => onChange({ ...data, city: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        required
                        fullWidth
                        label="State"
                        value={data.state}
                        onChange={(e) => onChange({ ...data, state: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        label="Zip Code"
                        value={data.zipCode}
                        onChange={(e) => onChange({ ...data, zipCode: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Manager Name"
                        value={data.managerName}
                        onChange={(e) => onChange({ ...data, managerName: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Branch Email"
                        type="email"
                        value={data.email}
                        onChange={(e) => onChange({ ...data, email: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Branch Phone"
                        value={data.phone}
                        onChange={(e) => onChange({ ...data, phone: e.target.value })}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
}

// Step 3: Review
function ReviewStep({ tenantData, branchData }: { tenantData: TenantFormData; branchData: BranchFormData }) {
    return (
        <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
                Review Your Information
            </Typography>

            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Company Information
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Company Name</Typography>
                        <Typography>{tenantData.name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Company ID</Typography>
                        <Typography>{tenantData.tenantId}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Plan</Typography>
                        <Typography sx={{ textTransform: 'capitalize' }}>{tenantData.plan}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Timezone</Typography>
                        <Typography>{tenantData.timezone}</Typography>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    First Branch
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Branch Name</Typography>
                        <Typography>{branchData.name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Branch ID</Typography>
                        <Typography>branch_{branchData.branchId}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Address</Typography>
                        <Typography>
                            {branchData.street && `${branchData.street}, `}
                            {branchData.city}, {branchData.state} {branchData.zipCode}
                        </Typography>
                    </Grid>
                    {branchData.managerName && (
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">Manager</Typography>
                            <Typography>{branchData.managerName}</Typography>
                        </Grid>
                    )}
                    {branchData.email && (
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">Email</Typography>
                            <Typography>{branchData.email}</Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Paper>
    );
}

