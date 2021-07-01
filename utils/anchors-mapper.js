import puppeteer from "puppeteer";
import prompts from "prompts";
import { mkdirSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

import config from "./config";

async function run() {
	try {
		let { eng, ru, path } = await initLangObjects();

		eng.data = await parseHeaders(eng.url);
		ru.data = await parseHeaders(ru.url);

		const mappedArray = createMappedArray(eng, ru);

		saveMappedJson(path, mappedArray);
	} catch (e) {
		console.log(e);
		process.exit(1);
	}
}

function saveMappedJson(p, data) {
	const path2File = `${resolve(__dirname, `../linking/${p}`)}.links.json`;
	const path2Check = path2File.slice(0, path2File.lastIndexOf("/"));

	if (!existsSync(path2Check)) {
		mkdirSync(path2Check, { recursive: true });
	}

	writeFileSync(path2File, JSON.stringify(data, 2, 2));
}

function createMappedArray(eng, ru) {
	return Object.keys(eng.data)
		.map((engHeader) => {
			const pre = eng.data[engHeader].map((engVal, index) => {
				return {
					engText: engVal.text,
					engHref: engVal.href,
					ruText: ru.data[engHeader][index].text,
					ruHref: ru.data[engHeader][index].href,
				};
			});
			return pre;
		})
		.flat();
}

async function initLangObjects() {
	const { path } = await prompts({
		type: "text",
		name: "path",
		message:
			"set relative path to file you check (without .md extension), like `basic-features/built-in-css-support` ",
		validate: (url) => (url.length < 10 ? `too short url` : true),
	});

	const urlTemplateRu = (path) => `${config.translations}/${path}.md`;
	const urlTemplateEng = (path) => `${config.source}/${path}.md`;

	return {
		eng: { url: urlTemplateRu(path) },
		ru: { url: urlTemplateEng(path) },
		path,
	};
}

async function parseHeaders(url) {
	const args = [];
	const browser = await puppeteer.launch({ headless: true, args });
	const page = await browser.newPage();
	await page.goto(url);

	const val = await page.evaluate(getHeadersObj);

	await page.close();
	await browser.close();

	return val;
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
