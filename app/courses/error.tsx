"use client";

import { useEffect } from "react";

export default function CoursesError({ error, retry }: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <section className="not-found" role="alert">
      <span className="eyebrow">COURSE CATALOG</span>
      <h1>Something went wrong</h1>
      <p>Could not load the data. The backend may not be running.</p>
      <button className="button primary" onClick={() => retry()}>Try again</button>
    </section>
  );
}
