import { HomePage } from '../pages/home_page';

describe('Home page', () => {
  const SEARCH_TERM = 'kabuto';
  const SEARCH_WRONG_TERM = 'abcdefs';

  let homePage: HomePage;

  beforeEach(() => {
    homePage = new HomePage();
    homePage.visit();
  });

  it('search the next page and previus page', () => {
    homePage.getPokemonItems().should('have.length', 20);
    homePage.getFirstPokemonItemId().should('have.text', '#001');
    homePage.clickNextPageButton();
    cy.wait(5000);
    homePage.getFirstPokemonItemId().first().should('have.text', '#021');
    homePage.clickPreviusPageButton();
    cy.wait(1000);
    homePage.getFirstPokemonItemId().first().should('have.text', '#001');
  });

  it('search by specific pokemon and clear input', () => {
    homePage.searchForTerm(SEARCH_TERM);
    cy.wait(500);
    homePage.getPokemonItems().should('have.length', 1);

    homePage.clickClearButton();
    cy.wait(500);
    homePage.getPokemonItems().should('have.length', 20);
  });

  it('show error when search pokemon that not exists', () => {
    homePage.searchForTerm(SEARCH_WRONG_TERM);
    cy.wait(500);

    homePage.getSnackBar().should('be.visible');
  });

  it('select and battle pokemons', () => {
    homePage.clickStartBattlePokemon().should('have.class', 'selected');

    homePage.clickFirstPokemonItem().should('have.class', 'selected');
    homePage.clickSecondPokemonItem().should('have.class', 'selected');

    homePage.getTitleBattleDialog().should('be.visible');
  });
});
