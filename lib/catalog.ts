import type { Course } from "./courses";
export type Query = Record<string, string | string[] | undefined>;
export function first(value: Query[string]): string { return (Array.isArray(value) ? value[0] : value) ?? ""; }
export function filterCourses(courses: Course[], query: Query) {
 const q = first(query.q).trim().toLowerCase();
 const type = first(query.type);
 const sort = first(query.sort);
 return courses.filter(c => (!q || c.title.toLowerCase().includes(q)) && (type !== "required" || !c.isElective) && (type !== "elective" || c.isElective)).sort((a,b) => {
 if(sort === "popular") return b.likes-a.likes || a.title.localeCompare(b.title);
 if(sort === "credits") return b.credits-a.credits || a.title.localeCompare(b.title);
 if(sort === "title") return a.title.localeCompare(b.title);
 return 0;
 });
}
