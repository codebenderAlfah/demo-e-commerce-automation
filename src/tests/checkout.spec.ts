import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import users from '../fixtures/users.json';

test.describe('Checkout Flow (End-to-End)', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);

        await loginPage.load();
        await loginPage.login(users.standardUser);
    });

    test('Complete a full purchase with valid details', async ({ page }) => {
        await inventoryPage.addFirstAvailableItemToCart();
        await inventoryPage.goToCart();
        await cartPage.clickCheckout();
        await checkoutPage.fillInformation('John', 'Doe', '12345');
        await checkoutPage.completeOrder();
        await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    });

});