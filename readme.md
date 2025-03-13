User Stories 


Filter Events by City: 
As an event attendee, 
I should be able to filter events by city 
So that I can easily find events in my preferred location. 

Show/Hide Event Detail: 
As an event attendee, 
I should be able to show or hide event details 
So that I can control how much information I see at a glance. 

Specify Number of Events: 
As a user, 
I should be able to specify the number of events displayed 
So that I can manage the amount of information based on my needs. 

Use the App When Offline: 
As a user, 
I should be able to use the app when offline 
So that I can still access event information even without an internet connection. 

Add an App Shortcut to the Home Screen: 
As a user, 
I should be able to add an app shortcut to my home screen 
So that I can quickly launch the app without navigating through a browser. 

Display Charts Visualizing Event Details: 
As an event attendee, 
I should be able to view charts visualizing event details 
So that I can quickly understand trends and insights about the events. 

 

Scenarios: 


Feature: Filter Events By City 


Scenario: Show upcoming events from all cities when no city is searched 

Given the user has not entered a city in the search field 

When the events are displayed 

Then the user should see upcoming events from all cities 

  

Scenario: Display city suggestions when searching for a city 

Given the user is entering text in the city search field 

When the user types a partial city name 

Then the user should see a list of city suggestions 

  

Scenario: Filter events by selecting a city from suggestions 

Given the user sees a list of city suggestions 

When the user selects a city from the list 

Then the events should be filtered to display only events from the selected city 

 

Feature: Show/Hide Event Details 

As an event attendee, I want to expand or collapse event details so that I can control the amount of information I see. 


Scenario: Event details are collapsed by default 

Given an event is displayed on the page 

When the page loads 

Then the event details should be hidden 

  

Scenario: Expand an event to view details 

Given an event is collapsed 

When the user clicks on the event 

Then the event details should be displayed 

  

Scenario: Collapse an event to hide details 

Given an event is expanded with visible details 

When the user clicks on the event again 

Then the event details should be hidden 


Feature: Specify Number of Events 
As a user, I want to specify the number of events to display so that I can manage how much information is shown. 


Scenario: Display 32 events by default when no number is specified 

Given the user has not specified the number of events to display 

When the events are rendered 

Then 32 events should be shown by default 

  

Scenario: Change the number of events displayed 

Given the user is on the events page 

When the user specifies a different number of events to display 

Then the events list should update to show the specified number of events 

 

Feature: Use the App When Offline 
As a user, I want to use the app when offline so that I can access previously loaded event information. 

Scenario: Display cached data when offline 

Given the user is offline 

When the user accesses the events page 

Then the app should display cached event data 

  

Scenario: Show error when changing search settings offline 

Given the user is offline 

When the user attempts to change search settings such as city or the number of events 

Then the app should display an error message indicating that this action is unavailable offline 

 

Feature: Add an App Shortcut to the Home Screen 
As a user, I want to install the app as a shortcut on my home screen so that I can quickly access it 

 
Scenario: Install the app shortcut on the home screen 

Given the user is using a compatible device 

When the user selects the option to add a shortcut to the home screen 

Then the app should be installed as a shortcut on the device's home screen 

 

Feature: Display Charts Visualizing Event Details 
As an event attendee, I want to view charts visualizing event details so that I can quickly understand trends and insights. 

 
Scenario: Display a chart with the number of upcoming events per city 

Given the user is on the dashboard 

When the chart is rendered 

Then the chart should display the number of upcoming events for each city 

 

 

 

 

  

 
