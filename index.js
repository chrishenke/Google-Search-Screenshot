const puppeteer = require("puppeteer");
const moment = require("moment");
const iPhone = puppeteer.devices["iPhone 6"];
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

async function getScreenshot(url, query, city, directory = "screenshots") {
	const date = new Date();
	const desktopFilename =
		directory +
		"/" +
		moment(date).format("YYYY-MM-DD") +
		"-" +
		query +
		"-" +
		city.city +
		"-desktop.png";
	const mobileFilename =
		directory +
		"/" +
		moment(date).format("YYYY-MM-DD") +
		"-" +
		query +
		"-" +
		city.city +
		"-mobile.png";
	const browser = await puppeteer.launch();

	// Grants permission for changing geolocation
	const context = browser.defaultBrowserContext();
	await context.overridePermissions("https://www.google.com", [
		"geolocation"
	]);

	const page = await context.newPage();

	await page.setGeolocation({ latitude: city.lat, longitude: city.long });
	await page.goto(url);

	await page.focus('input[name="q"]');
	await page.keyboard.type(query);
	await page.keyboard.press("Enter");
	await page.waitForSelector("#nav");

	await page.focus('input[name="q"]');
	await page.keyboard.press("Enter");
	await page.waitForSelector("#nav");

	await page.screenshot({
		path: desktopFilename.replace(" ", "-"),
		fullPage: true
	});

	await page.emulate(iPhone);
	await page.reload();

	await page.screenshot({
		path: mobileFilename.replace(" ", "-"),
		fullPage: true
	});

	await browser.close();
}

cities.forEach(
	async city => await getScreenshot("https://google.com", "pizza", city)
);
