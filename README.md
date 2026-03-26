# demo-e-commerce-automation

## 1. Framework Choice & Rationale
**Stack:** Playwright with TypeScript.
* **Why Playwright?** Native auto-waiting capabilities (crucial for handling scenarios like the `performance_glitch_user` without hardcoded `Thread.sleep`), built-in parallel execution, and out-of-the-box HTML reporting.
* **Why TypeScript?** Provides strict type safety, better IDE autocomplete, and highly maintainable self-documenting code.
* **Alternatives Considered:** Cypress was considered, but Playwright was chosen for its superior handling of multiple tabs/origins (if needed in the future) and faster execution times for WebKit/Firefox.

## 2. Architecture Overview
This framework applies **SOLID** and **DRY** principles, built around a robust Page Object Model (POM):
* `src/pages/BasePage.ts`: Encapsulates shared Playwright actions (clicks, waits, fills) to ensure a single point of maintenance for UI interactions.
* `src/pages/*`: Specific page objects (Login, Inventory, Cart, Checkout) inherit from `BasePage`.
* `src/fixtures/`: Test data (users) is extracted into JSON files to separate data from logic.
* `playwright.config.ts`: Environment-aware configuration loading `.env` securely.

## 3. Setup & Run Instructions

### Prerequisites
* Node.js (v18 or higher)
* Git

### Local Setup
1. Clone the repository: `git clone <repo-url>`
2. Install dependencies: `npm install`
3. Set up environment variables:
    * Copy the example config: `.env.example`
    * Ensure `BASE_URL` and `VALID_PASSWORD` are populated in the `.env` file.
4. Install Playwright browsers: `npx playwright install chromium`

### Execution
* **Run all tests:** `npx playwright test`
* **View HTML Report:** `npx playwright show-report`
* **Run tests with UI mode:** `npx playwright test --ui`

## 4. CI/CD Pipeline
The framework integrates with **GitHub Actions**.
* The pipeline triggers automatically on `push` and `pull_request` to the `main` branch.
* It securely injects `BASE_URL` and `VALID_PASSWORD` via GitHub Repository Secrets.
* **Test Artifacts:** Upon failure or completion, an HTML report containing traces and screenshots is published as an artifact. To view it, go to the "Actions" tab in GitHub, click the latest run, and download the `playwright-report.zip` at the bottom of the page.

## 5. Test Coverage Summary

**What is covered:**
* **Authentication:** Valid logins, negative scenarios (invalid credentials, SQL injection attempts), locked-out users, and session persistence (verified via hard reloads).
* **Product Catalog:** Parameterized array-based sorting verifications and a targeted visual regression test detecting broken duplicate images for the `problem_user`.
* **Shopping Cart:** Dynamic addition/removal of items, cart badge count verification, and UI state persistence across navigation.
* **Checkout:** The E2E happy path verifying a completed purchase.

**Intentionally Excluded (Next Iteration):**
* *Mathematical Tax Verification (2.4):* Skipped to meet the deadline.
* *Missing Checkout Fields (2.4):* Happy path prioritized.
* *Error/Glitch users (2.5):* Specific test blocks were omitted. However, the `performance_glitch_user` is already natively supported by the framework architecture via `BasePage.ts` leveraging Playwright's `waitFor({ state: 'visible' })` instead of brittle thread sleeps.