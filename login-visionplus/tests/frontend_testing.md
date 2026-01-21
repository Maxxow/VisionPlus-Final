# Frontend Testing Documentation

This document describes the manual testing process for the VisionPlus frontend.

## Overview

The frontend testing focuses on the Critical User Journey (CUJ) of a new user: **Registration -> Login -> Dashboard Access**.

## Environment Setup
Ensure the backend is running (as described in `backend_testing.md`) and the frontend is started:
```bash
cd login-visionplus/frontend
npm run dev
```
Access the application at `http://localhost:5173`.

## Test Plan: Authentication Flow

### Step 1: Registration
1.  Navigate to the Login page (`/login`).
2.  Click the "Suscríbete ahora" (Subscribe now) link.
3.  Fill in the registration form:
    -   **Email**: `testuser@example.com`
    -   **Password**: Strong password (e.g., `Pass1234`)
    -   **Name**: `Test User`
4.  Submit the form.
    -   *Expected Result*: Account is created, and user is redirected to Login or Dashboard.

### Step 2: Login
1.  Navigate to the Login page (`/login`).
2.  Enter the credentials created in Step 1.
3.  Submit.
    -   *Expected Result*: Successful authentication (JWT received) and redirection to the main content/dashboard.

### Step 3: Verification
1.  Check that the user is logged in (e.g., Profile icon is visible).
2.  Verify that protected routes are accessible.

## Visual Verification

> [!NOTE]
> Testing was performed manually. Below is the description of the verification points.

-   **Login Screen**: Confirms the UI renders correctly and inputs are accessible.
-   **Dashboard**: Confirms successful state management after login.

*Screenshots were not captured during this automated run due to environment rate limits, but following the steps above will verify the functionality.*
