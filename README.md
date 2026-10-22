# Forma — Course Catalog

A redesigned course catalog for **Advanced Web Technologies, Lab 1**.
Built on Next.js 16 App Router, React 19, TypeScript and Tailwind CSS 4.

## Run locally

Requires Node.js 20.9 or newer and npm.

```bash
npm ci
npm run dev
```

Open the local address printed by Next.js (normally http://localhost:3000).

```bash
npm run build
npm start
npm run lint
npm test
```

## Lab requirements

- Static Server Component pages at `/` and `/about`.
- Server-rendered `/courses` calls `await getCourses()`.
- Six exact sample course records from the assignment; mock responses wait 300 ms.
- Typed `CourseCard` Server Component: its entire card is a Next.js Link.
- `/courses/[id]` awaits `params: Promise<{ id: string }>` and `getCourse(id)`.
- `generateStaticParams()` prebuilds every sample course page.
- Unknown course IDs call `notFound()`; a custom recovery page links to the catalog.
- Course loading UI lives in `app/courses/[id]/loading.tsx`.
- `components/LikeButton.tsx` is the only application file with a `"use client"` directive.
- Likes use `useState<number>(initialLikes)` and increment by one per click.
- Shared navigation uses Next.js Link and Tailwind classes.
- Original teammate commits are preserved; follow-up work is committed separately.

## Improvements

- Forma visual identity, responsive layouts, illustrated course cards, keyboard focus states,
  skip navigation and reduced-motion support.
- Title search, required/elective filters, sorting by likes, credits or title.
- Shareable query-string selections, reset action and a useful empty state.
- Search uses Next.js Form and server rendering; no additional application Client Component.
- Course detail pages include illustrative topics, outcomes, prerequisites and related courses.
- Course-specific page metadata, custom app icon and an explanatory About page.
- Automated tests for combined filtering, duplicate query parameters, sorting and data integrity.

## Data and limitations

This is a catalog demo, not an enrolment platform. There is no authentication, enrolment,
real backend or lesson player. Expanded topics/outcomes/prerequisites are study suggestions,
not an official syllabus. Likes are local to the current mounted page; a reload restores
the sample count. Popularity sorting uses the original sample counts, not local likes.

The 300 ms delay is present in the data helpers. A loading fallback can appear in development
or on an uncached request. Prebuilt pages and client navigation caches may make it invisible
in production. Course card prefetching is disabled to make the fallback easier to observe.

## Manual acceptance checks

1. Start the development server and visit `/`, `/about` and `/courses`.
2. Open each of the six course cards.
3. On a course page, click Like several times: the number must increase each time.
4. Reload the course page: the sample count must return.
5. Open `/courses/does-not-exist` and follow the recovery link.
6. Search for `react`; combine it with Required, then Elective to check the empty state.
7. Sort all courses by Most liked: AI/LLM Integration must be first.
8. Copy a filtered URL and reopen it; check the selected controls and results.
9. Check narrow screens and keyboard navigation.
10. Run the build, lint and test commands above.

## Deployment

This project requires a Next.js server because catalog filters use request-time search parameters.
Import the GitHub repository into a Next.js-compatible host (for example Vercel), keeping the
default build command `npm run build`. No environment variables are required.

## Project structure

```text
app/
  layout.tsx, page.tsx, globals.css, icon.svg, not-found.tsx
  about/page.tsx
  courses/
    page.tsx, loading.tsx, not-found.tsx
    [id]/page.tsx, loading.tsx
components/
  CourseCard.tsx
  LikeButton.tsx
lib/
  courses.ts          # Assignment mock records and async helpers
  catalog.ts          # Pure search/filter/sort logic
  course-details.ts   # Illustrative learning information
tests/
  catalog.test.mjs
```
