# Project Enra Analytics Strategy

## Business Goal

**Primary objective:** Convert website visitors into paid Veilglass app subscribers.

This is a long-tail process. Success is measured over months, not days.

---

## The Funnel

```
Content (Facebook/Instagram) 
    → Website Entry (usually Codex realm pages)
        → Engagement (reading heritage content)
            → Interest (visiting Veilglass page)
                → Download (app store)
                    → Trial (free usage)
                        → Paid Subscription
                            → Advocacy (sharing with friends)
```

### Key Conversion Points to Track

1. **Social → Website:** Are people clicking through from Instagram/Facebook?
2. **Codex → Veilglass page:** Are content readers discovering the app?
3. **Mobile vs Desktop:** Mobile users can download immediately; desktop users need an extra step.

---

## Analytics Tools

| Tool | Purpose | Check Frequency |
|------|---------|-----------------|
| Google Analytics 4 (GA4) | Traffic, engagement, user flow, conversions | Weekly |
| Google Search Console | Organic search performance, keywords, rankings | Weekly |
| Microsoft Clarity | Session recordings, heatmaps, UX issues | As needed (when diagnosing problems) |

---

## Key Metrics to Review Weekly

### Traffic & Growth
- **Users** (total unique visitors)
- **New users** (first-time visitors — growth indicator)
- **Returning users** (loyalty indicator)
- **Sessions per user** (are people coming back?)

### Traffic Sources
- **Sessions by source/medium** — Where is traffic coming from?
  - `ig / social` = Instagram
  - `facebook.com / referral` = Facebook
  - `google / organic` = Search engine
  - `(direct) / (none)` = Direct or untracked
- **UTM campaign performance** (once using UTM links)

### Engagement
- **Average engagement time** — Are people reading content?
- **Engagement rate** — % of non-bounce sessions
- **Bounce rate by page** — Which pages lose people?

### Funnel Performance
- **Views by page** — Which Codex realms are popular?
- **Veilglass page views** — How many reach the conversion page?
- **Codex → Veilglass ratio** — What % of Codex visitors see the app page?

### Device Breakdown
- **Mobile vs Desktop %** — Mobile users are direct app download candidates

### Geography
- **Users by city** — Is traffic coming from Hampshire/UK (target audience)?

---

## Current Baseline (Week of Jan 14-20, 2026)

| Metric | Value |
|--------|-------|
| Total users | 5 |
| New users | 2 |
| Returning users | 2 |
| Sessions per user | 4 |
| Avg engagement time | 7m 38s |
| Top traffic source | Instagram (84%) |
| Mobile/Desktop split | 20% / 80% |
| Veilglass page views | 3 |

---

## What Good Looks Like (Goals to Work Toward)

| Metric | Current | Target Direction |
|--------|---------|------------------|
| Weekly new users | 2 | Growing week-over-week |
| Instagram engagement rate | 100% | Maintain above 70% |
| Mobile % of traffic | 20% | Increase toward 50%+ |
| Codex → Veilglass conversion | ~19% | Increase to 30%+ |
| Avg engagement time | 7m 38s | Maintain above 3 min |

---

## Weekly Review Process

Every Sunday:
1. Export GA4 Reports snapshot (CSV format)
2. Note any content posted that week (Instagram, Facebook, email)
3. Compare to previous week's numbers
4. Look for:
   - Traffic growth or decline
   - Changes in source mix
   - Pages gaining or losing engagement
   - Movement in mobile vs desktop ratio
   - Veilglass page traffic trend

---

## Known Issues & Watch Items

- **Desktop-heavy traffic (80%)** — Need to monitor; may need mobile-focused CTAs
- **Low Veilglass page traffic** — Funnel narrows significantly after Codex
- **Facebook underperforming** — Only 1 session vs 16 from Instagram
- **Small sample size** — Need more data before drawing strong conclusions

---

## UTM Tracking (For Future Campaigns)

When sharing links, use UTM parameters to track sources:

**Structure:**
```
https://www.project-enra.com/page/?utm_source=SOURCE&utm_medium=MEDIUM&utm_campaign=CAMPAIGN
```

**Examples:**
| Channel | UTM Link |
|---------|----------|
| Instagram bio | `?utm_source=instagram&utm_medium=social&utm_campaign=bio` |
| Instagram post | `?utm_source=instagram&utm_medium=social&utm_campaign=post-[topic]` |
| Facebook post | `?utm_source=facebook&utm_medium=social&utm_campaign=post-[topic]` |
| Email newsletter | `?utm_source=email&utm_medium=email&utm_campaign=newsletter-[date]` |
| Direct outreach email | `?utm_source=email&utm_medium=email&utm_campaign=outreach` |

Use the [Google Campaign URL Builder](https://ga-dev-tools.google/campaign-url-builder/) to generate these.

---

## Notes

- Analytics setup completed: January 20, 2026
- Tracking includes: GA4 + Microsoft Clarity on all 21 HTML pages
- Tracking managed via centralized `/analytics.js` file
