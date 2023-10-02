import {signin_pom} from '../pages/signin_pom.js'
const SignInPage = new signin_pom();
describe('sign-in page', () => {
  beforeEach(() => {
    cy.login("cole.stewart", "password")
  })
  it('should go to sign-in page', () => {
    SignInPage.register_header().should('exist')
  })
})