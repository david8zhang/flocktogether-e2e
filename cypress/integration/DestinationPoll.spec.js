const appUrl = require('../fixtures/config').APP_URL
import '@testing-library/cypress/add-commands'

describe('Destination Poll', () => {
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

    // Pick a date range
    cy.visit(appUrl)
    cy.findByText('My Trips').click()
    cy.findByText('Continue Planning').click()
    cy.findByText('Open date range poll').click()
    cy.findByText('Yes, continue').click()
    cy.findByText('No polling options added yet.').should('exist')
    cy.findByText('Add option').click()
    cy.findByPlaceholderText('Early').clear()
    cy.findByPlaceholderText('Early').type('Jul 10, 2020')
    cy.findByPlaceholderText('Continuous').clear()
    cy.findByPlaceholderText('Continuous').type('Jul 20, 2020')
    cy.get('button').last().click()
    cy.findByText('Fri Jul 10, 2020 - Mon Jul 20, 2020').should('exist')
    cy.findByText('Close voting').click()
    cy.findByText('Yes, continue').click()
    cy.findByText('Departure Date').should('exist')
    cy.findByText('Return Date').should('exist')

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
    cy.url().should('include', '/trips')
  })

  it('should generate a list of suggested destinations', () => {
    cy.visit(appUrl)
    cy.findByText('My Trips').click()
    cy.findByText('Continue Planning').click()
    cy.findByText('Page 1').should('exist')
  })

  it('should allow voting on a specific destination', () => {
    cy.visit(appUrl)
    cy.findByText('My Trips').click()
    cy.findByText('Continue Planning').click()
    cy.get('.svg-inline--fa.fa-square.fa-w-14').first().click()
    cy.findByTestId('voter-icon').should('exist')
    cy.get('.svg-inline--fa.fa-check-square.fa-w-14').first().click()
    cy.findByTestId('voter-icon').should('not.exist')
  })

  it('should show price breakdown', () => {
    cy.visit(appUrl)
    cy.findByText('My Trips').click()
    cy.findByText('Continue Planning').click()
    cy.get('.svg-inline--fa.fa-ellipsis-v.fa-w-6').first().click()
    cy.findByText('Departure City').should('exist')
    cy.findByText('Quantity').should('exist')
    cy.findByText('Best Price').should('exist')
    cy.findByText('Worst Price').should('exist')
    cy.findByText('Total (Best)').should('exist')
    cy.findByText('Total (Worst)').should('exist')
    cy.findByText('Total').should('exist')
    cy.findByText('Ticket Price / Person').should('exist')
    cy.get('.svg-inline--fa.fa-times.fa-w-11.fa-lg').click()
  })

  it('search bar should filter down results', () => {
    cy.visit(appUrl)
    cy.findByText('My Trips').click()
    cy.findByText('Continue Planning').click()
    cy.findByText('Page 1').should('exist')
    cy.findByPlaceholderText('Enter a city or country...').type('Paris, France')
    cy.findAllByText('Paris, France').should('exist')
  })

  it('should paginate results', () => {
    cy.visit(appUrl)
    cy.findByText('My Trips').click()
    cy.findByText('Continue Planning').click()
    cy.findByText('Page 1').should('exist')
    cy.get('.svg-inline--fa.fa-caret-right.fa-w-6.fa-lg').click()
    cy.findByText('Page 2').should('exist')
  })

  it('should prompt tiebreaker modal', () => {
    cy.visit(appUrl)
    cy.findByText('My Trips').click()
    cy.findByText('Continue Planning').click()
    cy.findByText('Page 1').should('exist')
    cy.get('.svg-inline--fa.fa-square.fa-w-14').first().click()
    cy.findByTestId('voter-icon').should('exist')
    cy.get('.svg-inline--fa.fa-square.fa-w-14').first().click()
    cy.findAllByTestId('voter-icon').should('have.length', 2)
    cy.findByText('Close voting').click()
    cy.findByText('Yes, continue').click()
    cy.get('.svg-inline--fa.fa-square.fa-w-14').last().click()
    cy.findByText('Select tiebreaker').click()
    cy.findByText('Avg. Total Ticket Price').should('exist')
  })

  it('should reopen polling', () => {
    cy.visit(appUrl)
    cy.findByText('My Trips').click()
    cy.findByText('Continue Planning').click()
    cy.findByText('Avg. Total Ticket Price').should('exist')
    cy.findAllByText('Reopen poll').last().click()
    cy.findByText('Yes, continue').click()
    cy.findByText('Page 1').should('exist')
    cy.findByTestId('voter-icon').should('not.exist')
  })

  afterEach(() => {
    cy.findByText('QA').click()
    cy.findByText('Sign out').click()
    cy.url().should('include', '/')
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
