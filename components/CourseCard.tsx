import Link from "next/link";
import { detailsFor } from "@/lib/course-details";
export type CourseCardProps = { id: string; title: string; description: string; credits: number; likes: number };
export default function CourseCard({id,title,description,credits,likes}:CourseCardProps) {
 const details = detailsFor(id);
 return <Link href={`/courses/${id}`} className="course-card" prefetch={false}>
 <div className={`card-art ${details.color}`} aria-hidden="true"><span className="art-grid"/><span className="art-symbol">{details.symbol}</span><span className="art-label">{details.area}</span><span className="art-arrow">↗</span></div>
 <div className="card-body"><span className="eyebrow">{details.area}</span><h2>{title}</h2><p>{description}</p><div className="card-meta"><span>{credits} credits</span><span>♡ {likes} likes</span></div></div></Link>;
}
