# Changelog

## Overview

This document outlines the changes made during the Vue Supabase Skills Test.

---

## Features

-   **Registration Page**  
    Added a registration page that allows users to create a new account and displays their full name and email on the dashboard upon login.

-   **Password Visibility Icon**  
    Added an icon to toggle password visibility for better UX during registration and login.

-   **Profile Creation**  
    Profiles are now created as part of the registration process.

-   **Forgot Password Functionality**  
    Implemented a forgot password flow but with dummy actions

---

## Code Improvements

-   **Separated Logic into Composables**  
    Separated the registration and login logic into reusable composables to improve maintainability and separation of concerns.

-   **Created Reusable Composables and Utils**

    -   `useLoading`: A composable for handling loading states across various components.
    -   `getErrorMessage`: A function for consistent error handling.
    -   `delay`: A function for adding delays in workflows (useful for debounce, animations, etc.).

-   **Use of Try-Catch for Registration and Login**  
    Wrapped registration and login processes in try-catch blocks to handle potential and unexpected errors gracefully.

-   **Use of VeeValidate + Zod for Validation**  
    Added `vee-validate` and `zod` for form validation to improve the user experience by catching errors early.

---

## Testing

-   **End-to-End (E2E) Tests**  
    Added E2E tests to cover the following workflows:

    -   Registration
    -   Login

-   **Unit Tests**  
    Added unit tests to cover the following components and composables:
    -   Dashboard
    -   ExamplePage
    -   `useLoading` composable
    -   Auth layout

---

## UI/UX Improvements

-   Improved the user flow of login and registration by adding appropriate links to navigate between each
-   Added client-side form validation
-   Enhanced the password input with a visibility toggle to improve accessibility and usability.

## Conclusion

The changes made address the key goals outlined in the task, with improvements to both functionality and maintainability. Testing coverage has been added where appropriate to ensure the application is stable and works as expected.
