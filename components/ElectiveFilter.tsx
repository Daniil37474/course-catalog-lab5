"use client";

import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import type { Course } from "@/lib/courses";

const API = process.env.NEXT_PUBLIC_API_URL;

async function fetcher(url: string): Promise<Course[]> {
  if (!API) throw new Error("NEXT_PUBLIC_API_URL is not set");
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export function ElectiveFilter() {
  const [onlyElective, setOnlyElective] = useState(false);
  const query = onlyElective ? "?is_elective=true" : "";
  const { data, error, isLoading, mutate } = useSWR(`${API}/courses${query}`, fetcher);

  return (
    <div className="live-filter">
      <label className="radio">
        <input type="checkbox" checked={onlyElective}
          onChange={(e) => setOnlyElective(e.target.checked)} />
        Electives only
      </label>
      {error && <div role="alert"><p>Failed to load courses</p>
        <button className="button" onClick={() => void mutate()}>Try again</button></div>}
      {isLoading && <p role="status">Loading…</p>}
      {data && !error && <>
        <p className="results-bar" role="status">{data.length} courses</p>
        <ul className="live-course-list">
          {data.map((course) => <li key={course.id}>
            <Link href={`/courses/${course.id}`} prefetch={false}>
              <strong>{course.title}</strong> — {course.credits} cr.
              {course.isElective && <span className="elective-mark"> · elective</span>}
              <span className="text-link" aria-hidden="true"> ↗</span>
            </Link>
          </li>)}
        </ul>
      </>}
    </div>
  );
}
