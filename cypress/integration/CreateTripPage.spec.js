const appUrl = require('../fixtures/config').APP_URL
import '@testing-library/cypress/add-commands'

describe('Create Trip Page', () => {
  describe('Not authenticated', () => {
    it('shows validation error if first or last name not entered', () => {
      cy.visit(appUrl)
      cy.findByText('Plan my trip').click()
      cy.url().should('include', '/create')
      cy.findByPlaceholderText('Enter your first name').type('QA')
      cy.findByText('Next').click()
      cy.findByText('You must enter a first and last name').should('exist')

      cy.visit(appUrl)
      cy.findByText('Plan my trip').click()
      cy.url().should('include', '/create')
      cy.findByPlaceholderText('Enter your last name').type('QA')
      cy.findByText('Next').click()
      cy.findByText('You must enter a first and last name').should('exist')
    })
    it('shows validation error if airport not entered', () => {
      cy.visit(appUrl)
      cy.findByText('Plan my trip').click()
      cy.url().should('include', '/create')
      cy.findByPlaceholderText('Enter your first name').type('QA')
      cy.findByPlaceholderText('Enter your last name').type('Tester')
      cy.findByText('Next').click()
      cy.findByText('Next').click()
      cy.findByText('You must enter a departure airport').should('exist')
    })
    it('shows validation error if trip name is not entered', () => {
      cy.visit(appUrl)
      cy.findByText('Plan my trip').click()
      cy.url().should('include', '/create')
      cy.findByPlaceholderText('Enter your first name').type('QA')
      cy.findByPlaceholderText('Enter your last name').type('Tester')
      cy.findByText('Next').click()
      cy.findByPlaceholderText('Enter your departure airport (e.g. SFO)').type(
        'SFO'
      )
      cy.findByText('Next').click()
      cy.findByText('Next').click()
      cy.findByText('You must enter a trip name').should('exist')
    })
    it('shows a login form if user is not currently logged in', () => {
      cy.visit(appUrl)
      cy.findByText('Plan my trip').click()
      cy.url().should('include', '/create')
      cy.findByPlaceholderText('Enter your first name').type('QA')
      cy.findByPlaceholderText('Enter your last name').type('Tester')
      cy.findByText('Next').click()
      cy.findByPlaceholderText('Enter your departure airport (e.g. SFO)').type(
        'SFO'
      )
      cy.findByText('Next').click()
      cy.findByPlaceholderText('Enter your trip name').type('QA Test Trip')
      cy.findByText('Next').click()
      cy.findByPlaceholderText('Enter your email').should('exist')
      cy.findByPlaceholderText('Enter your email').should('exist')
    })
    it('redirects to plan page once account is created', () => {
      cy.visit(appUrl)
      cy.findByText('Plan my trip').click()
      cy.url().should('include', '/create')
      cy.findByPlaceholderText('Enter your first name').type('QA')
      cy.findByPlaceholderText('Enter your last name').type('Tester')
      cy.findByText('Next').click()
      cy.findByPlaceholderText('Enter your departure airport (e.g. SFO)').type(
        'SFO'
      )
      cy.findByText('Next').click()
      cy.findByPlaceholderText('Enter your trip name').type('QA Test Trip')
      cy.findByText('Next').click()

      // Sign up process
      cy.findByText('Sign up').click()
      cy.findByDisplayValue('QA Tester').should('exist')
      cy.findByPlaceholderText('Enter your email').type('autoqa@email.com')
      cy.findByPlaceholderText('Enter your password').type('password')
      cy.findByPlaceholderText('Confirm your password').type('password')
      cy.get('.PrivateSwitchBase-input-4').click()
      cy.findByText('Sign up').click()
      cy.url().should('include', '/trip')
    })

    // Delete the created trip and the account
    after(() => {
      cy.visit(appUrl)
      cy.findByText('My Trips').click()
      cy.findByText('Continue Planning').click()
      cy.url().should('include', '/trip')
      cy.findByText('Delete trip').click()
      cy.findByText('Yes, continue').click()
      cy.url().should('include', '/')
    })
  })
  describe('Authenticated', () => {
    beforeEach(() => {
      cy.visit(appUrl)
      cy.findByText('Login').should('exist')
      cy.findByText('Login').click()
      cy.findByPlaceholderText('Enter your email').type('autoqa@email.com')
      cy.findByPlaceholderText('Enter your password').type('password')
      cy.findByText('Log in').click()
      cy.url().should('include', '/trips')
    })
    it('automatically redirects to plan page if user is already logged in', () => {
      cy.visit(appUrl)
      cy.findByText('Plan my trip').click()
      cy.url().should('include', '/create')
      cy.findByDisplayValue('QA').should('exist')
      cy.findByDisplayValue('Tester').should('exist')
      cy.findByText('Next').click()
      cy.findByPlaceholderText('Enter your departure airport (e.g. SFO)').type(
        'SFO'
      )
      cy.findByText('Next').click()
      cy.findByPlaceholderText('Enter your trip name').type('QA Test Trip')
      cy.findByText('Next').click()
      cy.url().should('include', '/trip')
    })
    it('pre-populates the first name and last name if user has already logged in', () => {
      cy.visit(appUrl)
      cy.findByText('Plan my trip').click()
      cy.url().should('include', '/create')
      cy.findByDisplayValue('QA').should('exist')
      cy.findByDisplayValue('Tester').should('exist')
    })
    after(() => {
      cy.visit(appUrl)
      cy.findByText('My Trips').click()
      cy.findByText('Continue Planning').click()
      cy.url().should('include', '/trip')
      cy.findByText('Delete trip').click()
      cy.findByText('Yes, continue').click()
      cy.url().should('not.include', '/trip')

      cy.visit(appUrl)
      cy.findByText('QA').click()
      cy.findByText('Delete account').click()
      cy.findByText('Yes, continue').click()
      cy.findByText('QA').should('not.exist')
    })
  })
})
