import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorMessage = page.locator('[data-test="error"]'); // <-- Added this
    }

    async load() {
        await this.navigateTo('/');
    }

    async login(username: string, password?: string) {
        const pass = password ?? process.env.VALID_PASSWORD ?? '';
        await this.fillText(this.usernameInput, username);
        await this.fillText(this.passwordInput, pass);
        await this.clickElement(this.loginButton);
    }

    async getErrorMessage(): Promise<string> {
        await this.errorMessage.waitFor({ state: 'visible' });
        return await this.errorMessage.innerText();
    }
}