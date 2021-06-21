---
description: Next.js поддерживает добавление CSS файлов как глобального CSS или как CSS-модулей, используя `styled-jsx` для CSS-in-JS, или любого другого решения в контексте CSS-in-JS! Узнайте больше здесь.
---

# Встроенная поддержка CSS

<details open>
  <summary><b>Примеры</b></summary>
  <ul>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/basic-css">Базовые примеры</a></li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss">С использованием Tailwind CSS</a></li>
  </ul>
</details>

Next.js позволяет импортировать CSS-файлы из JavaScript.
Это возможно потому, что Next.js расширяет концепцию [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import), имеющуюся в Javascript.

## Добавление глобальной таблицы стилей

Чтобы добавить глобальную таблицу стилей в приложение, импортируйте CSS-файл внутри `pages/_app.js`.

Например, рассмотрим следующую таблицу стилей в файле с названием `styles.css`:

```css
body {
	font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", "Helvetica",
		"Arial", sans-serif;
	padding: 20px 20px 60px;
	max-width: 680px;
	margin: 0 auto;
}
```

Создайте [`pages/_app.js` file](/docs/advanced-features/custom-app.md) если его еще нет.
Далее, [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) в него файл `styles.css`.

```jsx
import "../styles.css";

// Здесь default export необходим для текущего файла `pages/_app.js`.
export default function MyApp({ Component, pageProps }) {
	return <Component {...pageProps} />;
}
```

Эти стили (`styles.css`) ко всем страницам и компонентам вашего приложения.

Ввиду глобального характера применимости таблиц стилей, а также для того, чтобы избежат конфликтов, вы можете импортировать их **только внутри [`pages/_app.js`](/docs/advanced-features/custom-app.md)**

Такая имплементация таблиц стилей позволяет в процессе разработки совершать перезагрузку стилей "нагорячую", без перезагрузки всего состояния вашего приложения.

Для продакшна все CSS-файлы будут автоматически собраны в один минифицированный `.css` файл.

### Импортирование стилей из директории `node_modules`

Начина с Next.js **9.5.4**, импортирование CSS-файлов из директории `node_modules` разрешено в любом месте приложения.

Для глобальных таблиц стилей вроде `bootstrap` или `nprogress`, следует добавлять импорт внутрь файла `pages/_app.js`.
For example:

```jsx
// pages/_app.js
import "bootstrap/dist/css/bootstrap.css";

export default function MyApp({ Component, pageProps }) {
	return <Component {...pageProps} />;
}
```

Для импортирования CSS, который необходим в конкретном компоненте, можно сделать это непосредственно в самом компоненте, например:

```tsx
// components/ExampleDialog.js
import { useState } from "react";
import { Dialog } from "@reach/dialog";
import VisuallyHidden from "@reach/visually-hidden";
import "@reach/dialog/styles.css";

function ExampleDialog(props) {
	const [showDialog, setShowDialog] = useState(false);
	const open = () => setShowDialog(true);
	const close = () => setShowDialog(false);

	return (
		<div>
			<button onClick={open}>Открыть диалог</button>
			<Dialog isOpen={showDialog} onDismiss={close}>
				<button className="close-button" onClick={close}>
					<VisuallyHidden>Закрыть</VisuallyHidden>
					<span aria-hidden>×</span>
				</button>
				<p>Привет! Я - диалог</p>
			</Dialog>
		</div>
	);
}
```

## Добавление CSS-стилей уровня компонента

Next.js поддерживает [CSS Modules](https://github.com/css-modules/css-modules), для этого следует именовать файлы стилей так - `[name].module.css`, где `[name]` - это имя компонента.

CSS-модули образуют локальную область видимости благодаря созданию уникального имени класса.

Это позволяет вам использовать одинаковые имена CSS-классов в разных файлах без опасений того, что из-за этого возникнут коллизии.

Это механизм делает CSS-модули идеальным способом работы с CSS на уровне компонентов.
Файлы CSS-модулей **могут быть импортированы в любом месте вашего приложения**.

В качестве примера рассмотрим переиспользуемый компонент `Button`, расположенный в директории `components/`:

Сначала создадим `components/Button.module.css` со следующим кодом:

```css
/*
Вам не нужно беспокоиться о классе .error {}, который может совпасть с любым таким же из файлов `.css` или 
`.module.css`!
*/
.error {
	color: white;
	background-color: red;
}
```

Теперь создадим сам компонент `components/Button.js`, и импортируем в него написанный выше CSS-модуль:

```jsx
import styles from "./Button.module.css";

export function Button() {
	return (
		<button
			type="button"
			// помните, что CSS-класс "error" доступен как свойство импортированного CSS-модуля,
			// внутри объекта `styles`.
			className={styles.error}
		>
			Уничтожить
		</button>
	);
}
```

Использование CSS-модулей _необязательно_ и они включаются **только для файлов с расширением `.module.css`**
Обычные таблицы стилей, подключаемые с помощью тега `<link>` и глоабльные CSS-файлы по-прежнему поддерживаются.

В режиме продакшна все CSS-модули будут автоматически объединены в **множество минифицированных и автоматически разделенных** `.css` файлов.
Эти `.css` файлы будут загружаться "нагорячую" по мере необходимости,обеспечивая тем самым загрузку минимального количества CSS, который необходим вашему приложению.

## Поддержка Sass

Next.js позволяет импортировать Sass, используя оба его расширения - `.scss` и `.sass`.
Вы можете писать Sass-код, следуя компонентному подходу, именуя файлы с использованием расширений `.module.scss` или `.module.sass`.

Пеед тем как пользоваться встроенной в Next.js поддержкой Sass, убедитесь что установили [`sass`](https://github.com/sass/sass):

```bash
npm install sass
```

Поддержка Sass имеет те же преимущества и ограничения, как и встроенная поддержка CSS, описанная выше.

> **Помните**: Sass поддерживает [два разных синтаксиса](https://sass-lang.com/documentation/syntax), каждый из которых имеет собственное расширение.
> Расширение `.scss` требует использования [SCSS синтаксиса](https://sass-lang.com/documentation/syntax#scss),
> в то время как расширение `.sass` требует использования [SASS синтаксиса на основе отступов](https://sass-lang.com/documentation/syntax#the-indented-syntax).
>
> Если вы не уверены в том, что подходит для вашего проекта больше, просто начните с использования расширения `.scss`, которое по своей сути
> является "расширенной версией синтаксиса CSS", в отличии от синтаксиса SASS, построенного на основе отступов.

### Настройка параметров Sass

Если вы хотите настроить компилятор Sass, это можно сделать в свойстве `sassOptions`, внутри `next.config.js`.
Например, добавить `includePaths`:

```js
const path = require("path");

module.exports = {
	sassOptions: {
		includePaths: [path.join(__dirname, "styles")],
	},
};
```

## CSS-in-JS

<details>
  <summary><b>Примеры</b></summary>
  <ul>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-styled-jsx">Стилизованный JSX</a></li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-styled-components">Стилизованные Компоненты</a></li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-emotion">Emotion</a></li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-linaria">Linaria</a></li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss-emotion">Tailwind CSS + Emotion</a></li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-styletron">Styletron</a></li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-glamor">Glamor</a></li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-cxs">Cxs</a></li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-aphrodite">Aphrodite</a></li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/with-fela">Fela</a></li>
  </ul>
</details>

Можно использовать любое существующее решение CSS-in-JS.
Одно из самых простых - это инлайн-стили:

```jsx
function HiThere() {
	return <p style={{ color: "red" }}>Привет!</p>;
}

export default HiThere;
```

Мы встроили [styled-jsx](https://github.com/vercel/styled-jsx) для того, чтобы осуществить поддержку CSS с изолированной областью видимости.
Цель заключалась в реализации поддержки "shadow CSS" аналогичному Веб-компонентам, которые, к сожалению, [не поддерживают серверный рендеринг и существуют только в контексте JS](https://github.com/w3c/webcomponents/issues/71).

Посмотрите на приведенные выше примеры для других популярных решений CSS-in-JS (таких как Styled Components)

Компонент, использующий `styled-jsx` выглядит так:

```jsx
function HelloWorld() {
	return (
		<div>
			Привет Мир
			<p>изолированная область видимости!</p>
			<style jsx>{`
				p {
					color: blue;
				}
				div {
					background: red;
				}
				@media (max-width: 600px) {
					div {
						background: blue;
					}
				}
			`}</style>
			<style global jsx>{`
				body {
					background: black;
				}
			`}</style>
		</div>
	);
}

export default HelloWorld;
```

Чтобы увидеть больше примеров, пожалуйста, ознакомьтесь с [документацией по styled-jsx](https://github.com/vercel/styled-jsx).

## Часто задаваемые вопросы

### Будет ли это работать с отключенным JavaScript?

Да, если вы отключите JavaScript, CSS будет все равно загружен в продакшн-билде (`next start`). В процессе разработки нам необходим JavaScript для того, чтобы можно было комфортно пользоваться [Fast Refresh](https://nextjs.org/blog/next-9-4#fast-refresh).

## Связанные темы

Для большего понимания того что делать дальше, мы рекомендуем ознакомиться со следующими разделами:

<div class="card">
  <a href="/docs/advanced-features/customizing-postcss-config.md">
    <b>Настройка конфига PostCSS:</b>
    <small>Расширьте конфиг PostCSS и плагинов Next.js своими собственными настройками.</small>
  </a>
</div>
