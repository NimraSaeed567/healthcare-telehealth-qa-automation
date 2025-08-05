import { test, expect } from '@playwright/test';

test('Knowledge Base: add and delete card, topics, and comments', async ({ page }) => {
  // Login
  await page.goto('https://hcmd-stage.hcmdcommunication.com/user/login');
  await page.waitForTimeout(200);
  await page.getByRole('textbox', { name: 'Enter your email' }).fill('nimra@octathorn.com');
  await page.waitForTimeout(200);
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('12345678');
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForTimeout(600);

  //await expect(page.getByRole('heading', { name: 'Welcome, Nimra!' })).toBeVisible();
  //await page.waitForTimeout(600);

  // Navigate to Knowledge Base
  await page.getByRole('link', { name: 'Knowledge base' }).click();
  await page.waitForTimeout(200);

  // Search category
  await page.getByRole('textbox', { name: 'Search Category' }).click();
  await page.waitForTimeout(200);
  await page.getByRole('textbox', { name: 'Search Category' }).fill('hospitals');
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Search' }).click();
  await page.waitForTimeout(200);

  await page.getByRole('heading', { name: 'Hospitals' }).click();
  await page.waitForTimeout(200);

  // Add card (subcategory)
  await page.getByRole('button', { name: 'Add card' }).click();
  await page.waitForTimeout(200);
  await page.getByRole('textbox', { name: 'Sub Category' }).fill('Test');
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForTimeout(200);
  await expect(page.getByText('Successfully create sub', { exact: false })).toBeVisible();
  await page.waitForTimeout(200);

  // Add first topic
  await page.getByRole('button', { name: 'Add Topic' }).first().click();
  await page.waitForTimeout(200);
  await page.getByRole('textbox', { name: 'Subject Description' }).fill('Testingg');
  await page.waitForTimeout(200);
  await page.getByRole('textbox', { name: 'Editor editing area: main' }).fill('Testingg');
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.waitForTimeout(200);
  await expect(page.getByText('Testingg')).toBeVisible();
  await page.waitForTimeout(200);

  // Add second topic under the new "Test" subcategory
  // Here we click the SECOND "Add Topic" button on the page:
  const addTopicButtons = page.getByRole('button', { name: 'Add Topic' });
  await addTopicButtons.nth(1).waitFor({ state: 'visible', timeout: 30_000 });
  await addTopicButtons.nth(1).click();
  await page.waitForTimeout(200);

  await page.getByRole('textbox', { name: 'Subject Description' }).fill('hhhh');
  await page.waitForTimeout(200);
  await page.getByRole('textbox', { name: 'Editor editing area: main' }).fill('hhhh');
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.waitForTimeout(200);
  await expect(page.getByText('hhhh')).toBeVisible();
  await page.waitForTimeout(200);

  // Activity logs and add comment
  await page.getByRole('cell', { name: 'hhhh' }).click();
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Activity Logs' }).click();
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Close' }).click();
  await page.waitForTimeout(200);

  await page.getByText('Add Comment', { exact: true }).click();
  await page.waitForTimeout(200);
  await page.getByRole('textbox').fill('hey');
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Add Comment' }).click();
  await page.waitForTimeout(200);

  // Delete the comment
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.waitForTimeout(200);
  await expect(page.getByText('Are you sure to delete', { exact: false })).toBeVisible();
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Done' }).click();
  await page.waitForTimeout(200);

  // Delete second topic: again choose the SECOND "Delete" button under "Test":
  const deleteButtons = page.getByRole('button', { name: 'Delete' });
  await deleteButtons.nth(1).waitFor({ state: 'visible', timeout: 30_000 });
  await deleteButtons.nth(1).click();
  await page.waitForTimeout(200);
  await expect(page.getByText('Are you sure about delete', { exact: false })).toBeVisible();
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Done' }).click();
  await page.waitForTimeout(200);

  // Final: delete subcategory "Test"
  const deleteSubcategory = page.getByRole('button', { name: 'Delete subcategory Test' });
  await deleteSubcategory.waitFor({ state: 'visible', timeout: 30_000 });
  await deleteSubcategory.click();
  await page.waitForTimeout(200);
  await expect(page.getByText('The card will be deleted', { exact: false })).toBeVisible();
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'Done' }).click();
  await page.waitForTimeout(200);

  // Assert “Test” subcategory gone
  await expect(page.getByText('Test')).toHaveCount(0);
});
