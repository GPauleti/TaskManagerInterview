# Task Manager

A simple task management application built with **Next.js**, **TypeScript**, and **tRPC**.

The project focuses on clarity, correctness, and modern full-stack patterns rather than visual complexity.

---

## 📌 Main Technical Decisions & Reasoning

### 1. Next.js App Router + TypeScript
- Chosen to align with modern Next.js best practices.
- The App Router enables Server Components and Server-Side Rendering (SSR) by default.
- TypeScript provides end-to-end type safety, improving reliability and maintainability.

---

### 2. tRPC for Backend Communication
- Used to expose backend procedures directly to the frontend without REST endpoints.
- Eliminates API schema duplication by sharing types between frontend and backend.
- Reduces runtime errors and improves developer experience.

---

### 3. In-Memory Data Store
- Tasks are stored in memory using an array-based store.
- Keeps the solution simple and focused on application logic.
- Tradeoff: data is reset when the server restarts.

---

### 4. Server-Side Rendering (SSR) for Initial Load
- The initial task list is server-rendered.
- Ensures tasks are visible immediately on page load.
- Improves perceived performance and user experience.

---

### 5. Infinite Scrolling with Cursor-Based Pagination
- Tasks are loaded incrementally using a cursor-based pagination strategy.
- Prevents loading all tasks at once and improves scalability.
- Cursor pagination is easier to extend and reason about than page-number pagination.

---

### 6. Input Sanitization
- Sanitizing input to prevent JSON scripts.
- SQL Injection was not treated as the information lives in memory not in a DB.
- Took the conservative option of cleaning out any and all HTML tags to prevent any sort of injection.

---

### 7. Component Separation
- UI is split into focused components:
  - `TaskForm` for creating and editing tasks
  - `TaskList` for displaying tasks and handling infinite scroll
- Improves readability, reusability, and maintainability.

---

## ✨ Application Features

- Create tasks with:
  - Random UUID
  - Title (required)
  - Optional description
  - Creation timestamp
- Edit existing tasks
- Delete tasks with confirmation
- Infinite scrolling task list
- Optimistic UI updates
- Form validation and error handling
- Clean, minimal UI with icon-based actions
- Tooltips for edit and delete actions
- Server-side rendering for initial task load

---

## 🚀 Running the Application Locally

### Prerequisites
- Node.js (v18 or newer recommended)
- npm

### Steps

```bash
npm install
npm run dev
``` 

Then open:

http://localhost:3000
