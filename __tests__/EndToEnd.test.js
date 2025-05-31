/**
 * @jest-environment node
 */
import puppeteer from 'puppeteer';

jest.setTimeout(60000);  


describe('show/hide event details', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      slowMo: 100,
      args: ['--no-sandbox','--disable-setuid-sandbox'],
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:5173/');
    await page.waitForSelector('.event');
  });

  afterEach(async () => {
    await page.close();
  });


  afterAll(async () => {
    await browser.close();
  });

  test('An event element is collapsed by default', async () => {
    // We're reusing the `page` from beforeAll
    const eventDetails = await page.$('.event .details');
    expect(eventDetails).toBeNull();
  });

  test('User can expand an event to see its details', async () => {
    await page.click('.event .details-btn');
    await page.waitForSelector('.event .details');
    const eventDetails = await page.$('.event .details');
    expect(eventDetails).not.toBeNull();
  });

  test('User can collapse an event to hide details', async () => {
    // First expand so .details appears:
    await page.click('.event .details-btn');
    await page.waitForSelector('.event .details');

    // Then collapse:
    await page.click('.event .details-btn');

    // ← Wait until the .details element is removed/hidden
    await page.waitForSelector('.event .details', { hidden: true });

    const eventDetails = await page.$('.event .details');
    expect(eventDetails).toBeNull();
  });
});
