const appUrl = require('../fixtures/config').APP_URL
import '@testing-library/cypress/add-commands'

describe('Date Range Poll', () => {
  before(() => {
    cy.visit(appUrl)
    // Create a trip
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

    // Register a new account
    cy.findByText('Sign up').click()
    cy.findByPlaceholderText('Enter your email').type('autoqa@email.com')
    cy.findByPlaceholderText('Enter your password').type('password')
    cy.findByPlaceholderText('Confirm your password').type('password')
    cy.get('.PrivateSwitchBase-input-4').click()
    cy.findByText('Sign up').click()
    cy.url().should('include', '/trip')
    cy.findByText('QA').click()
    cy.findByText('Sign out').click()
    cy.url().should('include', '/')
  })

  beforeEach(() => {
    cy.visit(appUrl)
    cy.findByText('Login').click()
    cy.findByPlaceholderText('Enter your email').type('autoqa@email.com')
    cy.findByPlaceholderText('Enter your password').type('password')
    cy.findByText('Log in').click()
    cy.url().should('include', '/trip')
  })

  afterEach(() => {
    cy.findByText('QA').click()
    cy.findByText('Sign out').click()
    cy.url().should('include', '/')
  })

  it('should open a date range poll with no date range options', () => {
    cy.visit(appUrl)
    cy.findByText('My Trips').click()
    cy.findByText('Continue Planning').click()
    cy.findByText('Open date range poll').click()
    cy.findByText('Yes, continue').click()
    cy.findByText('No polling options added yet.').should('exist')
  })

  it('add a date range', () => {
    cy.visit(appUrl)
    cy.findByText('My Trips').click()
    cy.findByText('Continue Planning').click()
    cy.findByText('Add option').click()
    cy.findByPlaceholderText('Early').clear()
    cy.findByPlaceholderText('Early').type('Jul 10, 2020')
    cy.findByPlaceholderText('Continuous').clear()
    cy.findByPlaceholderText('Continuous').type('Jul 20, 2020')
    cy.get('button').last().click()
    cy.findByText('Fri Jul 10, 2020 - Mon Jul 20, 2020').should('exist')
  })

  it('voting / unvoting for a date range option', () => {
    cy.visit(appUrl)
    cy.findByText('My Trips').click()
    cy.findByText('Continue Planning').click()
    cy.findByTestId('pollOption-Fri Jul 10, 2020 - Mon Jul 20, 2020').click()
    cy.findByTestId('voter-icon').should('not.exist')
    cy.findByTestId('pollOption-Fri Jul 10, 2020 - Mon Jul 20, 2020').click()
    cy.findByTestId('voter-icon').should('exist')
  })

  it('initiates a tie breaker modal if votes are tied', () => {
    cy.visit(appUrl)
    cy.findByText('My Trips').click()
    cy.findByText('Continue Planning').click()
    cy.findByText('Add option').click()
    cy.findByPlaceholderText('Early').clear()
    cy.findByPlaceholderText('Early').type('Jul 12, 2020')
    cy.findByPlaceholderText('Continuous').clear()
    cy.findByPlaceholderText('Continuous').type('Jul 22, 2020')
    cy.get('button').last().click()
    cy.findByText('Sun Jul 12, 2020 - Wed Jul 22, 2020').should('exist')
    cy.findByText('Close voting').click()
    cy.findByText('Yes, continue').click()
    cy.findByText("Uh oh, there's a tie between options").should('exist')
    cy.get('.svg-inline--fa.fa-square.fa-w-14').last().click()
    cy.findByText('Select tiebreaker').click()
    cy.findByText('Departure Date').should('exist')
    cy.findByText('Return Date').should('exist')
  })

  it('reopens a date range poll after closing it', () => {
    cy.visit(appUrl)
    cy.findByText('My Trips').click()
    cy.findByText('Continue Planning').click()
    cy.findByText('Reopen poll').click()
    cy.findByText('Yes, continue').click()
    cy.findByText('No polling options added yet.').should('exist')
  })

  after(() => {
    cy.visit(appUrl)
    cy.findByText('Login').click()
    cy.findByPlaceholderText('Enter your email').type('autoqa@email.com')
    cy.findByPlaceholderText('Enter your password').type('password')
    cy.findByText('Log in').click()
    cy.url().should('include', '/trips')
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
