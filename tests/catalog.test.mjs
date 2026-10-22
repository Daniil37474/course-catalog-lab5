import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import ts from "typescript";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
function loadTs(file) {
 const source = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
 const compiled = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 const mod = {exports:{}};
 new Function("module","exports","require",compiled)(mod,mod.exports,require);
 return mod.exports;
}
const {filterCourses,first} = loadTs("lib/catalog.ts");
const {getCourses,getCourse} = loadTs("lib/courses.ts");
const {courseDetails} = loadTs("lib/course-details.ts");
const sample = [
 {id:"a",title:"React",description:"",credits:5,isElective:false,likes:9},
 {id:"b",title:"API Design",description:"",credits:4,isElective:true,likes:21},
 {id:"c",title:"Security",description:"",credits:4,isElective:false,likes:14}
];
test("search is case-insensitive and trims spaces",()=> {
 assert.deepEqual(filterCourses(sample,{q:"  REACT  "}).map(c=>c.id),["a"]);
});
test("type and search combine; conflicting filters return no results",()=> {
 assert.equal(filterCourses(sample,{q:"React",type:"elective"}).length,0);
 assert.deepEqual(filterCourses(sample,{type:"required"}).map(c=>c.id),["a","c"]);
});
test("sorting does not mutate the source",()=>{
 assert.deepEqual(filterCourses(sample,{sort:"popular"}).map(c=>c.id),["b","c","a"]);
 assert.deepEqual(filterCourses(sample,{sort:"credits"}).map(c=>c.id),["a","b","c"]);
 assert.deepEqual(filterCourses(sample,{sort:"title"}).map(c=>c.id),["b","a","c"]);
 assert.deepEqual(sample.map(c=>c.id),["a","b","c"]);
});
test("repeated query keys use the first value; unknown options safely fall back",()=>{
 assert.equal(first(["React","API"]), "React");
 assert.equal(first(undefined), "");
 assert.deepEqual(filterCourses(sample,{q:["React","API"]}).map(c=>c.id),["a"]);
 assert.deepEqual(filterCourses(sample,{sort:"invalid",type:"invalid"}),sample);
});
test("all six assignment records and supplemental entries agree",async()=>{
 const courses=await getCourses();
 assert.deepEqual(courses.map(c=>[c.id,c.credits,c.isElective,c.likes]),[
 ["modern-frontend",5,false,24],["backend-fastapi",5,false,19],
 ["databases-postgresql",5,false,15],["api-design",4,true,11],
 ["web-security",4,false,21],["ai-integration",5,true,32]
 ]);
 for(const course of courses) assert.equal(courseDetails[course.id].topics.length,4);
 assert.equal(await getCourse("does-not-exist"),undefined);
 assert.equal((await getCourse("modern-frontend")).title,"Modern Frontend: React & Next.js");
});
test("LikeButton remains the only application client boundary",()=>{
 const clientFiles=[];
 for(const directory of ["app","components","lib"]) {
  function visit(dir) { for(const entry of fs.readdirSync(dir,{withFileTypes:true})) {
   const full=path.join(dir,entry.name);
   if(entry.isDirectory()) visit(full);
   else if(/\.tsx?$/.test(entry.name)&&/^\s*["']use client["'];?/m.test(fs.readFileSync(full,"utf8"))) clientFiles.push(path.relative(path.join(__dirname,".."),full).replaceAll("\\","/"));
  }}
  visit(path.join(__dirname,"..",directory));
 }
 assert.deepEqual(clientFiles,["components/LikeButton.tsx"]);
});
