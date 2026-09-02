# Cybercore Class Directory

A premium cybercore digital yearbook with a public searchable archive, responsive member profiles, privacy controls, and a password-protected owner control room.

## Features

The public page is available at `/`. The owner console is available at `/owner`. The owner can create, update, hide, publish, and delete member records; control publication of phone numbers and Instagram usernames; and manage approved photo and video Media Vault items. Owner operations are protected by a signed server-side admin session.

## Portable architecture

This version is prepared for a standard Node deployment such as Render and a PostgreSQL database such as Render Postgres or Supabase. It no longer requires Manus OAuth for owner access. The owner signs in using the password stored in the server-only `ADMIN_PASSWORD` environment variable.

GitHub stores the source code, but it does not run the server or provide the database. A Render web service and a PostgreSQL database are still required for a live deployment.

## Environment variables

Set these values in the hosting provider’s private environment settings. Never commit real values to GitHub.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string from Render Postgres or Supabase. |
| `ADMIN_PASSWORD` | Private password for `/owner`. Use a long unique password. |
| `JWT_SECRET` | Long random value used to sign the admin session cookie. |
| `PORT` | Provided automatically by Render; the server reads it at runtime. |

A safe template is provided in `ENV_EXAMPLE.txt`. Rename it to `.env.example` only if your local workflow requires that filename; it contains placeholders only.

## Local development

Install dependencies with `pnpm install`, set the environment variables above, then run `pnpm dev`. Run `pnpm check` for TypeScript validation and `pnpm test` for the Vitest suite. Use `pnpm build` to create the production bundle and `pnpm start` to run it.

## Render deployment outline

Create a PostgreSQL database in Render or Supabase and copy its connection string into `DATABASE_URL`. Create a Render Web Service connected to this repository. Use `pnpm install --frozen-lockfile` as the build command and `pnpm build` as the build command’s final build step if your Render plan supports it. Use `pnpm start` as the start command. Add `DATABASE_URL`, `ADMIN_PASSWORD`, and `JWT_SECRET` under the service’s private Environment settings.

Before using the live site, run the PostgreSQL migration SQL against the new database. Do not run PostgreSQL migration SQL against the old Manus MySQL database. Review the generated migration files and apply them through your selected PostgreSQL migration workflow.

## Owner access

Open `/owner` and enter the value configured as `ADMIN_PASSWORD`. A successful login creates a secure, HTTP-only session cookie. The password is never sent back to the browser as a stored profile value. Change the password by updating the hosting provider’s environment variable and restarting the service.

## Privacy

Phone numbers and Instagram usernames are private by default. Publish them only after receiving permission. Use approved images and videos only. Hidden profiles remain stored but do not appear in the public directory.

## Free-plan guidance

The design uses free-compatible React, Tailwind, Framer Motion, inline icons, CSS effects, and PostgreSQL-compatible Drizzle ORM. Render and Supabase free tiers may sleep, have storage limits, or impose usage restrictions. A true always-on service may require a paid hosting tier depending on provider policy and traffic.
