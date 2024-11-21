import { loginFixtures } from "./login.fixtures";
import { expect, test } from "@playwright/test";

test.describe("Playright - Login Workflows", () => {
    test("User can login with valid credentials", async ({ page }) => {
        await page.goto("/login");

        await page.fill("input[name='email']", loginFixtures.validUser.email);
        await page.fill("input[name='password']", loginFixtures.validUser.password);

        await page.click("button[type='submit']");

        await expect(page).toHaveURL("/dashboard");
    });

    test("User cannot login with invalid credentials", async ({ page }) => {
        await page.goto("/login");

        await page.fill("input[name='email']", loginFixtures.invalidUser.email);
        await page.fill("input[name='password']", loginFixtures.invalidUser.password);

        await page.click("button[type='submit']");

        const toast = page.locator("[description='Invalid login credentials']");
        await expect(toast).toBeVisible();
    });

    test("Empty email and password fields should show validation errors", async ({ page }) => {
        await page.goto("/login");

        await page.click("button[type='submit']");

        const emailError = page.getByRole("alert").getByText("Email address is required");
        const passwordError = page.getByRole("alert").getByText("Password is required");

        await expect(emailError).toBeVisible();
        await expect(passwordError).toBeVisible();
    });
});
