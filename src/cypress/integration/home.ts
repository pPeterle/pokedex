describe('Home page', () => {
  const SEARCH_TERM = 'kabuto';
  const SEARCH_WRONG_TERM = 'abcdefs';

  beforeEach(() => {
    cy.visit('/');
  });

  it('search the next page and previus page', () => {
    cy.byTestId('pokemon-item').should('have.length', 20);
    cy.byTestId('pokemon-item-id').first().should('have.text', '#001');
    cy.byTestId('next-page-button').first().click();
    cy.wait(500);
    cy.byTestId('pokemon-item-id').first().should('have.text', '#021');
    cy.byTestId('previus-page-button').first().click();
    cy.wait(500);
    cy.byTestId('pokemon-item-id').first().should('have.text', '#001');
  });

  it('search by specific pokemon and clear input', () => {
    cy.byTestId('search-pokemon-input').first().clear().type(SEARCH_TERM);

    cy.byTestId('search-button').first().click();
    cy.wait(500);
    cy.byTestId('pokemon-item').should('have.length', 1);

    cy.byTestId('clear-button').first().click();
    cy.wait(500);
    cy.byTestId('pokemon-item').should('have.length', 20);
  });

  it('show error when search pokemon that not exists', () => {
    cy.byTestId('search-pokemon-input').first().clear().type(SEARCH_WRONG_TERM);
    cy.byTestId('search-button').first().click();
    cy.wait(500);

    cy.get('snack-bar-container').first().should('be.visible');
  })

  it('select and batle pokemons', () => {
    cy.byTestId('batle-pokemon-button')
      .first()
      .click()
      .should('have.class', 'selected');

    cy.byTestId('pokemon-item').eq(0).click().should('have.class', 'selected');
    cy.byTestId('pokemon-item').eq(1).click().should('have.class', 'selected');

    cy.byTestId('fight-pokemon-dialog-title').first().should('be.visible');
  });
});
