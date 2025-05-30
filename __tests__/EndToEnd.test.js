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
      headless: true,     // CI-friendly, no UI
      slowMo: 100,        // optional: slow things down so you can watch locally
      args: ['--no-sandbox','--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
    await page.goto('http://localhost:5173/');
    await page.waitForSelector('.event');
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
    // clicking the same button again should hide it
    await page.click('.event .details-btn');
    // short pause to let the collapse animation finish
    await page.waitForTimeout(200);
    const eventDetails = await page.$('.event .details');
    expect(eventDetails).toBeNull();
  });
});
