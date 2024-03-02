## Table of Contents

  - [About](#invoice-app)
  - [Feature list](#features)
  - [Tech-Stack](#tech-stack)
  - [Requirements](#requirements)
  - [Getting Started](#getting-started)
  - [Responsiveness](#responsiveness)
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
- Generate description with the help of openai
- Automatic price calculation based on description items
- EPC-QR-Code on invoices (QR Girocode to scan with your banking app)
- Send them by mail, email or delayed email
- Convert offers to invoices
- Get statistics about your business
- Light and dark mode
- Currently supports german and english
- Dockerized for easy deployment

## Tech Stack
The project relies on Typescript for code quality and uses Commitlint and Husky to ensure consistent commit message formatting and automate quality checks.

The frontend, based on Nuxt 3, uses tailwindcss for streamlined styling and Formkit for efficient form management. Chartjs is employed for data visualization.

In the backend, NestJs serves as the foundation, and TypeORM simplifies database operations. Employ Puppeteer for headless browser pdf generation and Jest for testing.

The database of choice is Postgres, providing a robust data storage solution for our application.

## Requirements
The listed versions are not strictly needed, but tested with.

- `Node v20`
- `Npm v9`
- `Python 3` is needed for the sqlite3 npm package
- `Docker v20`
- `Docker-Compose 3I`

## Getting Started
- **`npm i`** *to install the project dependencies*
- **`npm run prepare`** *to install husky*
- **`npm run ia`** *to install the frontend and backend depenencies*
- Set the required Envs based on the `.env-example` inside the `/frontend` and `/backend` directory
- If you wanna create migrations with typeorm, you need to setup a `ormconfig.json` file, there is also a example for it `/backend/ormconfig-example.json`
- **`npm run dev`** *run the front and backend*

*`Note to .env: If any env value contains a dollar sign ($) you have to encode that with a backslash (\$)`*

### Access the app:
| Name | Port | Path |
| --- | --- | --- |
| frontend | `3000` | `/*` |
| backend  | `3010` | `/v1/*` |
| swagger docs  | `3010` | `/docs` |

## Responsiveness
It is optimised for desktop, tablet and mobile.

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
- issueDate
- dateOfDue

if you wanna use any other value from the client, document or settings just put in the name of the field.

## Screenshots
<details>
  <summary>Desktop</summary>

| Dark | Light |
| ---- | ----- |
| ![](https://invoice-app.pscl.dev/v2/statistics_view_dark.png) | ![](https://invoice-app.pscl.dev/v2/statistics_view_light.png) |
| ![](https://invoice-app.pscl.dev/v2/client_view_dark.png) | ![](https://invoice-app.pscl.dev/v2/client_view_light.png) |
| ![](https://invoice-app.pscl.dev/v2/client_edit_dark.png) | ![](https://invoice-app.pscl.dev/v2/client_edit_light.png) |
| ![](https://invoice-app.pscl.dev/v2/document_view_dark.png) | ![](https://invoice-app.pscl.dev/v2/document_view_light.png) |
| ![](https://invoice-app.pscl.dev/v2/document_edit_dark.png) | ![](https://invoice-app.pscl.dev/v2/document_edit_light.png) |
| ![](https://invoice-app.pscl.dev/v2/document_create_dark.png) | ![](https://invoice-app.pscl.dev/v2/document_create_light.png) |
| ![](https://invoice-app.pscl.dev/v2/settings_view_dark.png) | ![](https://invoice-app.pscl.dev/v2/settings_view_light.png) |
</details>

<details>
  <summary>Mobile</summary>

| Dark | Light |
| ---- | ----- |
| ![](https://invoice-app.pscl.dev/v2/statistics_view_dark_mobile.png) | ![](https://invoice-app.pscl.dev/v2/statistics_view_light_mobile.png) |
| ![](https://invoice-app.pscl.dev/v2/client_view_dark_mobile.png) | ![](https://invoice-app.pscl.dev/v2/client_view_light_mobile.png) |
| ![](https://invoice-app.pscl.dev/v2/client_edit_dark_mobile.png) | ![](https://invoice-app.pscl.dev/v2/client_edit_light_mobile.png) |
| ![](https://invoice-app.pscl.dev/v2/document_view_dark_mobile.png) | ![](https://invoice-app.pscl.dev/v2/document_view_light_mobile.png) |
| ![](https://invoice-app.pscl.dev/v2/document_edit_dark_mobile.png) | ![](https://invoice-app.pscl.dev/v2/document_edit_light_mobile.png) |
| ![](https://invoice-app.pscl.dev/v2/document_create_dark_mobile.png) | ![](https://invoice-app.pscl.dev/v2/document_create_light_mobile.png) |
| ![](https://invoice-app.pscl.dev/v2/settings_view_dark_mobile.png) | ![](https://invoice-app.pscl.dev/v2/settings_view_light_mobile.png) |
</details>

<details>
  <summary>PDF</summary>

| Offer | Invoice |
| ---- | ----- |
| ![](https://invoice-app.pscl.dev/v2/offer_example.png) | ![](https://invoice-app.pscl.dev/v2/invoice_example.png) |

</details>

### Old Version 1
<details>
  <summary>Desktop</summary>

| Dark | Light |
| ---- | ----- |
| ![](https://invoice-app.pscl.dev/v1/statistics_view_dark.png) | ![](https://invoice-app.pscl.dev/v1/statistics_view_light.png) |
| ![](https://invoice-app.pscl.dev/v1/client_view_dark.png) | ![](https://invoice-app.pscl.dev/v1/client_view_light.png) |
| ![](https://invoice-app.pscl.dev/v1/client_edit_dark.png) | ![](https://invoice-app.pscl.dev/v1/client_edit_light.png) |
| ![](https://invoice-app.pscl.dev/v1/document_view_dark.png) | ![](https://invoice-app.pscl.dev/v1/document_view_light.png) |
| ![](https://invoice-app.pscl.dev/v1/document_edit_dark.png) | ![](https://invoice-app.pscl.dev/v1/document_edit_light.png) |
| ![](https://invoice-app.pscl.dev/v1/document_send_dark.png) | ![](https://invoice-app.pscl.dev/v1/document_send_light.png) |
| ![](https://invoice-app.pscl.dev/v1/document_create_dark_1.png) | ![](https://invoice-app.pscl.dev/v1/document_create_light_1.png) |
| ![](https://invoice-app.pscl.dev/v1/document_create_dark_2.png) | ![](https://invoice-app.pscl.dev/v1/document_create_light_2.png) |
| ![](https://invoice-app.pscl.dev/v1/settings_view_dark.png) | ![](https://invoice-app.pscl.dev/v1/settings_view_light.png) |
</details>

<details>
  <summary>Mobile</summary>

| Dark | Light |
| ---- | ----- |
| ![](https://invoice-app.pscl.dev/v1/statistics_view_dark_mobile.png) | ![](https://invoice-app.pscl.dev/v1/statistics_view_light_mobile.png) |
| ![](https://invoice-app.pscl.dev/v1/client_view_dark_mobile.png) | ![](https://invoice-app.pscl.dev/v1/client_view_light_mobile.png) |
| ![](https://invoice-app.pscl.dev/v1/client_edit_dark_mobile.png) | ![](https://invoice-app.pscl.dev/v1/client_edit_light_mobile.png) |
| ![](https://invoice-app.pscl.dev/v1/document_view_dark_mobile.png) | ![](https://invoice-app.pscl.dev/v1/document_view_light_mobile.png) |
| ![](https://invoice-app.pscl.dev/v1/document_edit_dark_mobile.png) | ![](https://invoice-app.pscl.dev/v1/document_edit_light_mobile.png) |
| ![](https://invoice-app.pscl.dev/v1/document_send_dark_mobile.png) | ![](https://invoice-app.pscl.dev/v1/document_send_light_mobile.png) |
| ![](https://invoice-app.pscl.dev/v1/document_create_dark_1_mobile.png) | ![](https://invoice-app.pscl.dev/v1/document_create_light_1_mobile.png) |
| ![](https://invoice-app.pscl.dev/v1/document_create_dark_2_mobile.png) | ![](https://invoice-app.pscl.dev/v1/document_create_light_2_mobile.png) |
| ![](https://invoice-app.pscl.dev/v1/settings_view_dark_mobile.png) | ![](https://invoice-app.pscl.dev/v1/settings_view_light_mobile.png) |
</details>

<details>
  <summary>PDF</summary>

| Offer | Invoice |
| ---- | ----- |
| ![](https://invoice-app.pscl.dev/v1/offer_example.png) | ![](https://invoice-app.pscl.dev/v1/invoice_example.png) |

</details>