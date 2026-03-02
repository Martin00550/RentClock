---
description: Steps to verify the build and Netlify compatibility before pushing to GitHub.
---

# Pre-Commit Deployment Checklist (Netlify Edition)

Follow these steps before every `git push` to ensure the production build doesn't fail on Netlify.

### 1. Run Standard Local Build
Execute the Next.js build locally to catch general TypeScript or ESLint errors.
// turbo
```bash
npm run build
```
*If this fails, you MUST fix the errors before proceeding.*

### 2. Run Netlify Build Simulation
If you have the Netlify CLI installed, you can simulate the build environment locally.
// turbo
```bash
npx netlify build
```
*Look for any environment variable issues or build-time errors.*

### 3. Check for "Explicit Any" & Unused Variables
- Search for `: any` or `as any`.
- Verify no unused imports (greyed out in IDE).

### 4. Check for Unescaped Entities (`react/no-unescaped-entities`)
- Replace `"` with `&quot;`
- Replace `'` with `&apos;`

### 5. Legal & Compliance (RentClock Specific)
- [ ] Refund Policy is set to **14 days**.
- [ ] Support email `support@rentclock.online` is in the footer.
- [ ] Legal entity (Martin Vasko) and IČO are in the footer.

### 6. Final Push
Once the build passes:
```bash
git add .
git commit -m "Your descriptive message"
git push
```
