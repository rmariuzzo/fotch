[![Fotch – In browser fake REST API for creative development purposes!
](.github/assets/banner.svg)](#installation)

## Motivation

When I code for fun, I occasionally need a backend REST API to play with. Usually, I feel too lazy to create a dumb REST API. I have dream about a simple library that I could plug in the frontend with little effort and simulate and persist data somewhere. Then **`fotch`** was born.

## How it works?

**`fotch`** monkey patches the `window.fetch` API and intercept all calls. When a matching call looks like a REST operation then **`fotch`** responds as you would expect from a REST API. All data is stored in `window.localStorage`.

# Installation

```bash
npm i fotch
```

# Usage

```ts
import fotch from 'fotch'

fotch.start()
```

That's it! Seriously, just start using the `fetch` API as if there's a REST API. You can stop intercepting calls using `fotch.stop()`.

| **[▶︎ View demo on CodeSandbox](https://codesandbox.io/s/rwqo347pjo?autoresize=1&hidenavigation=1&view=preview)** |
| ----------------------------------------------------------------------------------------------------------------- |


## Examples

```js
// Get a list of apples.
fetch('/apples')

// Get an apple by id.
fetch('/apples/1')

// Create an apple.
fetch('/apples', { method: 'post', data: JSON.stringify({ color: 'red' }) })

// Update an apple.
fetch('/apples/1', { method: 'put', data: JSON.stringify({ color: 'green' }) })

// Remove an apple.
fetch('/apples/1', { method: 'delete' })
```

# Documentation

The first parameter can be a `string` or a [configuration object](#configuration-object).

When the first parameter is a string it will be interpreted as match pattern.

```js
fotch.start('/api/')
```

This will filter any `fetch` calls where the URL contains `/api/`.

## Configuration object

When the first parameter is a configuration object the following options can be used:

| Name                              | Type           | Description                                                                                                                   |
| --------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `match`                           | `string`       | The portion to match in a URL to filter `fetch` calls.                                                                        |
| `delay`                           | `number`       | Specify a delay to all calls in milliseconds .                                                                                |
| <!-- Intentionally left blank --> | `{ min, max }` | Specify a minimum and a maximum delay to all calls in milliseconds. **`fotch`** will return a random delay within that range. |

If you need more options then **[request it creating an issue](/issues/new)**.

# Development

1.  Clone this repository.
2.  Install dependencies: `npm i`.
3.  Make changes and create a PR.

## Tests

```sh
npm run test
```

## Releases

Releases are triggered by `npm version` and handled by [GitHub Actions](https://github.com/rmariuzzo/fotch/actions?query=workflow%3Apublish).

---

Made with ♥ by [@rmariuzzo](https://github.com/rmariuzzo) and [contributors](https://github.com/rmariuzzo/fotch/graphs/contributors).
