# Axis

Axis is an Expo/React Native mastery-learning app for teachers and students. Teachers create courses and sections, configure assessment points, and update student progress. Students join sections with enrollment codes and view their progress in real time.

## Requirements

- Node.js 24 or a current supported LTS release
- npm
- An Expo-compatible Android, iOS, or web environment
- A Supabase project containing the application schema

## Local setup

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env`.
3. Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env`.
4. Run `npm start`.

The anonymous key is intended for client applications, but database Row Level Security must still be enabled and correctly configured. Never place a Supabase service-role key in this app.

## Quality checks

```sh
npm run lint
npx tsc --noEmit
npm test -- --runInBand
npx expo-doctor
```

To verify the web production bundle, run `npx expo export --platform web`.

## Project structure

- `App.tsx` — navigation and shared domain types
- `code/screens` — authentication, profile, teacher, and student screens
- `code/components` — reusable UI and forms
- `code/service` — Supabase access and data conversion
- `code/utils` — navigation types, generated school asset map, and Supabase client
- `code/assets/schoolData` — state-by-state school lists

`code/utils/fileMap.ts` is generated. After changing school data, run `node generateFileMap.js`.

Middle-school keys intentionally reuse the high-school datasets because the source files are byte-for-byte identical. This avoids bundling two copies of the same statewide data.

## Password recovery

The app handles recovery links through `myapp://reset-password`. Add that redirect URL to the Supabase authentication redirect allowlist.
