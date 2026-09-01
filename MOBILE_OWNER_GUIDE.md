# Cybercore Class Directory — Mobile Owner Guide

## What has been built

The project now contains a public digital yearbook at `/` and an owner control room at `/owner`. Visitors can search and filter published members, open profile cards, and view only information that has been approved for publication. The owner can sign in, add members, edit records, hide profiles, publish or hide phone numbers, publish or hide Instagram usernames, and delete records.

The project uses the existing Manus authentication and database setup. Your account becomes the owner automatically when the signed-in account matches the project owner identity. Other signed-in users are blocked from the control room by the server, not just hidden in the interface.

## How to use it from a phone

### 1. Open the project preview

In Manus, open the project’s **Preview** panel. You can also open the generated preview link in your phone browser. The public archive is the home page.

### 2. Open the owner console

Tap **Owner access** in the top-right corner of the public page. If you are already authenticated, open `/owner` directly by adding `/owner` to the preview address.

If the page asks you to sign in, tap **Sign in as owner** and complete the Manus sign-in flow. Use the same account that owns this project. If you sign in with a different account, the app will correctly show **Access restricted**.

### 3. Add your first member

Inside the owner console, use the **Profile editor** form. Enter the full name first. The unique slug can usually be left blank because the app generates one from the name. Add a profile image URL, status, tagline, hobbies, personal goal, Instagram username, phone number, and hometown as appropriate.

Keep phone and Instagram publication disabled until the person gives permission. The default behavior is privacy-first. Tap **Add to directory** when the record is ready.

### 4. Edit a member later

In **Live records**, tap **Edit** next to a person. Change any field, update the publication switches, and tap **Save changes**. Tap **New profile** when you want to return to a blank form.

### 5. Hide a profile temporarily

Edit the member and turn off **Public profile**. The profile remains stored in the database and appears in the owner list, but it disappears from the public directory. Turn it on again when the profile is ready.

### 6. Protect personal information

The owner console has separate switches for **Publish phone** and **Publish Instagram**. Leave both disabled unless the member has explicitly approved public display. The public profile does not show hidden contact information.

Use only approved photos and image URLs. Do not upload or publish a classmate’s photo, phone number, social account, or goal without their permission.

### 7. Delete a profile

Tap the trash icon beside a record and confirm the browser prompt. Deletion is permanent for that member record. If you are unsure, hide the profile instead of deleting it.

## How to prepare member information

Use a private spreadsheet or notes file with these columns: Full name, status, tagline, hobbies, personal goal, Instagram, phone, hometown, image URL, and publication approval. Enter one member at a time from your phone. This reduces mistakes and makes it easier to confirm consent.

| Field | Recommended action |
|---|---|
| Full name | Required. Use the person’s preferred spelling. |
| Status | Use short labels such as Active, Creative, or Legend. |
| Tagline | Keep it to one memorable sentence. |
| Hobbies | Separate multiple hobbies with commas. |
| Personal goal | Publish only with approval. |
| Instagram | Enter the username, then enable Publish Instagram only with approval. |
| Phone | Keep private by default. Enable Publish phone only with approval. |
| Image URL | Use an approved image URL. |
| Hometown | Optional and consent-based. |

## Free-plan notes

The visual experience is designed to look premium without paid templates, paid fonts, paid APIs, or paid image assets. The current implementation uses image URLs for profile photos and has database procedures ready for gallery records. Large video libraries, unlimited media uploads, custom domains, and high-volume storage may exceed free-plan limits, so those should be added only after checking the available storage.

## If something does not appear

If a new member does not appear on the public page, check that **Public profile** is enabled. If a phone number or Instagram username does not appear, check its separate publication switch. If the owner list cannot load, refresh the page and confirm that you are signed in with the project owner account.

For future changes, work in small steps: first update data and wording, then adjust the visual design, and only then add optional features such as galleries, maps, or audio. The core directory will remain easier to maintain when optional features are not allowed to complicate the owner workflow.

## Files you will receive

The project source contains the React pages, database schema, server procedures, tests, migration SQL, and this guide. The main files you may care about are:

| File | Purpose |
|---|---|
| `client/src/pages/Home.tsx` | Public directory and profile view. |
| `client/src/pages/Admin.tsx` | Owner control room and editing form. |
| `client/src/index.css` | Cybercore theme and responsive styling. |
| `drizzle/schema.ts` | Member, gallery, and user database structure. |
| `server/db.ts` | Database helpers. |
| `server/routers.ts` | Public and owner-only API procedures. |
| `server/owner.access.test.ts` | Owner authorization test. |
| `server/directory.procedures.test.ts` | Public directory procedure tests. |
