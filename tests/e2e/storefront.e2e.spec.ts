import { expect, test } from '@playwright/test'

test.describe('Storefront landing page', () => {
  test('shows the desktop design and switches hero images', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle("Dilara's Finesse | Sterling Silver Jewellery")
    await expect(page.getByRole('banner')).toHaveCount(1)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      "Dilara's FinesseFine Sterling Silver",
    )
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible()
    await expect(
      page.getByRole('region', { name: 'Shop by category' }).getByRole('article'),
    ).toHaveCount(4)
    await page.getByRole('button', { name: 'Slide 2', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Slide 2', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(
      page.getByRole('img', {
        name: 'Fine sterling silver chain and pendant detail in natural light',
      }),
    ).toBeVisible()

    const rail = page.getByLabel('Recommended products', { exact: true })
    await page.getByRole('button', { name: 'Next products' }).click()
    await expect.poll(() => rail.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      1440,
    )
  })

  test('supports quick-view, preview bag, wishlist, and search', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page
      .getByRole('button', { name: 'View Heart Station Chain Bracelet', exact: true })
      .click()
    let dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('heading')).toHaveText('Heart Station Chain Bracelet')
    await dialog.getByRole('button', { name: 'Add to Bag', exact: true }).click()
    await expect(dialog).not.toBeVisible()
    await expect(
      page.getByRole('button', { name: 'View Heart Station Chain Bracelet', exact: true }),
    ).toBeFocused()

    await page.getByRole('button', { name: 'Shopping bag (1 items)', exact: true }).click()
    dialog = page.getByRole('dialog')
    await expect(dialog).toContainText('Total: £68')
    await expect(dialog).toContainText('checkout is not connected')
    await dialog.getByRole('button', { name: 'Remove Heart Station Chain Bracelet' }).click()
    await expect(dialog).toContainText('No items yet')
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Shopping bag (0 items)' })).toBeFocused()

    const save = page.getByRole('button', { name: 'Save Heart Charm Necklace to wishlist' })
    await save.click()
    await expect(save).toHaveAttribute('aria-pressed', 'true')
    await page.getByRole('button', { name: 'Wishlist (1 items)', exact: true }).click()
    await expect(page.getByRole('dialog')).toContainText('Heart Charm Necklace')
    await page.keyboard.press('Escape')
    await save.click()
    await expect(save).toHaveAttribute('aria-pressed', 'false')

    await page.getByRole('button', { name: 'Search', exact: true }).click()
    await page.getByRole('searchbox', { name: 'Search jewellery' }).fill('moonstone')
    await expect(page.getByRole('dialog').getByRole('listitem')).toHaveCount(1)
    await expect(page.getByRole('dialog')).toContainText('The Angellica Moonstone Cabochon Ring')
    await page.getByRole('searchbox', { name: 'Search jewellery' }).fill('not-a-product')
    await expect(page.getByRole('dialog')).toContainText('No matching jewellery found.')
  })

  test('fits mobile screens and provides a keyboard-accessible drawer', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('http://localhost:3000')
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).not.toBeVisible()
    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused()

    await page.getByRole('button', { name: 'Open menu' }).click()
    await page
      .getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: 'Collections', exact: true })
      .click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
    await expect(page).toHaveURL(/#collections-section$/)
    await expect(page.getByRole('heading', { name: 'We think you may like...' })).toBeInViewport()

    const cards = page.getByRole('region', { name: 'Shop by category' }).getByRole('article')
    const first = await cards.nth(0).boundingBox()
    const second = await cards.nth(1).boundingBox()
    expect(first).not.toBeNull()
    expect(second).not.toBeNull()
    expect(second!.y).toBeGreaterThanOrEqual(first!.y + first!.height)

    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 844 })
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      )
    }

    await page.getByRole('button', { name: 'Open customer support chat' }).click()
    await expect(page.getByRole('dialog')).toContainText('Live messaging is not connected yet')
  })
})
