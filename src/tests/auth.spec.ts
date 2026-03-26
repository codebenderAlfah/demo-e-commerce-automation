import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import users from '../fixtures/users.json';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Authentication Scenarios', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.load();
    });

    test('Successful login with valid credentials', async ({ page }) => {
        await loginPage.login(users.standardUser);

        await expect(page).toHaveURL(/.*inventory.html/);
    });

    test('Login failure with wrong password', async () => {
        await loginPage.login(users.standardUser, 'wrong_password');
        const error = await loginPage.getErrorMessage();
        expect(error).toContain('Username and password do not match');
    });

    test('Login failure with empty fields', async () => {
        await loginPage.login('', '');
        const error = await loginPage.getErrorMessage();
        expect(error).toContain('Username is required');
    });

    test('Login failure with SQL injection attempt in username', async () => {
        await loginPage.login("' OR '1'='1", "' OR '1'='1");
        const error = await loginPage.getErrorMessage();
        expect(error).toContain('Username and password do not match');
    });

    test('Locked-out user behaviour', async () => {
        await loginPage.login(users.lockedOutUser);
        const error = await loginPage.getErrorMessage();
        expect(error).toContain('Sorry, this user has been locked out.');
    });

    test('Session persistence and logout behaviour', async ({ page }) => {
        await loginPage.login(users.standardUser);
        await expect(page).toHaveURL(/.*inventory.html/);

        await page.reload();
        await expect(page).toHaveURL(/.*inventory.html/);

        const inventoryPage = new InventoryPage(page);
        await inventoryPage.logout();

        await expect(page.locator('[data-test="login-button"]')).toBeVisible();

        await page.goto('/inventory.html');
        const error = await loginPage.getErrorMessage();
        expect(error).toContain("You can only access '/inventory.html' when you are logged in.");
    });
});