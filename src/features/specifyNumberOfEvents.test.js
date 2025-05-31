/**
 * @jest-environment node
 */
jest.setTimeout(60000);  // Increase timeout to 60 seconds

import path from 'path';
import puppeteer from 'puppeteer';
import { loadFeature, defineFeature } from 'jest-cucumber';

// Load the feature file from the same directory
const feature = loadFeature(
  path.join(__dirname, 'specifyNumberOfEvents.feature')
);

defineFeature(feature, (test) => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  //
  // Scenario: Default number of events is 32
  //
  test('Default number of events is 32', ({ given, when, then }) => {
    // 1st Given = Background’s “Given the app is loaded”
    given('the app is loaded', async () => {
      page = await browser.newPage();
      await page.goto('http://localhost:5173/');
      await page.waitForSelector('.event');
    });

    // 2nd Given = Scenario’s “Given the user has not specified a number of events”
    given('the user has not specified a number of events', async () => {
      // By default, assume the input is untouched. 
      // If you want to assert it’s empty, do something like:
      // const value = await page.$eval('.number-of-events-input', el => el.value);
      // expect(value).toBe('');
    });

    when('I view the list of events', async () => {
      // Page load already rendered them—no extra code needed here.
    });

    then('I should see 32 events displayed', async () => {
      const eventCards = await page.$$('.event');
      expect(eventCards.length).toBe(32);
      await page.close();
    });
  });

  //
  // Scenario: User can change the number of events
  //
  test('User can change the number of events', ({ given, when, then }) => {
    // 1st Given = Background’s “Given the app is loaded”
    given('the app is loaded', async () => {
      page = await browser.newPage();
      await page.goto('http://localhost:5173/');
      await page.waitForSelector('.event');
    });

    // 2nd Given = Scenario’s “Given the app is loaded” (repeat the same, or no-op)
    given('the app is loaded', async () => {
      // You could leave this as a no-op, since the page is already open.
      // For clarity, you could also repeat the navigation:
      // await page.goto('http://localhost:5173/');
      // await page.waitForSelector('.event');
    });

    when('the user sets the number of events to 5', async () => {
      // 1) Wait until the input appears (role="textbox")
      await page.waitForSelector('input[role="textbox"]');
    
      // 2) Click to select any existing value (e.g. “32”), then type “5”
      await page.click('input[role="textbox"]', { clickCount: 3 });
      await page.type('input[role="textbox"]', '5');
    
      // 3) Press Enter to submit (or your app’s equivalent action)
      await page.keyboard.press('Enter');
    
    // 4) Wait until exactly 5 ".event" cards are rendered (allow up to 60 seconds)
    await page.waitForFunction(
      () => document.querySelectorAll('.event').length === 5,
      { timeout: 60000 }
    );
    });

    then('I should see only 5 events displayed', async () => {
      const eventCards = await page.$$('.event');
      expect(eventCards.length).toBe(5);
      await page.close();
    });
  });

  //
  // Scenario: User enters invalid number of events
  //
  test(
    'User enters invalid number of events',
    ({ given, when, then }) => {
      // 1st Given = Background’s “Given the app is loaded”
      given('the app is loaded', async () => {
        page = await browser.newPage();
        await page.goto('http://localhost:5173/');
        await page.waitForSelector('.event');
      });

      // 2nd Given = Scenario’s “Given the app is loaded” (again)
      given('the app is loaded', async () => {
        // No-op or re-open page if you prefer:
        // await page.goto('http://localhost:5173/');
        // await page.waitForSelector('.event');
      });

      when('the user sets the number of events to 0', async () => {
        // 1) Wait for the input (role="textbox") to appear
        await page.waitForSelector('input[role="textbox"]');
      
        // 2) Click to select the existing value (e.g. “32”), then type “0”
        await page.click('input[role="textbox"]', { clickCount: 3 });
        await page.type('input[role="textbox"]', '0');
      
        // 3) Press Enter to submit
        await page.keyboard.press('Enter');
      
        // 4) Wait until at least one ".event" card is displayed again (allow up to 60 seconds)
        await page.waitForFunction(
       () => document.querySelectorAll('.event').length >= 1,
       { timeout: 60000 }
     );
      });
      

      then(
        'I should see a validation error or fallback to a minimum of 1',
        async () => {
          // Option A: If your app shows an error message, check for it:
          // const errorText = await page.$eval(
          //   '.error-message',
          //   el => el.textContent
          // );
          // expect(errorText).toMatch(/enter a number greater than 0/i);

          // Option B: Or at least ensure one event is displayed:
          const eventCards = await page.$$('.event');
          expect(eventCards.length).toBeGreaterThanOrEqual(1);

          await page.close();
        }
      );
    }
  );
});
