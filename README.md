# DeenConnect

DeenConnect is a production-ready full-stack Muslim events platform built with Next.js App Router, Tailwind CSS, TypeScript, and Firebase. All event, RSVP, auth, and image data comes from Firebase. There is no mock data in this project.

## Features

- Public real-time feed of approved events
- Search by title and filter by area
- Firebase Authentication with email/password signup and login
- Authenticated event submission with image upload to Firebase Storage
- Protected `/admin` moderation dashboard
- Approve, reject, edit, and delete events
- Live RSVP counts and RSVP toggle per event
- Event detail pages with live attendee totals
- Firestore and Storage security rules

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Firebase Auth
- Cloud Firestore
- Firebase Storage

## Project Structure

```text
app/           Next.js routes and route handlers
components/    UI, forms, feed, and admin dashboard components
hooks/         Real-time data and auth hooks
lib/           Firebase configuration, server auth, and helpers
types/         Shared TypeScript types
firebase/      Firestore rules, indexes, and Storage rules
```

## 1. Install dependencies

```bash
npm install
```

## 2. Create a Firebase project

In the Firebase console:

1. Create a new Firebase project.
2. Add a Web app and copy the client SDK configuration.
3. Enable Email/Password under Authentication.
4. Create a Firestore database in production mode.
5. Enable Firebase Storage.
## 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in every value:

```bash
cp .env.example .env.local
```

Required client variables:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## 4. Deploy Firebase rules and indexes

Install the Firebase CLI if you do not already have it:

```bash
npm install -g firebase-tools
```

Authenticate and select your project:

```bash
firebase login
firebase use --add
```

Deploy the Firestore rules, indexes, and Storage rules:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

## 5. Create the admin user

The application hardcodes the admin email as:

```text
admin@deenconnect.com
```

Create or sign up with that exact email address through the app. Once authenticated, that user can access `/admin`.

## 6. Run the application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How the data model works

### `users`

- `id`
- `name`
- `email`
- `createdAt`

### `events`

- `id`
- `title`
- `description`
- `location`
- `area`
- `dateTime`
- `imageUrl`
- `imagePath`
- `createdBy`
- `status`
- `createdAt`

`imagePath` is stored so admins can remove Storage files when an event is deleted or replaced.

### `rsvps`

- `id`
- `eventId`
- `userId`
- `createdAt`

RSVP documents use a deterministic document ID of `{eventId}_{userId}` so duplicate RSVPs are prevented at the database level.

## Production notes

- Route protection for `/submit` and `/admin` verifies Firebase ID tokens against Firebase Auth on the server, so the Firebase web config must be present in the environment.
- Public event cards and detail views update in real time using Firestore listeners.
- RSVP counts are also live and update without refreshing the page.
- Event search and area filtering happen in the client after real-time event sync.
