---
description: Steps to verify the build and Cloudflare Pages compatibility before pushing to GitHub.
---

# Pre-Commit Deployment Checklist (Cloudflare Edition)

Follow these steps before every `git push` to ensure the production build doesn't fail on Cloudflare Pages.

### 1. Run Standard Local Build
Execute the Next.js build locally to catch general TypeScript or ESLint errors.
// turbo
```bash
npm run build
```
*If this fails, you MUST fix the errors before proceeding.*

### 2. Run Cloudflare Simulation
This is the most critical step. It verifies that your code actually works in the Cloudflare Edge Runtime.
// turbo
```bash
npx @cloudflare/next-on-pages
```
*Look for errors related to Node.js built-ins. If you see "Module not found: node:..." or similar, you must either use the Edge version of the library OR ensure `nodejs_compat` is enabled in `wrangler.toml`.*

### 3. Check for "Explicit Any" & Unused Variables
Cloudflare's build process is strict.
- Search for `: any` or `as any`.
- Verify no unused imports (greyed out in IDE).

### 4. Check for Unescaped Entities (`react/no-unescaped-entities`)
Cloudflare will fail on unescaped characters like `"`, `'`, `>`, or `}`.
- Replace `"` with `&quot;`
- Replace `'` with `&apos;`

### 5. Runtime Verification
Check your modified files for:
- `export const runtime = 'edge'` (Use for API routes where possible).
- Ensure no Browser APIs (like `window` or `document`) are used in Server Components.

### 6. Legal & Compliance (RentClock Specific)
- [ ] Refund Policy is set to **14 days**.
- [ ] Support email `support@rentclock.online` is in the footer.
- [ ] Legal entity (Martin Vasko) and IČO are in the footer.

### 7. Final Push
Once BOTH `npm run build` and `next-on-pages` pass:
```bash
git add .
git commit -m "Your descriptive message"
git push
```
