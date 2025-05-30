Feature: Specify number of events
  As a user of the Meet app
  I want to be able to control how many events are displayed
  So that I can see exactly the number of events I’m interested in

  Background:
    Given the app is loaded

  Scenario: Default number of events is 32
    Given the user has not specified a number of events
    When I view the list of events
    Then I should see 32 events displayed

  Scenario: User can change the number of events
    Given the app is loaded
    When the user sets the number of events to 5
    Then I should see only 5 events displayed

  Scenario: User enters invalid number of events
    Given the app is loaded
    When the user sets the number of events to 0
    Then I should see a validation error or fallback to a minimum of 1
