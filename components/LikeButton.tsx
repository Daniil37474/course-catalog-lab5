"use client";

import { useState } from "react";
import type { Course } from "@/lib/courses";

const API = process.env.NEXT_PUBLIC_API_URL;
export type LikeButtonProps = { courseId: string; initialLikes: number };

export default function LikeButton({ courseId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [failed, setFailed] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleClick() {
    if (sending) return;
    setFailed(false);
    setSending(true);
    try {
      if (!API) throw new Error("NEXT_PUBLIC_API_URL is not set");
      const res = await fetch(`${API}/courses/${encodeURIComponent(courseId)}/like`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const course: Course = await res.json();
      setLikes(course.likes);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  }

  return <div>
    <button type="button" className="like-button" onClick={handleClick}
      disabled={sending} aria-label={`Like this course. ${likes} likes`}>
      <span className="like-heart" aria-hidden="true">♡</span>
      <span>Like this course</span>
      <span aria-live="polite" aria-atomic="true">{likes}</span>
    </button>
    {failed && <p className="form-error" role="alert">Failed to like the course</p>}
  </div>;
}
