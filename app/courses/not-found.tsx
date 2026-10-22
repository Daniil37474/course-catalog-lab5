import Link from "next/link";
export default function CourseNotFound(){return <section className="not-found"><span className="error-number">404</span><h1>Course not found.</h1><p>This course may have a different address. There is plenty more to discover in the catalog.</p><Link className="button primary" href="/courses">Back to all courses →</Link></section>;}
