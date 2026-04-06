---
description: verify the project's build and health status
---

# Workflow: Project Verification

Use this workflow to ensure the project continues to compile correctly and adheres to coding standards after making
changes.

1. **Run Linter**:

    - Execute the lint script to catch Next.js and ESLint errors.
    - Run command: `pnpm lint`

2. **Check Typing**:

    - Ensure the TypeScript compiler passes without errors across the codebase.
    - Run command: `pnpm tsc --noEmit`

3. **Test Build**:
    - Run the production build to compile the application and ensure the `.next` output generates without errors. This
      is crucial for verifying Server/Client component boundaries.
    - Run command: `pnpm build`
