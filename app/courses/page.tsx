import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { getCourses } from "@/lib/courses";
import { filterCourses, first, type Query } from "@/lib/catalog";
import CourseCard from "@/components/CourseCard";
export const metadata: Metadata = {title: "Explore courses"};
export default async function CoursesPage({searchParams}:{searchParams:Promise<Query>}) {
 const courses = await getCourses();
 const query = await searchParams;
 const filtered = filterCourses(courses, query);
 const q = first(query.q);
 const type = ["required","elective"].includes(first(query.type)) ? first(query.type) : "all";
 const sort = ["popular","credits","title"].includes(first(query.sort)) ? first(query.sort) : "default";
 return <>
 <div className="catalog-heading"><div><span className="eyebrow">THE COURSE COLLECTION</span><h1>Follow your curiosity.</h1><p>Six ways to build your skills. Find the one that moves you forward.</p></div><span className="catalog-count">{courses.length} courses to explore</span></div>
 <div className="catalog-layout"><aside className="filters" aria-label="Course filters">
 <Form action="/courses" className="filter-form" key={JSON.stringify([q,type,sort])}>
 <label className="field"><span>Search courses</span><input type="search" name="q" placeholder="e.g. React" defaultValue={q} maxLength={200}/></label>
 <fieldset><legend className="filter-label">Course type</legend>{[["all","All courses"],["required","Required"],["elective","Elective"]].map(([value,label])=><label className="radio" key={value}><input type="radio" name="type" value={value} defaultChecked={type===value}/>{label}</label>)}</fieldset>
 <label className="field"><span>Sort by</span><select name="sort" defaultValue={sort}><option value="default">Learning order</option><option value="popular">Most liked</option><option value="credits">Most credits</option><option value="title">Title A–Z</option></select></label>
 <div className="filter-actions"><button className="button primary" type="submit">Apply filters →</button><Link href="/courses" className="text-link">Reset filters</Link></div>
 </Form><p className="filter-tip">Your filters stay in the page address. Copy the link to share the same selection.</p></aside>
 <section aria-label="Course results"><div className="results-bar"><span>{filtered.length} of {courses.length} courses{q.trim() ? ` · “${q.trim()}”` : ""}</span><span>{filtered.reduce((sum,c)=>sum+c.credits,0)} credits in this selection</span></div>
 {filtered.length ? <div className="course-grid">{filtered.map(course=><CourseCard key={course.id} id={course.id} title={course.title} description={course.description} credits={course.credits} likes={course.likes}/>)}</div> : <div className="empty-state"><h2>No courses found.</h2><p>Try another title or broaden your filters.</p><Link href="/courses" className="button primary">Show all courses →</Link></div>}</section></div>
 </>;
}
