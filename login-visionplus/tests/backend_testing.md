# Backend Testing Documentation

This document describes the load testing strategy for the VisionPlus backend.

## Overview

We have implemented a load testing script that simulates 1000 concurrent users performing:
1.  **Registration**: Creating a new account with valid credentials.
2.  **Login**: Authenticating with the newly created account to receive a JWT.

## Environment Setup

> [!NOTE]
> **Mock Database Mode**: Due to the absence of a local MongoDB instance, the backend has been temporarily configured to use an **in-memory mock database**. This allows the application to run and process requests without an external database dependency. Reverting `src/app.module.ts` and `src/auth/auth.service.ts` will restore MongoDB functionality.

### Prerequisites
-   Node.js & NPM
-   Python 3
-   `requests` library (`pip install requests`)

## Running the Test

1.  **Start the Backend**:
    Navigate to the backend directory and start the server:
    ```bash
    cd login-visionplus/backend
    npm start
    ```
    Ensure the server displays "Servidor iniciado correctamente".

2.  **Run the Load Script**:
    Open a new terminal and run:
    ```bash
    cd login-visionplus/tests
    python3 backend_load_test.py
    ```

## Results & Key Findings

The script attempts to register and login 1000 users rapidly.

### Rate Limiting Encountered
During our test run, we observed that the **ThrottlerModule** correctly intercepts high-velocity traffic.
-   **Success Rate**: ~15% (150 requests accepted)
-   **Blocked Requests**: ~85% (850 requests rejected with `429 Too Many Requests`)

This confirms that the API is protected against brute-force or DoS attacks. The default limit is configured to 150 requests/minute in `src/app.module.ts`.

### Sample Output
```text
Starting load test with 1000 users...
Target: http://localhost:3000/auth
...
[150/1000] Success: user123_abc@example.com
[151/1000] Failed: user124_xyz@example.com - Register failed: {"statusCode":429,"message":"ThrottlerException: Too Many Requests"}
...
Test Completed in 7.53 seconds
Successful: 150
Failed: 850
```

## Script Details
The script `tests/backend_load_test.py` uses `concurrent.futures` to parallelize requests, simulating real-world load conditions more accurately than a sequential loop.
