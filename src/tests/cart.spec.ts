import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import users from '../fixtures/users.json';

test.describe('Shopping Cart Scenarios', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);

        await loginPage.load();
        await loginPage.login(users.standardUser);
    });

    test('Add a single item and verify cart badge updates', async () => {
        expect(await inventoryPage.getCartBadgeCount()).toBe(0);
        await inventoryPage.addFirstAvailableItemToCart();
        expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    });

    test('Add multiple items and verify all appear in cart', async () => {
        await inventoryPage.addFirstAvailableItemToCart();
        await inventoryPage.addFirstAvailableItemToCart();
        await inventoryPage.addFirstAvailableItemToCart();

        expect(await inventoryPage.getCartBadgeCount()).toBe(3);

        await inventoryPage.goToCart();

        expect(await cartPage.getCartItemCount()).toBe(3);
    });

    test('Remove an item from the cart and verify cart state', async () => {
        await inventoryPage.addFirstAvailableItemToCart();
        await inventoryPage.addFirstAvailableItemToCart();
        await inventoryPage.goToCart();

        expect(await cartPage.getCartItemCount()).toBe(2);

        await cartPage.removeFirstItem();

        expect(await cartPage.getCartItemCount()).toBe(1);
        expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    });

    test('Cart persists across page navigation and reloads', async ({ page }) => {
        await inventoryPage.addFirstAvailableItemToCart();
        expect(await inventoryPage.getCartBadgeCount()).toBe(1);

        await inventoryPage.goToCart();
        expect(await cartPage.getCartItemCount()).toBe(1);

        await page.reload();

        expect(await cartPage.getCartItemCount()).toBe(1);
        expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    });
});