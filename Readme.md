## Table of Contents

  - [About](#invoice-app)
  - [Feature list](#features)
  - [Screenshots](#screenshots)
  - [Responsiveness](#responsiveness)
  - [Tech-Stack](#tech-stack)
  - [Dependabot](#dependabot-integration)
  - [Getting Started](#getting-started)
  - [Postman](#postman)
  - [Git / Pre-Commit hook](#git)
  - [Continuous Integration](#ci)
  - [Known bugs](#known-bugs)

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

## Responsiveness
It is optimised for desktop and mobile but should work also on the tablet without issues.

## Tech Stack
The frontend is based on nestjs version 2. Backend is written with nestjs and postgres database.

## Dependabot Integration
The app is checked on a daily bases by the dependabot.

## Getting Started
If you are using `npm` just replace the `yarn` keyword with `npm run`

- **`yarn` or `npm i`** *to install the project dependencies*
- **`yarn ia`** *to install the frontend and backend depenencies*
- **`yarn dev`** *run the front and backend*
- Set the required Envs based on the `.env-example` inside the `/frontend` and `/backend` directory
- If you wanna create migrations with typeorm, you need to setup a `ormconfig.json` file, there is also a example for it `/backend/ormconfig-example.json`

Access the app with `http://localhost:3000`


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

## Known bugs
- There is currently a issue that linted files will not be restaged inside the pre-commit hook from husky.

## Screenshots

### Desktop
| Dark | Light |
| ---- | ----- |
| ![](https://invoice-app.pscl.dev/client_view_dark.png) | ![](https://invoice-app.pscl.dev/client_view_light.png) |
| ![](https://invoice-app.pscl.dev/client_edit_dark.png) | ![](https://invoice-app.pscl.dev/client_edit_light.png) |
| ![](https://invoice-app.pscl.dev/document_view_dark.png) | ![](https://invoice-app.pscl.dev/document_view_light.png) |
| ![](https://invoice-app.pscl.dev/document_edit_dark.png) | ![](https://invoice-app.pscl.dev/document_edit_light.png) |
| ![](https://invoice-app.pscl.dev/document_send_dark.png) | ![](https://invoice-app.pscl.dev/document_send_light.png) |
| ![](https://invoice-app.pscl.dev/document_create_dark_1.png) | ![](https://invoice-app.pscl.dev/document_create_light_1.png) |
| ![](https://invoice-app.pscl.dev/document_create_dark_2.png) | ![](https://invoice-app.pscl.dev/document_create_light_2.png) |
### Mobile
| Dark | Light |
| ---- | ----- |
| ![](https://invoice-app.pscl.dev/client_view_dark_mobile.png) | ![](https://invoice-app.pscl.dev/client_view_light_mobile.png) |
| ![](https://invoice-app.pscl.dev/client_edit_dark_mobile.png) | ![](https://invoice-app.pscl.dev/client_edit_light_mobile.png) |
| ![](https://invoice-app.pscl.dev/document_view_dark_mobile.png) | ![](https://invoice-app.pscl.dev/document_view_light_mobile.png) |
| ![](https://invoice-app.pscl.dev/document_edit_dark_mobile.png) | ![](https://invoice-app.pscl.dev/document_edit_light_mobile.png) |
| ![](https://invoice-app.pscl.dev/document_send_dark_mobile.png) | ![](https://invoice-app.pscl.dev/document_send_light_mobile.png) |
| ![](https://invoice-app.pscl.dev/document_create_dark_1_mobile.png) | ![](https://invoice-app.pscl.dev/document_create_light_1_mobile.png) |
| ![](https://invoice-app.pscl.dev/document_create_dark_2_mobile.png) | ![](https://invoice-app.pscl.dev/document_create_light_2_mobile.png) |