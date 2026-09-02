# Render deployment guide

## 1. Create PostgreSQL

Create a PostgreSQL database in Render or Supabase. Copy its private connection string. It normally starts with `postgresql://` and may include `sslmode=require`.

## 2. Create the web service

Create a Render Web Service connected to the `vimal88700/AIML` repository and the `main` branch.

Use these commands:

| Render setting | Value |
|---|---|
| Build command | `pnpm install --frozen-lockfile && pnpm build` |
| Start command | `pnpm start` |
| Root directory | Leave blank because the project files are at the repository root |
| Health check path | `/` |

Render provides the `PORT` value at runtime. The server reads `process.env.PORT`; do not hardcode a port.

## 3. Add private environment variables

In the Render service, open **Environment → Add Environment Variable** and add:

```text
DATABASE_URL=your PostgreSQL connection string
ADMIN_PASSWORD=your long private admin password
JWT_SECRET=your long random signing secret
```

Do not add real values to GitHub. `ENV_EXAMPLE.txt` contains placeholders only.

## 4. Prepare the database schema

The current repository was originally created from a Manus/MySQL project. The code now uses PostgreSQL Drizzle definitions, but the old MySQL migration history should not be applied to a new PostgreSQL database.

Before production use, generate a clean PostgreSQL migration set from `drizzle/schema.ts`, review every SQL statement, and apply it to the new PostgreSQL database. Confirm that the tables `users`, `class_members`, and `member_gallery` exist before opening `/owner`.

Never run PostgreSQL SQL against a MySQL database or run destructive SQL against a database containing real member information.

## 5. Test the website

After the Render deploy finishes, open the service URL. The public directory is at `/`. The owner console is at `/owner`. Enter the same value used for `ADMIN_PASSWORD`.

Add a private test member, refresh the page, and confirm the member remains in the owner list. Then remove the test member before adding real data.

## 6. Security checklist

Keep the GitHub repository private. Use a unique password that is not used elsewhere. Keep `JWT_SECRET` private. Do not publish phone numbers, Instagram accounts, or media without consent. Rotate `ADMIN_PASSWORD` if it is ever exposed.

## 7. Free hosting expectations

Free hosting tiers can sleep, limit database size, restrict outbound traffic, or impose monthly usage limits. “24/7” availability is not guaranteed on every free tier. If the service must remain continuously awake, check the current Render plan terms before relying on it for critical access.
