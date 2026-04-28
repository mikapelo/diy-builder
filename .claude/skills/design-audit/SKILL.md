---
name: design-audit
description: Run a comprehensive visual design audit on DIY Builder pages. Use this whenever the user asks to check the design, audit CSS consistency, verify accessibility, review the landing page appearance, or says things like "verifie le design", "audit visuel", "check accessibility", "review the UI". Screenshots all sections, inspects computed styles, checks WCAG contrast, and reports findings.
---

# /design-audit [page]

Run a structured design audit on a DIY Builder page.

## Arguments

- `page` (optional): URL path to audit. Defaults to `/` (landing page). Can be `/cabanon`, `/calculateur`, etc.

## Procedure

### 1. Setup
- Start the preview server via `preview_start("frontend")`
- Navigate to the target page
- Set viewport to desktop (1440x900) for primary audit

### 2. Screenshot inventory
Scroll through the entire page in 700px increments, taking a screenshot at each position. This gives full visual coverage.

### 3. Token consistency check
Inspect these elements and verify they use the Atelier Design System tokens:

| Token | Expected value | Check selector |
|---|---|---|
| `--primary` | `#D4AF37` | `.btn-primary`, `.gradient-gold` |
| `--primary-text` | `#7A5C00` | `.section-eyebrow`, `.section-label`, `.how-num` |
| `--text` | `#1a1c1b` | `body`, `h1`, `h2` |
| `--surface` | `#faf9f7` | `body` background |
| border-radius | `24px` for cards, `999px` for buttons | `.card`, `.btn-primary`, `.comparateur-row` |

Use `preview_inspect` with specific CSS properties for each.

### 4. Contrast audit (WCAG AA)
Check these critical pairs:

| Foreground | Background | Minimum ratio | Context |
|---|---|---|---|
| `--primary-text` (#7A5C00) | `--surface` (#faf9f7) | 4.5:1 (normal text) | Eyebrows, labels |
| `--text-3` (#6b5f4f) | `--surface` (#faf9f7) | 4.5:1 (normal text) | Subtitles, descriptions |
| `--text-4` (#8a7e6f) | `--surface` (#faf9f7) | 3.0:1 (large text only) | Hints, captions |
| White text | Gold gradient bg | 4.5:1 | CTA buttons |
| `#D4AF37` | `#1A1C1B` (dark sections) | 4.5:1 | Gold on dark |

Use `preview_inspect` to get actual computed colors, then calculate contrast ratios.

### 5. Spacing & layout check
- Verify section padding is consistent (88-96px vertical)
- Check max-width containers (1200px or 1440px)
- Verify responsive grid breakpoints (640px for 3-col, 768px for cards, 1024px for hero 2-col)

### 6. Typography hierarchy
Inspect and list all heading sizes to verify descending scale:
- h1 (hero): clamp(2.4rem, 5vw, 3.6rem), weight 800
- h2 (sections): clamp(1.8rem, 3.5vw, 2.6rem), weight 800
- h3 (cards): 16px, weight 700

### 7. Responsive spot-check
Resize to mobile (375x812) and tablet (768x1024), screenshot each, flag any overflow or broken layout.

### 8. Console errors
Check `preview_console_logs(level: 'error')` for any runtime errors.

## Output format

Present findings as a structured table:

```markdown
## Design Audit: [page]

### Token Consistency
| Element | Expected | Actual | Status |
|---------|----------|--------|--------|

### Contrast (WCAG AA)
| Pair | Ratio | Required | Status |
|------|-------|----------|--------|

### Issues Found
| Issue | Severity | Location | Fix |
|-------|----------|----------|-----|

### Screenshots
[Attach key screenshots showing issues or confirming correctness]
```
