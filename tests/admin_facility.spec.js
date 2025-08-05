import { test, expect } from '@playwright/test';

test.describe('Organization flow with permissions and validation', () => {
  test.setTimeout(360_000); // 6 minutes

  test.beforeEach(async ({ page }) => {
    await page.goto('https://hcmd-stage.hcmdcommunication.com/user/login');
    await page.waitForTimeout(500);

    await page.getByRole('textbox', { name: 'Enter your email' }).fill('nimra@octathorn.com');
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('12345678');

    await Promise.all([
      page.waitForNavigation(),
      page.getByRole('button', { name: 'Sign In' }).click(),
    ]);

    await page.getByRole('link', { name: 'Admin' }).click();
  });

  test('Add, update, and delete a facility', async ({ page }) => {
    await page.getByRole('tab', { name: 'Facility' }).click();
    await page.getByRole('button', { name: 'Add Facility' }).click();

    await page.getByRole('combobox', { name: 'Facility*' }).fill('new');
    await page.getByRole('option', { name: 'Create "new"' }).click();

    await page.getByRole('combobox', { name: 'Organization*' }).fill('hcmd');
    await page.getByText('Loading...').waitFor();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    await page.getByRole('combobox', { name: 'Facility Type' }).fill('ind');
    await page.getByRole('option', { name: 'Independent Living' }).click();

    await page.getByRole('textbox', { name: 'Phone Number' }).fill('+1 (111) 111-11111');
    await page.getByTestId('input-faxNumber').fill('11111111111');
    await page.getByTestId('input-location').fill('isb');
    await page.getByTestId('input-note').fill('hhhh');
    await page.getByTestId('input-pharmacy').fill('care');

    const roomInput = page.getByRole('combobox', { name: 'Room no.' });
    for (let i = 1; i <= 4; i++) {
      await roomInput.fill(i.toString());
      await page.getByRole('option', { name: `Create "${i}"` }).click();
    }

    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(500);

    async function selectUserFromDropdown(containerSelector, userName) {
      const container = page.locator(containerSelector);
      const input = container.locator('input');
      await container.click({ force: true });
      await input.fill(userName);
      const option = page.getByRole('option', { name: userName, exact: true });
      await option.waitFor({ state: 'visible', timeout: 5000 });
      await option.click();
    }

    // HCMD Default MD
    await selectUserFromDropdown('#default-hcmd-md .select__value-container', 'Abel');
    await selectUserFromDropdown('#default-hcmd-md .select__value-container', 'Allison Abad');
    await selectUserFromDropdown('#default-hcmd-md .select__value-container', 'Beza Getahun');
    await selectUserFromDropdown('#default-hcmd-md .select__value-container', 'Christopher Yan');

    // HCMD Default NP
    await selectUserFromDropdown('#default-hcmd-np .select__value-container', 'Christine Marcucci');
    await selectUserFromDropdown('#default-hcmd-np .select__value-container', 'Audrey Smith');
    await selectUserFromDropdown('#default-hcmd-np .select__value-container', 'Christopher');

    // HCMD MD
    await selectUserFromDropdown('#hcmd-md .select__value-container', 'Dan Chester Santiago');
    await selectUserFromDropdown('#hcmd-md .select__value-container', 'Danah Lucasan');

    // HCMD NP
    await selectUserFromDropdown('#hcmd-np .select__value-container', 'Anthony Moradian');

    // Billing Provider
    await selectUserFromDropdown('#default-hcmd-billing .select__value-container', 'Alexander Romero');

    // Staff
    await selectUserFromDropdown('#hcmd-staff .select__value-container', 'EJ Jimenea');

    // Case Manager (No typing – just click and pick)
    const caseManagerDropdown = page.locator('#default-hcmd-case-manager .select__value-container');
    await caseManagerDropdown.click({ force: true });
    await page.getByRole('option', { name: 'Moises Villamizar', exact: true }).click();

    // Blur the last dropdown by clicking somewhere neutral
    //await page.locator('h1').click({ force: true });
    //await page.waitForTimeout(300);

   // Scroll and click either submit
  const submitButton = page.getByRole('button', { name: 'Submit' }).first();
await expect(submitButton).toBeVisible({ timeout: 10000 }); // wait for visibility
await submitButton.click({ force: true });

    // Assertion
    await expect(page.getByText('facility loaded.')).toBeVisible({ timeout: 8000 });

    // Search the facility
await page.getByRole('textbox', { name: 'Search facility...' }).click();
await page.getByRole('textbox', { name: 'Search facility...' }).fill('new');
await page.waitForTimeout(1000); // small wait for results to appear

// Click delete
await page.getByRole('button', { name: 'Delete' }).click();

// Confirm deletion dialog
await page.getByText('Are you sure about to delete').waitFor();
await page.getByRole('button', { name: 'Done' }).click();

// Assert the facility no longer appears in search results
await page.getByRole('textbox', { name: 'Search facility...' }).fill('new');
await page.waitForTimeout(1000); // wait for search to re-process

// Expect no matching result (e.g., fallback message)
await expect(page.getByText(/No rows/i)).toBeVisible();
    // ✅ Close the page/tab
    await page.close();
    
  });
});
