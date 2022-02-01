export class HomePage {
  public visit() {
    cy.visit('/');
  }

  public getPokemonItems() {
    return cy.byTestId('pokemon-item');
  }

  public getFirstPokemonItemId() {
    return cy.byTestId('pokemon-item-id').first();
  }

  public clickNextPageButton() {
    return cy.byTestId('next-page-button').first().click();
  }

  public clickClearButton() {
    return cy.byTestId('clear-button').first().click();
  }

  public searchForTerm(term: string) {
    cy.byTestId('search-pokemon-input').first().clear().type(term);
    cy.byTestId('search-button').first().click();
  }

  public getSnackBar() {
    return cy.get('snack-bar-container').first();
  }

  public clickPreviusPageButton() {
    return cy.byTestId('previus-page-button').first().click();
  }

  public clickFirstPokemonItem() {
    return cy.byTestId('pokemon-item').eq(0).click();
  }

  public clickSecondPokemonItem() {
    return cy.byTestId('pokemon-item').eq(1).click();
  }

  public clickStartBattlePokemon() {
    return cy.byTestId('battle-pokemon-button').first().click();
  }

  public getTitleBattleDialog() {
    return cy.byTestId('fight-pokemon-dialog-title').first();
  }
}
