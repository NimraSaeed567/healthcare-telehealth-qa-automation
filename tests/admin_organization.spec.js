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

  test('should add, verify, delete org and validate permission toggles', async ({ page }) => {
    await page.getByRole('tab', { name: 'Organization' }).click();

    // Add organization
    await page.getByRole('button', { name: 'Add Organization' }).click();
    await page.waitForTimeout(800);
    await page.locator('.select__input-container').click();
    await page.getByRole('combobox', { name: 'Organization*' }).fill('Testing123');
    await page.waitForTimeout(400);
    await page.getByRole('option', { name: 'Create "Testing123"' }).click();
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(800);

    await expect(page.getByText('organization loaded.')).toBeVisible();

    // Delete organization
    await page.getByRole('textbox', { name: 'Search Organization...' }).fill('Testing123');
    await page.waitForTimeout(400);
    await page.getByRole('row', { name: 'Testing123' }).getByLabel('Delete').click();
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Done' }).click();
    await page.waitForTimeout(800);
    await page.getByRole('textbox', { name: 'Search Organization...' }).fill('Testing123');
    await page.waitForTimeout(400);
    await expect(page.getByRole('row', { name: 'Testing123' })).toHaveCount(0);

    // Open permission modal for 'hcmd'
    await page.getByRole('textbox', { name: 'Search Organization...' }).fill('hcmd');
    await page.waitForTimeout(400);
    await page.getByRole('row', { name: /hcmd/i }).getByRole('button').first().click();
    await page.waitForTimeout(800);

    const dialog = page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 10000 });

    const permissionsToToggle = [
      { permission: 'Patient', tab: 'Patient' },
      { permission: 'Payment Code', tab: 'Payment Code' },
      { permission: 'Insurance', tab: 'Insurance' },
      { permission: 'Outside providers', tab: 'Outside providers' },
      { permission: 'Facility', tab: 'Facility' },
      { permission: 'User Group', tab: 'User Groups' }, // mapping here
      { permission: 'Task Category', tab: 'Task Category' },
      { permission: 'Task logs', tab: 'Task logs' },
      { permission: 'Knowledgebase Category', tab: 'Knowledgebase Category' },
      { permission: 'HCMD Providers', tab: 'HCMD Providers' },
    ];

    for (const { permission } of permissionsToToggle) {
      console.log(`🔍 Processing: ${permission}`);
      const item = dialog.locator('li').filter({ hasText: new RegExp(`^${permission}$`, 'i') }).first();

      await item.scrollIntoViewIfNeeded();
      await expect(item).toBeVisible({ timeout: 8000 });

      const switchBtn = item.getByRole('switch');
      await expect(switchBtn).toBeVisible({ timeout: 5000 });

      let toggled = false;

      try {
        for (let i = 0; i < 2; i++) {
          const state = await switchBtn.getAttribute('aria-checked');
          if (state === 'true') {
            try {
              await switchBtn.click();
              await page.waitForTimeout(500);
              const newState = await switchBtn.getAttribute('aria-checked');
              if (newState === 'false') {
                toggled = true;
                break;
              }
            } catch {
              const box = await switchBtn.boundingBox();
              if (box) {
                await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
              }
              await page.waitForTimeout(500);
            }
          } else {
            toggled = true;
            break;
          }
        }
      } catch (err) {
        console.warn(`⚠️ Failed to toggle "${permission}": ${err}`);
      }

      if (toggled) {
        console.log(`✅ "${permission}" now OFF`);
      } else {
        console.warn(`❌ "${permission}" toggle failed`);
      }

      await page.waitForTimeout(300);
    }

    await dialog.getByRole('button', { name: 'Close' }).click();
    await page.waitForTimeout(1000);

    // Verify tabs are not visible
    for (const { tab } of permissionsToToggle) {
      const tabElement = page.getByRole('tab', { name: tab, exact: true });
      await expect(tabElement, `Tab "${tab}" should be hidden`).toHaveCount(0);
    }
  });

  test('should enable all permission toggles and verify tabs are visible', async ({ page }) => {
    await page.getByRole('tab', { name: 'Organization' }).click();

    await page.getByRole('textbox', { name: 'Search Organization...' }).fill('hcmd');
    await page.waitForTimeout(400);
    await page.getByRole('row', { name: /hcmd/i }).getByRole('button').first().click();
    await page.waitForTimeout(800);

    const dialog = page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 10000 });

    const permissionsToToggle = [
      { permission: 'Patient', tab: 'Patient' },
      { permission: 'Payment Code', tab: 'Payment Code' },
      { permission: 'Insurance', tab: 'Insurance' },
      { permission: 'Facility', tab: 'Facility' },
      { permission: 'User Group', tab: 'User Groups' }, // mapped
      { permission: 'Task Category', tab: 'Task category' },
      { permission: 'Attendance logs', tab: 'Attendance Logs' },
      { permission: 'Task logs', tab: 'Task Logs' },
      { permission: 'Knowledgebase Category', tab: 'Knowledge based category' },
      { permission: 'Users', tab: 'Users' }
    ];

    for (const { permission } of permissionsToToggle) {
      console.log(`🔍 Enabling: ${permission}`);
      const item = dialog.locator('li').filter({ hasText: new RegExp(`^${permission}$`, 'i') }).first();

      await item.scrollIntoViewIfNeeded();
      await expect(item).toBeVisible({ timeout: 8000 });

      const switchBtn = item.getByRole('switch');
      await expect(switchBtn).toBeVisible({ timeout: 5000 });

      let toggled = false;

      try {
        for (let i = 0; i < 2; i++) {
          const state = await switchBtn.getAttribute('aria-checked');
          if (state === 'false') {
            try {
              await switchBtn.click();
              await page.waitForTimeout(500);
              const newState = await switchBtn.getAttribute('aria-checked');
              if (newState === 'true') {
                toggled = true;
                break;
              }
            } catch {
              const box = await switchBtn.boundingBox();
              if (box) {
                await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
              }
              await page.waitForTimeout(500);
            }
          } else {
            toggled = true;
            break;
          }
        }
      } catch (err) {
        console.warn(`⚠️ Failed to toggle "${permission}": ${err}`);
      }

      if (toggled) {
        console.log(`✅ "${permission}" now ON`);
      } else {
        console.warn(`❌ "${permission}" toggle failed`);
      }

      await page.waitForTimeout(300);
    }

    await dialog.getByRole('button', { name: 'Close' }).click();
    await page.waitForTimeout(1000);

    for (const { tab } of permissionsToToggle) {
      const tabElement = page.getByRole('tab', { name: tab, exact: true });
      await expect(tabElement, `Tab "${tab}" should be visible`).toBeVisible({ timeout: 5000 });
    }
  });
});
