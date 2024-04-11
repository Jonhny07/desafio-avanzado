
Cypress.Commands.add('verifyBillingSummary', (producto) => {
  cy.get('[role="list"]').within(() => {
      cy.get('[data-cy="subtotalAmount"]').should('have.text', `$${producto}`)
      cy.get('[data-cy="freightAmount"]').should('have.text', 'Free')
      cy.get('[data-cy="totalPriceAmount"]').should('have.text', `$${producto}`)
  })
})