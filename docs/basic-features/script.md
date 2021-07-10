---
description: Next.js помогает оптимизировать загрузку сторонних скриптов с помощью встроенного компонента next/script.
---

# Компонент Script

<details>
  <summary><b>История версий</b></summary>

| Version   | Changes                                |
| --------- | -------------------------------------- |
| `v11.0.0` | Компонент`next/script` был представлен |

</details>

Имеющийся в Next.js компонент Script позволяет разработчикам настроить приоритеты загрузки для сторонних скриптов, это экономит время и позволяет улучшить проихводительность приложения.

Для Веб-сайтов нередко требуются сторонние решения для аналитики, рекламы, сервисов поддержки и согласия на обработку данных. Эти скрипты могут сильно влиять на производительность, тем самым негативно влияя на UX (пользовательский опыт). Для разработчиков нередко является камнем преткновения то, где в приложении следует подключать эти скрипты для их оптимальной загрузки.

Для `next/script` вы можете определить свойство `strategy`, руководствуясь которым Next.js будет оптимизировать загруждаемые скрипты:

- `beforeInteractive`: Для критически важных скриптов, которые необходимо получить **до** того, как страница станет интерактивной, например, скрипты обнаружения ботов или согласия на использование/обработку персональных данных. Эти скрипты вставляются в начальный HTML с сервера и запускаются до всего остального JavaScript, который делает страницу интерактивной.

- `afterInteractive` (**используется по умолчанию**): Для скриптов, которые могут быть получены и выполнены **после** того, как страница станет интерактивное, например, скриптов менеджмента тегов и аналитики. Эти скрипты вставляются на стороне клиента и должны быть запущено после гидрации.
- `lazyOnload`: Для скриптов, которые могут быть загружены во время простоя, например, для чата поддержки или виджетов социальных сетей.

> **Примечание:** Эти стратегии будут аналогично работать и для инлайновых скриптом, обернутых в `<Script>`. См. пример с инлайн-скриптами ниже.

## Использование

Ранее вам следовало определять теги `script` внутри компонента `Head` вашей страницы на Next.js.

```js
// Раньше

// pages/index.js
import Head from "next/head";

function Home() {
	return (
		<>
			<Head>
				<script async src="https://www.google-analytics.com/analytics.js" />
			</Head>
		</>
	);
}
```

Используя `next/script`, вам больше не нужно оборачивать скрипты в компонент `next/head`. Кроме того, `next/script` **не должен быть использован** в компоненте `pages/_document.js`, потому как `next/script` имеет функционал для клиентской стороны, который обеспечивает порядок загрузки скриптов. Например:

```js
// Теперь

// pages/index.js
import Script from "next/script";

function Home() {
	return (
		<>
			<Script src="https://www.google-analytics.com/analytics.js" />
		</>
	);
}
```

## Примеры

### Загрузка полифиллов

```js
import Script from "next/script";
<Script
	src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserverEntry%2CIntersectionObserver"
	strategy="beforeInteractive"
/>;
```

### Ленивая загрузка

```js
import Script from "next/script";
<Script
	src="https://connect.facebook.net/en_US/sdk.js"
	strategy="lazyOnload"
/>;
```

### Выполнение кода после загрузки (`onLoad`)

```js
import Script from "next/script";
<Script
	id="stripe-js"
	src="https://js.stripe.com/v3/"
	onLoad={() => {
		this.setState({ stripe: window.Stripe("pk_test_12345") });
	}}
/>;
```

### Инлайн-скрипты

```js
import Script from 'next/script'

<Script strategy="lazyOnload">
  {`document.getElementById('banner').removeClass('hidden')`}
</Script>

// или

<Script
  dangerouslySetInnerHTML={{
    __html: `document.getElementById('banner').removeClass('hidden')`
  }}
/>
```

### Установка атрибутов

```js
import Script from "next/script";
<Script
	src="https://www.google-analytics.com/analytics.js"
	id="analytics"
	nonce="XUENAJFW"
	data-test="analytics"
/>;
```
