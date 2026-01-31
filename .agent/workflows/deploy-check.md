---
description: Steps to verify the build and code quality before pushing to GitHub to ensure a successful Vercel deployment.
---

# Pre-Commit Deployment Checklist

Follow these steps before every `git push` to ensure the production build doesn't fail.

### 1. Run Local Build Check
Execute the Next.js build locally to catch any TypeScript or ESLint errors that would break the Vercel deployment.
// turbo
```bash
npm run build
```
*If this fails, you MUST fix the errors before pushing.*

### 2. Check for "Explicit Any"
Vercel is configured to fail on `any` types. Search the codebase for `any` if the build failed due to `@typescript-eslint/no-explicit-any`.

### 3. Check for Unused Variables
Unused imports or variables will cause build warnings that may be treated as errors. 
- Look for greyed-out imports in your IDE.
- Verify that every `const` and `useState` is actually used in the component logic or JSX.

### 4. Check for Unescaped Entities (`react/no-unescaped-entities`)
JSX will fail on unescaped characters like `"`, `'`, `>`, or `}`.
- Replace `"` with `&quot;`
- Replace `'` with `&apos;`
- **Common Locations:** Blog posts, long copy sections.

### 5. Check for Server/Client Conflicts
- **Metadata Export:** You CANNOT export `metadata` from a file marked `"use client"`.
- If a page needs metadata AND client interactivity:
  - Keep the `page.tsx` as a Server Component (no `"use client"`).
  - Move the interactive parts (buttons, forms) into a separate component (e.g., `components/signup-trigger.tsx`) and mark *that* component as `"use client"`.

### 6. Verify Legal & Compliance (RentClock Specific)
Before final deployment for Paddle verification, ensure:
- [ ] Refund Policy is set to **14 days**.
- [ ] Support email `support@rentclock.online` is in the footer.
- [ ] Legal entity (Martin Vasko) and IČO are in the footer.

### 7. Final Push
Once `npm run build` passes with zero errors:
```bash
git add .
git commit -m "Your descriptive message"
git push
```
