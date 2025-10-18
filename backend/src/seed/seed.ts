import { connectToDatabase, disconnectFromDatabase } from '../db/mongoose';
import { createRuleset } from '../modules/rulesets/ruleset.service';

async function run() {
    await connectToDatabase();
    console.log('Connected to MongoDB');

    const tenantId = 't_123';
    const branchId = 'b_001';

    // Global ruleset
    const globalRs = await createRuleset({
        tenantId,
        scope: 'global',
        name: 'Global Base v1',
        notes: 'Seed: Global ruleset',
        definitions: {
            fields: [
                {
                    id: 'move.type',
                    label: 'Move Type',
                    type: 'string',
                    widget: { type: 'builtIn', key: 'select' },
                    options: { dataSourceId: 'ds:moveTypes', valueKey: 'id', labelKey: 'name' },
                },
            ],
            layout: {
                sections: [
                    {
                        id: 'base',
                        title: 'Base',
                        rows: [{ cols: [{ fieldId: 'move.type', span: 12 }] }],
                    },
                ],
            },
            expressions: [
                { id: 'expr:isResidential', engine: 'jsonlogic', body: { '==': [{ var: 'move.type' }, 'Residential'] } },
            ],
            dataSources: [
                { id: 'ds:moveTypes', type: 'static', config: { items: [{ id: 'Residential', name: 'Residential' }, { id: 'Commercial', name: 'Commercial' }] } },
            ],
            widgets: [],
        },
        createdBy: 'seed',
    });
    console.log('Created global ruleset:', globalRs._id);

    // Branch ruleset
    const branchRs = await createRuleset({
        tenantId,
        scope: 'branch',
        branchId,
        name: 'Branch Custom v1',
        notes: 'Seed: Branch ruleset',
        definitions: {
            fields: [
                {
                    id: 'contact.phone',
                    label: 'Phone',
                    type: 'string',
                    required: true,
                    validators: [{ kind: 'regex', pattern: '^\\+?\\d{10,15}$', message: 'Invalid phone' }],
                    widget: { type: 'builtIn', key: 'phone', props: { mask: '+1 (###) ###-####' } },
                    showWhen: { ref: 'expr:isResidential' },
                    options: null,
                },
            ],
            layout: {
                sections: [
                    {
                        id: 'contact',
                        title: 'Contact',
                        rows: [{ cols: [{ fieldId: 'contact.phone', span: 6 }] }],
                    },
                ],
            },
            expressions: [
                { id: 'expr:isResidential', engine: 'jsonlogic', body: { '==': [{ var: 'move.type' }, 'Residential'] } },
            ],
            dataSources: [
                { id: 'ds:moveTypes', type: 'static', config: { items: [{ id: 'Residential', name: 'Residential' }, { id: 'Commercial', name: 'Commercial' }] } },
            ],
            widgets: [],
        },
        createdBy: 'seed',
    });
    console.log('Created branch ruleset:', branchRs._id);

    await disconnectFromDatabase();
    console.log('Disconnected');
}

run().catch(async (err) => {
    console.error('Seed failed', err);
    try { await disconnectFromDatabase(); } catch { }
    process.exit(1);
});


