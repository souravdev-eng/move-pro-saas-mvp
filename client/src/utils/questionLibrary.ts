import type { FieldDef } from '../types/rules'

// Question Library - Pre-built questions users can reuse
export const QUESTION_LIBRARY = {
    contact: [
        {
            id: 'lib_first_name',
            label: 'First Name',
            type: 'string' as const,
            required: true,
            widget: { type: 'builtIn' as const, key: 'text' as const },
            options: null,
            showWhen: null,
            category: 'Contact Information',
        },
        {
            id: 'lib_last_name',
            label: 'Last Name',
            type: 'string' as const,
            required: true,
            widget: { type: 'builtIn' as const, key: 'text' as const },
            options: null,
            showWhen: null,
            category: 'Contact Information',
        },
        {
            id: 'lib_full_name',
            label: 'Full Name',
            type: 'string' as const,
            required: true,
            widget: { type: 'builtIn' as const, key: 'text' as const },
            options: null,
            showWhen: null,
            category: 'Contact Information',
        },
        {
            id: 'lib_email',
            label: 'Email Address',
            type: 'string' as const,
            required: true,
            validators: [{ kind: 'email' as const }],
            widget: { type: 'builtIn' as const, key: 'email' as const },
            options: null,
            showWhen: null,
            category: 'Contact Information',
        },
        {
            id: 'lib_phone',
            label: 'Phone Number',
            type: 'string' as const,
            required: true,
            validators: [
                { kind: 'phone' as const },
                { kind: 'regex' as const, pattern: '^\\+?\\d{10,15}$', message: 'Phone must be 10-15 digits' },
            ],
            widget: { type: 'builtIn' as const, key: 'phone' as const },
            options: null,
            showWhen: null,
            category: 'Contact Information',
        },
    ],
    address: [
        {
            id: 'lib_street_address',
            label: 'Street Address',
            type: 'string' as const,
            required: true,
            widget: { type: 'builtIn' as const, key: 'text' as const },
            options: null,
            showWhen: null,
            category: 'Address',
        },
        {
            id: 'lib_city',
            label: 'City',
            type: 'string' as const,
            required: true,
            widget: { type: 'builtIn' as const, key: 'text' as const },
            options: null,
            showWhen: null,
            category: 'Address',
        },
        {
            id: 'lib_state',
            label: 'State',
            type: 'string' as const,
            required: true,
            widget: { type: 'builtIn' as const, key: 'text' as const },
            options: null,
            showWhen: null,
            category: 'Address',
        },
        {
            id: 'lib_zip',
            label: 'ZIP Code',
            type: 'string' as const,
            required: true,
            validators: [{ kind: 'regex' as const, pattern: '^\\d{5}$', message: '5-digit ZIP code' }],
            widget: { type: 'builtIn' as const, key: 'text' as const },
            options: null,
            showWhen: null,
            category: 'Address',
        },
    ],
    business: [
        {
            id: 'lib_company_name',
            label: 'Company Name',
            type: 'string' as const,
            required: true,
            widget: { type: 'builtIn' as const, key: 'text' as const },
            options: null,
            showWhen: null,
            category: 'Business',
        },
        {
            id: 'lib_job_title',
            label: 'Job Title',
            type: 'string' as const,
            required: false,
            widget: { type: 'builtIn' as const, key: 'text' as const },
            options: null,
            showWhen: null,
            category: 'Business',
        },
    ],
    feedback: [
        {
            id: 'lib_rating',
            label: 'How would you rate our service?',
            type: 'string' as const,
            required: true,
            widget: { type: 'builtIn' as const, key: 'select' as const },
            options: { dataSourceId: 'ds_lib_rating' },
            showWhen: null,
            category: 'Feedback',
        },
        {
            id: 'lib_comments',
            label: 'Additional Comments',
            type: 'string' as const,
            required: false,
            widget: { type: 'builtIn' as const, key: 'textarea' as const },
            options: null,
            showWhen: null,
            category: 'Feedback',
        },
        {
            id: 'lib_recommend',
            label: 'Would you recommend us to others?',
            type: 'string' as const,
            required: true,
            widget: { type: 'builtIn' as const, key: 'select' as const },
            options: { dataSourceId: 'ds_lib_yes_no' },
            showWhen: null,
            category: 'Feedback',
        },
    ],
    dates: [
        {
            id: 'lib_preferred_date',
            label: 'Preferred Date',
            type: 'string' as const,
            required: true,
            widget: { type: 'builtIn' as const, key: 'date' as const },
            options: null,
            showWhen: null,
            category: 'Scheduling',
        },
        {
            id: 'lib_start_date',
            label: 'Start Date',
            type: 'string' as const,
            required: true,
            widget: { type: 'builtIn' as const, key: 'date' as const },
            options: null,
            showWhen: null,
            category: 'Scheduling',
        },
    ],
}

// Data sources needed for library questions
export const LIBRARY_DATA_SOURCES = [
    {
        id: 'ds_lib_rating',
        type: 'static',
        config: {
            items: [
                { id: '5', name: '⭐⭐⭐⭐⭐ Excellent' },
                { id: '4', name: '⭐⭐⭐⭐ Good' },
                { id: '3', name: '⭐⭐⭐ Average' },
                { id: '2', name: '⭐⭐ Poor' },
                { id: '1', name: '⭐ Very Poor' },
            ],
        },
    },
    {
        id: 'ds_lib_yes_no',
        type: 'static',
        config: {
            items: [
                { id: 'yes', name: 'Yes' },
                { id: 'no', name: 'No' },
            ],
        },
    },
]

// Get all library questions as a flat array
export function getAllLibraryQuestions(): FieldDef[] {
    return Object.values(QUESTION_LIBRARY).flat()
}

// Get library questions by category
export function getLibraryByCategory() {
    return {
        'Contact Information': QUESTION_LIBRARY.contact,
        'Address': QUESTION_LIBRARY.address,
        'Business': QUESTION_LIBRARY.business,
        'Feedback': QUESTION_LIBRARY.feedback,
        'Scheduling': QUESTION_LIBRARY.dates,
    }
}

// Save custom question to library (localStorage)
export function saveToLibrary(question: FieldDef) {
    const saved = localStorage.getItem('customQuestionLibrary')
    const library = saved ? JSON.parse(saved) : []
    library.push({ ...question, savedAt: new Date().toISOString() })
    localStorage.setItem('customQuestionLibrary', JSON.stringify(library))
}

// Get custom questions from library
export function getCustomLibrary(): FieldDef[] {
    const saved = localStorage.getItem('customQuestionLibrary')
    return saved ? JSON.parse(saved) : []
}

// Delete from custom library
export function deleteFromLibrary(questionId: string) {
    const saved = localStorage.getItem('customQuestionLibrary')
    if (!saved) return
    const library = JSON.parse(saved)
    const filtered = library.filter((q: FieldDef) => q.id !== questionId)
    localStorage.setItem('customQuestionLibrary', JSON.stringify(filtered))
}

