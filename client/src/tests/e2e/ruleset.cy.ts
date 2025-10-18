import sample from '../../fixtures/sampleRuleset.global.json'

describe('Ruleset detail happy path', () => {
    it('loads, toggles stairs visibility, submits valid values', () => {
        cy.intercept('GET', '/api/rulesets/*', sample).as('getRuleset')
        cy.visit('/rulesets/rs_global_move')
        cy.wait('@getRuleset')

        cy.findByRole('button', { name: /use sample/i }).click()

        // Fill required contact fields
        cy.findByLabelText(/First Name/i).type('John')
        cy.findByLabelText(/Last Name/i).type('Doe')
        cy.findByLabelText(/Phone/i).type('+15551234567')
        cy.findByLabelText(/Email/i).type('john@example.com')

        // Select Residential -> stairs should appear
        cy.findByLabelText(/Move Type/i).click()
        cy.findByRole('option', { name: /Residential/i }).click()
        cy.findByLabelText(/Stairs/i).should('be.visible')
        cy.findByLabelText(/Stairs/i).type('2')

        // Fill other required fields
        cy.findByLabelText(/Move Date/i).type('2024-06-15')
        cy.findByLabelText(/Crew Size/i).type('3')
        cy.findByLabelText(/Origin Address 1/i).type('123 Main St')
        cy.findByLabelText(/Origin City/i).type('Boston')
        cy.findByLabelText(/Origin State/i).type('MA')
        cy.findByLabelText(/Origin ZIP/i).type('02101')
        cy.findByLabelText(/Destination Address 1/i).type('456 Elm St')
        cy.findByLabelText(/Destination City/i).type('Cambridge')
        cy.findByLabelText(/Destination State/i).type('MA')
        cy.findByLabelText(/Destination ZIP/i).type('02139')

        cy.findByRole('button', { name: /Validate & Submit/i }).click()
        cy.contains('Submitted Values')
            .parent()
            .within(() => {
                cy.contains('John')
                cy.contains('john@example.com')
            })
    })
})


