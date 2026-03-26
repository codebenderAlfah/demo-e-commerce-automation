import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateTo(path: string) {
        await this.page.goto(path);
    }

    async clickElement(locator: Locator) {
        await locator.waitFor({ state: 'visible' });
        await locator.click();
    }

    async fillText(locator: Locator, text: string) {
        await locator.waitFor({ state: 'visible' });
        await locator.fill(text);
    }
}