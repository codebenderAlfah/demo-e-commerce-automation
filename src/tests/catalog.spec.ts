import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import users from '../fixtures/users.json';

test.describe('Product Catalog Scenarios', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        await loginPage.load();
    });

    test('Product listing loads correctly', async () => {
        await loginPage.login(users.standardUser);

        const count = await inventoryPage.getProductCount();
        expect(count).toBe(6);

        const names = await inventoryPage.getProductNames();
        expect(names.length).toBe(6);
        names.forEach(name => expect(name.length).toBeGreaterThan(0));

        const prices = await inventoryPage.getProductPrices();
        expect(prices.length).toBe(6);
        prices.forEach(price => expect(price).toBeGreaterThan(0));
    });

    const sortOptions =[
        { option: 'az', desc: 'Name A to Z', isNumeric: false, reverse: false },
        { option: 'za', desc: 'Name Z to A', isNumeric: false, reverse: true },
        { option: 'lohi', desc: 'Price Low to High', isNumeric: true, reverse: false },
        { option: 'hilo', desc: 'Price High to Low', isNumeric: true, reverse: true },
    ];

    for (const { option, desc, isNumeric, reverse } of sortOptions) {
        test(`Sorting by: ${desc}`, async () => {
            await loginPage.login(users.standardUser);
            await inventoryPage.sortProducts(option);

            if (isNumeric) {
                const prices = await inventoryPage.getProductPrices();
                const expectedPrices = [...prices].sort((a, b) => reverse ? b - a : a - b);
                expect(prices).toEqual(expectedPrices);
            } else {
                const names = await inventoryPage.getProductNames();
                const expectedNames = [...names].sort((a, b) => reverse ? b.localeCompare(a) : a.localeCompare(b));
                expect(names).toEqual(expectedNames);
            }
        });
    }

    test('problem_user visual regression - detects broken/mismatched images', async () => {
        test.fail(true, 'Expected to fail because problem_user loads broken duplicate images');

        await loginPage.login(users.problemUser);
        const imageSrcs = await inventoryPage.getProductImageSrcs();
        const uniqueImages = new Set(imageSrcs);

        expect(uniqueImages.size, 'Expected all products to have unique images').toBe(imageSrcs.length);
    });
});