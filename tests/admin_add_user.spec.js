import { test, expect } from '@playwright/test';

test.describe('👤 Add User Flow', () => {
  test.setTimeout(300_000); // Increased to 300 seconds to accommodate the flow

  test.beforeEach(async ({ page }) => {
    await page.goto('https://hcmd-stage.hcmdcommunication.com/user/login');
    await page.waitForTimeout(800); // Wait for page load
    await page.getByRole('textbox', { name: 'Enter your email' }).fill('nimra@octathorn.com');
    await page.waitForTimeout(400);
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('12345678');
    await page.waitForTimeout(400);
    await Promise.all([
      page.waitForNavigation({ timeout: 60000 }),
      page.getByRole('button', { name: 'Sign In' }).click(),
    ]);
    await page.waitForTimeout(1200); // Wait for dashboard load
    await page.getByRole('link', { name: 'Admin' }).click();
    await page.waitForTimeout(800); // Wait for Admin section
  });

  test('✅ Create New User with Unique Email', async ({ page }) => {
    await page.getByRole('button', { name: 'Add User' }).click();
    await page.waitForTimeout(800); // Wait for Add User form

    await page.getByTestId('input-name').fill('Testingg');
    await page.waitForTimeout(400);
    await page.getByTestId('input-password').fill('12345678');
    await page.waitForTimeout(400);
    await page.getByTestId('input-confirmPassword').fill('12345678');
    await page.waitForTimeout(400);
    await page.getByTestId('input-email').fill('testingg@octathorn.com');
    await page.waitForTimeout(400);

    const nextBtn1 = page.getByRole('button', { name: 'Next', exact: true });
    await nextBtn1.waitFor({ state: 'visible', timeout: 50000 });
    await nextBtn1.click();
    await page.waitForTimeout(800); // Wait for next step

    await page.getByTestId('form-group-organizationIds').locator('div').filter({ hasText: 'Select Organization...' }).nth(2) .click();
    await page.waitForTimeout(500);

    const orgOption = page.getByRole('option', { name: 'HCMD' });
    await orgOption.waitFor({ state: 'visible', timeout: 30000 }); // Ensure HCMD is visible
    await orgOption.click();
    await page.waitForTimeout(500);

    await page.locator('.select__value-container.select__value-container--is-multi.css-hlgwow > .select__input-container').click();
    await page.waitForTimeout(500);

    const facilityOption = page.getByRole('option', { name: 'Mountain View Cottages 6' });
    await facilityOption.waitFor({ state: 'visible', timeout: 30000 });
    await facilityOption.click();
    await page.waitForTimeout(500);

    const mdCheckbox = page.locator('label:has-text("MD") input[type="checkbox"]');
    await expect(mdCheckbox).toBeVisible();
    if (!(await mdCheckbox.isChecked())) {
      await mdCheckbox.click();
    }
    await page.waitForTimeout(500);

    const defaultYesRadio = page.locator('label:has-text("Yes") input[type="radio"]');
    await expect(defaultYesRadio).toBeVisible();
    if (!(await defaultYesRadio.isChecked())) {
      await defaultYesRadio.click();
    }
    await page.waitForTimeout(500);

    const nextBtn3 = page.getByRole('button', { name: 'Next', exact: true });
    await nextBtn3.waitFor({ state: 'visible', timeout: 30000 });
    await nextBtn3.click();
    await page.waitForTimeout(800);

    // Personal Info
    await page.getByTestId('input-firstName').fill('Testing');
    await page.waitForTimeout(400);
    await page.getByTestId('input-lastName').fill('user');
    await page.waitForTimeout(400);
    await page.getByTestId('input-companyName').fill('HouseCall MD');
    await page.waitForTimeout(400);
    await page.getByTestId('input-extension').fill('123456');
    await page.waitForTimeout(400);
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('+1 (111) 111-11111');
    await page.waitForTimeout(400);
    await page.getByTestId('textarea-address').fill('123 Isb');
    await page.waitForTimeout(400);

    const specialityField = page.getByRole('combobox', { name: 'Speciality' });
    await specialityField.fill('pul');
    await page.waitForTimeout(400);
    await page.getByRole('option', { name: 'Pulmonology' }).click();
    await page.waitForTimeout(400);

    await page.getByTestId('input-faxNumber').fill('11111111');
    await page.waitForTimeout(400);
      const nextBtn4 = page.getByRole('button', { name: 'Next', exact: true });
    await nextBtn3.click();

    // Permissions
    await page.locator('.select__input-container').first().click();
  await page.getByRole('combobox', { name: 'User Role*' }).fill('super');
  await page.getByRole('option', { name: 'superAdmin' }).click();
  await page.locator('.css-1heozg9-control > .css-hlgwow > .css-nf418r').first().click();
  await page.getByRole('combobox', { name: 'Company Role' }).fill('medi');
  await page.getByRole('option', { name: 'Medical Assistant' }).click();
  await page.locator('.select__value-container.select__value-container--is-multi > .select__input-container').click();
  await page.getByRole('combobox', { name: 'User Group' }).fill('bill');
  await page.getByRole('option', { name: 'Billing Provider' }).click();
  await page.locator('div:nth-child(5) > .css-b62m3t-container > .css-1heozg9-control > .css-hlgwow > .css-nf418r').click();
  await page.getByRole('combobox', { name: 'Keywords' }).fill('insurance');
  await page.getByRole('option', { name: 'Create "insurance"' }).click();


    await page.getByRole('button', { name: 'Finish' }).waitFor({ state: 'visible', timeout: 30000 });
    await page.getByRole('button', { name: 'Finish' }).click();
    await page.waitForTimeout(800);

  await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();

    await expect(page.getByText('Successfully Created User')).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1200); // Pause to view final state
  });


 test(' Create User that is deleted but already made', async ({ page }) => {
    await page.getByRole('button', { name: 'Add User' }).click();
    await page.waitForTimeout(800); // Wait for Add User form

    await page.getByTestId('input-name').fill('Hafsa');
    await page.waitForTimeout(400);
    await page.getByTestId('input-password').fill('12345');
    await page.waitForTimeout(400);
    await page.getByTestId('input-confirmPassword').fill('12345');
    await page.waitForTimeout(400);
    await page.getByTestId('input-email').fill('hafsa@octathorn.com');
    await page.waitForTimeout(400);

    const nextBtn1 = page.getByRole('button', { name: 'Next', exact: true });
    await nextBtn1.waitFor({ state: 'visible', timeout: 50000 });
    await nextBtn1.click();
    await page.waitForTimeout(800); // Wait for next step

    await page.getByTestId('form-group-organizationIds')
      .locator('div')
      .filter({ hasText: 'Select Organization...' })
      .nth(2)
      .click();
    await page.waitForTimeout(500);

    const orgOption = page.getByRole('option', { name: 'HCMD' });
    await orgOption.waitFor({ state: 'visible', timeout: 30000 }); // Ensure HCMD is visible
    await orgOption.click();
    await page.waitForTimeout(500);

    await page.locator('.select__value-container.select__value-container--is-multi.css-hlgwow > .select__input-container').click();
    await page.waitForTimeout(500);

    const facilityOption = page.getByRole('option', { name: 'Mountain View Cottages 6' });
    await facilityOption.waitFor({ state: 'visible', timeout: 30000 });
    await facilityOption.click();
    await page.waitForTimeout(500);

    const mdCheckbox = page.locator('label:has-text("MD") input[type="checkbox"]');
    await expect(mdCheckbox).toBeVisible();
    if (!(await mdCheckbox.isChecked())) {
      await mdCheckbox.click();
    }
    await page.waitForTimeout(500);

    const defaultYesRadio = page.locator('label:has-text("Yes") input[type="radio"]');
    await expect(defaultYesRadio).toBeVisible();
    if (!(await defaultYesRadio.isChecked())) {
      await defaultYesRadio.click();
    }
    await page.waitForTimeout(500);

    const nextBtn3 = page.getByRole('button', { name: 'Next', exact: true });
    await nextBtn3.waitFor({ state: 'visible', timeout: 30000 });
    await nextBtn3.click();
    await page.waitForTimeout(800);

    // Personal Info
    await page.getByTestId('input-firstName').fill('Hafsa');
    await page.waitForTimeout(400);
    await page.getByTestId('input-lastName').fill('Waqar');
    await page.waitForTimeout(400);
    await page.getByTestId('input-companyName').fill('HouseCall MD');
    await page.waitForTimeout(400);
    await page.getByTestId('input-extension').fill('123456');
    await page.waitForTimeout(400);
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('+1 (111) 111-11111');
    await page.waitForTimeout(400);
    await page.getByTestId('textarea-address').fill('123 Isb');
    await page.waitForTimeout(400);

    const specialityField = page.getByRole('combobox', { name: 'Speciality' });
    await specialityField.fill('pul');
    await page.waitForTimeout(400);
    await page.getByRole('option', { name: 'Pulmonology' }).click();
    await page.waitForTimeout(400);

    await page.getByTestId('input-faxNumber').fill('11111111');
    await page.waitForTimeout(400);
      const nextBtn4 = page.getByRole('button', { name: 'Next', exact: true });
    await nextBtn3.click();

    // Permissions
    await page.locator('.select__input-container').first().click();
  await page.getByRole('combobox', { name: 'User Role*' }).fill('super');
  await page.getByRole('option', { name: 'superAdmin' }).click();
  await page.locator('.css-1heozg9-control > .css-hlgwow > .css-nf418r').first().click();
  await page.getByRole('combobox', { name: 'Company Role' }).fill('medi');
  await page.getByRole('option', { name: 'Medical Assistant' }).click();
  await page.locator('.select__value-container.select__value-container--is-multi > .select__input-container').click();
  await page.getByRole('combobox', { name: 'User Group' }).fill('bill');
  await page.getByRole('option', { name: 'Billing Provider' }).click();
  await page.locator('div:nth-child(5) > .css-b62m3t-container > .css-1heozg9-control > .css-hlgwow > .css-nf418r').click();
  await page.getByRole('combobox', { name: 'Keywords' }).fill('insurance');
  await page.getByRole('option', { name: 'Create "insurance"' }).click();


    await page.getByRole('button', { name: 'Finish' }).waitFor({ state: 'visible', timeout: 30000 });
    await page.getByRole('button', { name: 'Finish' }).click();
    await page.waitForTimeout(800);
     await page.getByText('Account with the same email').click();
  await page.getByText('Would you like to recover it').click();
  await page.getByRole('button', { name: 'Done' }).click();
  
  await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();

    await page.waitForTimeout(1200); // Pause to view final state
  });


  test('❌ Try Creating User With Existing Email', async ({ page }) => {
    await page.getByRole('button', { name: 'Add User' }).click();
    await page.waitForTimeout(800);

    await page.getByTestId('input-name').fill('Nimra');
    await page.waitForTimeout(400);
    await page.getByTestId('input-password').fill('12345678');
    await page.waitForTimeout(400);
    await page.getByTestId('input-confirmPassword').fill('12345678');
    await page.waitForTimeout(400);
    await page.getByTestId('input-email').fill('nimra@octathorn.com');
    await page.waitForTimeout(400);

    await page.getByRole('button', { name: 'Next', exact: true }).waitFor({ state: 'visible', timeout: 30000 });
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.waitForTimeout(800);

    const orgField = page.locator('.select__input-container').first();
    await orgField.waitFor({ state: 'visible', timeout: 30000 });
    await orgField.click();
    await page.waitForTimeout(500);

    const orgOption = page.getByRole('option', { name: 'HCMD' });
    await orgOption.waitFor({ state: 'visible', timeout: 30000 });
    await orgOption.click();
    await page.waitForTimeout(500);

    const facilityField = page.locator('.select__input-container').nth(1);
    await facilityField.waitFor({ state: 'visible', timeout: 30000 });
    await facilityField.click();
    await page.waitForTimeout(500);

    await page.getByRole('combobox', { name: 'Select Facility' }).fill('mountain');
    await page.waitForTimeout(400);
    await page.getByRole('option', { name: 'Mountain View Cottages 6' }).waitFor({ state: 'visible', timeout: 30000 });
    await page.getByRole('option', { name: 'Mountain View Cottages 6' }).click();
    await page.waitForTimeout(500);

    await page.getByRole('checkbox', { name: 'MD' }).check();
    await page.waitForTimeout(400);
    await page.getByRole('radio', { name: 'Yes' }).check();
    await page.waitForTimeout(400);

    await page.getByRole('button', { name: 'Next', exact: true }).waitFor({ state: 'visible', timeout: 30000 });
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.waitForTimeout(800);

    await page.getByTestId('input-firstName').fill('Nimra');
    await page.waitForTimeout(400);
    await page.getByTestId('input-lastName').fill('Saeed');
    await page.waitForTimeout(400);
    await page.getByTestId('input-companyName').fill('Housecall MD');
    await page.waitForTimeout(400);
    await page.getByTestId('input-extension').fill('1122111');
    await page.waitForTimeout(400);
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('+1 (111) 111-11111');
    await page.waitForTimeout(400);
    await page.getByTestId('textarea-address').fill('123 Isb');
    await page.waitForTimeout(400);

    await page.getByRole('button', { name: 'Next', exact: true }).waitFor({ state: 'visible', timeout: 30000 });
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.waitForTimeout(800); 

 await page.locator('.select__input-container').first().click();
  await page.getByRole('combobox', { name: 'User Role*' }).fill('super');
  await page.getByRole('option', { name: 'superAdmin' }).click();
  await page.locator('.css-1heozg9-control > .css-hlgwow > .css-nf418r').first().click();
  await page.getByRole('combobox', { name: 'Company Role' }).fill('medi');
  await page.getByRole('option', { name: 'Medical Assistant' }).click();
  await page.locator('.select__value-container.select__value-container--is-multi > .select__input-container').click();
  await page.getByRole('combobox', { name: 'User Group' }).fill('bill');
  await page.getByRole('option', { name: 'Billing Provider' }).click();
  await page.locator('div:nth-child(5) > .css-b62m3t-container > .css-1heozg9-control > .css-hlgwow > .css-nf418r').click();
  await page.getByRole('combobox', { name: 'Keywords' }).fill('insurance');
  await page.getByRole('option', { name: 'Create "insurance"' }).click();

    await page.getByRole('button', { name: 'Finish' }).waitFor({ state: 'visible', timeout: 30000 });
    await page.getByRole('button', { name: 'Finish' }).click();
    await page.waitForTimeout(800);

    await expect(page.getByText('Email already exists')).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Close' }).click();
    await page.waitForTimeout(500);
  });
});