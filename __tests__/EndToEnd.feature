Feature: Show and hide event details
  As a user of the Meet app
  I want event details to be collapsed by default
  And I want to be able to toggle them open and closed
  So that I can see more information on demand

  Background:
    Given the application is loaded in the browser

  Scenario: An event element is collapsed by default
    When I view the list of events
    Then I should not see any event’s details

  Scenario: User can expand an event to see its details
    Given event details are hidden
    When I click the “Show Details” button on an event
    Then I should see that event’s details expand

  Scenario: User can collapse an expanded event
    Given an event’s details are visible
    When I click the “Hide Details” button on that event
    Then I should see its details collapse
