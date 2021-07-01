import puppeteer from "puppeteer";
import prompts from "prompts";

async function run() {
	try {
		const path = await prompts({
			type: "text",
			name: "url",
			message:
				"set relative path to file you check (without .md extension), like `docs/basic-features/built-in-css-support` ",
			validate: (url) => (url.length < 10 ? `too short url` : true),
		});

		const urlTemplateRu = (path) => `${path}`;
		const urlTemplateEng = (path) =>
			`https://github.com/vercel/next.js/blob/canary/${path}.md`;

		const mappingObject = { eng, ru };

		Object.values(mappingObject).map((v) => {
			parseHeaders(v.url);
		});
	} catch (e) {
		console.log(e);
		process.exit(1);
	}
}

async function parseHeaders(url) {
	const args = [];
	const browser = await puppeteer.launch({ headless: true, args });
	const page = await browser.newPage();
	await page.goto(url);

	const val = await page.evaluate(getHeadersObj);

	await page.close();
	await browser.close();

	console.log(val);
}

function getHeadersObj() {
	return [1, 2, 3, 4, 5, 6].reduce((acc, rec) => {
		let headersCollection = document.querySelectorAll(`#readme h${rec}`);

		headersCollection = Array.from(headersCollection).map((i) => {
			const href = decodeURI(new URL(i.querySelector("a").href).hash);
			return {
				text: i.textContent,
				href,
			};
		});
		if (headersCollection.length)
			return { ...acc, [`h${rec}`]: Array.from(headersCollection) };
		return acc;
	}, {});
}

run();
