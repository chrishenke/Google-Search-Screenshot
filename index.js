const puppeteer = require("puppeteer");
const moment = require("moment");
const cities = [
	{
		city: "San Angelo",
		state: "TX",
		country: "USA",
		lat: 31.442778,
		long: -100.450279
	},
	{
		city: "Woodbridge",
		state: "NJ",
		country: "USA",
		lat: 40.560001,
		long: -74.290001
	},
	{
		city: "Clinton",
		state: "MI",
		country: "USA",
		lat: 42.586945,
		long: -82.919998
	},
	{
		city: "Fort Wayne",
		state: "IN",
		country: "USA",
		lat: 41.079273,
		long: -85.139351
	}
];

async function getScreenshot(url, query, city) {
	const date = new Date();
	const filepath =
		"screenshots/" +
		moment(date).format("YYYY-MM-DD") +
		"-" +
		query +
		"-" +
		city.city +
		".png";
	const browser = await puppeteer.launch({ headless: false, slowMo: 200 });

	// Grants permission for changing geolocation
	const context = browser.defaultBrowserContext();
	await context.overridePermissions("https://www.google.com", [
		"geolocation"
	]);

	const page = await context.newPage();

	await page.setGeolocation({ latitude: city.lat, longitude: city.long });
	await page.goto(url);

	await page.focus('input[name = "q"]');
	await page.keyboard.type(query);
	await page.keyboard.press("Enter");
	await page.waitForSelector("title");

	await page.focus('input[name = "q"]');
	await page.keyboard.press("Enter");
	await page.waitForSelector("title");

	await page.screenshot({ path: filepath.replace(" ", "-"), fullPage: true });
	await browser.close();
}

cities.forEach(
	async city => await getScreenshot("https://google.com", "pizza", city)
);
