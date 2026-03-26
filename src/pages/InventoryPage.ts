import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
    readonly burgerMenuButton: Locator;
    readonly logoutLink: Locator;

    readonly inventoryItems: Locator;
    readonly itemNames: Locator;
    readonly itemPrices: Locator;
    readonly itemImages: Locator;
    readonly sortDropdown: Locator;

    constructor(page: Page) {
        super(page);
        this.burgerMenuButton = page.locator('#react-burger-menu-btn');
        this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');

        this.inventoryItems = page.locator('.inventory_item');
        this.itemNames = page.locator('.inventory_item_name');
        this.itemPrices = page.locator('.inventory_item_price');
        this.itemImages = page.locator('img.inventory_item_img');
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    }

    async logout() {
        await this.clickElement(this.burgerMenuButton);
        await this.clickElement(this.logoutLink);
    }


    async getProductCount(): Promise<number> {
        return await this.inventoryItems.count();
    }

    async getProductNames(): Promise<string[]> {
        return await this.itemNames.allInnerTexts();
    }

    async getProductPrices(): Promise<number[]> {
        const priceTexts = await this.itemPrices.allInnerTexts();
        return priceTexts.map(text => parseFloat(text.replace('$', '')));
    }

    async sortProducts(option: string) {
        await this.sortDropdown.selectOption(option);
    }

    async getProductImageSrcs(): Promise<string[]> {
        const count = await this.itemImages.count();
        const srcs: string[] =[];
        for (let i = 0; i < count; i++) {
            const src = await this.itemImages.nth(i).getAttribute('src');
            if (src) srcs.push(src);
        }
        return srcs;
    }
}