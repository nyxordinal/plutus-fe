# Plutus Frontend

Plutus is a personal finance app for recording and reviewing expenses and income. This repository contains the Next.js frontend. It communicates with the Plutus API for authentication and financial data.

## Features

- Register, sign in, and reset a password
- Create, edit, delete, and clone expense and income records
- Search and filter records by name, date, and expense type
- View monthly summaries and dashboard statistics
- Set expense limits and choose a display currency
- English and Indonesian translations

## Requirements

- Node.js and npm
- Yarn (the repository includes `yarn.lock`)
- A running Plutus backend API

## Getting started

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Create `.env.local` in the project root:

   ```dotenv
   NEXT_PUBLIC_API_V1=http://localhost:8080/api/v1
   NEXT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----...-----END PUBLIC KEY-----"
   ```

   Set `NEXT_PUBLIC_API_V1` to the backend API base URL, including its version prefix. Set `NEXT_PUBLIC_KEY` to the RSA public key expected by that backend. The public key is included in the frontend bundle, so do not put private keys or other secrets in `NEXT_PUBLIC_` variables.

3. Start the development server:

   ```bash
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

The backend must be available at the configured API URL for authentication and data features to work.

## Scripts

| Command | Description |
| --- | --- |
| `yarn dev` | Start the Next.js development server |
| `yarn build` | Build the production app |
| `yarn start` | Serve the production build |
| `yarn lint` | Run the Next.js ESLint checks |
| `yarn build:tailwind` | Regenerate `src/styles/tailwind.css` from `src/styles/index.css` |
| `yarn format` | Format JavaScript and TypeScript files with Prettier |

For a production run, build first and then start the server:

```bash
yarn build
yarn start
```

## Project structure

```text
src/
  components/   Reusable UI components
  interfaces/   Data types, API contracts, and constants
  layouts/      Page layouts
  locale/       English and Indonesian dictionaries
  pages/        Next.js pages and routes
  redux/        Redux Toolkit state
  services/     API and session services
  styles/       Tailwind source and generated CSS
```

The app uses Next.js 11 with the Pages Router. API calls are configured in `src/api.ts`, and individual finance endpoints are wrapped by services in `src/services/`.

## License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md).
