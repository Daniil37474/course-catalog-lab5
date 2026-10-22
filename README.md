# Forma - Course Catalog

Lab 5: Next.js 16.3.4 and FastAPI integration, JSON contracts, and CORS diagnostics. The Forma design, search, sorting, and additional course details are preserved.

## Repositories

- Frontend: https://github.com/Daniil37474/course-catalog-lab5
- Backend: https://github.com/Daniil37474/course-catalog-api-lab5

## Setup

Requires Node.js 20.9+ and the running backend from the second repository.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev -- --port 3000
```

Open **http://localhost:3000**. This exact origin is required for the lab: the backend does not allow `http://127.0.0.1:3000` or a different port.

Contents of `.env.local`:

```dotenv
API_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

`API_URL` is used by the Next.js server. `NEXT_PUBLIC_API_URL` is included in browser JavaScript at build time and must not contain secrets. Restart the development server after creating the file; rebuild the frontend when changing the production API address. `.env.local` is excluded from Git; `.env.example` contains example addresses only.

## Features

| Page or action | Caller | Request |
| --- | --- | --- |
| `/courses` | Next.js server | `GET /courses` |
| `/courses/[id]` | Next.js server | `GET /courses/{id}` |
| `/filter` | Browser, SWR | `GET /courses?is_elective=true` |
| Like | Browser | `POST /courses/{id}/like` |
| Course enrollment | Browser | `POST /enrollments` with JSON |

`getCourses` and `getCourse` use `cache: "no-store"`, check HTTP status codes, and return typed data. Only a 404 for an individual course returns `undefined`; other errors reach `app/courses/error.tsx`. The Try again button calls `retry`, available in Next.js 16.3.4, to request the data again.

`generateStaticParams` was removed because the course list now lives in the API and can change without rebuilding the frontend. The build must not contact an offline backend; `/courses` and `/courses/[id]` are rendered on request.

Python fields remain `is_elective`, `course_id`, and `student_name`. JSON fields are `isElective`, `courseId`, and `studentName`. The filter query parameter remains `is_elective`. Client components import only types from `lib/courses.ts`.

A like is a simple POST without a body or special headers, so no OPTIONS preflight is required. Enrollment uses `Content-Type: application/json`, so the browser first checks permission through OPTIONS. If allowed, it sends POST. A 201 response contains the enrollment number; a 422 response describes the `studentName` validation error. Browser-side name length validation is intentionally omitted to demonstrate server validation.

Preflight permission is cached for 600 seconds. Repeated submissions may omit OPTIONS; with caching disabled, the check runs again. CORS restricts browser access to responses, not server execution of simple requests. It is not an authentication mechanism.

## Verification

```powershell
npm run lint
npm test
npm run build
npm start -- --port 3000
```

Run the build with the backend stopped. Restart the backend on port 8000 to use the pages. Frontend tests do not require a running API: they cover filtering, sorting, 404 and 503 handling, and connection failures.

Manual scenarios:

1. `/courses` displays six cards, with AI/LLM Integration first.
2. On `/filter`, Electives only changes six courses to two: AI/LLM Integration and API Design. The elective label is visible.
3. On `/courses/web-security`, liking increases the server counter, and the value survives a page reload.
4. Entering `A` produces a server validation message about minimum length; `Aigerim` produces an enrollment number. `GET http://localhost:8000/enrollments` returns that enrollment.
5. `/courses/does-not-exist` displays Course not found.
6. Stopping the backend displays an error page; after restarting it, Try again restores the data.
7. A temporary backend delay makes the loading state visible. Remove the delay before submission.

## Limitations

Courses, likes, and enrollments are stored in FastAPI process memory and reset on restart. Authentication, a database, and learning materials are not included. Additional topics and learning outcomes are illustrative, not an official curriculum.

## Diagnostic journal

Experiments were performed on October 16, 2026, using local copies of the actual API routes. One condition was changed at a time; the working backend source was unchanged. Interface behavior was checked in the browser; status codes and headers were checked through server request logs and control HTTP requests. The CORS console messages below are standard Chromium diagnostic wording from the assignment, included as a reference rather than a saved console dump.

### Failure 1 - CORS disabled

- Change: removed `app.add_middleware(CORSMiddleware, ...)` from the experimental application.
- Console: expected indicator is `No 'Access-Control-Allow-Origin' header is present`.
- Interface: `/filter` shows Failed to load courses; liking shows Failed to like the course; enrollment shows Could not submit the enrollment. The server-rendered course page opens.
- Requests: course GET and like POST return 200 without CORS headers; enrollment OPTIONS returns 405. Enrollment POST is not sent. The server like counter increases.
- Cause: the browser cannot read the response; OPTIONS reaches a route that does not support this method.
- Identified at steps 3 and 4: missing allow-origin and a 405 preflight response. Recovery: restore the middleware.

### Failure 2 - Trailing slash in the allowed origin

- Change: replaced `allow_origins=["http://localhost:3000"]` with `["http://localhost:3000/"]`.
- Console: expected indicators are `No 'Access-Control-Allow-Origin' header is present` and a preflight failure.
- Interface: liking and enrollment show errors; the server-rendered course page works.
- Requests: course GET and like POST return 200 without allow-origin. OPTIONS returns 400 with `Disallowed CORS origin` in the control response. Enrollment POST is absent.
- Cause: the request origin has no trailing slash and does not match the configured string.
- Identified at steps 3 and 4 by comparing origins and inspecting the OPTIONS response body. Recovery: remove the slash.

### Failure 3 - allow_methods omitted

- Change: removed the `allow_methods=["*"]` argument.
- Console: expected indicator is `Response to preflight request doesn't pass access control check`.
- Interface: the filter displays six courses, liking updates the counter, and enrollment shows an error.
- Requests: GET and the simple like POST return 200 with allow-origin. Enrollment OPTIONS returns 400, `Access-Control-Allow-Methods: GET`, and `Disallowed CORS method`. Enrollment POST is not sent.
- Cause: only GET is allowed by default. The simple POST does not undergo a preflight method check, while the JSON POST does.
- Identified at step 4: the origin is allowed, but POST is missing from the allowed methods. Recovery: restore the method list.

### Failure 4 - Different page hostname

- Change: opened the frontend at `http://127.0.0.1:3000`, temporarily added `allowedDevOrigins: ["127.0.0.1"]` to Next.js, and restarted the development server.
- Console: expected indicator is a CORS rejection for `http://127.0.0.1:3000`.
- Interface: filtering and client actions show errors; the server-rendered course page opens.
- Requests: GET and like POST return 200 with `Origin: http://127.0.0.1:3000` but without allow-origin. OPTIONS returns 400; enrollment POST is absent.
- Cause: `localhost` and `127.0.0.1` are different hosts and therefore different origins.
- Identified at steps 1 and 3: the page address and request Origin do not match the allowed address. Recovery: use localhost and remove the temporary allowedDevOrigins setting.

### Failure 5 - Python typo mistaken for a CORS error

- Change: replaced `courses[p["offset"] : ...]` with `courses[p["ofset"] : ...]` in a copy of the list route.
- Console: the Next.js server recorded the browser error `Error: API error: 500`; a missing allow-origin message is expected for the direct filter request.
- Interface: `/filter` shows an error and `/courses` shows Something went wrong. The individual course page, liking, and enrollment still work.
- Requests: GET `/courses` returns 500 without CORS headers. Individual course GET returns 200; like POST returns 200; enrollment OPTIONS returns 200; enrollment POST returns 201.
- Cause: the backend terminal reports `KeyError: 'ofset'`; the unhandled 500 response is generated outside CORSMiddleware.
- Identified at steps 2 and 5: the server-rendered page also fails, and the traceback points to an incorrect key. Recovery: restore `offset` without changing CORS.
- Course recommendations are optional: a list request failure does not hide an available course or its enrollment form.

## Design decisions

`generateStaticParams` was removed so builds do not depend on a running API or freeze an outdated course list. Likes use a simple POST without special headers and do not require preflight; JSON enrollment requires OPTIONS because of `Content-Type: application/json`. Temporary diagnostic settings were removed. The interface handles errors without replacing real API data with mocks.
