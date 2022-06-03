## Table of Contents

  - [About](#invoice-app)
  - [Feature list](#features)
  - [Tech-Stack](#tech-stack)
  - [Requirements](#requirements)
  - [Getting Started](#getting-started)
  - [Responsiveness](#responsiveness)
  - [Dependabot](#dependabot-integration)
  - [Postman](#postman)
  - [Git / Pre-Commit hook](#git)
  - [Continuous Integration](#ci)
  - [Usage Guide](#usage-guide)
  - [Screenshots](#screenshots)

# Invoice-App
This app allows you to create offers and invoices for your business. Its generates a pdf which can be send by mail or email. You can manage your clients which are split up in two types: private and company clients.
You get simple statistics monthly and yearly based on.

## Features
- Manage private and company clients
- Manage offers and invoices
- Send them by mail or email
- Convert offers to invoices
- Get statistics about your business
- Light and dark mode
- Currently supports german and english
- Dockerized for easy deployment

## Tech Stack
The frontend is based on nuxtjs 2. Backend is written with nestjs and postgres database.

## Requirements
The listed versions are not strictly needed, but tested with.

- `Node v16`
- `Yarn v1` or `Npm v8.5`
- `Python 3` is needed for the sqlite3 npm package, which is only used for unit-testing.
- `Docker v20`
- `Docker-Compose 2.6`

## Getting Started
If you are using `npm` just replace the `yarn` keyword with `npm run`

You can also run the project in a dockershell. If you want that just run the following two commands first:

- *Docker only*
  -  **`yarn shell:build`** or **`npm run shell:build`**
  - **`yarn shell`** or **`npm run shell`**

<br>

- **`yarn` or `npm i`** *to install the project dependencies*
- **`yarn prepare`** *to install husky*
- **`yarn ia`** *to install the frontend and backend depenencies*
- **`yarn dev`** *run the front and backend*
- Set the required Envs based on the `.env-example` inside the `/frontend` and `/backend` directory
- If you wanna create migrations with typeorm, you need to setup a `ormconfig.json` file, there is also a example for it `/backend/ormconfig-example.json`

*`Note to .env: If any env value contains a dollar sign ($) you have to encode that with a backslash (\$)`*

### Access the app:
| Name | Port | Path |
| --- | --- | --- |
| frontend | `3000` | `/*` |
| backend  | `3010` | `/v1/*` |
| swagger docs  | `3010` | `/docs` |
| postgres *(docker shell only)*  | `5432` |  |

## Responsiveness
It is optimised for desktop and mobile but should work also on the tablet without issues.

## Dependabot Integration
The app is checked on a daily bases by the dependabot.

## Postman
If you are importing the postman collection you just need to edit the Folder Varible `base_url` and `v1`. 

e.g:

`base_url` => `"http://localhost:3010"`

`v1` => `"/v1"`

Everything else will be working without Issues. The empty variables are used to help you out while working with the requests and will be filled automatically. So you get a minimal amount of manual steps for the requests. Every Request contains example data

## Git
Husky is used to run two pre-commit hooks. Staged files will be linted and fixed and also commitlint to check the commit-message

Check out `https://github.com/conventional-changelog/commitlint` for more informations

## CI
It will always run some github actions for both the frontend and backend. It will check the linting and run some unit-tests.

if you `merge` or `push` to `master` branch it will create a new docker image

## Usage Guide
Regarding the mail settings you can use the mustache-syntax to use object values. 
E.g. `Hello {{fullname}}` will be transformed to the `client.firstname + client.lastname` currently there are 3 transform functions which can be used.
- fullname
- formattedInvoiceNr
- formattedOfferNr

if you wanna use any other value from the client, document or settings just put in the name of the field.

## Screenshots
### Desktop
| Dark | Light |
| ---- | ----- |
| ![](https://invoice-app.pscl.dev/statistics_view_dark.png) | ![](https://invoice-app.pscl.dev/statistics_view_light.png) |
| ![](https://invoice-app.pscl.dev/client_view_dark.png) | ![](https://invoice-app.pscl.dev/client_view_light.png) |
| ![](https://invoice-app.pscl.dev/client_edit_dark.png) | ![](https://invoice-app.pscl.dev/client_edit_light.png) |
| ![](https://invoice-app.pscl.dev/document_view_dark.png) | ![](https://invoice-app.pscl.dev/document_view_light.png) |
| ![](https://invoice-app.pscl.dev/document_edit_dark.png) | ![](https://invoice-app.pscl.dev/document_edit_light.png) |
| ![](https://invoice-app.pscl.dev/document_send_dark.png) | ![](https://invoice-app.pscl.dev/document_send_light.png) |
| ![](https://invoice-app.pscl.dev/document_create_dark_1.png) | ![](https://invoice-app.pscl.dev/document_create_light_1.png) |
| ![](https://invoice-app.pscl.dev/document_create_dark_2.png) | ![](https://invoice-app.pscl.dev/document_create_light_2.png) |
| ![](https://invoice-app.pscl.dev/settings_view_dark.png) | ![](https://invoice-app.pscl.dev/settings_view_light.png) |
### Mobile
| Dark | Light |
| ---- | ----- |
| ![](https://invoice-app.pscl.dev/statistics_view_dark_mobile.png) | ![](https://invoice-app.pscl.dev/statistics_view_light_mobile.png) |
| ![](https://invoice-app.pscl.dev/client_view_dark_mobile.png) | ![](https://invoice-app.pscl.dev/client_view_light_mobile.png) |
| ![](https://invoice-app.pscl.dev/client_edit_dark_mobile.png) | ![](https://invoice-app.pscl.dev/client_edit_light_mobile.png) |
| ![](https://invoice-app.pscl.dev/document_view_dark_mobile.png) | ![](https://invoice-app.pscl.dev/document_view_light_mobile.png) |
| ![](https://invoice-app.pscl.dev/document_edit_dark_mobile.png) | ![](https://invoice-app.pscl.dev/document_edit_light_mobile.png) |
| ![](https://invoice-app.pscl.dev/document_send_dark_mobile.png) | ![](https://invoice-app.pscl.dev/document_send_light_mobile.png) |
| ![](https://invoice-app.pscl.dev/document_create_dark_1_mobile.png) | ![](https://invoice-app.pscl.dev/document_create_light_1_mobile.png) |
| ![](https://invoice-app.pscl.dev/document_create_dark_2_mobile.png) | ![](https://invoice-app.pscl.dev/document_create_light_2_mobile.png) |
| ![](https://invoice-app.pscl.dev/settings_view_dark_mobile.png) | ![](https://invoice-app.pscl.dev/settings_view_light_mobile.png) |