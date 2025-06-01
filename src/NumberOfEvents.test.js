import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberOfEvents from './components/NumberOfEvents';

describe('<NumberOfEvents /> component', () => {
  test('contains an element with the role "textbox"', () => {
    // Pass a no-op function for setCurrentNOE:
    const { getByRole } = render(<NumberOfEvents setCurrentNOE={() => {}} />);
    const textbox = getByRole('textbox');
    expect(textbox).toBeInTheDocument();
  });

  test('default value of the input field is 32', () => {
    const { getByRole } = render(<NumberOfEvents setCurrentNOE={() => {}} />);
    const textbox = getByRole('textbox');
    // Note: textbox.value is a string, so we compare with "32"
    expect(textbox.value).toBe("32");
  });

  test('updates value when a user types in the textbox', async () => {
    const { getByRole } = render(<NumberOfEvents setCurrentNOE={() => {}} />);
    const textbox = getByRole('textbox');
    const user = userEvent.setup();
    // Clear the textbox and type a new value:
    await user.clear(textbox);
    await user.type(textbox, '10');
    expect(textbox.value).toBe("10");
  });

  test('simulates backspace and then typing 10', async () => {
    const { getByRole } = render(<NumberOfEvents setCurrentNOE={() => {}} />);
    const textbox = getByRole('textbox');
    const user = userEvent.setup();
    // Simulate pressing backspace twice and then typing "10"
    // (assuming the initial value is "32")
    await user.type(textbox, '{backspace}{backspace}10');
    expect(textbox.value).toBe("10");
  });
});
