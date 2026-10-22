import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCourse, getCourses } from "@/lib/courses";
import { detailsFor } from "@/lib/course-details";
import LikeButton from "@/components/LikeButton";
import CourseCard from "@/components/CourseCard";
type CoursePageProps = {params:Promise<{id:string}>};
export async function generateStaticParams() { return (await getCourses()).map(c=>({id:c.id})); }
export async function generateMetadata({params}:CoursePageProps):Promise<Metadata> {
 const {id}=await params;
 const course=await getCourse(id);
 return {title:course?.title ?? "Course not found",description:course?.description};
}
export default async function CoursePage({params}:CoursePageProps) {
 const {id}=await params;
 const course=await getCourse(id);
 if(!course) notFound();
 const details=detailsFor(id);
 const related=(await getCourses()).filter(c=>c.id!==id).slice(0,3);
 return <>
 <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/courses">← All courses</Link><span>/</span><span>{details.area}</span></nav>
 <section className="detail-hero"><div><span className="eyebrow">{details.area} / {course.isElective?"ELECTIVE":"REQUIRED"}</span><h1>{course.title}</h1><p>{course.description}</p></div><div className={`detail-art ${details.color}`} aria-hidden="true">{details.symbol}</div></section>
 <div className="detail-layout"><section className="detail-content"><h2>What you can work towards</h2><p>{details.outcome}</p><h2>Topics to explore</h2><ol className="topic-list">{details.topics.map(topic=><li key={topic}>{topic}</li>)}</ol><h2>Before you start</h2><p>{details.prerequisites}</p></section>
 <aside className="fact-panel"><h2>At a glance</h2><dl><div><dt>Credits</dt><dd>{course.credits}</dd></div><div><dt>Course type</dt><dd>{course.isElective?"Elective":"Required"}</dd></div><div><dt>Area</dt><dd>{details.area}</dd></div></dl><LikeButton key={course.id} initialLikes={course.likes}/><p className="fact-note">Show this course some appreciation.<br/>Likes are local to this page visit.</p></aside></div>
 <section className="related"><div className="section-heading"><div><span className="eyebrow">KEEP EXPLORING</span><h2>Connect the dots.</h2></div><Link href="/courses" className="text-link">All courses ↗</Link></div><div className="course-grid">{related.map(c=><CourseCard key={c.id} id={c.id} title={c.title} description={c.description} credits={c.credits} likes={c.likes}/>)}</div></section>
 </>;
}
