import { test, expect } from '@playwright/test';

test.describe('User Login Scenarios', () => {

  const baseURL = 'https://hcmd-stage.hcmdcommunication.com/user/login';
  const validEmail = 'nimra@octathorn.com';
  const validPassword = '12345678';

  test('✅ Valid login credentials', async ({ page }) => {
    await page.goto(baseURL);
    await page.waitForTimeout(500);

    await page.getByRole('textbox', { name: 'Enter your email' }).fill(validEmail);
    await page.waitForTimeout(500);

    await page.getByRole('textbox', { name: 'Enter your password' }).fill(validPassword);
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForTimeout(500);

    const welcomeMessage = page.getByRole('heading', { name: 'Welcome, Nimra!' });
    await expect(welcomeMessage).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(500);
  });

  test('❌ Invalid password', async ({ page }) => {
    await page.goto(baseURL);
    await page.waitForTimeout(500);

    await page.getByRole('textbox', { name: 'Enter your email' }).fill(validEmail);
    await page.waitForTimeout(500);

    await page.getByRole('textbox', { name: 'Enter your password' }).fill('ahbdkwvlhs');
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForTimeout(500);

    const error = page.locator('div').filter({ hasText: /^Email or password is incorrect$/ }).nth(2);
    await expect(error).toBeVisible();
    await page.waitForTimeout(500);
  });

  test('❌ Invalid email format', async ({ page }) => {
    await page.goto(baseURL);
    await page.waitForTimeout(500);

    await page.getByRole('textbox', { name: 'Enter your email' }).fill('wrong@octathorn.com');
    await page.waitForTimeout(500);

    await page.getByRole('textbox', { name: 'Enter your password' }).fill(validPassword);
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForTimeout(500);

    await page.getByText('Email not found.').click();
    await page.waitForTimeout(500);
  });

  test('❌ Empty fields', async ({ page }) => {
    await page.goto(baseURL);
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForTimeout(500);

    const emailError = page.locator('text=Email is a required field');
    const passwordError = page.locator('text=Password is a required field');

    await expect(emailError).toBeVisible();
    await expect(passwordError).toBeVisible();
    await page.waitForTimeout(500);
  });

  test('❌ Network disconnect and reconnect with successful login', async ({ page }) => {
    await page.goto(baseURL);
    await page.waitForTimeout(500);

    // Step 1: Fill valid credentials
    await page.getByRole('textbox', { name: 'Enter your email' }).fill(validEmail);
    await page.waitForTimeout(500);
    await page.getByRole('textbox', { name: 'Enter your password' }).fill(validPassword);
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForTimeout(500);

    // Step 2: Expect "Retrying to connect..." banner to show
    await expect(page.getByText('Retrying to connect...')).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(500);

    // Step 3: Expect "Back online!" banner to show
    await expect(page.getByText('Back online! Data will')).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(500);

    // Step 5: Confirm login success
    const welcomeMessage = page.getByRole('heading', { name: 'Welcome, Nimra!' });
    await expect(welcomeMessage).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(500);
  });

});