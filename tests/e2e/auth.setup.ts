import {test as setup, expect} from '@playwright/test'
import {config} from "dotenv";

config()
const authFile = 'var/session.json';
setup('auth', async ({page}, testInfo) => {
    await page.goto('/');
    const userInput = page.getByPlaceholder('Nombre de usuario');
    await expect(userInput).toBeVisible();
    let passInput = page.getByPlaceholder('Contraseña');
    await expect(passInput).toBeVisible();
    await userInput.fill(process.env.TEST_USERNAME);
    await passInput.fill(process.env.TEST_PASSWORD);
    await testInfo.attach('Auth Setup Dev User', {
        body: await page.screenshot(),
        contentType: 'image/png',
    });
    await page.context().storageState({path: authFile});
});