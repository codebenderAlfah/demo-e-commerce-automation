import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly finishButton: Locator;
    readonly completeHeader: Locator;

    constructor(page: Page) {
        super(page);
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.completeHeader = page.locator('.complete-header');
    }

    async fillInformation(firstName: string, lastName: string, zip: string) {
        await this.fillText(this.firstNameInput, firstName);
        await this.fillText(this.lastNameInput, lastName);
        await this.fillText(this.postalCodeInput, zip);
        await this.clickElement(this.continueButton);
    }

    async completeOrder() {
        await this.clickElement(this.finishButton);
    }
}