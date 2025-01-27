import { test, expect } from '@playwright/test';

test.describe('Spinner Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show examples tab when no spinners exist', async ({ page }) => {
    const examplesTab = page.getByRole('tab', { name: 'Examples' });
    await expect(examplesTab).toHaveAttribute('aria-selected', 'true');
  });

  test('should add a new spinner', async ({ page }) => {
    // Open add spinner modal
    await page.getByRole('button', { name: 'Add new spinner' }).click();
    
    // Fill in spinner details
    await page.getByLabel('Title').fill('Test Spinner');
    await page.getByLabel('Items').fill('Item 1\nItem 2\nItem 3');
    
    // Save spinner
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify spinner was added
    await expect(page.getByText('Test Spinner')).toBeVisible();
  });

  test('should edit existing spinner', async ({ page }) => {
    // First add a spinner
    await page.getByRole('button', { name: 'Add Spinner' }).click();
    await page.getByLabel('Title').fill('Original Title');
    await page.getByLabel('Items').fill('Item 1\nItem 2');
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Click configure button
    await page.getByRole('button', { name: 'Configure spinner' }).click();
    
    // Edit spinner details
    await page.getByLabel('Title').fill('Updated Title');
    await page.getByLabel('Items').fill('New Item 1\nNew Item 2');
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify changes
    await expect(page.getByText('Updated Title')).toBeVisible();
    await expect(page.getByText('New Item 1')).toBeVisible();
  });

  test('should delete spinner', async ({ page }) => {
    // First add a spinner
    await page.getByRole('button', { name: 'Add Spinner' }).click();
    await page.getByLabel('Title').fill('To Be Deleted');
    await page.getByLabel('Items').fill('Item 1\nItem 2');
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Delete the spinner
    await page.getByRole('button', { name: 'Delete spinner' }).click();
    
    // Verify spinner was deleted
    await expect(page.getByText('To Be Deleted')).not.toBeVisible();
  });

  test('should spin all spinners', async ({ page }) => {
    // Add test spinners
    await page.getByRole('button', { name: 'Add Test Spinners' }).click();
    
    // Click spin all
    await page.getByRole('button', { name: 'Spin All' }).click();
    
    // Verify spinners have values (after animation)
    await page.waitForTimeout(3000); // Wait for spin animation
    const spinResults = page.locator('[data-testid="spin-result"]');
    await expect(spinResults.first()).not.toBeEmpty();
  });

  test('should show statistics', async ({ page }) => {
    // Add test spinners and spin them
    await page.getByRole('button', { name: 'Add Test Spinners' }).click();
    await page.getByRole('button', { name: 'Spin All' }).click();
    await page.waitForTimeout(3000); // Wait for spin animation
    
    // Toggle stats
    await page.getByRole('button', { name: 'Toggle Stats' }).click();
    
    // Verify stats are visible
    await expect(page.getByTestId('stats-panel')).toBeVisible();
  });

  test('should switch between tabs', async ({ page }) => {
    // Check Values tab
    await page.getByRole('tab', { name: 'Values' }).click();
    await expect(page.getByRole('tabpanel', { name: 'Values' })).toBeVisible();
    
    // Check Examples tab
    await page.getByRole('tab', { name: 'Examples' }).click();
    await expect(page.getByRole('tabpanel', { name: 'Examples' })).toBeVisible();
  });

  test('should add example spinners', async ({ page }) => {
    // Test each example button
    const examples = ['Add Fruit Spinners', 'Add Random Number Spinners', 'Add Large Item Spinners', 'Add Mixed Examples'];
    
    for (const example of examples) {
      await page.getByRole('tab', { name: 'Examples' }).click();
      await page.getByRole('button', { name: example }).click();
      
      // Verify spinners were added
      await expect(page.locator('.spinner')).toHaveCount.above(0);
      
      // Clear spinners for next test
      while (await page.getByRole('button', { name: 'Delete spinner' }).count() > 0) {
        await page.getByRole('button', { name: 'Delete spinner' }).first().click();
      }
    }
  });
});
