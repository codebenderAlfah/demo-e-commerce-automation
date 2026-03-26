import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
    readonly cartItems: Locator;
    readonly removeButtons: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        super(page);
        this.cartItems = page.locator('.cart_item');
        // Matches any button where data-test starts with "remove-"
        this.removeButtons = page.locator('[data-test^="remove-"]');
        this.checkoutButton = page.locator('[data-test="checkout"]');
    }

    async getCartItemCount(): Promise<number> {
        return await this.cartItems.count();
    }

    async removeFirstItem() {
        await this.clickElement(this.removeButtons.first());
    }

    async clickCheckout() {
        await this.clickElement(this.checkoutButton);
    }
}