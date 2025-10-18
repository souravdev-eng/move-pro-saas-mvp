import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FieldInput from '../../components/FieldInput/FieldInput'

const baseField: any = { id: 'f', label: 'Field', type: 'string', required: false, widget: { key: 'text' } }

describe('FieldInput', () => {
    it('renders text and handles change', async () => {
        const user = userEvent.setup()
        const onChange = vi.fn()
        render(<FieldInput field={baseField} value="" onChange={onChange} />)
        const input = screen.getByLabelText(/Field/i)
        await user.type(input, 'abc')
        expect(onChange).toHaveBeenCalled()
    })

    it('renders select options', async () => {
        const onChange = vi.fn()
        const field: any = { ...baseField, widget: { key: 'select' } }
        render(<FieldInput field={field} value="" onChange={onChange} items={[{ id: 'a', name: 'A' }]} />)
        expect(screen.getByRole('button')).toBeInTheDocument()
    })
})


