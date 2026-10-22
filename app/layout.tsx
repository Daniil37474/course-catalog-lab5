import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
export const metadata: Metadata = {
 title: { default: "Forma — Course Catalog", template: "%s | Forma" },
 description: "Explore six courses in modern web development. Compare topics and find your next course.",
};
export default function RootLayout({children}:{children: React.ReactNode}) {
 return <html lang="en"><body>
 <a className="skip-link" href="#main">Skip to content</a>
 <header className="site-header"><nav className="shell nav flex items-center justify-between gap-6 py-5" aria-label="Main navigation">
 <Link href="/" className="brand"><span className="brand-mark" aria-hidden="true">f.</span>forma<span className="brand-dot">/</span></Link>
 <div className="nav-links flex gap-6"><Link className="hover:text-emerald-800 transition-colors" href="/">Home</Link><Link className="hover:text-emerald-800 transition-colors" href="/courses">Courses</Link><Link className="hover:text-emerald-800 transition-colors" href="/about">About</Link></div>
 <span className="nav-caption">A little curiosity. A lot of possibility.</span></nav></header>
 <main id="main" className="shell main-content">{children}</main>
 <footer className="shell footer"><span>Forma / Course catalog</span><span>Advanced Web Technologies · Lab 01</span><Link href="/about">Made for learning ↗</Link></footer>
 </body></html>;
}
