"use client";

import { useState, type FormEvent } from "react";
import type { Enrollment } from "@/lib/courses";

const API = process.env.NEXT_PUBLIC_API_URL;
type Status = "idle" | "sending" | "done" | "rejected" | "error";

export function EnrollForm({ courseId }: { courseId: string }) {
  const [studentName, setStudentName] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setMessage("");
    try {
      if (!API) throw new Error("NEXT_PUBLIC_API_URL is not set");
      const res = await fetch(`${API}/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, studentName }),
      });
      if (res.status === 422) {
        const body = await res.json();
        setMessage(body.detail?.[0]?.msg ?? "Invalid enrollment data");
        setStatus("rejected");
        return;
      }
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const enrollment: Enrollment = await res.json();
      setMessage(`Enrollment number: ${enrollment.id}`);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return <form onSubmit={handleSubmit} className="enroll-form">
    <label className="field" htmlFor="studentName"><span>Your name</span>
      <input id="studentName" name="studentName" autoComplete="name"
        value={studentName} onChange={(e) => setStudentName(e.target.value)} />
    </label>
    <button type="submit" className="button primary" disabled={status === "sending"}>
      {status === "sending" ? "Sending…" : "Enroll"}
    </button>
    {status === "done" && <p role="status" className="form-success">You are enrolled. {message}</p>}
    {status === "rejected" && <p role="alert" className="form-error">The server rejected the data: {message}</p>}
    {status === "error" && <p role="alert" className="form-error">Could not submit the enrollment</p>}
  </form>;
}
