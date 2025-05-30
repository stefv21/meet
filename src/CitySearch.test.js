import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitySearch from './components/CitySearch';
import App from './App';
import { extractLocations, getEvents } from './api';


describe('<CitySearch /> component', () => {


  let CitySearchDOM;
  let cityTextBox;
  beforeEach(() => {
      CitySearchDOM = render(<CitySearch 
      allLocations={[]} 
      setCurrentCity={() => {}} 
      setInfoAlert={() => {}}    
      />);
      cityTextBox = CitySearchDOM.queryByRole('textbox');
  });

  test("render text input", () => {
      expect(cityTextBox).toBeInTheDocument();
      expect(cityTextBox).toHaveClass('city');
  });

  test('suggestion list is hidden by default', () => {
      const suggestions = CitySearchDOM.queryByRole('list');
      expect(suggestions).not.toBeInTheDocument();
  });

  test("render list of suggestions when city textbox gains focus", async () => {
    const user = userEvent.setup();
    await user.click(cityTextBox);
    const suggestions = CitySearchDOM.queryByRole('list');
    expect(suggestions).toBeInTheDocument();
    expect(suggestions).toHaveClass('suggestions');
});

test('updates list of suggestions correctly when user types in city textbox', async () => {
    const user = userEvent.setup();
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
    CitySearchDOM.rerender(<CitySearch allLocations={allLocations} setCurrentCity={() => {}} setInfoAlert={() => {}} />);

    // user types "Berlin" in city textbox
    await user.type(cityTextBox, "Berlin");

    // filter allLocations to locations matching "Berlin"
    const suggestions = allLocations ? allLocations.filter((location) => {
        return location.toUpperCase().indexOf(cityTextBox.value.toUpperCase()) > -1;
    }) : [];

    // get all <li> elements inside the suggestion list
    const suggestionListItems = CitySearchDOM.queryAllByRole('listitem');
    expect(suggestionListItems).toHaveLength(suggestions.length + 1);
    for (let i = 0; i < suggestions.length; i += 1) {
        expect(suggestionListItems[i].textContent).toBe(suggestions[i]);
    }
});
test('renders the suggestion text in the textbox upon clicking on the suggestion', async () => {
    const user = userEvent.setup();
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
    CitySearchDOM.rerender(<CitySearch
      allLocations={allLocations}
      setCurrentCity={() => { }}
    />);
 
 
    const cityTextBox = CitySearchDOM.queryByRole('textbox');
    await user.type(cityTextBox, "Berlin");
 
 
    // the suggestion's textContent look like this: "Berlin, Germany"
    const BerlinGermanySuggestion = CitySearchDOM.queryAllByRole('listitem')[0];
 
 
    await user.click(BerlinGermanySuggestion);
 
 
    expect(cityTextBox).toHaveValue(BerlinGermanySuggestion.textContent);
  });

test('hides the suggestion list when a suggestion is clicked', async () => {
  const user = userEvent.setup();
  const allEvents = await getEvents();
  const allLocations = extractLocations(allEvents);
  CitySearchDOM.rerender(
      <CitySearch
          allLocations={allLocations}
          setCurrentCity={() => { }}
          setInfoAlert={() => {}}
      />);
      await user.type(cityTextBox, "Berlin");

        // the suggestion's textContent look like this: "Berlin, Germany"
        const BerlinGermanySuggestion = CitySearchDOM.queryAllByRole('listitem')[0];

        await user.click(BerlinGermanySuggestion);

        const suggestions = CitySearchDOM.queryByRole('list');
        expect(suggestions).not.toBeInTheDocument();
    });

    test('calls setCurrentCity with the correct argument when a suggestion is clicked', async () => {
        const user = userEvent.setup();
        const allEvents = await getEvents();
        const allLocations = extractLocations(allEvents);
        const setCurrentCity = jest.fn();
        CitySearchDOM.rerender(
            <CitySearch
                allLocations={allLocations}
                setCurrentCity={setCurrentCity}
                setInfoAlert={() => {}}
            />);

        await user.type(cityTextBox, "Berlin");

        // the suggestion's textContent look like this: "Berlin, Germany"
        const BerlinGermanySuggestion = CitySearchDOM.queryAllByRole('listitem')[0];

        await user.click(BerlinGermanySuggestion);

        expect(setCurrentCity).toHaveBeenCalledWith(BerlinGermanySuggestion.textContent);
    });

    test('renders "See all cities" suggestion when user types in city textbox', async () => {
      const user = userEvent.setup();
      const allEvents = await getEvents();
      const allLocations = extractLocations(allEvents);
      CitySearchDOM.rerender(<CitySearch allLocations={allLocations} setCurrentCity={() => {}} setInfoAlert={() => {}} />);

      // user types "Berlin" in city textbox
      await user.type(cityTextBox, "Berlin");

      // get the "See all cities" suggestion
      const seeAllCitiesSuggestion = CitySearchDOM.queryByText(/See all cities/i);
      expect(seeAllCitiesSuggestion).toBeInTheDocument();
  });

  test('calls setCurrentCity with "See all cities" when the "See all cities" suggestion is clicked', async () => {
      const user = userEvent.setup();
      const allEvents = await getEvents();
      const allLocations = extractLocations(allEvents);
      const setCurrentCity = jest.fn();
      CitySearchDOM.rerender(
          <CitySearch
              allLocations={allLocations}
              setCurrentCity={setCurrentCity}
              setInfoAlert={() => {}}
          />);

      await user.type(cityTextBox, "Berlin");

      // the "See all cities" suggestion
      const seeAllCitiesSuggestion = CitySearchDOM.queryByText(/See all cities/i);

      await user.click(seeAllCitiesSuggestion);
      expect(setCurrentCity).toHaveBeenCalledWith("See all cities");
    });

    test('handles case when allLocations is undefined', async () => {
        const user = userEvent.setup();
        CitySearchDOM.rerender(<CitySearch allLocations={undefined} setCurrentCity={() => {}} setInfoAlert={() => {}} />);

        // user types "Berlin" in city textbox
        await user.type(cityTextBox, "Berlin");

        // get all <li> elements inside the suggestion list
        const suggestionListItems = CitySearchDOM.queryAllByRole('listitem');
        expect(suggestionListItems).toHaveLength(1); // Only "See all cities" should be present
    });
});

describe('<CitySearch /> integration', () => {
    test('renders suggestions list when the app is rendered.', async () => {
        const user = userEvent.setup();
        const AppComponent = render(<App />);
        const AppDOM = AppComponent.container.firstChild;

        const CitySearchDOM = AppDOM.querySelector('#city-search');
        const cityTextBox = within(CitySearchDOM).getByRole('textbox');
        await user.click(cityTextBox);

        const allEvents = await getEvents();
        const allLocations = extractLocations(allEvents);

        const suggestionListItems = within(CitySearchDOM).getAllByRole('listitem');
        expect(suggestionListItems.length).toBe(allLocations.length + 1);
    });
  });