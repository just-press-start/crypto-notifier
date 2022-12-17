const { launch } = require("puppeteer");
const fs = require('fs')
const telegramAPI = require("./telegram");
const { tsv2json, json2tsv } = require('tsv-json');
var decoder = new TextDecoder('utf-8')

//const executablePath =  "/usr/bin/chromium-browser"
const url = 'https://coinmarketcap.com/'
const coinTableRow = ".cmc-table tbody tr"
const coinColumnIndexName = 2
const coinColumnIndex7d = 6

const runDataCrawler = async () => {
    const page = await openUrlPage(url);
    await autoScroll(page);

    const names = await extractDataFromPage(page);
    //console.log(names);
    const stringified = JSON.stringify(names);
    fs.writeFile('./outputs/outputt.json', stringified, (err) => {
        if (err) throw err;
    })
    await page.close();
    const utf8 = unescape(encodeURIComponent(jsonToFlatString(names)));
    const response = await telegramAPI.sendMessage(stringified);
    console.log(response);
}

const extractDataFromPage = async (page) => {
    return await page.evaluate((coinTableRow, coinColumnIndexName, coinColumnIndex7d) => {
        console.log("sfghfdgfsdfsa") // why this is not displayed?
        return Array.from(document.querySelectorAll(coinTableRow)).map(i => {
            return [i.childNodes[coinColumnIndexName].textContent, i.childNodes[coinColumnIndex7d].textContent]
        });
    }, coinTableRow, coinColumnIndexName, coinColumnIndex7d).catch((error) => {
        console.error(error);
    });
}

const jsonToFlatString = (json) => {
    var string = ""
    for (const row of json) {
        string += row.join(" - ")
        string += "\n"
    }
    return string;
}

const openUrlPage = async () => {
    const browser = await launch({
    });
    const page = await browser.newPage();
    await page.goto(url);
    return page;
}



function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}


runDataCrawler();