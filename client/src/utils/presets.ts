import type { FieldDef, DataSourceStatic, Expression, Layout } from '../types/rules'

export function getMovePresetFields(): FieldDef[] {
    return [
        {
            id: 'contact.firstName',
            label: 'First Name',
            type: 'string',
            required: true,
            widget: { type: 'builtIn', key: 'text' },
            options: null,
            showWhen: null,
        },
        {
            id: 'contact.lastName',
            label: 'Last Name',
            type: 'string',
            required: true,
            widget: { type: 'builtIn', key: 'text' },
            options: null,
            showWhen: null,
        },
        {
            id: 'contact.phone',
            label: 'Phone',
            type: 'string',
            required: true,
            validators: [{ kind: 'phone' }, { kind: 'regex', pattern: '^\\+?\\d{10,15}$', message: 'Phone must be 10-15 digits' }],
            widget: { type: 'builtIn', key: 'phone' },
            options: null,
            showWhen: null,
        },
        {
            id: 'contact.email',
            label: 'Email',
            type: 'string',
            required: false,
            validators: [{ kind: 'email' }],
            widget: { type: 'builtIn', key: 'email' },
            options: null,
            showWhen: null,
        },
        {
            id: 'move.type',
            label: 'Move Type',
            type: 'string',
            required: true,
            widget: { type: 'builtIn', key: 'select' },
            options: { dataSourceId: 'ds:moveTypes' },
            showWhen: null,
        },
        {
            id: 'schedule.date',
            label: 'Move Date',
            type: 'string',
            required: true,
            widget: { type: 'builtIn', key: 'date' },
            options: null,
            showWhen: null,
        },
        {
            id: 'crew.size',
            label: 'Crew Size',
            type: 'number',
            required: true,
            widget: { type: 'builtIn', key: 'number' },
            options: null,
            showWhen: null,
        },
        {
            id: 'origin.address1',
            label: 'Origin Address 1',
            type: 'string',
            required: true,
            widget: { type: 'builtIn', key: 'text' },
            options: null,
            showWhen: null,
        },
        {
            id: 'origin.address2',
            label: 'Origin Address 2',
            type: 'string',
            required: false,
            widget: { type: 'builtIn', key: 'text' },
            options: null,
            showWhen: null,
        },
        {
            id: 'origin.city',
            label: 'Origin City',
            type: 'string',
            required: true,
            widget: { type: 'builtIn', key: 'text' },
            options: null,
            showWhen: null,
        },
        {
            id: 'origin.state',
            label: 'Origin State',
            type: 'string',
            required: true,
            widget: { type: 'builtIn', key: 'text' },
            options: null,
            showWhen: null,
        },
        {
            id: 'origin.zip',
            label: 'Origin ZIP',
            type: 'string',
            required: true,
            widget: { type: 'builtIn', key: 'text' },
            options: null,
            showWhen: null,
        },
        {
            id: 'destination.address1',
            label: 'Destination Address 1',
            type: 'string',
            required: true,
            widget: { type: 'builtIn', key: 'text' },
            options: null,
            showWhen: null,
        },
        {
            id: 'destination.address2',
            label: 'Destination Address 2',
            type: 'string',
            required: false,
            widget: { type: 'builtIn', key: 'text' },
            options: null,
            showWhen: null,
        },
        {
            id: 'destination.city',
            label: 'Destination City',
            type: 'string',
            required: true,
            widget: { type: 'builtIn', key: 'text' },
            options: null,
            showWhen: null,
        },
        {
            id: 'destination.state',
            label: 'Destination State',
            type: 'string',
            required: true,
            widget: { type: 'builtIn', key: 'text' },
            options: null,
            showWhen: null,
        },
        {
            id: 'destination.zip',
            label: 'Destination ZIP',
            type: 'string',
            required: true,
            widget: { type: 'builtIn', key: 'text' },
            options: null,
            showWhen: null,
        },
        {
            id: 'property.stairs',
            label: 'Stairs',
            type: 'number',
            required: false,
            widget: { type: 'builtIn', key: 'number' },
            options: null,
            showWhen: { ref: 'expr:isResidential' },
        },
        {
            id: 'property.elevator',
            label: 'Elevator',
            type: 'string',
            required: false,
            widget: { type: 'builtIn', key: 'select' },
            options: { dataSourceId: 'ds:elevatorTypes' },
            showWhen: null,
        },
        {
            id: 'inventory.notes',
            label: 'Inventory Notes',
            type: 'string',
            required: false,
            widget: { type: 'builtIn', key: 'textarea' },
            options: null,
            showWhen: null,
        },
    ]
}

export function getMovePresetDataSources(): DataSourceStatic[] {
    return [
        {
            id: 'ds:moveTypes',
            type: 'static',
            config: {
                items: [
                    { id: 'Residential', name: 'Residential' },
                    { id: 'Commercial', name: 'Commercial' },
                ],
            },
        },
        {
            id: 'ds:elevatorTypes',
            type: 'static',
            config: {
                items: [
                    { id: 'None', name: 'None' },
                    { id: 'Passenger', name: 'Passenger' },
                    { id: 'Freight', name: 'Freight' },
                ],
            },
        },
    ]
}

export function getMovePresetExpressions(): Expression[] {
    return [
        {
            id: 'expr:isResidential',
            engine: 'jsonlogic',
            body: { '==': [{ var: 'move.type' }, 'Residential'] },
        },
    ]
}

export function getMovePresetLayout(): Layout {
    return {
        sections: [
            {
                id: 'contact',
                title: 'Contact Information',
                rows: [
                    {
                        cols: [
                            { fieldId: 'contact.firstName', span: 6 },
                            { fieldId: 'contact.lastName', span: 6 },
                        ],
                    },
                    {
                        cols: [
                            { fieldId: 'contact.phone', span: 6 },
                            { fieldId: 'contact.email', span: 6 },
                        ],
                    },
                ],
            },
            {
                id: 'move',
                title: 'Move Details',
                rows: [
                    {
                        cols: [
                            { fieldId: 'move.type', span: 6 },
                            { fieldId: 'schedule.date', span: 6 },
                        ],
                    },
                    {
                        cols: [{ fieldId: 'crew.size', span: 6 }],
                    },
                ],
            },
            {
                id: 'locations',
                title: 'Locations',
                rows: [
                    { cols: [{ fieldId: 'origin.address1', span: 12 }] },
                    { cols: [{ fieldId: 'origin.address2', span: 12 }] },
                    {
                        cols: [
                            { fieldId: 'origin.city', span: 4 },
                            { fieldId: 'origin.state', span: 4 },
                            { fieldId: 'origin.zip', span: 4 },
                        ],
                    },
                    { cols: [{ fieldId: 'destination.address1', span: 12 }] },
                    { cols: [{ fieldId: 'destination.address2', span: 12 }] },
                    {
                        cols: [
                            { fieldId: 'destination.city', span: 4 },
                            { fieldId: 'destination.state', span: 4 },
                            { fieldId: 'destination.zip', span: 4 },
                        ],
                    },
                ],
            },
            {
                id: 'extras',
                title: 'Additional Details',
                rows: [
                    {
                        cols: [
                            { fieldId: 'property.stairs', span: 6 },
                            { fieldId: 'property.elevator', span: 6 },
                        ],
                    },
                    { cols: [{ fieldId: 'inventory.notes', span: 12 }] },
                ],
            },
        ],
    }
}

