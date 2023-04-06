import express from "express";
import bodyParser from "body-parser";
import puppeteer from "puppeteer";

interface Home {
	price?: string;
	stats?: string[];
	address?: string;
}

interface Data {
	pageTitle: string;
	homes: Home[];
}

(async () => {
	const app = express();

	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(express.json());

	app.get("/", (req, res) => {
		res.send({ message: "Ola!" });
	});

	app.post("/scrape-redfin", async (req, res) => {
		const { place } = req.body;

		try {
			if (!place)
				return res
					.status(400)
					.send({ message: "payload `place` is missing" });

			const browser = await puppeteer.launch();
			const page = await browser.newPage();

			await page.goto("https://www.redfin.com/");

			// Type into search box
			await page.type(".search-input-box", place);

			// Wait and click on first result
			const searchResultSelector = ".SearchButton";
			await page.waitForSelector(searchResultSelector);
			await page.click(searchResultSelector);

			// Locate the full title with a unique string
			const textSelector = await page.waitForSelector(
				".collapsedListView"
			);
			const pageTitle =
				(await textSelector?.evaluate((el) => el.textContent)) || "";

			const Homes = await page.$$(".bottomV2");

			const data: Data = {
				pageTitle: pageTitle,
				homes: [],
			};

			for (const home of Homes) {
				let homeData: Home = {
					stats: [],
				};

				const stats = await home.$$(".stats");

				for (const stat of stats) {
					const statData =
						(await stat?.evaluate((node) => node.textContent)) ||
						"";
					homeData.stats?.push(statData);
				}

				const address = await home.$(".collapsedAddress");

				if (address) {
					const addressData =
						(await address.evaluate((node) => node.textContent)) ||
						"";

					homeData.address = addressData;
				}

				const price = await home.$(".homecardV2Price");

				if (price) {
					const priceData =
						(await price.evaluate((node) => node.textContent)) ||
						"";

					homeData.price = priceData;
				}

				data.homes.push(homeData);
			}

			res.status(200).send(data);
		} catch (error) {
			res.send(500).send(error);
		}
	});

	const PORT = process.env.PORT || 8080;

	const server = app.listen(PORT, () => {
		console.log(`Server started at ${PORT}`);
	});
})();
