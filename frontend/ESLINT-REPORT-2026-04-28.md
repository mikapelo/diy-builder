# ESLint Installation Report — DIY Builder Frontend
**Date:** 2026-04-28  
**Status:** ✅ Installation Complete

---

## Installation Summary

| Component | Version | Status |
|-----------|---------|--------|
| **eslint** | 9.39.4 | ✅ Installed |
| **eslint-config-next** | 16.2.4 | ✅ Installed |
| **Config Format** | eslint.config.js (v9) | ✅ Active |

**Package.json:** Updated with both packages as devDependencies.

---

## Lint Report Results

### Overall Statistics
- **Total Errors:** 273 (critical path blockers)
- **Total Warnings:** 49 (quality improvements)
- **Files Affected:** 40 out of ~200+ files (20%)
- **Files Clean:** ~160+ files (80%)

### Top 5 Rules Violated

| Rank | Rule | Count | Severity | Primary Cause |
|------|------|-------|----------|---------------|
| 1 | `react/no-unescaped-entities` | 256 | ERROR | HTML entities (–, —, ©, ') in JSX strings without `{` escaping |
| 2 | `react-hooks/exhaustive-deps` | 22 | WARNING | Missing dependencies in useEffect/useCallback dependency arrays |
| 3 | `@next/next/no-html-link-for-pages` | 12 | WARNING | Using `<a>` instead of `<Link>` for internal navigation |
| 4 | `@next/next/no-img-element` | 10 | WARNING | Using `<img>` instead of `<Image>` component |
| 5 | `react-hooks/set-state-in-effect` | 8 | ERROR | setState directly in useEffect without proper cleanup |

---

### Top 10 Files Most Impacted

| File | Errors | Warnings | Total | Type |
|------|--------|----------|-------|------|
| app/guides/cabanon/page.jsx | 65 | 1 | 66 | PAGE |
| app/guides/terrasse/page.jsx | 54 | 1 | 55 | PAGE |
| app/guides/cloture/page.jsx | 52 | 1 | 53 | PAGE |
| app/guides/pergola/page.jsx | 34 | 1 | 35 | PAGE |
| app/cgv/page.jsx | 25 | 1 | 26 | PAGE |
| app/mentions-legales/page.jsx | 8 | 1 | 9 | PAGE |
| app/politique-confidentialite/page.jsx | 4 | 1 | 5 | PAGE |
| components/simulator/CabanonScene/WallsGroup.jsx | 0 | 5 | 5 | COMPONENT |
| app/HomeClient.jsx | 4 | 0 | 4 | COMPONENT |
| app/cookies/page.jsx | 3 | 1 | 4 | PAGE |

---

## Root Cause Analysis

### 1. Unescaped Entities (256 errors) — **HIGH PRIORITY**
**Problem:** HTML entities (–, —, ©, ', ") used directly in JSX strings.  
**Locations:** Primarily in guide pages + HomeClient.jsx  
**Quick Fix:** Replace with escaped versions:
- `–` → `{'–'}` or `&ndash;` in string literals
- `—` → `{'—'}` or `&mdash;`
- `'` → `{'’'}` or use double quotes
- `©` → `{'©'}`

**Fix Effort:** ~30 minutes (bulk regex replacements)

### 2. Hook Dependencies (22 warnings) — **MEDIUM PRIORITY**
**Problem:** useEffect/useCallback missing dependencies (stability risk).  
**Locations:** FormulaireTerrasse.jsx, ArtisanLeadModal.jsx, etc.  
**Example:**
```js
useEffect(() => {
  doSomething(ref); // ref missing from deps array
}, []); // ❌ Should be [ref]
```

**Fix Effort:** ~1 hour (case-by-case review)

### 3. Next.js Navigation (12 warnings) — **LOW PRIORITY**
**Problem:** Using `<a>` tags instead of Next.js `<Link>` component.  
**Impact:** Loss of client-side prefetching optimization.  
**Fix Effort:** ~20 minutes (bulk find/replace)

### 4. Image Component (10 warnings) — **LOW PRIORITY**
**Problem:** Using `<img>` instead of Next.js `<Image>` component.  
**Impact:** Missing optimization (lazy loading, responsive sizing).  
**Fix Effort:** ~20 minutes

---

## Deployment Readiness

### Current Status: **NOT DEPLOYABLE** (273 errors block build)

### Blockers
1. **React ESLint enforcement** in `eslint-config-next` treats errors as hard failures
2. **256 unescaped entity errors** must be resolved before any CI/CD pipeline passes
3. **8 setState-in-effect errors** risk memory leaks and unstable behavior

### Remediation Path

| Phase | Task | Effort | Impact |
|-------|------|--------|--------|
| **Phase 1** | Fix unescaped entities (256) | 30 min | -94% errors |
| **Phase 2** | Fix hook dependencies (22) | 1 hr | -8% warnings |
| **Phase 3** | Fix setState in effect (8) | 30 min | Stability gains |
| **Phase 4** | Fix Next.js best practices (22) | 1 hr | Performance gains |
| **Total** | Complete remediation | ~3 hours | **0 errors, 0 warnings** |

---

## Recommended Actions

### For Lead/Stakeholder
- **Decision Required:** Accept auto-fix of unescaped entities (safe, no logic changes)?
- **Timeline:** 3-4 hours for manual review, or 30 minutes with auto-fix + spot-check

### For Development Team
1. **Enable ESLint in CI/CD** (add `npm run lint` to pre-merge checks)
2. **Fix Phase 1 (Unescaped Entities):** Highest ROI, removes 94% of errors
3. **Schedule Hook Audit:** Medium-term stability improvement
4. **Defer Image/Link:** Lower priority, can be parallel with other work

### Config Status
✅ ESLint v9 config properly set up in `eslint.config.js`  
✅ Next.js rules active (core-web-vitals + React plugins)  
✅ Ready for automated remediation or manual fixes

---

## Files Created/Modified

- ✅ `package.json` — eslint + eslint-config-next added
- ✅ `eslint.config.js` — New v9 config (flat config format)
- ✅ `.eslintrc.json` — Deprecated (v8 format), can be deleted
- ✅ `ESLINT-REPORT-2026-04-28.md` — This report

---

## Next Steps

1. **Review this report** with product/tech lead
2. **Decide on auto-fix approach** for Phase 1 (unescaped entities)
3. **Create a GitHub issue** or task to track remediation
4. **Integrate `npm run lint`** into CI/CD pipeline
5. **Schedule 1-hour session** to fix hook dependencies

---

**Report Generated:** 2026-04-28 13:50 UTC  
**ESLint Version:** 9.39.4 (latest flat config)  
**Config Type:** eslint.config.js (ESLint v9+)
