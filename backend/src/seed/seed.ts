import { connectToDatabase, disconnectFromDatabase } from '../db/mongoose';
import { createRuleset } from '../modules/rulesets/ruleset.service';
import { TenantModel } from '../models/tenant.model';
import { BranchModel } from '../models/branch.model';
import { RulesetModel } from '../modules/rulesets/ruleset.model';

async function run() {
    await connectToDatabase();
    console.log('Connected to MongoDB');

    const tenantId = 'ams123';

    // Clear ALL existing data to avoid duplicate key errors
    console.log('Clearing all existing data...');
    await TenantModel.deleteMany({});
    await BranchModel.deleteMany({});
    await RulesetModel.deleteMany({});

    // ========================================
    // Create Tenant (Company)
    // ========================================
    console.log('\n🏢 Creating tenant (company)...');

    const tenant = await TenantModel.create({
        tenantId,
        name: 'AMS Moving Services',
        displayName: 'AMS Moving Company',
        status: 'active',
        subscription: {
            plan: 'professional',
            startDate: new Date('2024-01-01'),
            maxBranches: 10,
            maxUsers: 100,
        },
        billing: {
            companyName: 'AMS Moving Services LLC',
            taxId: 'TX-987654321',
            billingEmail: 'billing@ams-moving.com',
            billingAddress: {
                street: '100 Business Park Drive',
                city: 'Dallas',
                state: 'TX',
                zipCode: '75201',
                country: 'USA',
            },
        },
        settings: {
            timezone: 'America/Chicago',
            currency: 'USD',
            dateFormat: 'MM/DD/YYYY',
            features: {
                jobCreation: true,
                rulesEngine: true,
                analytics: true,
            },
        },
        metadata: {
            industry: 'Moving & Logistics',
            foundedYear: 2020,
        },
    });

    console.log(`✅ Created tenant: ${tenant.displayName} (${tenant.tenantId})`);
    console.log(`   Plan: ${tenant.subscription.plan}`);
    console.log(`   Max Branches: ${tenant.subscription.maxBranches}`);
    console.log(`   Max Users: ${tenant.subscription.maxUsers}`);

    // ========================================
    // Create Branches
    // ========================================
    console.log('\n📍 Creating branches...');

    const branches = [
        {
            branchId: 'branch_dallas',
            tenantId,
            name: 'Dallas',
            displayName: 'AMS Dallas',
            status: 'active' as const,
            address: {
                street: '1234 Main Street',
                city: 'Dallas',
                state: 'TX',
                zipCode: '75201',
                country: 'USA',
            },
            contact: {
                phone: '+1-214-555-0100',
                email: 'dallas@ams-moving.com',
                managerName: 'Sarah Johnson',
            },
            timezone: 'America/Chicago',
            settings: {
                serviceRadius: 100,
                defaultCurrency: 'USD',
            },
        },
        {
            branchId: 'branch_houston',
            tenantId,
            name: 'Houston',
            displayName: 'AMS Houston',
            status: 'active' as const,
            address: {
                street: '5678 West Avenue',
                city: 'Houston',
                state: 'TX',
                zipCode: '77002',
                country: 'USA',
            },
            contact: {
                phone: '+1-713-555-0200',
                email: 'houston@ams-moving.com',
                managerName: 'Michael Chen',
            },
            timezone: 'America/Chicago',
            settings: {
                serviceRadius: 120,
                defaultCurrency: 'USD',
            },
        },
        {
            branchId: 'branch_austin',
            tenantId,
            name: 'Austin',
            displayName: 'AMS Austin',
            status: 'active' as const,
            address: {
                street: '9012 Congress Avenue',
                city: 'Austin',
                state: 'TX',
                zipCode: '78701',
                country: 'USA',
            },
            contact: {
                phone: '+1-512-555-0300',
                email: 'austin@ams-moving.com',
                managerName: 'Emily Rodriguez',
            },
            timezone: 'America/Chicago',
            settings: {
                serviceRadius: 80,
                defaultCurrency: 'USD',
            },
        },
    ];

    for (const branchData of branches) {
        const branch = await BranchModel.create(branchData);
        console.log(`✅ Created branch: ${branch.displayName} (${branch.branchId})`);
    }

    // ========================================
    // Create Global Ruleset (Published)
    // ========================================
    console.log('\n📋 Creating global ruleset...');

    const globalRs = await createRuleset({
        tenantId,
        scope: 'global',
        name: 'Global Residential Move Form',
        notes: 'Base form for all residential moves',
        definitions: {
            serviceType: 'residential-move',
            fields: [
                {
                    id: 'customer.name',
                    label: 'Customer Name',
                    type: 'text',
                    required: true,
                },
                {
                    id: 'customer.email',
                    label: 'Email',
                    type: 'email',
                    required: true,
                    validation: {
                        pattern: '^[^@]+@[^@]+\\.[^@]+$',
                    },
                },
                {
                    id: 'customer.phone',
                    label: 'Phone Number',
                    type: 'phone',
                    required: true,
                    validation: {
                        pattern: '^\\+?1?[-.]?\\(?\\d{3}\\)?[-.]?\\d{3}[-.]?\\d{4}$',
                    },
                },
                {
                    id: 'move.origin',
                    label: 'Origin Address',
                    type: 'text',
                    required: true,
                },
                {
                    id: 'move.destination',
                    label: 'Destination Address',
                    type: 'text',
                    required: true,
                },
                {
                    id: 'move.moveDate',
                    label: 'Move Date',
                    type: 'date',
                    required: true,
                    validation: {
                        gte: 'today',
                    },
                },
                {
                    id: 'move.rooms',
                    label: 'Number of Rooms',
                    type: 'number',
                    required: true,
                    validation: {
                        min: 1,
                        max: 20,
                    },
                    default: 3,
                },
                {
                    id: 'pricing.baseCost',
                    label: 'Base Cost',
                    type: 'number',
                    required: true,
                    default: 1000,
                },
                {
                    id: 'pricing.estimatedCost',
                    label: 'Estimated Total (with 15% markup)',
                    type: 'number',
                    compute: 'ceil(pricing.baseCost * 1.15)',
                },
                {
                    id: 'pricing.currency',
                    label: 'Currency',
                    type: 'select',
                    default: 'USD',
                    options: [
                        { value: 'USD', label: 'US Dollar' },
                        { value: 'EUR', label: 'Euro' },
                    ],
                },
            ],
            layout: {
                sections: [
                    {
                        id: 'customer',
                        title: 'Customer Information',
                        fields: ['customer.name', 'customer.email', 'customer.phone'],
                    },
                    {
                        id: 'move',
                        title: 'Move Details',
                        fields: ['move.origin', 'move.destination', 'move.moveDate', 'move.rooms'],
                    },
                    {
                        id: 'pricing',
                        title: 'Pricing',
                        fields: ['pricing.baseCost', 'pricing.estimatedCost', 'pricing.currency'],
                    },
                ],
            },
            expressions: [],
            dataSources: [],
            widgets: [],
        },
        createdBy: 'seed',
    });

    // Publish the global ruleset
    await RulesetModel.findByIdAndUpdate(globalRs._id, { status: 'published' });
    console.log(`✅ Created & published global ruleset: ${globalRs._id}`);

    // ========================================
    // Create Branch-Specific Rulesets (Published)
    // ========================================
    console.log('\n📋 Creating branch-specific rulesets...');

    // Dallas - has special local tax
    const dallasRs = await createRuleset({
        tenantId,
        scope: 'branch',
        branchId: 'branch_dallas',
        name: 'Dallas Residential Move Form',
        notes: 'Dallas-specific form with local tax',
        definitions: {
            serviceType: 'residential-move',
            fields: [
                {
                    id: 'customer.name',
                    label: 'Customer Name',
                    type: 'text',
                    required: true,
                },
                {
                    id: 'customer.email',
                    label: 'Email',
                    type: 'email',
                    required: true,
                },
                {
                    id: 'customer.phone',
                    label: 'Phone Number',
                    type: 'phone',
                    required: true,
                },
                {
                    id: 'move.origin',
                    label: 'Origin Address',
                    type: 'text',
                    required: true,
                },
                {
                    id: 'move.destination',
                    label: 'Destination Address',
                    type: 'text',
                    required: true,
                },
                {
                    id: 'move.moveDate',
                    label: 'Move Date',
                    type: 'date',
                    required: true,
                    validation: {
                        gte: 'today',
                    },
                },
                {
                    id: 'move.rooms',
                    label: 'Number of Rooms',
                    type: 'number',
                    required: true,
                    validation: {
                        min: 1,
                        max: 20,
                    },
                    default: 3,
                },
                {
                    id: 'pricing.baseCost',
                    label: 'Base Cost',
                    type: 'number',
                    required: true,
                    default: 1200,
                },
                {
                    id: 'pricing.localTax',
                    label: 'Dallas Local Tax (8.25%)',
                    type: 'number',
                    compute: 'ceil(pricing.baseCost * 0.0825)',
                },
                {
                    id: 'pricing.estimatedCost',
                    label: 'Estimated Total (base + tax + 15% markup)',
                    type: 'number',
                    compute: 'ceil((pricing.baseCost + pricing.localTax) * 1.15)',
                },
                {
                    id: 'pricing.currency',
                    label: 'Currency',
                    type: 'select',
                    default: 'USD',
                },
            ],
            layout: {
                sections: [
                    {
                        id: 'customer',
                        title: 'Customer Information',
                        fields: ['customer.name', 'customer.email', 'customer.phone'],
                    },
                    {
                        id: 'move',
                        title: 'Move Details',
                        fields: ['move.origin', 'move.destination', 'move.moveDate', 'move.rooms'],
                    },
                    {
                        id: 'pricing',
                        title: 'Pricing',
                        fields: ['pricing.baseCost', 'pricing.localTax', 'pricing.estimatedCost', 'pricing.currency'],
                    },
                ],
            },
        },
        createdBy: 'seed',
    });

    await RulesetModel.findByIdAndUpdate(dallasRs._id, { status: 'published' });
    console.log(`✅ Created & published Dallas ruleset: ${dallasRs._id}`);

    // Houston - has minimum room requirement
    const houstonRs = await createRuleset({
        tenantId,
        scope: 'branch',
        branchId: 'branch_houston',
        name: 'Houston Residential Move Form',
        notes: 'Houston-specific form with minimum room requirement',
        definitions: {
            serviceType: 'residential-move',
            fields: [
                {
                    id: 'customer.name',
                    label: 'Customer Name',
                    type: 'text',
                    required: true,
                },
                {
                    id: 'customer.email',
                    label: 'Email',
                    type: 'email',
                    required: true,
                },
                {
                    id: 'customer.phone',
                    label: 'Phone Number',
                    type: 'phone',
                    required: true,
                },
                {
                    id: 'move.origin',
                    label: 'Origin Address',
                    type: 'text',
                    required: true,
                },
                {
                    id: 'move.destination',
                    label: 'Destination Address',
                    type: 'text',
                    required: true,
                },
                {
                    id: 'move.moveDate',
                    label: 'Move Date',
                    type: 'date',
                    required: true,
                    validation: {
                        gte: 'today',
                    },
                },
                {
                    id: 'move.rooms',
                    label: 'Number of Rooms (min 2 in Houston)',
                    type: 'number',
                    required: true,
                    validation: {
                        min: 2,
                        max: 20,
                    },
                    default: 3,
                },
                {
                    id: 'pricing.baseCost',
                    label: 'Base Cost',
                    type: 'number',
                    required: true,
                    default: 1100,
                },
                {
                    id: 'pricing.estimatedCost',
                    label: 'Estimated Total (with 15% markup)',
                    type: 'number',
                    compute: 'ceil(pricing.baseCost * 1.15)',
                },
                {
                    id: 'pricing.currency',
                    label: 'Currency',
                    type: 'select',
                    default: 'USD',
                },
            ],
            layout: {
                sections: [
                    {
                        id: 'customer',
                        title: 'Customer Information',
                        fields: ['customer.name', 'customer.email', 'customer.phone'],
                    },
                    {
                        id: 'move',
                        title: 'Move Details',
                        fields: ['move.origin', 'move.destination', 'move.moveDate', 'move.rooms'],
                    },
                    {
                        id: 'pricing',
                        title: 'Pricing',
                        fields: ['pricing.baseCost', 'pricing.estimatedCost', 'pricing.currency'],
                    },
                ],
            },
        },
        createdBy: 'seed',
    });

    await RulesetModel.findByIdAndUpdate(houstonRs._id, { status: 'published' });
    console.log(`✅ Created & published Houston ruleset: ${houstonRs._id}`);

    // Austin uses the global ruleset (no branch-specific override)
    console.log('ℹ️  Austin will use the global ruleset (no branch-specific override)');

    // ========================================
    // Summary
    // ========================================
    console.log('\n✨ Seed complete! Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🏢 Tenant (Company):');
    console.log(`  - ${tenant.displayName} (${tenant.tenantId})`);
    console.log(`  - Plan: ${tenant.subscription.plan}`);
    console.log(`  - Status: ${tenant.status}`);
    console.log('\n📍 Branches:');
    console.log('  - Dallas   (branch_dallas)');
    console.log('  - Houston  (branch_houston)');
    console.log('  - Austin   (branch_austin)');
    console.log('\n📋 Rulesets (all published):');
    console.log('  - Global: residential-move');
    console.log('  - Dallas: residential-move (with local tax)');
    console.log('  - Houston: residential-move (min 2 rooms)');
    console.log('  - Austin: uses global ruleset');
    console.log('\n🚀 Ready to test job creation!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📊 Data Hierarchy:');
    console.log(`  Tenant (${tenantId})`);
    console.log('    ├── Branch: Dallas');
    console.log('    ├── Branch: Houston');
    console.log('    └── Branch: Austin');
    console.log('    └── Rulesets (3 published)');
    console.log('\nExample API calls:');
    console.log('\n# Get Dallas form schema:');
    console.log('curl http://localhost:4000/api/form/branch_dallas/residential-move');
    console.log('\n# Create job in Dallas:');
    console.log(`curl -X POST http://localhost:4000/api/jobs -H 'Content-Type: application/json' -d '{
  "branchId": "branch_dallas",
  "serviceType": "residential-move",
  "payload": {
    "customer.name": "John Doe",
    "customer.email": "john@example.com",
    "customer.phone": "+1-214-555-1234",
    "move.origin": "123 Main St, Dallas, TX",
    "move.destination": "456 Oak Ave, Plano, TX",
    "move.moveDate": "2025-12-01",
    "pricing.baseCost": 1500
  }
}'`);

    await disconnectFromDatabase();
    console.log('\n✅ Disconnected from MongoDB');
}

run().catch(async (err) => {
    console.error('Seed failed', err);
    try { await disconnectFromDatabase(); } catch { }
    process.exit(1);
});


