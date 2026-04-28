---
name: price-update
description: Run the price scraper to update material prices from hardware stores (Leroy Merlin, Castorama, Brico Depot). Use this when the user wants to refresh prices, update the price database, check current prices, or says things like "mets a jour les prix", "scrape les prix", "prix actuels", "refresh prices", "update store data".
---

# /price-update [store]

Scrape and update material prices from French hardware stores.

## Arguments

- `store` (optional): `leroymerlin`, `castorama`, `bricodepot`, or `all`. Defaults to `all`.

## Procedure

### 1. Check backend infrastructure

Read the backend directory structure to understand the scraping setup:
- `backend/` — check for existing scraper scripts
- `database/` — check for price storage (JSON, SQLite, etc.)

### 2. Run scraper

If scraper scripts exist in `backend/`:
```bash
cd /Users/pelo/Downloads/diy-builder-scraper3/backend
node scraper.js --store [store]
```

If no scraper exists, inform the user and offer to create one. The scraper should:
- Target the 3 stores: Leroy Merlin, Castorama, Brico Depot
- Scrape prices for key materials: lames terrasse, lambourdes, plots, montants, bardage, chevrons, vis
- Respect rate limits and robots.txt
- Save to `database/prices.json` with timestamp

### 3. Validate results

After scraping:
- Compare new prices with previous data (if exists)
- Flag any price that changed by more than 20% (likely error)
- Flag any missing products
- Show summary of price changes

### 4. Report

```markdown
## Price Update: [date]

### Summary
| Store | Products scraped | Errors | Last update |
|-------|-----------------|--------|-------------|

### Price changes (> 5%)
| Product | Store | Old price | New price | Change |
|---------|-------|-----------|-----------|--------|

### Errors
[List any products that couldn't be scraped]
```

### 5. Invalidate cache

If the frontend has any price caching mechanism, clear it:
```bash
# Clear Next.js cache
rm -rf frontend/.next/cache
```

Inform the user to restart the dev server if needed.
