---
description: generate a new UI or Feature Component
---

# Workflow: Generate Component

When tasked with generating a new component for this project, you must follow these steps strictly:

1. **Classify the Component**:

    - Ask yourself and the user: _Is this a reusable UI Component (e.g., Button, Input) or a Feature Component (e.g.,
      ProjectCard, ProfileSection)?_

2. **Determine File Location**:

    - If it's a **UI Component**, place it in `components/ui/`.
    - If it's a **Feature Component**, place it in `components/features/` or the relevant `app/_sections/` directory.

3. **Implement the Standard Stack**:

    - Style the component exclusively via **Tailwind CSS v4** utility classes.
    - Use `cva` from `class-variance-authority` to define structured design variants.
    - Combine dynamic classes using the `cn()` utility (wrapper for `clsx` and `tailwind-merge`).
    - If you need icons, import them from `lucide-react`.
    - Add **Framer Motion** (`motion.div`, etc.) if animations are required, ensuring the file begins with
      `"use client"`.

4. **Write Strict TypeScript**:

    - Define all props using `interface` or `type`.
    - Do not use `any`.

5. **Review**:
    - Make sure It adheres to the Server-First rule (unless interactivity/animation requires client-side execution).
