---
description: Next.js supports built-in web font optimization to inline font CSS. Learn more here.
---

# Оптимизация шрифтов

Начиная с версии **10.2**, Next.js имеет встроенную оптимизацию web-шрифтов. По умолчанию,
Next.js будет автоматически инлайнить font-declaration в CSS во время сборки,
что исключит дополнительные запросы для этого. Это положительно сказывается на
[первом существенном отображении - First Contentful Paint (FCP)](https://web.dev/fcp/) и
на времени [рендеринга самого большого элемента - Largest Contentful Paint (LCP)](https://vercel.com/blog/core-web-vitals#largest-contentful-paint).
Например:

```js
// Before
<link
  href="https://fonts.googleapis.com/css2?family=Inter"
  rel="stylesheet"
/>

// After
<style data-href="https://fonts.googleapis.com/css2?family=Inter">
  @font-face{font-family:'Inter';font-style:normal...
</style>
```

## Использование

Для добавления web-шрифта в ваше приложение на Next.js, переопределите секцию `next/head`.
Например, вы можете добавить шрифт для конкретной страницы:

```js
// pages/index.js

import Head from "next/head";

export default function IndexPage() {
	return (
		<div>
			<Head>
				<link
					href="https://fonts.googleapis.com/css2?family=Inter"
					rel="stylesheet"
				/>
			</Head>
			<p>Hello world!</p>
		</div>
	);
}
```

или для всего приложения, используя [модифицированный `Document`](/docs/advanced-features/custom-document.md).

```js
// pages/_document.js

import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head>
					<link
						href="https://fonts.googleapis.com/css2?family=Inter"
						rel="stylesheet"
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
```

Автоматическая оптимизация web-шрифтов сейчас поддерживает Google Fonts и Typekit, в дальнейшем появится поддержка других провайдеров шрифтов.
Мы также планируем добавить контроль для [стратегий загрузки](https://github.com/vercel/next.js/issues/21555) и значентий `font-display`.

## Отключение оптимизации

Если вам не нужна опцимизация шрифтов от Next.js, вы можете ее отключить.

```js
// next.config.js

module.exports = {
	optimizeFonts: false,
};
```

## Связанные темы

В контексте этой темы мы также рекомендуем ознакомиться с:

<div class="card">
  <a href="/docs/advanced-features/custom-document.md">
    <b>Модифицированный Document</b>
    <small>Узнайте, как расширить теги `body` и `html` для вашего приложения</small>
  </a>
</div>
