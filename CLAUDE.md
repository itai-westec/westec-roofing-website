# WesTec Roofing — Project Instructions

## Project Overview
This is the WesTec Roofing website — a premium roofing contractor site serving Los Angeles. It is a **static HTML/CSS/JS site** (no framework, no build tools, no bundler). Do NOT convert to React, Next.js, Astro, or any framework unless I explicitly ask.

## Tech Stack
- Plain HTML5
- Plain CSS3 (single styles.css file)
- Vanilla JavaScript (single main.js file)
- Google Fonts (DM Sans + Playfair Display)
- No npm, no package.json, no build step

## Design System — DO NOT CHANGE THESE VALUES

### Colors
- --primary: #1a2e35 (dark teal — nav, footer, hero backgrounds)
- --primary-light: #2a4a54 (lighter teal)
- --accent: #c5a55a (gold — CTAs, highlights, badges)
- --accent-light: #d4bc7e (light gold — button hover)
- --white: #ffffff
- --off-white: #f8f7f4 (section backgrounds)
- --light-gray: #edecea (borders)
- --text: #2c2c2c (body text)
- --text-light: #6b6b6b (secondary text)

### Fonts
- --sans: DM Sans (body, nav, buttons, labels)
- --serif: Playfair Display (headings, stats, phone numbers)

### Design Rules
- All headings use Playfair Display, font-weight 400
- em tags inside headings = gold italic (color: var(--accent))
- Buttons are uppercase, letter-spacing 1-1.5px, DM Sans, weight 700
- Section padding: 7rem 3rem (desktop), 4rem 1.5rem (mobile)
- Max-width containers: 1200px
- Cards have 1px light-gray borders and accent top-line hover animation

## Critical Rules
1. NEVER change colors, fonts, spacing, or visual design unless I explicitly ask
2. NEVER add a CSS framework (Tailwind, Bootstrap, etc.)
3. NEVER add a JS framework (React, Vue, etc.)
4. NEVER add build tools (Vite, Webpack, etc.)
5. Preserve ALL inline styles (Tesla page, Contact page, Commercial page)
6. Service detail blocks on residential.html alternate layout using direction: rtl on even children
7. Keep styles.css as ONE file and main.js as ONE file — do not split them
8. When adding new content, match the EXACT patterns and class names already in the codebase
9. When making changes, only edit the specific files and sections related to the task. Do not modify any other sections or files. Before committing, always show a summary of every file and section you changed.

## Placeholder Business Info (Replace When Ready)
These values appear across the site and should be easy to find-and-replace globally:
- Phone: (310) 555-1234 — will be replaced with real number or CallRail tracking number
- Email: info@westecroofing.com — will be replaced with real email
- License: License #XXXXXXX — will be replaced with real CA contractor license number
- Address: Los Angeles, CA — will be updated with real office address when available
- GBP Link: not yet created — add link when Google Business Profile is live
- Reviews: not yet collected — testimonials section is pre-built with placeholder structure

## SEO Strategy
This is a local service business website competing in the Los Angeles roofing market. All SEO work should follow these principles.

### Technical SEO (implement when asked)
- Semantic HTML5 structure (header, main, section, article, footer)
- Unique title tags per page format: [Page Topic] | WesTec Roofing Los Angeles
- Meta descriptions: 150-160 chars, include primary keyword + location + CTA language
- Canonical URLs on every page to prevent duplicate content
- XML sitemap (sitemap.xml) listing all pages including area pages
- robots.txt allowing all crawling except admin/draft pages
- Schema markup types to implement: LocalBusiness, RoofingContractor, Service, FAQPage, BreadcrumbList, Review (when available)
- Open Graph + Twitter Card meta tags for social sharing
- Alt text on all images — descriptive, keyword-aware, not stuffed
- Clean URL structure: lowercase, hyphens, no query params, no trailing slashes
- Mobile-first responsive design (already implemented)
- Image optimization: use WebP where possible, lazy loading on below-fold images, explicit width/height attributes to prevent CLS
- Minimize render-blocking: styles.css in head is fine, main.js at end of body (already correct)

### Local SEO Focus
- Primary market: Los Angeles, CA and surrounding areas
- Service radius: Greater Los Angeles including Westside, San Fernando Valley, South Bay, and Pasadena/Glendale area
- Target neighborhoods (29 area pages): Beverly Hills, Brentwood, Malibu, Bel Air, Pacific Palisades, Santa Monica, West Hollywood, Westwood, Hollywood Hills, Studio City, Encino, Tarzana, Valley Village, Sherman Oaks, Woodland Hills, Calabasas, Thousand Oaks, Westlake Village, Manhattan Beach, Redondo Beach, Venice, Toluca Lake, Burbank, Los Feliz, Silverlake, Atwater Village, Larchmont Village, Pasadena, Glendale
- Each area page MUST be genuinely unique — not template content with city name swapped
- Area pages should include: neighborhood-specific architecture styles, common roofing challenges for that area (coastal salt air, fire zones, hillside homes, etc.), notable local landmarks for context, distance/relationship to other service areas
- NAP (Name, Address, Phone) must be consistent on every page footer and contact page
- When GBP is live: add GBP link in footer, embed Google Map on contact page, add "Leave Us a Review" CTA

### Content SEO Guidelines
- Primary keyword clusters:
  - Roofing contractor Los Angeles / LA roofer / roofing company Los Angeles
  - Roof repair Los Angeles / roof leak repair LA
  - Roof replacement Los Angeles / re-roofing LA
  - Tesla Solar Roof installer Los Angeles
  - [Service type] + [neighborhood] (e.g., "tile roofing Beverly Hills")
  - Emergency roof repair Los Angeles / emergency tarping LA
- Write for humans first, search engines second — natural, helpful, authoritative tone
- Natural keyword placement: H1, H2, first paragraph, image alt text, meta description
- Each page targets a distinct keyword cluster — no cannibalization between pages
- Service pages should answer real customer questions (cost, timeline, process, materials)
- Internal linking strategy:
  - Every area page links to 2-3 relevant service pages
  - Every service page links to the contact page
  - Homepage distributes link equity to priority service and area pages
  - Use descriptive anchor text (not "click here")
  - Footer links provide site-wide navigation equity

### Trust Signals & Conversion (build structure now, populate later)
- Testimonials/reviews section: pre-built with placeholder structure, ready for real Google reviews
- Trust badges area: licensed, bonded, insured + manufacturer certifications + Tesla Certified badge
- Before/after project photos in portfolio (when available)
- Phone number prominent in nav (already implemented) — ensure clickable tel: link
- Mobile: consider sticky bottom CTA bar for phone/contact on small screens
- Contact form should be above the fold on contact.html (already implemented)
- Every page ends with clear CTA section (already implemented)

### Page Speed & Core Web Vitals
- Target: LCP under 2.5s, FID under 100ms, CLS under 0.1
- Images: compress to WebP, add width/height attributes, lazy load below-fold images
- Fonts: preconnect to Google Fonts (already implemented), consider font-display: swap
- CSS: single file is fine for this site size, no need to split
- JS: single file at end of body (already correct), no heavy libraries

### Future Additions (not built yet, planned)
- Blog section targeting informational queries: "how much does roof replacement cost in LA", "best roofing materials for California", "do I need a permit for roof repair in Los Angeles", "how to choose a roofing contractor"
- FAQ page (standalone, beyond the Tesla FAQ) targeting featured snippet opportunities
- Financing page if WesTec offers payment plans
- About page with team bios, company story, certifications
- Google Reviews integration (manual or API) when reviews are collected
- Google Map embed on contact page when address is confirmed
- Call tracking number swap capability (CallRail or similar)
- Blog content targeting "People Also Ask" queries from Google SERPs

### What NOT to Do
- No keyword stuffing — ever
- No hidden text or cloaking
- No duplicate content across area pages (each must be genuinely unique)
- No thin content pages (every page provides real value)
- No aggressive exact-match anchor text in internal links
- No auto-generated content without human review
- No doorway pages — area pages must have real, useful, unique content
- No link schemes or paid links
- No fake reviews or testimonials

## Pages
- index.html — Hero, services grid, Tesla section, portfolio grid, service areas, CTA
- residential.html — Page hero + 7 alternating service detail blocks
- commercial.html — Page hero + Coming Soon content
- tesla-solar.html — Page hero + Tesla section + How It Works + FAQ accordion + CTA
- portfolio.html — Page hero + filter pills + portfolio grid with data-category filtering
- contact.html — Page hero + 2-column layout (form left, info right) + CTA
- areas.html — Page hero + 29 area cards in responsive grid + CTA
- areas/ folder — Individual neighborhood landing pages (local SEO)

## JavaScript Behaviors (main.js)
1. Navbar scroll effect — adds .scrolled class when scrollY > 50
2. Scroll animation — IntersectionObserver on cards/items, fade-in + slide-up
3. Mobile menu — .mobile-menu click toggles .active on .nav-links
4. Portfolio filter — .filter-pill click filters .portfolio-item by data-category
5. FAQ accordion — .faq-question click toggles .active on parent .faq-item
