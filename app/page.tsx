import Link from "next/link";
export default function HomePage() {
return <>
<section className="home-hero"><div className="hero-copy">
<span className="eyebrow"><span className="status-dot" /> YOUR NEXT CHAPTER STARTS HERE</span>
<h1>Small steps.<br/>Real <em>possibilities.</em></h1>
<p>Welcome to Forma. Explore the building blocks of the modern web and find what you want to learn next.</p>
<div className="hero-actions"><Link href="/courses" className="button primary">Explore the courses ↗</Link><Link href="/about" className="text-link">Meet the project →</Link></div>
<div className="hero-note"><span className="mini-stack" aria-hidden="true"><i>R</i><i>Py</i><i>SQL</i></span><span>From your first component to your next big idea.</span></div>
</div><div className="learning-map" aria-label="Learning path: interface, API, database">
<div className="map-top"><span>THE BIG PICTURE</span><span>01 — 03</span></div>
<div className="map-orbit orbit-one"/><div className="map-orbit orbit-two"/>
<div className="map-card map-front"><span className="map-symbol">&lt;/&gt;</span><div><small>01 / CREATE</small><strong>The interface</strong><span>React & Next.js</span></div><b>↗</b></div>
<div className="map-card map-back"><span className="map-symbol">{"{ }"}</span><div><small>02 / CONNECT</small><strong>The logic</strong><span>Python & FastAPI</span></div><b>↗</b></div>
<div className="map-card map-data"><span className="map-symbol">SQL</span><div><small>03 / ORGANIZE</small><strong>The foundation</strong><span>PostgreSQL</span></div><b>↗</b></div>
<div className="map-bottom"><span className="map-spark">✳</span> It all connects.</div></div></section>
<section className="path-section"><div className="section-heading"><div><span className="eyebrow">FIND YOUR DIRECTION</span><h2>What will you build next?</h2></div><Link href="/courses" className="text-link">View all courses ↗</Link></div>
<div className="direction-grid">
<Link href="/courses/modern-frontend" className="direction"><span className="direction-icon mint">&lt;/&gt;</span><div><h3>Interfaces that feel right</h3><p>Start with modern frontend development.</p></div><span>↗</span></Link>
<Link href="/courses/backend-fastapi" className="direction"><span className="direction-icon peach">{"{ }"}</span><div><h3>What happens behind it</h3><p>Connect your ideas with a working API.</p></div><span>↗</span></Link>
<Link href="/courses/ai-integration" className="direction"><span className="direction-icon pink">✳</span><div><h3>A new kind of feature</h3><p>Explore how LLMs fit into an application.</p></div><span>↗</span></Link>
</div></section></>;
}
