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
process.env.API_URL = "http://api.test";
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
test("API helpers handle success, 404, HTTP errors and connection failure",async(t)=>{
 const requests=[];
 let status=200;
 let payload=sample;
 t.mock.method(globalThis,"fetch",async(url,options)=>{
  requests.push({url,options});
  return new Response(JSON.stringify(payload),{status,headers:{"Content-Type":"application/json"}});
 });
 assert.deepEqual(await getCourses(),sample);
 assert.deepEqual(requests[0],{url:"http://api.test/courses",options:{cache:"no-store"}});
 payload=sample[0];
 assert.deepEqual(await getCourse("a"),sample[0]);
 assert.equal(requests[1].url,"http://api.test/courses/a");
 status=404;
 assert.equal(await getCourse("missing"),undefined);
 await assert.rejects(getCourses(),/API error: 404/);
 status=503;
 await assert.rejects(getCourse("a"),/API error: 503/);
 await assert.rejects(getCourses(),/API error: 503/);
 t.mock.method(globalThis,"fetch",async()=>{throw new TypeError("fetch failed");});
 await assert.rejects(getCourses(),/fetch failed/);
 assert.equal(Object.keys(courseDetails).length,6);
});
