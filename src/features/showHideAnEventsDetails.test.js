/**
 * @jest-environment node
 */
import path from 'path';
import { loadFeature, defineFeature } from 'jest-cucumber';
import puppeteer from 'puppeteer';

// Notice we only join __dirname with the feature file name (no extra "src/features").
const feature = loadFeature(
  path.join(__dirname, 'showHideAnEventsDetails.feature')
);

defineFeature(feature, (test) => {
  let browser;
  let page;

  // Launch one browser instance for all scenarios
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  });

  // Close the browser when everything is done
  afterAll(async () => {
    await browser.close();
  });

  //
  // Scenario 1: An event element is collapsed by default
  //
  test(
    'An event element is collapsed by default',
    ({ given, when, then }) => {
      given('the application is loaded in the browser', async () => {
        page = await browser.newPage();
        await page.goto('http://localhost:5173/');
        // Wait until at least one ".event" card appears
        await page.waitForSelector('.event');
      });

      when('I view the list of events', async () => {
        // No extra clicks needed—just viewing the list
      });

      then('I should not see any event’s details', async () => {
        // If details are collapsed by default, there should be no ".event .details"
        const eventDetails = await page.$('.event .details');
        expect(eventDetails).toBeNull();
        await page.close();
      });
    }
  );

  //
  // Scenario 2: User can expand an event to see its details
  //
  test(
    'User can expand an event to see its details',
    ({ given, and, when, then }) => {
      given('the application is loaded in the browser', async () => {
        page = await browser.newPage();
        await page.goto('http://localhost:5173/');
        await page.waitForSelector('.event');
      });

      and('event details are hidden', async () => {
        // Immediately after load, ".event .details" should not exist
        const eventDetails = await page.$('.event .details');
        expect(eventDetails).toBeNull();
      });

      when('I click the “Show Details” button on an event', async () => {
        // Click the button to expand details
        await page.click('.event .details-btn');
      });

      then('I should see that event’s details expand', async () => {
        // Wait for the ".event .details" node to appear
        await page.waitForSelector('.event .details');
        const eventDetails = await page.$('.event .details');
        expect(eventDetails).not.toBeNull();
        await page.close();
      });
    }
  );

  //
  // Scenario 3: User can collapse an expanded event
  //
  test(
    'User can collapse an expanded event',
    ({ given, and, when, then }) => {
      given('the application is loaded in the browser', async () => {
        page = await browser.newPage();
        await page.goto('http://localhost:5173/');
        await page.waitForSelector('.event');
      });

      and('an event’s details are visible', async () => {
        // First, click “Show Details” so that details are visible
        await page.click('.event .details-btn');
        await page.waitForSelector('.event .details');
        // Confirm it’s actually there
        const eventDetails = await page.$('.event .details');
        expect(eventDetails).not.toBeNull();
      });

      when('I click the “Hide Details” button on that event', async () => {
        // Click the SAME button again to collapse
        await page.click('.event .details-btn');
      });

      then('I should see its details collapse', async () => {
        // Wait until the ".event .details" either disappears from the DOM or is hidden
        await page.waitForSelector('.event .details', { hidden: true });
        const eventDetails = await page.$('.event .details');
        expect(eventDetails).toBeNull();
        await page.close();
      });
    }
  );
});
