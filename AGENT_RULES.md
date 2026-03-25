# Agent Rules for my-portfolio

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Animations**: Framer Motion
- **UI Base**: Radix UI Primitives

## Architectural Rules

1. **Server-First Approach**: Default to Next.js Server Components. Only use the `"use client"` directive when
   absolutely necessary for interactivity (e.g., event listeners, hooks like `useState` or `useEffect`, or Framer Motion
   animations).
2. **Type Safety**: Strictly adhere to TypeScript typings. Avoid using `any`.

## Component & Styling Standard

1. **Class Management**: Use the `cn()` utility function (combining `clsx` and `tailwind-merge`) to conditionally join
   Tailwind utility classes.
2. **Tailwind v4 Considerations**: Note that Tailwind v4 relies on CSS variables for its configuration rather than
   `tailwind.config.js`. Ensure that when using `tailwind-merge` and `cva`, you account for any custom CSS variables you
   declare in your globals.
3. **Variants**: Use `class-variance-authority` (`cva`) to build robust UI component variants.
4. **Icons**: Use `lucide-react` for all icons.

## File Naming & Organization

1. **Classification Step**: Always classify components before creation. Determine whether the component is a generic UI
   building block or a complex feature.
2. **Directory Placement**:
    - Place standard **UI components** (e.g., Buttons, Inputs) inside `components/ui/`.
    - Place **Feature components** (e.g., ProjectCard, ContactForm) inside `components/features/` or specific section
      folders like `app/_sections/`.
3. **Data Logging**: All mock or static data should remain inside `app/_data/`.
