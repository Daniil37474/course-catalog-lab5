import type { Metadata } from "next";
import { ElectiveFilter } from "@/components/ElectiveFilter";

export const metadata: Metadata = { title: "Course filter" };

export default function FilterPage() {
  return <section>
    <div className="catalog-heading"><div>
      <span className="eyebrow">FIND YOUR NEXT COURSE</span>
      <h1>Course filter</h1>
      <p>Explore every course, or focus on electives.</p>
    </div></div>
    <ElectiveFilter />
  </section>;
}
