const appUrl = require('../fixtures/config').APP_URL
import '@testing-library/cypress/add-commands'

describe('Landing Page', () => {
  describe('Plan trip redirect', () => {
    it('should redirect when plan trip is clicked', () => {
      cy.visit(appUrl)
      cy.findByText('Plan my trip').click()
      cy.url().should('include', '/create')
    })
  })
  describe('Registration flows', () => {
    it('Validation error if no email', () => {
      cy.visit(appUrl)
      cy.findByText('Login').click()
      cy.findByText('Sign up').click()
      cy.findByPlaceholderText('Enter your full name').type('QA Test')
      cy.findByPlaceholderText('Enter your password').type('password')
      cy.findByPlaceholderText('Confirm your password').type('password')
      cy.get('.PrivateSwitchBase-input-4').click()
      cy.findByText('Sign up').click()
      cy.findByText('You must enter an email!').should('exist')
    })
    it('Validation error if no full name', () => {
      cy.visit(appUrl)
      cy.findByText('Login').click()
      cy.findByText('Sign up').click()
      cy.findByPlaceholderText('Enter your email').type('autoqa@email.com')
      cy.findByPlaceholderText('Enter your password').type('password')
      cy.findByPlaceholderText('Confirm your password').type('password')
      cy.get('.PrivateSwitchBase-input-4').click()
      cy.findByText('Sign up').click()
      cy.findByText('You must enter a full name!').should('exist')
    })
    it('Validation error if passwords do not match', () => {
      cy.visit(appUrl)
      cy.findByText('Login').click()
      cy.findByText('Sign up').click()
      cy.findByPlaceholderText('Enter your full name').type('QA Test')
      cy.findByPlaceholderText('Enter your email').type('autoqa@email.com')
      cy.findByPlaceholderText('Enter your password').type('password')
      cy.findByPlaceholderText('Confirm your password').type('invalid')
      cy.get('.PrivateSwitchBase-input-4').click()
      cy.findByText('Sign up').click()
      cy.findByText('Passwords do not match!').should('exist')
    })
    it('Validation error if TOS and PP checkbox not clicked', () => {
      cy.visit(appUrl)
      cy.findByText('Login').click()
      cy.findByText('Sign up').click()
      cy.findByPlaceholderText('Enter your full name').type('QA Test')
      cy.findByPlaceholderText('Enter your email').type('autoqa@email.com')
      cy.findByPlaceholderText('Enter your password').type('password')
      cy.findByPlaceholderText('Confirm your password').type('password')
      cy.findByText('Sign up').click()
      cy.findByText(
        'You must accept the terms of service and privacy policy'
      ).should('exist')
    })
    it('redirects to the trips page when registration is successful', () => {
      cy.visit(appUrl)
      cy.findByText('Login').click()
      cy.findByText('Sign up').click()
      cy.findByPlaceholderText('Enter your full name').type('QA Test')
      cy.findByPlaceholderText('Enter your email').type('autoqa@email.com')
      cy.findByPlaceholderText('Enter your password').type('password')
      cy.findByPlaceholderText('Confirm your password').type('password')
      cy.get('.PrivateSwitchBase-input-4').click()
      cy.findByText('Sign up').click()
      cy.url().should('include', '/trips')
    })
  })
  describe('Login flows', () => {
    it('shows validation error if no email is provided', () => {
      cy.visit(appUrl)
      cy.findByText('Login').click()
      cy.findByPlaceholderText('Enter your password').type('password')
      cy.findByText('Log in').click()
      cy.findByText('You must enter an email!').should('exist')
    })

    it('shows validation error if no password is provided', () => {
      cy.visit(appUrl)
      cy.findByText('Login').click()
      cy.findByPlaceholderText('Enter your email').type('autoqa@email.com')
      cy.findByText('Log in').click()
      cy.findByText('You must enter a password!').should('exist')
    })

    it('redirects to the trips page after successful login', () => {
      cy.visit(appUrl)
      cy.findByText('Login').click()
      cy.findByPlaceholderText('Enter your email').type('autoqa@email.com')
      cy.findByPlaceholderText('Enter your password').type('password')
      cy.findByText('Log in').click()
      cy.url().should('include', '/trips')
    })
  })

  after(() => {
    cy.visit(appUrl)
    cy.findByText('QA').click()
    cy.findByText('Delete account').click()
    cy.findByText('Yes, continue').click()
    cy.findByText('QA').should('not.exist')
  })
})
