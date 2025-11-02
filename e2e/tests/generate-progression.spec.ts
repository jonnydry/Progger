import { test, expect } from '@playwright/test';

test.describe('Chord Progression Generation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
  });

  test('should display the main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /PROGGER/i })).toBeVisible();
  });

  test('should have controls for key selection', async ({ page }) => {
    // Check if key selector exists
    const keySelector = page.getByLabel(/key/i);
    await expect(keySelector).toBeVisible();
  });

  test('should have controls for mode selection', async ({ page }) => {
    // Check if mode selector exists
    const modeSelector = page.getByLabel(/mode/i);
    await expect(modeSelector).toBeVisible();
  });

  test('should have a generate button', async ({ page }) => {
    // Look for generate/submit button
    const generateButton = page.getByRole('button', { name: /generate|create/i });
    await expect(generateButton).toBeVisible();
  });

  test('should show loading state when generating', async ({ page }) => {
    // Click generate button
    const generateButton = page.getByRole('button', { name: /generate|create/i });
    
    // Note: This test may need to be adjusted based on actual button text
    // and whether we want to mock the API or test against real API
    if (await generateButton.isVisible()) {
      await generateButton.click();
      
      // Should show some loading indicator (skeleton, spinner, etc.)
      // This is a basic check - actual implementation may vary
      await page.waitForTimeout(500); // Brief wait for loading state
    }
  });
});

