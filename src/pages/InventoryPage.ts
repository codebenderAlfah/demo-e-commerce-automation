import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
    readonly burgerMenuButton: Locator;
    readonly logoutLink: Locator;

    constructor(page: Page) {
        super(page);
        this.burgerMenuButton = page.locator('#react-burger-menu-btn');
        this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    }

    async logout() {
        await this.clickElement(this.burgerMenuButton);
        await this.clickElement(this.logoutLink);
    }
}