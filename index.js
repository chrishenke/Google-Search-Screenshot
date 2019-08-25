const puppeteer = require("puppeteer");
const moment = require("moment");
const cities = [
    {
        city:"San Angelo",
        state:"TX",
        country:"USA",
        lat: 31.442778,
        long: -100.450279
    },
    {
        city:"Woodbridge",
        state:"NJ",
        country:"USA",
        lat: 40.560001,
        long:-74.290001
    },
    {
        city:"Clinton",
        state:"MI",
        country:"USA",
        lat: 42.586945,
        long:-82.919998
    }
]

async function getPic(url, query, city) {
    const date = new Date();
    const filepath = "screenshots/" + moment(date).format('YYYY-MM-DD') + '-' + query + "-" + city.city + ".png";
    const browser = await puppeteer.launch();

    const urlObj = new URL(url);

    // Grants permission for changing geolocation
    const context = browser.defaultBrowserContext();
    context.clearPermissionOverrides();
    await context.overridePermissions(urlObj.origin, ['geolocation']);
    
    const page = await context.newPage();
    await page.setGeolocation({ latitude: city.lat, longitude: city.long }); 
 	await page.goto(urlObj.href + "?q=" + query);
 	const granted = await page.evaluate(async () => {
        return (await navigator.permissions.query({name: 'geolocation'})).state;
      });
      console.log('Granted:', granted);
  	await page.screenshot({ path: filepath.replace(" ","-"), fullPage: true });
 	await browser.close();
}

//getPic('https://google.com​/search','pizza', );
cities.forEach(city => getPic("https://google.com/search","pizza",city));
