# Cybercore Class Directory

A premium cybercore digital yearbook for a class directory. It includes a public searchable archive, responsive member profiles, privacy controls, and an owner-only control room for adding and editing records.

## Features

The public page is available at `/`. The owner console is available at `/owner`. The owner can create, update, hide, publish, and delete member records; control publication of phone numbers and Instagram usernames; and add approved gallery image URLs. The server protects owner operations with the authenticated admin role.

## Important architecture note

This project was created for the Manus full-stack environment. It uses Manus OAuth, the Manus-provided database connection, and the project’s server runtime. Uploading the source to GitHub is useful for backup and version history, but GitHub alone does not provide the database, authentication, secrets, or hosting required by this app.

Do not commit `.env` files, access tokens, database credentials, or private member information.

## Local development

Install dependencies with `pnpm install`, then configure the environment values required by the Manus full-stack template. Run `pnpm dev` for development. Run `pnpm check` for TypeScript validation and `pnpm test` for the Vitest suite.

## Owner access

Sign in through Manus OAuth using the account that owns the Manus project. The project owner is promoted to the `admin` role by the existing authentication flow. Non-admin users can browse the public directory but cannot call owner procedures.

## Privacy

Phone numbers and Instagram usernames are private by default. Publish them only after receiving permission. Use approved images only. Hidden profiles remain stored but do not appear in the public directory.

## Free-plan guidance

The design uses free-compatible React, Tailwind, Framer Motion, inline icons, CSS effects, and image URLs. Large video libraries, unlimited storage, custom domains, and high-volume uploads may require additional hosting or storage capacity.
