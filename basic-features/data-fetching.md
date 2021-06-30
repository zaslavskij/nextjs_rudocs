---
description: "Next.js включает в себя 2 вида пре-рендеринга: Статическую Генерацию (Static Generation) и Серверный Рендеринг (Server-side rendering). Здесь вы узнаете как они работают."
---

<a name="data-fetching" href="#data-fetching"></a>

# Получение данных

> Эта часть документации Next.js относится к версиям 9.3 и новее. Если вы используете старшие версии Next.js, обратитесь к [предыдущей версии документации](https://nextjs.org/docs/tag/v9.2.2/basic-features/data-fetching).

<details open>
  <summary><b>Примеры</b></summary>
  <ul>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-wordpress">WordPress</a> (<a href="https://next-blog-wordpress.vercel.app">Demo</a>)</li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/blog-starter">Шаблон для блога с использованием файлов Markdown</a> (<a href="https://next-blog-starter.vercel.app/">Demo</a>)</li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-datocms">DatoCMS</a> (<a href="https://next-blog-datocms.vercel.app/">Demo</a>)</li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-takeshape">TakeShape</a> (<a href="https://next-blog-takeshape.vercel.app/">Demo</a>)</li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-sanity">Sanity</a> (<a href="https://next-blog-sanity.vercel.app/">Demo</a>)</li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-prismic">Prismic</a> (<a href="https://next-blog-prismic.vercel.app/">Demo</a>)</li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-contentful">Contentful</a> (<a href="https://next-blog-contentful.vercel.app/">Demo</a>)</li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-strapi">Strapi</a> (<a href="https://next-blog-strapi.vercel.app/">Demo</a>)</li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-prepr">Prepr</a> (<a href="https://next-blog-prepr.vercel.app/">Demo</a>)</li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-agilitycms">Agility CMS</a> (<a href="https://next-blog-agilitycms.vercel.app/">Demo</a>)</li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-cosmic">Cosmic</a> (<a href="https://next-blog-cosmic.vercel.app/">Demo</a>)</li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-buttercms">ButterCMS</a> (<a href="https://next-blog-buttercms.vercel.app/">Demo</a>)</li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-storyblok">Storyblok</a> (<a href="https://next-blog-storyblok.vercel.app/">Demo</a>)</li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-graphcms">GraphCMS</a> (<a href="https://next-blog-graphcms.vercel.app/">Demo</a>)</li>
    <li><a href="https://github.com/vercel/next.js/tree/canary/examples/cms-kontent">Kontent</a> (<a href="https://next-blog-kontent.vercel.app/">Demo</a>)</li>
    <li><a href="https://static-tweet.vercel.app/">Static Tweet Demo</a></li>
  </ul>
</details>

В документации для [страниц](/docs/basic-features/pages.md) мы рассказали, что Next.js имеет два вида пре-рендеринга: **Статическую генерацию (Static Generation)** and **Серверный рендеринг (Server-side Rendering)**.
В этом же разделе мы более подробно поговрим о том, как модно получать данные в каждом из этих кейсов. Мы рекомендуем начать с чтения документации о [страницах](/docs/basic-features/pages.md), если вы еще этого не сделали.

Мы поговорим о трех функциях существующих в Next.js, которые позволяют получать данные для пре-рендеринга:

- [`getStaticProps`](#getstaticprops-static-generation) (Статическая генерация (Static Generation)): Получение данных во время **сборки проекта**.
- [`getStaticPaths`](#getstaticpaths-static-generation) (Статическая генерация (Static Generation)): Указание [динамических путей](/docs/routing/dynamic-routes.md) для пре-рендеринга страниц на основе данных.
- [`getServerSideProps`](#getserversideprops-server-side-rendering) (Серверный рендеринг (Server-side Rendering)): Получение данных **на каждый запрос**.

В дополнение мы кратко обсудим, как получать данные на стороне клиента.

## `getStaticProps` (Статическая генерация (Static Generation))

<details>
  <summary><b>История версий</b></summary>

| Version   | Changes                                                                                                           |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| `v10.0.0` | Дабавлены опции `locale`, `locales`, `defaultLocale`, и `notFound`.                                               |
| `v9.5.0`  | Stable [Incremental Static Regeneration](https://nextjs.org/blog/next-9-5#stable-incremental-static-regeneration) |
| `v9.3.0`  | `getStaticProps` introduced.                                                                                      |

</details>

Если вы экспортируете со страницы `асинхронную` функцию `getStaticProps`, Next.js будет пре-рендерить эту страницу во время сборки с пропсами, которые были возвращены из вызова функции `getStaticProps`.

```jsx
export async function getStaticProps(context) {
	return {
		props: {}, // Будет передано компоненту страницы как пропсы
	};
}
```

Параметр `context` - это объект, содаржащий следующие ключи:

- `params` содержит параметры роутов для страниц, использующих динамический роутинг. Например, если страница называется `[id].js` , то `params` будут выглядет так `{ id: ... }`. Чтобы узнать больше об этом, обратитесь к [документации по динамическому роутингу](/docs/routing/dynamic-routes.md). Вам следует использовать это вместе с `getStaticPaths`, о котором мы поговорим далее.
- `preview` установлено в значении `true` если страница в режиме превью и `undefined` в противном случае. См. [документацию по режиму превью](/docs/advanced-features/preview-mode.md).
- `previewData` содержит данные превью, установленные в `setPreviewData`. См. [документацию по режиму превью](/docs/advanced-features/preview-mode.md).
- `locale` содержит активнуб локаль (если включено).
- `locales` содержит все поддерживаемые локали (если включено).
- `defaultLocale` содержит значение локали по умолчанию (если включено).

`getStaticProps` должен вернуть объект с:

- `props` - **Опциональный** объект с пропсами для компонента страницы. Он должен быть [сериализуемым объектом](https://en.wikipedia.org/wiki/Serialization)
- `revalidate` - **Опциональный** интервал в секундах может повториться перегенерация страницы (по умолчанию установлено как `false`). Больше об [инкрементальном статическом регенерация](#incremental-static-regeneration)
- `notFound` - **Опциональное** значение булевого типа чтобы позволить странице вернуть статус 404 и страницу. Ниже приведен пример того, как это работает:

  ```js
  export async function getStaticProps(context) {
  	const res = await fetch(`https://.../data`);
  	const data = await res.json();

  	if (!data) {
  		return {
  			notFound: true,
  		};
  	}

  	return {
  		props: { data }, // Будет передано компоненту страницы как пропсы
  	};
  }
  ```

  > **Примечание**: `notFound` не нуждается в [`fallback: false`](#fallback-false) так как только пути, возвращенные из `getStaticPaths` будут пре-рендериться.

  > **Примечание**: Страница с параметром `notFound: true` вернет статус 404 даже если она была успешно перегенерирована. Это реализовано для тех случаев, когда пользовательский контент удаляется его автором..

- `redirect` - **Опциональное** значение редиректа, чтобы разрешить перенаправление на внешние и внутренние ресурсы. Оно должно соответствовать виду `{ destination: string, permanent: boolean }`. В некоторых случаях для корректного перенаправления старых HTTP-клиентов, вам следует статус-код самолстоятельно. Для этого вы можете использовать свойство `statusCode` вместо `permanent`, но не оба свойства одновременно. Ниже приведен пример того, как это работает:

  ```js
  export async function getStaticProps(context) {
  	const res = await fetch(`https://...`);
  	const data = await res.json();

  	if (!data) {
  		return {
  			redirect: {
  				destination: "/",
  				permanent: false,
  			},
  		};
  	}

  	return {
  		props: { data }, // Будет передано компоненту страницы как пропсы
  	};
  }
  ```

  > **Примечание**: Редиректы в процессе сборки не разрешены и если в подобной ситуации редиректы нужны, их нужно указать в [`next.config.js`](/docs/api-reference/next.config.js/redirects.md).

> **Примечание**: ВЫ можете импортировать модули на верхний уровень для использования в `getStaticProps`.
> Импорты, использованные в `getStaticProps` [не будут включены в клиентскую часть](#write-server-side-code-directly).
> Это означает, что вы можете писать **серверный код прямо в `getStaticProps`**.
> Сюда относятся как операции чтения из файловой системы, так и работы с базой данных.

> **Примечание**: Вы не должны использовать [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) для
> обращения к API-роутам в `getStaticProps`.
> Вместо этого разместите код, который используется внутри вашего API-роута.
> Возможно, вам понадобится легкий рефакторинг для реализации этого подхода.
>
> Получение данных из внешнего API - это легко и просто!

### Простой пример

Ниже пример, в котором используется функция `getStaticProps` для получения списка записей блога из CMS (системы управление контентом). Этот пример так же имеется в [документации по страницам](/docs/basic-features/pages.md).

```jsx
// записи блога будут поступать сюда во время сборки из `getStaticProps()`
function Blog({ posts }) {
	return (
		<ul>
			{posts.map((post) => (
				<li>{post.title}</li>
			))}
		</ul>
	);
}

// Эта функция вызывается во время сборки на стороне сервера.
// Она не будет вызываться на клиентской стороне, поэтому вы можете
// отправлять из нее запросы прямиком в базу данных. Обратитесь к секции "Технические детали".
export async function getStaticProps() {
	// Запрос к внешним API для получения записей блога.
	// Вы можете использовать любую библиотеку для получения данных
	const res = await fetch("https://.../posts");
	const posts = await res.json();

	// С возвращением объекта { props: { posts } }, компонент Blog
	// получит `posts` из `props` в момент сборки
	return {
		props: {
			posts,
		},
	};
}

export default Blog;
```

### Когда я должен использовать `getStaticProps`?

Вы должны использовать `getStaticProps` если:

- Данные, необходимые для рендеринга страницы доступны в момент сборки и без запроса пользователя.
- Данные получаются из CMS (системы управления контентом) без пользовательского интерфейса.
- Данные могут быть кешированы публично (вне зависимости от пользователя).
- Страница должны быть отрендерена заранее (для поисковой оптимизации) и работать очень быстро — `getStaticProps` генерирует HTML и JSON файлы, которые можно кешировать с помощью CDN для увеличения производительности.

### TypeScript: использование `GetStaticProps`

Для TypeScript, вы можете использовать тип `GetStaticProps` уже имеющийся в `next`:

```ts
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async (context) => {
	// ...
};
```

Если вы хотите установить предполагаемые типы для ваших пропсов, можете использовать `InferGetStaticPropsType<typeof getStaticProps>`:

```tsx
import { InferGetStaticPropsType } from "next";

type Post = {
	author: string;
	content: string;
};

export const getStaticProps = async () => {
	const res = await fetch("https://.../posts");
	const posts: Post[] = await res.json();

	return {
		props: {
			posts,
		},
	};
};

function Blog({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
	// получит сообщения, соответсвующию типу Posts[]
}

export default Blog;
```

### Инкрементальная статическая регенерация (ISR)

<details open>
  <summary><b>Примеры</b></summary>
  <ul>
    <li><a href="https://nextjs.org/commerce">Next.js Commerce</a></li>
    <li><a href="https://reactions-demo.vercel.app/">GitHub Reactions Demo</a></li>
    <li><a href="https://static-tweet.vercel.app/">Static Tweet Demo</a></li>
  </ul>
</details>

<details>
  <summary><b>История версий</b></summary>

| Версия   | Изменения              |
| -------- | ---------------------- |
| `v9.5.0` | Базовый путь добавлен. |

</details>

Next.js позволяет вам создавать или обновлять статические страницы _после того_ как вы собрали ваш сайт. Инкрементальная статическая регенерация (ISR - Incremental Static Regeneration) позволяет использовать статическую генерацию для каждой страницы, **без необходимости пересборки всего сайта**. С помощью ISR вы можете сохранять преимущества статической генерации с масштабированием до миллионов страниц.

Рассмотрим наш предыдущий пример с [`getStaticProps`](#simple-example), но с использованием включенного ISR через свойство `revalidate`:

```jsx
function Blog({ posts }) {
	return (
		<ul>
			{posts.map((post) => (
				<li>{post.title}</li>
			))}
		</ul>
	);
}

// Эта функция вызывается на стороне сервера, во время сборки.
// Она может быть вызвана снова, как serverless (бессерверная) функция,
// если включена повторная валидация на поступающие запросы

export async function getStaticProps() {
	const res = await fetch("https://.../posts");
	const posts = await res.json();

	return {
		props: {
			posts,
		},
		// Next.js попрбует перегнерерировать страницу есть:
		// - Пришел запрос
		// - Не чаще 1 раза в 10 секунд
		revalidate: 10, // В секундах
	};
}

// Эта функция вызывается на стороне сервера, во время сборки.
// Она может быть вызвана снова, как serverless (бессерверная) функция,
// если путь не был создан
export async function getStaticPaths() {
	const res = await fetch("https://.../posts");
	const posts = await res.json();

	// Получаем пути для рендеринга страниц, относящихся к записям в блоге
	const paths = posts.map((post) => ({
		params: { id: post.id },
	}));

	// Мы сделаем пререндер только для этих путей
	// { fallback: blocking } будет рендерить страницы на сервере
	// по запросу, если запрашиваемый путь не будет найден.
	return { paths, fallback: "blocking" };
}

export default Blog;
```

Кто был сделан запрос к странице, для которой был пре-рендер в момент сборки, первоначально отобразится кешированная страница.

- Любые запросы к странице после первого и до 10 секунд также мгновенно кешируются.
- После 10-секундного промежутка, следующий запрос будет по-прежнему показывать кешированную (устаревшую) страницу.
- Next.js запускает перерендер страницы в фоновом режиме.
- С того момента, как страница была успешно сгенерирована, Next.js инвалидирует кеш и отобразит новую страницу. В случае сбоя старая страница останется неизменной.

Если запрос сделан по пути, который не был создан, Next.js по первому запросу отрендерит страницу на стороне сервера. На последующие запросфы будет отправляться статичная страница из кеша.

Для того, чтобы понять, как хранить кеш глобально и обрабатывать откаты (rollbacks), изучите больше информации об [Инкрементальной статической регенерации (ISR)](https://vercel.com/docs/next.js/incremental-static-regeneration).

### Чтение фалов: использование `process.cwd()`

Файлы могут быть прочитаны напрямую из файловой системы, в функции `getStaticProps`.

Для того, чтобы это сделать, вам необходим полный путь до файла.

С тех пор как Next.js комплириует ваш код в отдельную директорию, вы не можете использовать `__dirname` в качестве составной части пути, он вернет значение, отличное от той директории, где находятся страницы.

Вместо этого вы можете использовать `process.cwd()`, что дает вам доступ к той директории, в которой Next.js будет выполняться.

```jsx
import { promises as fs } from "fs";
import path from "path";

// posts will be populated at build time by getStaticProps()
function Blog({ posts }) {
	return (
		<ul>
			{posts.map((post) => (
				<li>
					<h3>{post.filename}</h3>
					<p>{post.content}</p>
				</li>
			))}
		</ul>
	);
}

// Эта функция вызывается во время сборки на стороне сервера.
// Она не будет вызываться на клиентской стороне, поэтому вы можете
// отправлять из нее запросы прямиком в базу данных. Обратитесь к секции "Технические детали".
export async function getStaticProps() {
	const postsDirectory = path.join(process.cwd(), "posts");
	const filenames = await fs.readdir(postsDirectory);

	const posts = filenames.map(async (filename) => {
		const filePath = path.join(postsDirectory, filename);
		const fileContents = await fs.readFile(filePath, "utf8");

		// Как правило, вы трансформируете/преобразовываете содержимое
		// Например, преобразуете markdown в html

		return {
			filename,
			content: fileContents,
		};
	});
	// С возвращением объекта { props: { posts } }, компонент Blog
	// получит `posts` из `props` в момент сборки
	return {
		props: {
			posts: await Promise.all(posts),
		},
	};
}

export default Blog;
```

### Технические детали

#### Запуск только в момент сборки

Т.к. `getStaticProps` запускается во время сборки, у нее **нет доступа к данным, получаемым в момент пользовательского запроса**, таких как параметры запроса или HTTP-заголовки, потому как она генерирует статичный HTML.

#### Пишите серверный код напрямую

Помните, что `getStaticProps` запускается только на стороне сервера и никогда не вызовется наклиентской части. Она никогда не будет попадет в сборку скриптов, которые будут переданы браузеру. Это значит, что вы можете использовать в коде такие вещи, как прямые запросы к базам данных без доступа к ним со стороны браузера. Вы не должны отправлять запросы на **API** с помощью `getStaticProps` - напротив, вы можете писать серверный код прямо внутри функции `getStaticProps`.

Вы можете использовать [этот инструмент](https://next-code-elimination.vercel.app/) для того, чтобы убедиться, что Next.js исключает из клиенсткого пакета.

#### Статическая генерация как HTML, так и JSON

Когда страница пре-рендерится с помощью `getStaticProps`, в дополнение к HTML-файлу Next.js генерирует JSON-файл, содержащий результат выполнения функции `getStaticProps`.

Этот JSON-файл будет использован на клиентской стороне для маршрутизации с помощью `next/link` ([документация](/docs/api-reference/next/link.md)) или `next/router` ([документация](/docs/api-reference/next/router.md)). Когда вы переходите на страницу которая была предварительно отрендерена с помощью функции `getStaticProps`, Next.js запрашивает этот JSON-файл (так же созданный в момент сборки) и использует его данные как пропсы для компонента страницы. Это означает, что переходы на клиентской стороне **не вызовут** `getStaticProps` потому как для них используется уже экспортированный JSON.

При использовании Инкрементальной статической генерации (ISG), `getStaticProps` будет выполняться будет выполняться контекста генерации JSON для навигации на стороне клиента. Вы можете заметить это в виде нескольких запросов для одной и той же страницы, но это не скажется на производительности для конечного пользователя.

#### Можно выполнять только на странице

Функция `getStaticProps` может быть экспортирована только со **страницы**. Вы не можете экспортировать ее с не-страничных компонентов.

Одна из причин этого ограничения заключается в том, что React рендеринга страницы необходимы все данные, связанные с ней.

Так же вы должны совершать экспорт так: `export async function getStaticProps() {}`. Функция не будет работать если вы будете экспортировать `getStaticProps` как свойство компонента страницы.

#### В режиме разработки запускается на каждый запрос

Функция `getStaticProps` в режиме разработки (`next dev`) будет вызываться на каждый запрос.

#### Режим предпросмотра (превью)

В некоторых случаях вам может понадобиться отрендерить страницу **во время запроса**, обойдя при этом Статическую генерацию. Например, вы используете CMS без визуального интерфейса и хотите посмотреть черновики до публикации записей.

В Next.js реализована такая возможность с помощью **Превью режима**. Узнайте больше в [документации по режиму превью](/docs/advanced-features/preview-mode.md).

## `getStaticPaths` (Статическая генерация)

<details>
  <summary><b>История версий</b></summary>

| версия   | Изменения                                                                                                                     |
| -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `v9.5.0` | Стабильная [Инкрементальная статическая регенерация](https://nextjs.org/blog/next-9-5#stable-incremental-static-regeneration) |
| `v9.3.0` | Представлена функция`getStaticPaths`.                                                                                         |

</details>

Если у страницы есть динамическая маршрутизация ([документация](/docs/routing/dynamic-routes.md)) и она использует `getStaticProps`, необходимо определить список маршрутов, которые будут необходимы.

Если вы экспортировали асинхронную (`async`) функцию `getStaticPaths` со страницы, которая использует динамическую маршрутизацию, Next.js статически отрендерит все пути, которые указаны в функции `getStaticPaths`.

```jsx
export async function getStaticPaths() {
  return {
    paths: [
      { params: { ... } } // См. секцию "path" ниже
    ],
    fallback: true or false // См. секцию "fallback" ниже
  };
}
```

#### Ключ `paths` (обязательный)

Ключ `paths` определяет какие маршруты необходимо пре-рендерить. Например, у вас есть страница, которая использует динамический маршрут и называется `pages/posts/[id].js`. Вы экспортируете `getStaticPaths` с этой страницы и функция возвращает следующий объект `paths`:

```js
return {
  paths: [
    { params: { id: '1' } },
    { params: { id: '2' } }
  ],
  fallback: ...
}
```

В таком случае Node.js будет статически генерировать `posts/1` и `posts/2` во время сборки, используя компонент страницы `pages/posts/[id].js`.

Помните, что значение каждого свойства `params` должно совпадать с параметрами, используемыми страницей:

- Если страница находится по маршруту `pages/posts/[postId]/[commentId]`, то свойства `params` должно содержать `postId` и `commentId`.
- Если страница использует "жадную маршрутизацию", например `pages/[...slug]`, тогда свойство `params` должно содержать в себе `slug`, который в свою очередь представлен массивом. Предположим, что у нас есть следующий массив `['foo', 'bar']`. Исходя из этого Next.js генерирует для страницы статический маршрут `/foo/bar`.
- Если на страница использует корневой маршрут, укажите `null`, `[]`, `undefined` или `false` для рендеринга корневого маршрута. Например, если вы укажите `slug: false` для `pages/[[...slug]]`, Next.js автоматически сгенерирует страницу `/`.

#### Ключ `fallback` (обязательный)

Объект, возвращаемый функцией `getStaticPaths` должен содержать ключ `fallback`, по которому хранится булевое значение.

#### `fallback: false`

Когда `fallback` имеет значение `false`, то любые маршруты, которые не возвращались из функции `getStaticPaths` вернут **404 страницу**. Вы можете так делать в случае, если у вас небольшое количество маршрутов для пререндеринга - так они будут генерироваться во время сборки. Это также удобно, когда страницы не добавляются часто. Если вы добавляете новые данные и вам необходимо отрендерить новые страницы, то понадобится запустить сборку заново.

Вот пример пререндеринга одностраничной записи блога, которая находится по маршруту `pages/posts/[id].js`. Список записей блога получается из CMS и возвращается результатом вызова функции `getStaticPaths`. Далее, для каждой страницы данные из CMS с помощью `getStaticProps`. Этот пример также представлен в [документации страниц](/docs/basic-features/pages.md).

```jsx
// pages/posts/[id].js

function Post({ post }) {
	// Рендеринг записи...
}

// Эта функция вызывается во время сборки
export async function getStaticPaths() {
	// Вызов внешнего API для получения записей
	const res = await fetch("https://.../posts");
	const posts = await res.json();

	// Получение маршрутов, которые мы хотим пре-рендерить, основываясь на имеющихся записях
	const paths = posts.map((post) => ({
		params: { id: post.id },
	}));

	// Нам необходимо пре-рендерить только эти маршруты во время сборки.
	// { fallback: false } все другие пути будут отдавать 404.
	return { paths, fallback: false };
}

// Эта функция тоже вызывается во время сборки
export async function getStaticProps({ params }) {
	// Параметры содержат `id` поста.
	// Если маршрут - /posts/1, следовательно, params.id равен 1
	const res = await fetch(`https://.../posts/${params.id}`);
	const post = await res.json();

	// Передаем данные записи (поста) компоненту страницы через пропсы
	return { props: { post } };
}

export default Post;
```

#### `fallback: true`

<details>
  <summary><b>Примеры</b></summary>
  <ul>
    <li><a href="https://static-tweet.vercel.app">Статическая генерация большого количества страниц</a></li>
  </ul>
</details>

Если `fallback` установлен в значение `true`, то поведение функции `getStaticProps` изменяется:

- Маршруты, возвращаемые из `getStaticPaths` будут переданы в HTML во время сборки с помощью функции `getStaticProps`.
- Маршруты, которые не были созданы во время сборки **не будут** возвращать 404 страницу. Вместо этого, Next.js будет возвращать "резервную" ("fallback") версию страницы, при первом запросе по этому адресу (обратитесь к документации по [“ререзвным ("fallback") страницам”](#fallback-pages) для больших сведений).
- В фоновом режиме Next.js будет генерировать статику в HTML и JSON для указанных маршрутов. Это включает запуск `getStaticProps`.
- Когда эта задача выполнена, браузер получает JSON для указанного маршрута. Он будет автоматически использоваться для рендера страницы с необходимыми пропсами. Если смотреть на это со стороны пользователя, то для него "резервная" ("fallback") версия страницы будет заменена на полную.
- Вместе с этим Next.js добавляет этот маршрут в список маршрутов для пре-рендеринга. Последующие запросы по этому же пути будут возвращать такую же отрендеренную страницу, как и другие отрендеренные в момент сборки страницы.

> `fallback: true` не поддерживается при использовании [`next export`](/docs/advanced-features/static-html-export.md).

#### "Резервные" ("fallback") страницы

В “резервной” версии страницы:

- Пропсы страницы должны быть пустыми.
- С помощью [router](/docs/api-reference/next/router.md) вы можете определить, была ли отрендерена "резервная" страница, в этом случае `router.isFallback` должен быть установлен в значении `true`.

Далее, обратимся к примеру, в котором используется `isFallback`:

```jsx
// pages/posts/[id].js
import { useRouter } from "next/router";

function Post({ post }) {
	const router = useRouter();

	// Если страница еще не была отрендерена, это будет отображаться
	// до тех пор, пока функция `getStaticProps()` не закончит свое выполнение
	if (router.isFallback) {
		return <div>Loading...</div>;
	}

	// Рендериг записи блога...
}

// Эта функция вызывается во время сборки
export async function getStaticPaths() {
	return {
		// Только страницы по маршрутам `/posts/1` и `/posts/2` будут генерированы в момент сборки
		paths: [{ params: { id: "1" } }, { params: { id: "2" } }],

		// Включение генерациим дополнительных страниц,
		// например: `/posts/3`
		fallback: true,
	};
}

// Эта функция также вызывается в момент сборки
export async function getStaticProps({ params }) {
	// параметры содержат идентификатор записи - `id`.
	// Маршруту `/posts/1`, сооветствует params.id со значением 1
	const res = await fetch(`https://.../posts/${params.id}`);
	const post = await res.json();

	// Передача записи компоненту страницы с помощью пропсов
	return {
		props: { post },

		// Повторно генерировать запись на чаще 1 раза в секунду,
		// если происходит запрос
		revalidate: 1,
	};
}

export default Post;
```

#### Когда удобно использовать `fallback: true`?

Использовать `fallback: true` удобно если в вашем приложении большое количество статических страниц, которые зависят от данных (например, большой e-commerce сайт). Вы хотели бы пререндерить все страницы с продуктами, но тогда рендер займет целую вечность.

Вместо этого, вы можете статически сгенерировать небольшую выборку страниц и использовать `fallback: true` для всех остальных. Когда пользователь запросит страницу, которая ранее не была сгенерирована, пользователь увидит страницу с индикатором загрузки. Вскоре, после того как функция `getStaticProps` будет выполнена, страница будет отрендерина с релевантными пользовательскому запросу данными. С этого момента все, кто запросит эту же страницу, получат уже статически отрендеренную страницу со всеми нужными данными.

Такой подход гарантирует, что клиентская часть будет производительной, сохраняя возможность быстрых сборок и преимущества статической генерации.

`fallback: true` _не обновляет_ сгенерированные страницы, для этого следует обратиться к [инкрементальной статической генерации (Incremental Static Regeneration - ISR)](#incremental-static-regeneration).

#### `fallback: 'blocking'`

Если `fallback` установлен в значении `'blocking'`, то новые пути, которые не были возвращены из вызова `getStaticPaths` будут ожидать генерации HTML (именно поэтому и `'blocking'`), аналогично SSR (Server-Side Rendering - рендеринг на стороне сервера), а затем будут кешированы для будущих запросов. Поэтому "блокировка" совершится только на первый запрос по новому пути.

Функция `getStaticProps` будет работать следующим образом:

- Маршруты, вернувшиеся из вызова функции `getStaticPaths` будут отрендерены в HTML в момент сборки, с вызовом функции `getStaticProps`.
- Пути, которые не вернулись из вызова функции `getStaticPaths` **не будут перенапревлены** на 404 страницу. Next.js запустит процесс SSR на первый же запрос по этому маршруту и вернет сгенерированный страницу.
- Когда рендеринг будет выполнен, браузер получит HTML для запрашиваемого маршрута. На стороне пользователя визуально это будет выглядет как обычная загрузка страницы, когда браузер запрашивает мстраницу и затем ее отображает. Не будет никакого перехода между с оборажением "резервной" страницы и требуемой.
- Вместе с этим, Next.js добавляет этот маршрут в список страниц для пре-рендеринга. Последующие запросы по этому же маршруту будут отдавать такую же готовую страницу, как и другие пре-рендеренные.

`fallback: 'blocking'` по умолчанию _не обновляет_ сгенерированные страницы. Для обновления таких страниц используйте [Инкрементальную Статическую Генерацию - ISR](#incremental-static-regeneration) в связке с `fallback: 'blocking'`.

> `fallback: 'blocking'` не поддерживается при использовании [`next export`](/docs/advanced-features/static-html-export.md).

### Когда я должен использовать `getStaticPaths`?

Вы должны использовать функцию `getStaticPaths`, если страницы, которые вы пре-рендерите, используют динамические роуты.

### TypeScript: использование `GetStaticPaths`

Для TypeScript вы можете использовать тип `GetStaticPaths`, имеющийся в `next`:

---

```ts
import { GetStaticPaths } from "next";

export const getStaticPaths: GetStaticPaths = async () => {
	// ...
};
```

### Технические подробности

#### Использование совместно с `getStaticProps`

Когда вы используете `getStaticProps` на странице, которая предполагает маршрутизацию с динамическими параметрами, вы должны использовать `getStaticPaths`.

Вы не можете использовать функцию `getStaticPaths` совместно с `getServerSideProps`.

#### Работает только во время сборки на стороне сервера

Функция `getStaticPaths` вызывается только во время сборки на стороне сервера.

#### Разрешено только на уровне страницы

Функция `getStaticPaths` модет быть экспортирована только из компонента **страницы**. Вы не можете экспортировать из других компонентов.

Также вы должны использовать `export async function getStaticPaths() {}`. Функция **не будет работать**, если вы экспортируете ее как свойство компонента страницы.

#### Запускается на каждый запрос в режиме разработки

В режиме разработки (`next dev`), функция `getStaticPaths` будет вызываться на каждый запрос.

## `getServerSideProps` (Рендеринг на стороне сервера - Server-side Rendering, SSR)

<details>
  <summary><b>История версий</b></summary>

| Версия    | Изменения                                                                   |
| --------- | --------------------------------------------------------------------------- |
| `v10.0.0` | Были добавлены свойства `locale`, `locales`, `defaultLocale`, и `notFound`. |
| `v9.3.0`  | Была представлена функция `getServerSideProps`.                             |

</details>

Если вы экспортируете со страницы асинхронную (`async`) функцию `getServerSideProps`, Next.js будет пре-рендерить эту страницу на каждый запрос, с данными, которые возвращает функция `getServerSideProps`.

```js
export async function getServerSideProps(context) {
	return {
		props: {}, // Будут переданы компоненту страницы как пропсы
	};
}
```

Параметр `context` - это объект, который содержит следующие ключи:

- `params`: Если страница использует динамическую маршрутизацию, то `params` содержит параметры маршрутизации. Если страница называется, например, `[id].js`, то `params` будет выглядеть так `{ id: ... }`. Чтобы узнать больше о динамической маршрутизации, обратитесь к соответсвующиему [разделу документации](/docs/routing/dynamic-routes.md).
- `req`: [Объект HTTP-запроса (The HTTP IncomingMessage object)](https://nodejs.org/api/http.html#http_class_http_incomingmessage).
- `res`: [Объект HTTP-ответа (The HTTP response object)](https://nodejs.org/api/http.html#http_class_http_serverresponse).
- `query`: Объект, представленный строкой запроса.
- `preview`: `preview` установлен в значении `true`, если страница в режиме "предпросмотра" ("preview") и установлен как `false` в обратном случае. См. документацию по [Режиму предпросмотра](/docs/advanced-features/preview-mode.md).
- `previewData`: Данные для предпросмотра устанавливаются с помощью функции `setPreviewData`. См. документацию по [Режиму предпросмотра](/docs/advanced-features/preview-mode.md).
- `resolvedUrl`: Нормализованная версия URL-запроса, которая убирает префикс `_next/data` для переходов на клиенте и включает исходные значения запросов.
- `locale` содержит активную локаль (если включено).
- `locales` содержит все поддерживаемые локали (если включено).
- `defaultLocale` содержит выбранную по умолчанию локаль (если включено).

Функция `getServerSideProps` должна вернуть объект с:

- `props` - **Опциональный** объект с пропсами, которые будут получены компонентом страницы. Это должен быть [сериализуемый объект](https://en.wikipedia.org/wiki/Serialization)
- `notFound` - **Опциональное** значение булевого типа, разрешающее возврат статуса 404 и страницы. Ниже пример того, как это работает:

  ```js
  export async function getServerSideProps(context) {
  	const res = await fetch(`https://...`);
  	const data = await res.json();

  	if (!data) {
  		return {
  			notFound: true,
  		};
  	}

  	return {
  		props: {}, // Будут переданы компоненту страницы как пропсы
  	};
  }
  ```

- `redirect` - **Опциональное** значение, позволяющее делать перенаправление на внутренние и внешние ресурсы. Оно должно соответствовать виду: `{ destination: string, permanent: boolean }`. В некоторых редких случаях вам может понадобиться установить статус код самостоятельно, чтобы старые HTTP-клиенты смогли правильно выполнить редирект. В этих случаях вы можете использовать свойство `statusCode` вместо свойства `permanent`, но не оба свойства одновременно. Ниже приведен пример того, как это работает:

  ```js
  export async function getServerSideProps(context) {
  	const res = await fetch(`https://.../data`);
  	const data = await res.json();

  	if (!data) {
  		return {
  			redirect: {
  				destination: "/",
  				permanent: false,
  			},
  		};
  	}

  	return {
  		props: {}, // Будут переданы компоненту страницы как пропсы
  	};
  }
  ```

> **Примечание**: Вы можете импортировать модули внутри области видимости в функции `getServerSideProps`.
> Импорты, использованные в `getServerSideProps` не будут добавлены в бандл клиентской части.
>
> Это означает, что вы можете писать **серверный код прямо в функции `getServerSideProps`**.
> Такой подход включает чтение из базы данных или файловой системы.

> **Примечание**: Вы не должны использовать [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) для
> обращения к API-сервисам внутри функции `getServerSideProps`.
> Напротив, перенесите логику, которая используется в конкретном API-роуте прямиком в функцию.
> Вам может понадобиться немного отрефакторить код для такого подхода.
>
> Получение данных из внешнего API - это нормально!

### Простой пример

Ниже представлен простой пример использования функции `getServerSideProps` для получения данных и последующего пререндера. Этот пример также освящен в [документации по страницам](/docs/basic-features/pages.md).

```jsx
function Page({ data }) {
	// Рендеринг данных...
}

// Функция вызывается на каждый запрос
export async function getServerSideProps() {
	// Получение данных из внешнего API
	const res = await fetch(`https://.../data`);
	const data = await res.json();

	// Данные будут переданы компоненту страницы как пропсы
	return { props: { data } };
}

export default Page;
```

### Когда мы должны использовать `getServerSideProps`?

Вам следует использовать `getServerSideProps` только если необходимо сделать пре-рендер страницы с данными, которые получаются в момент запроса. Время до первого байта (Time to first byte - TTFB) будет больше, чем при использовании `getStaticProps`, потому как сервер будет вычислять результат для каждого запроса и результат не может быть кеширован с помощью CDN без дополнительных настроек.

Если вам не нужно пре-рендерить данные, тогда вам следует подумать о получении данных на стороне клиента. [Нажмите здесь, чтобы узнать больше](#fetching-data-on-the-client-side).

### TypeScript: Использование `GetServerSideProps`

В случае с TypeScript, вы можете использовать уже имеющийся в next тип `GetServerSideProps`:

```ts
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
	// ...
};
```

Если вы хотите получить выводимые типы для ваших пропсов, можете использовать `InferGetServerSidePropsType<typeof getServerSideProps>`, как это показано ниже:

```tsx
import { InferGetServerSidePropsType } from 'next'

type Data = { ... }

export const getServerSideProps = async () => {
  const res = await fetch('https://.../data')
  const data: Data = await res.json()

  return {
    props: {
      data,
    },
  }
}

function Page({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // Сделает резолв записей относительно типа Data
}

export default Page
```

### Технические детали

#### Вызывается только на сервере

Функция `getServerSideProps` вызывается только на сервере и никогда не в браузере. Если страница использует функцию `getServerSideProps`, то:

- Когда вы делаете запрос к данной странице, `getServerSideProps` вызывается в момент запроса и страница будет отрендерена с вернувшимися из вызова пропсами.
- Когда вы на клиенте обращаетесь к странице при переходе по ссылке через `next/link` ([документация](/docs/api-reference/next/link.md)) или or `next/router` ([документация](/docs/api-reference/next/router.md)), Next.js отправляет API-запрос на сервер, который вызывает `getServerSideProps`. Функция должна вернуть данные в формате JSON, которые будут использованы для рендеринга страницы. Все эти задачи внутри Next.js будут выполнены автоматически, вам не потребуется ничего сверх того, что вы используете на странице функцию `getServerSideProps`.

Вы можете воспользоваться [данным инструментом](https://next-code-elimination.vercel.app/), чтобы проверить что Next.js удаляет из клиентского пакета скриптов.

#### Разрешено к использованию только на странице

Функция `getServerSideProps` может быть экспортирована **только со страницы**. Вы не можете экспортировать из файлов, не представляющих из себя страницы.

Вы должны экспортировать функцию так - `export async function getServerSideProps() {}`. Функция не будет работать, если вы сделаете ее свойством компонента страницы.

## Получение данных на стороне клиента

Если ваша страница содержит часто обновляемые данные и у вас нет необходимости пре-рендерить данные, то вы можете получить их на стороне клиента. Примером таких данных могут послужить пользовательские данные. Вот как это работает:

- Сразу отображается страница без данных. Части страницы могут быть пре-рендеренными с использованием статической генерации (SSG). Для отсутствующих данных можно отображать состояние загрузки.
- Затем на стороне клиента запрашиваются данные и отображаются по мере их получения.

Например, этот подход хорош для личных кабинетов пользователей. Потому как личные кабинеты приватны и уникальны для каждого пользователя, то вопросы SEO-оптимизации для них не стоят и, как следствие, нет нужды в их пре-рендеринге. Данные часто обновляются, что требует получение данных в момент запроса.

### SWR

Команда Next.js создала хук для React, который позволяет получать данные. Он называется [**SWR**](https://swr.vercel.app/). Мы очень рекомендуем его, если вы получаете данные на стороне клиента. Она поддерживает кеширование, повторную валидацию, отслеживание фокуса, повторные запросы по интервалу и многое другое. Вы можете пользоваться хуком так:

```jsx
import useSWR from "swr";

function Profile() {
	const { data, error } = useSWR("/api/user", fetch);

	if (error) return <div>failed to load</div>;
	if (!data) return <div>loading...</div>;
	return <div>hello {data.name}!</div>;
}
```

[Обратитесь к документации по SWR чтобы узнать больше](https://swr.vercel.app/).

## Узнать больше

Дальше мы рекомендуем прочесть следующие разделы:

<div class="card">
  <a href="/docs/advanced-features/preview-mode.md">
    <b>Режим превью:</b>
    <small>Узнайте больше о режиме превью в Next.js.</small>
  </a>
</div>

<div class="card">
  <a href="/docs/routing/introduction.md">
    <b>Маршрутизация:</b>
    <small>Узнайте больше о маршрутизации в Next.js.</small>
  </a>
</div>

<div class="card">
  <a href="/docs/basic-features/typescript.md#pages">
    <b>TypeScript:</b>
    <small>Добавьте TypeScript к своим страницам.</small>
  </a>
</div>
