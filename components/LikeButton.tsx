"use client";
import { useState } from "react";
export type LikeButtonProps = {initialLikes:number};
export default function LikeButton({initialLikes}:LikeButtonProps) {
 const [likes,setLikes]=useState<number>(initialLikes);
 return <button type="button" className="like-button" onClick={()=>setLikes(previous=>previous+1)} aria-label={`Like this course. ${likes} likes`}><span className="like-heart" aria-hidden="true">♡</span><span>Like this course</span><span aria-live="polite" aria-atomic="true">{likes}</span></button>;
}
