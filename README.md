[![build](https://github.com/ts-templates/node18/actions/workflows/build.yml/badge.svg)](https://github.com/ts-templates/node18/actions/workflows/build.yml)
[![lint](https://github.com/ts-templates/node18/actions/workflows/lint.yml/badge.svg)](https://github.com/ts-templates/node18/actions/workflows/lint.yml)
[![test](https://github.com/ts-templates/node18/actions/workflows/test.yml/badge.svg)](https://github.com/ts-templates/node18/actions/workflows/test.yml)
[![ESLint Recommended](https://img.shields.io/badge/eslint-recommended-%234B32C3)](https://github.com/eslint-recommended)

# node-ttp-nexus-scheduler-checker

This is a program to check for Nexus interview apppointments through the Trusted Traveler Prgram (TTP) scheduler apis.

## Features

- [ESLint](https://eslint.org/) with [ESLint Recommended](https://github.com/eslint-recommended)
  - Run on Pull request by GitHub Actions
- Test by [Jest](https://jestjs.io/)
  - Run on Pull request by GitHub Actions
- Manage Node.js version by [nvm](https://github.com/nvm-sh/nvm)
- Manage dependency updates by [Renovate](https://renovatebot.com/)

## Usage

1. Clone repository.
1. Install [nvm](https://github.com/nvm-sh/nvm) (or [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) on windows).
1. Install node 18 - `nvm install 18`
1. Switch to node 18 - `nvm use 18`
1. Install dependencies - `npm install`
1. Configure [.params.json](./src/.params.json)
1. Run the program - `npm start`

## Configuration

Configuration specified through [.params.json](./src/.params.json)

| Parameter      | Description                                                                                                             |
|----------------|-------------------------------------------------------------------------------------------------------------------------|
| locationId     | Required - The location id of an enrollment center to search appointments for. See section below for known locationIds. |
| earlierByDate  | Optional - Ignores any appointments found after a given date. Specify in ISO 8601 format, i.e. "YYYY-MM-DD"             |
| datesToExclude | Optional - The list of dates to exclude. Specify in ISO 8601 format, i.e. "YYYY-MM-DD", "YYYY-MM-DD"                    |
| numberOfAppts  | Required - The number of consecutive appointment slots to find.                                                         |


### LocationId Choices

Known locationIds of the [Nexus Enrollment Centers](https://www.cbp.gov/travel/trusted-traveler-programs/nexus/enrollment-centers).

| Location                | LocationId |
|-------------------------|------------|
| Blaine, WA              | 5020       |
| Calais, ME              | 5500       |
| Champlain, NY           | 5021       |
| Derby Line, VT          | 5223       |
| Detroit, MI             | 16656      |
| International Falls, MN | 5160       |
| Niagara Falls, NY       | 5161       |
| Ogsdenburg, NY          | 16546      |
| Pembina, ND             | 5100       |
| Port Huron, MI          | 5024       |
| Sault Ste. Marie, MI    | 5080       |
| Sweetgrass, MT          | 5120       |
| Warroad, MN             | 5060       |

## Scripts

```sh
# Compile TypeScript files to JavaScript files
npm run build

# Remove built files
npm run clean

# Run linters
npm run lint

# Fix codes by linters
npm run lint:fix

# Run main.ts
npm start

# Run tests
npm test
```
