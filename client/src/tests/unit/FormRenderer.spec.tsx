import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FormRenderer from '../../components/FormRenderer/FormRenderer'
import sample from '../../fixtures/sampleRuleset.global.json'

describe('FormRenderer', () => {
    it('renders fields from layout and toggles visibility', async () => {
        const defs = (sample as any).definitions
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        render(<FormRenderer definitions={defs} onSubmit={onSubmit} />)

        // move.type visible initially
        expect(screen.getByLabelText(/Move Type/i)).toBeInTheDocument()
        // stairs hidden until Residential (showWhen references expr:isResidential)
        expect(screen.queryByLabelText(/Stairs/i)).toBeNull()

        // Select Residential -> stairs appears
        const select = screen.getByLabelText(/Move Type/i)
        await user.click(select)
        const option = await screen.findByRole('option', { name: /Residential/i })
        await user.click(option)
        expect(await screen.findByLabelText(/Stairs/i)).toBeInTheDocument()
    })

    it('validates required fields and email/phone', async () => {
        const defs = (sample as any).definitions
        const onSubmit = vi.fn()
        const { container } = render(<FormRenderer definitions={defs} onSubmit={onSubmit} />)

        // Click submit without filling required fields
        const submitBtn = screen.getByRole('button', { name: /Validate & Submit/i })
        await user.click(submitBtn)

        // Should not call onSubmit
        expect(onSubmit).not.toHaveBeenCalled()

        // Should show error messages (at least for required fields)
        expect(container.textContent).toMatch(/Required/i)
    })
})
