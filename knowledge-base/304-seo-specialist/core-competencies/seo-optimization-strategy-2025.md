# SEO Optimization & Strategy 2025

**Updated**: 2025-11-23 | **Focus**: Technical SEO, Content Strategy, Link Building

---

## On-Page SEO

```markdown
TITLE TAGS:

FORMAT: Primary Keyword - Secondary Keyword | Brand
Example: "Best Running Shoes for Beginners - 2025 Guide | Nike"

RULES:
- 50-60 characters (avoid truncation)
- Include target keyword (front-loaded)
- Unique for each page
- Compelling (encourage clicks)

BAD:
❌ "Home" (not descriptive)
❌ "Buy the best shoes online at our store" (too long)

GOOD:
✅ "Running Shoes for Beginners | Nike"
✅ "SEO Guide 2025: Complete Tutorial | Moz"

---

META DESCRIPTIONS:

FORMAT: Compelling summary with call-to-action

RULES:
- 150-160 characters
- Include target keyword
- Action-oriented (Click, Learn, Discover)
- Unique for each page

Example:
"Learn SEO in 2025 with our complete guide. Covers on-page, technical, and link building. Start ranking higher today!"

NOTE: Not a ranking factor, but affects CTR (click-through rate)

---

HEADER TAGS (H1-H6):

STRUCTURE:
<h1>Primary Topic: Running Shoes for Beginners</h1>
  <h2>Types of Running Shoes</h2>
    <h3>Neutral Shoes</h3>
    <h3>Stability Shoes</h3>
  <h2>How to Choose</h2>
    <h3>Foot Type</h3>
    <h3>Running Style</h3>

RULES:
- One H1 per page (primary keyword)
- H2-H6 for subheadings
- Descriptive (not "Click Here")
- Keyword variations (natural)

---

URL STRUCTURE:

GOOD:
✅ example.com/running-shoes/beginners
✅ example.com/blog/seo-guide-2025

BAD:
❌ example.com/page?id=12345
❌ example.com/category/subcategory/post-title-with-many-words

RULES:
- Short, descriptive
- Include keyword
- Hyphens (not underscores)
- Lowercase
- No stop words (a, the, and)

---

CONTENT OPTIMIZATION:

KEYWORD PLACEMENT:
- Title tag (primary keyword)
- H1 (primary keyword)
- First 100 words (primary keyword)
- H2-H3 (keyword variations)
- Throughout body (natural, not stuffed)
- Image alt text
- URL

KEYWORD DENSITY:
- 1-2% (keyword appears 1-2 times per 100 words)
- Don't overdo! (keyword stuffing = penalty)

LSI KEYWORDS (Latent Semantic Indexing):
- Related terms Google expects to see
- Example: "Running shoes" → "athletic footwear", "sneakers", "trainers"
- Use naturally in content

CONTENT LENGTH:
- Short answer: 300-500 words (featured snippet)
- Long-form: 1500-3000+ words (comprehensive guide)
- Longer = more keywords, more backlinks (generally)

READABILITY:
- Short paragraphs (2-3 sentences)
- Bullet points, numbered lists
- Subheadings (scannable)
- Images, videos (break up text)
- 8th grade reading level (Flesch Reading Ease: 60-70)
```

---

## Technical SEO

```markdown
SITE SPEED:

CORE WEB VITALS:
- LCP (Largest Contentful Paint): <2.5s
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1

OPTIMIZATION:
- Compress images (TinyPNG, WebP format)
- Minify CSS/JS (remove whitespace)
- Enable gzip compression
- Browser caching
- CDN (Cloudflare, AWS CloudFront)
- Lazy loading (images load when scrolled to)

TEST:
- Google PageSpeed Insights
- GTmetrix
- WebPageTest

---

MOBILE-FIRST:

REQUIREMENTS:
- Responsive design (adapts to screen size)
- Touch-friendly buttons (44×44px minimum)
- No Flash (not supported on mobile)
- Readable text (16px font minimum)

TEST:
- Google Mobile-Friendly Test
- Chrome DevTools (mobile emulator)

---

STRUCTURED DATA (Schema.org):

JSON-LD FORMAT:

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Running Shoes for Beginners",
  "image": "https://example.com/shoes.jpg",
  "description": "Best running shoes for beginners",
  "brand": {
    "@type": "Brand",
    "name": "Nike"
  },
  "offers": {
    "@type": "Offer",
    "price": "99.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "120"
  }
}
</script>

BENEFITS:
- Rich snippets (star ratings, price, availability)
- Increased CTR (stand out in search results)
- Better understanding by Google

TYPES:
- Product (ecommerce)
- Recipe (food blogs)
- Article (news sites)
- Event (calendar listings)
- FAQ (Q&A format)

TEST:
- Google Rich Results Test

---

XML SITEMAP:

EXAMPLE:
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/running-shoes</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>

SUBMIT:
- Google Search Console
- Bing Webmaster Tools

UPDATE:
- Automatically (plugin: Yoast SEO, Rank Math)
- Manually (when adding new pages)

---

ROBOTS.TXT:

EXAMPLE:
User-agent: *
Disallow: /admin/
Disallow: /private/
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php

Sitemap: https://example.com/sitemap.xml

PURPOSE:
- Block crawlers from pages you don't want indexed
- Link to sitemap
- Located at: example.com/robots.txt

---

CANONICALIZATION:

PROBLEM: Duplicate content
- example.com/product
- example.com/product?ref=email
- example.com/product?color=blue

SOLUTION: Canonical tag
<link rel="canonical" href="https://example.com/product" />

TELLS GOOGLE: "This is the main version, ignore others"
```

---

## Keyword Research

```markdown
PROCESS:

1. BRAINSTORM:
   - Seed keywords (running shoes, sneakers, athletic footwear)
   - Customer language (how do they search?)
   - Competitor keywords

2. TOOLS:
   - Google Keyword Planner (free)
   - Ahrefs Keywords Explorer (paid, $99/month)
   - SEMrush (paid, $129/month)
   - Ubersuggest (freemium, $29/month)

3. METRICS:
   - Search volume (monthly searches)
   - Keyword difficulty (0-100, lower = easier to rank)
   - CPC (cost per click, indicates commercial intent)
   - Trend (increasing or decreasing?)

EXAMPLE:
| Keyword | Volume | Difficulty | CPC | Trend |
|---------|--------|------------|-----|-------|
| running shoes | 200K | 85 (hard) | $2.50 | Stable |
| running shoes for beginners | 10K | 45 (medium) | $1.80 | Growing |
| best running shoes 2025 | 5K | 60 (medium) | $3.00 | Seasonal |

4. INTENT:
   - Informational: "how to choose running shoes" (looking to learn)
   - Navigational: "nike running shoes" (finding specific brand)
   - Commercial: "best running shoes" (comparing options)
   - Transactional: "buy running shoes online" (ready to purchase)

5. LONG-TAIL:
   - 3+ words
   - Lower volume, lower difficulty
   - Higher conversion (more specific)
   - Example: "best running shoes for flat feet beginners"

STRATEGY:
- Target mix of head terms (high volume, competitive) + long-tail (low volume, easy)
- Create content for each intent stage (funnel)
```

---

## Link Building

```markdown
WHY LINKS MATTER:

GOOGLE ALGORITHM:
- Backlinks = "votes" for your site
- More quality backlinks = higher rankings
- Quality > quantity

LINK EQUITY (PageRank):
- High authority site (nytimes.com) → Your site = valuable
- Low authority site (spam blog) → Your site = worthless

---

TYPES:

DOFOLLOW:
- Passes link equity
- Default link type
- <a href="https://example.com">Link</a>

NOFOLLOW:
- Does NOT pass link equity
- Use for untrusted content, paid links
- <a href="https://example.com" rel="nofollow">Link</a>

UGC (User Generated Content):
- Comments, forum posts
- <a href="https://example.com" rel="ugc">Link</a>

SPONSORED:
- Paid links
- <a href="https://example.com" rel="sponsored">Link</a>

---

STRATEGIES:

GUEST POSTING:
- Write article for another site
- Include link back to your site
- Target: High authority, relevant sites

Example:
"I write SEO guides. I pitch Moz: 
'10 Advanced SEO Tactics for 2025' (includes link to my site)"

BROKEN LINK BUILDING:
1. Find broken links on high authority sites (Ahrefs, Check My Links extension)
2. Create similar content on your site
3. Email site owner: "Hey, your link to X is broken. I have similar content: Y"
4. They update broken link → Your link ✓

SKYSCRAPER TECHNIQUE:
1. Find popular content (many backlinks)
2. Create BETTER version (more comprehensive, updated, better design)
3. Email sites linking to original: "I created an updated version..."
4. Some will link to yours instead

RESOURCE PAGES:
- Find "Resources" or "Links" pages in your niche
- Email curator: "I noticed you link to X. My guide on Y might fit well"
- Example: Search "running + resources" or "running + intitle:links"

HARO (Help a Reporter Out):
- Journalists request expert quotes
- Respond with quote
- Get featured in article + backlink
- Sign up: helpareporter.com

---

OUTREACH EMAIL:

TEMPLATE:
Subject: Quick question about [Article Title]

Hi [Name],

I came across your article "[Title]" and really enjoyed [specific detail].

I noticed you mentioned [Topic]. I recently published a comprehensive guide on [Your Topic] that covers [unique angle].

Here's the link: [URL]

If you think it would add value to your readers, I'd appreciate if you'd consider linking to it.

Either way, keep up the great work!

Best,
[Your Name]

TIPS:
- Personalize (mention specific detail from their article)
- Keep short (3-4 sentences)
- No pressure ("if you think it fits")
- Follow up once (after 1 week, if no response)
```

---

## Local SEO

```markdown
GOOGLE BUSINESS PROFILE (formerly Google My Business):

SETUP:
1. Claim listing: business.google.com
2. Verify (postcard, phone, email)
3. Complete profile:
   - Business name, address, phone (NAP)
   - Category (primary + additional)
   - Hours
   - Website
   - Photos (logo, cover, interior, products)
   - Description (750 characters, include keywords)

OPTIMIZATION:
- Regular posts (updates, offers, events)
- Respond to reviews (positive + negative)
- Add Q&A
- Upload new photos monthly

BENEFITS:
- Appear in Local Pack (map results)
- Reviews visible in search
- Direct call/directions buttons

---

LOCAL CITATIONS:

NAP CONSISTENCY:
Name, Address, Phone must be IDENTICAL everywhere

GOOD:
✅ ABC Plumbing, 123 Main St, New York, NY 10001, (555) 123-4567

BAD:
❌ ABC Plumbing Inc., 123 Main Street, NY, NY 10001, 555-123-4567
(Different business name, street abbreviation, phone format)

DIRECTORIES:
- Yelp
- Yellow Pages
- Facebook Business
- BBB
- Industry-specific (Avvo for lawyers, Zillow for real estate)

CHECK:
- Moz Local Check
- Whitespark Citation Tracker

---

LOCAL KEYWORDS:
- "plumber near me"
- "plumber in [city]"
- "[city] plumber"

CONTENT:
- Location pages (if multiple locations)
- Local blog posts ("Top 10 Restaurants in [City]")
- Embed Google Map on Contact page
```

---

## SEO Tools

```markdown
FREE:

GOOGLE SEARCH CONSOLE:
- Submit sitemap
- Index coverage (errors, warnings)
- Performance (clicks, impressions, CTR, position)
- URL inspection (check if page indexed)

GOOGLE ANALYTICS:
- Traffic sources (organic, direct, referral, social)
- User behavior (bounce rate, time on page)
- Conversions (goals, ecommerce)

GOOGLE KEYWORD PLANNER:
- Search volume
- Keyword ideas
- Competition

---

PAID:

AHREFS ($99-$999/month):
- Backlink analysis
- Keyword research
- Site audit (technical issues)
- Rank tracking

SEMRUSH ($129-$499/month):
- Competitor analysis
- Keyword research
- Site audit
- Position tracking

MOZ PRO ($99-$599/month):
- Keyword research
- Link building
- Rank tracking
- On-page optimization

SCREAMING FROG ($259/year):
- Website crawler
- Find broken links, missing meta tags, redirects
- Technical SEO audit
```

---

## Key Takeaways

1. **Content is king** - Quality, comprehensive, answers user intent
2. **Technical foundation** - Fast, mobile-friendly, crawlable
3. **Links still matter** - Build quality backlinks (not quantity)
4. **User experience** - Low bounce rate, high dwell time (ranking signals)
5. **Patience** - SEO takes 3-6 months to see results

---

## References

- "The Art of SEO" - Enge, Spencer, Stricchiola
- Moz Blog
- Google Search Central

**Related**: `content-seo.md`, `technical-seo-advanced.md`, `local-seo-guide.md`
