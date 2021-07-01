---
description: Next.js предоставляет встроенную поддержку ESLint по умолчанию. Эти правила соответствия позволят вам пользоваться Next.js в оптимальном ключе.
---

# ESLint

Начиная с версии **11.0.0**, Next.js предоставляет встроенный механизм [ESLint](https://eslint.org/) из коробки. Добавьте `next lint` в список `scripts` вашего `package.json`:

```json
"scripts": {
  "lint": "next lint"
}
```

Далее, вызовите команду `npm run lint` или `yarn lint`:

```bash
yarn lint
```

Если в вашем приложении еще не сконфигурирован ESLint, перед вами возникнет диалог установки необходимых для его использования пакетов.

```bash
yarn lint

# You'll see instructions like these:
#
# Please install eslint and eslint-config-next by running:
#
#         yarn add --dev eslint eslint-config-next
#
# ...
```

Если в проекте не существует конфигурации ESLint, Next.js создаст файл `.eslintrc` в корне вашего проект и автоматически инициализирует его следующей базовой конфигурацией:

```js
{
  "extends": "next"
}
```

Теперь вы можете выполнять команду `next lint` каждый раз, когда необходимо с помощью обнаружить ошибки с помощью ESLint.

> Конфигурация по умолчанию (`"extends": "next"`) может быть обновлена в любой момент. Конфигурация по умолчанию будет использоваться только при условии, что до нее не существовало никакой другой конфигурации.

Мы рекомендуем использовать соответсвующую [интеграцию](https://eslint.org/docs/user-guide/integrations#editors) с вашим редактором кода для наилучшего отображения ошибок в процессе написания кода.

## Поиск ошибок во время сборки проекта

С тех пор как ESLint был настроен для проекта, он будет автоматически запускаться во время каждой сборки (`next build`). Ошибки, обнаруженные при этом, будут приводить к сбою сборки, в то время как предупреждения - нет.

Если вы не хотите, чтобы ESLint запускался на определенном этапе сборки проекта, обратитесь к документации по [Игнорированию ESLint](/docs/api-reference/next.config.js/ignoring-eslint.md):

## Поиск ошибок в других каталогах

По умолчанию Next.js будет запускать ESLint для всех файлов в директориях `pages/`, `components/` и `lib/`.
Тем не менее, вы можете указать какие директории отслеживать для сборки проекта с помощью свойства `dirs` для `eslint` внутри `next.config.js`:

```js
module.exports = {
	eslint: {
		dirs: ["pages", "utils"], // Запускать ESLint только для директорий 'pages' и 'utils' во время сборки проекта (next build)
	},
};
```

Аналогично, флаг `--dir` может быть использован при вызове `next lint`:

```bash
yarn lint --dir pages --dir utils
```

## ESLint плагин

Next.js предостовляет плагин для ESLint, [`eslint-plugin-next`](https://www.npmjs.com/package/@next/eslint-plugin-next), который позволяет легче отлавливать основные нюансы и проблемы в приложении на Next.js. Полный набор правил выглядит следующим образом:

|     | Правило                                                                                        | Описание                                                                                    |
| :-: | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| ✔️  | [next/google-font-display](https://nextjs.org/docs/messages/google-font-display)               | Использование значений optional or swap для параметра font-display в контексте Google Fonts |
| ✔️  | [next/google-font-preconnect](https://nextjs.org/docs/messages/google-font-preconnect)         | Принудительное использование preconnect для сервиса Google Fonts                            |
| ✔️  | [next/link-passhref](https://nextjs.org/docs/messages/link-passhref)                           | Принудительное использование пропса passHref вместе с настраиваемым компонентом Link        |
| ✔️  | [next/no-css-tags](https://nextjs.org/docs/messages/no-css-tags)                               | Запрещает "ручные" теги таблиц стилей                                                       |
| ✔️  | [next/no-document-import-in-page](https://nextjs.org/docs/messages/no-document-import-in-page) | Запрещает импортирование next/document вне pages/document.js                                |
| ✔️  | [next/no-head-import-in-document](https://nextjs.org/docs/messages/no-head-import-in-document) | Запрещает импортирование next/head для pages/document.js                                    |
| ✔️  | [next/no-html-link-for-pages](https://nextjs.org/docs/messages/no-html-link-for-pages)         | Запрещает якорные ссылки на страницы без компонента Link                                    |
| ✔️  | [next/no-img-element](https://nextjs.org/docs/messages/no-img-element)                         | Запрещает использование HTML-тега &lt;img&gt;                                               |
| ✔️  | [next/no-page-custom-font](https://nextjs.org/docs/messages/no-page-custom-font)               | Запрещает шрифты, используемые тольно на одной странице                                     |
| ✔️  | [next/no-sync-scripts](https://nextjs.org/docs/messages/no-sync-scripts)                       | Запрещает синхронные скрипты                                                                |
| ✔️  | [next/no-title-in-document-head](https://nextjs.org/docs/messages/no-title-in-document-head)   | Запрещает использование &lt;title&gt; вместе с Head из next/document                        |
| ✔️  | [next/no-unwanted-polyfillio](https://nextjs.org/docs/messages/no-unwanted-polyfillio)         | Предотвращает дублирование полифиллов с Polyfill.io                                         |

- ✔: Включен в рекомендованной конфигурации

## Базовая конфигурация

Базовая конфигурация ESLint для Next.js автоматически генерируется, когда команда `next lint` запускается в первый раз:

```js
{
  "extends": "next"
}
```

Данная конфигурация расширяет рекомендованный набор правил из различных ESLint плагинов:

- [`eslint-plugin-react`](https://www.npmjs.com/package/eslint-plugin-react)
- [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [`eslint-plugin-next`](https://www.npmjs.com/package/@next/eslint-plugin-next)

Вы можете ознакомиться с полной информацией совместно используемой конфигурации в пакете [`eslint-config-next`](https://www.npmjs.com/package/eslint-config-next).

## Отключение правил

Если вы хотите изменить или отключить какие-либо правила, которые были представлены плагинами (`react`, `react-hooks`, `next`), вы можете напрямую изменить их в свойстве `rules`, в вашем `.eslintrc`:

```js
{
  "extends": "next",
  "rules": {
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off",
  }
}
```

> **Помните**: Если вам необходимо добавить отдельную, отличную конфигурацию, крайне рекомендуется, чтобы `eslint-config-next` был последним в списке других используемых конфигураций Например:
>
> ```
> {
>   "extends": ["eslint:recommended", "next"]
> }
> ```

> Конфигурация `next` уже по умолчанию обрабатывает значения для свойств `parser`, `plugins` и `settings`.
> Нет необходимости переопределять вручную какие-либо из этих свойтсв до тех пор, пока вам не понадобится конфигурация, которая отличается от той, что определена по умолчанию.
> Если вы подключаете какую-либо другую конфигурацию, вам следует убедиться, что ее свойства не переписываются или не модифицируются.

### Core Web Vitals

Более строгий набор правил `next/core-web-vitals` может быть также добавлен в `.eslintrc`:

```
{
  "extends": ["next", "next/core-web-vitals"]
}
```

`next/core-web-vitals` обновляет `eslint-plugin-next` для того, чтобы определить предупреждения как ошибки, если они затрагивают
[Core Web Vitals](https://web.dev/vitals/).

> Большинство точек входа `next` и `next/core-web-vitals` автоматически включены в новые приложения, если они созданы с помощью [Create Next App](/docs/api-reference/create-next-app.md).

## Миграция имеющегося конфига

Если у вас уже имеется конфиг ESLint для вашего приложения, мы рекомендуем расширять конфигурацию относительно плагина ESLint от Next.js, вместо того, чтобы использовать переносимую конфигурацию (shareable configuration).

```js
module.exports = {
	extends: [
		//...
		"plugin:@next/next/recommended",
	],
};
```

Это устраняет любой риск конфликтов, которые могут возникнуть при импорте того же плагина или парсера в нескольких конфигурациях.

/// https://github.com/vercel/next.js/commit/ef97d9b73eccbebfa956e003fb27a09336835010
