import {test, expect} from '@playwright/test';
import {faker} from "@faker-js/faker";

test.describe('Auth Page', async () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/');
    });
    test('Login form', async ({page}, testInfo) => {
        await expect(page).toHaveTitle(/Click2Eat/);
        await testInfo.attach("001_auth_login", {
            body: await page.screenshot(),
            contentType: 'image/png',
        });
        const userInput = page.getByPlaceholder('Nombre de usuario')
        await expect(userInput).toBeVisible();
        let passInput = page.getByPlaceholder('Contraseña');
        await expect(passInput).toBeVisible();
        await userInput.fill(faker.internet.userName());
        await passInput.fill(faker.internet.password());
        await testInfo.attach("001_auth_login_filled", {
            body: await page.screenshot(),
            contentType: 'image/png',
        });
    });
    test('Register form', async ({page}, testInfo) => {
        await expect(page.getByRole('link', {name: 'Registrate'})).toBeVisible();
        await page.getByRole('link', {name: 'Registrate'}).click();
        await testInfo.attach("002_auth_register", {
            body: await page.screenshot(),
            contentType: 'image/png',
        });
        await expect(page.getByRole('button', {name: 'Atrás'})).toBeDisabled();
        await expect(page.getByRole('button', {name: 'Siguiente'})).toBeVisible();
        const password = faker.internet.password();
        await page.getByPlaceholder('Nombre empresa').fill(faker.company.name());
        await page.getByPlaceholder('NIF').fill(faker.string.uuid().slice(0, 9).replace('-', ''));
        await page.getByPlaceholder('Dirección').fill(faker.location.streetAddress());
        await page.getByPlaceholder('Código postal').fill(faker.location.zipCode());
        await page.getByPlaceholder('Provincia').fill(faker.location.state());
        await page.getByPlaceholder('Localidad').fill(faker.location.city());
        await page.getByPlaceholder('País').fill(faker.location.country());
        await page.getByRole('button', {name: 'Siguiente'}).click();
        await expect(page.getByRole('button', {name: 'Siguiente'})).toBeDisabled();
        await expect(page.getByRole('button', {name: 'Registrarse'})).toBeVisible();
        await page.getByPlaceholder('Nombre', {exact: true}).fill(faker.person.firstName());
        await page.getByPlaceholder('Apellido').fill(faker.person.lastName());
        await page.getByPlaceholder('Nombre usuario').fill(faker.internet.userName());
        await page.getByPlaceholder('Correo electrónico').fill(faker.internet.email());
        await page.getByPlaceholder('Contraseña', {exact: true}).fill(password);
        await page.getByPlaceholder('Confirmar contraseña').fill(password);
        await testInfo.attach("002_auth_register_filled", {
            body: await page.screenshot(),
            contentType: 'image/png',
        });
    });
});
