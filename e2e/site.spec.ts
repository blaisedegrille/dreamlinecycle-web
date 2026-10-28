import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("gateway links to all supported locales", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /magyar/i })).toHaveAttribute("href", "/hu/");
  await expect(page.getByRole("link", { name: /english/i })).toHaveAttribute("href", "/en/");
  await expect(page.getByRole("link", { name: /deutsch/i })).toHaveAttribute("href", "/de/");
});

test("localized static pages are emitted with canonical metadata", async ({ page }) => {
  const response = await page.goto("/hu/szolgaltatasok/");
  expect(response?.status()).toBe(200);
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.dreamlinecycle.hu/hu/szolgaltatasok/",
  );
  await expect(page.locator('link[rel="alternate"][hreflang="de"]')).toHaveAttribute(
    "href",
    "https://www.dreamlinecycle.hu/de/leistungen/",
  );
});

test("language switcher preserves the current gallery album route", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/hu/galeria/builds/");
  await page.getByRole("button", { name: "Nyelv" }).click();
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/gallery\/builds\/$/);
  await expect(page.locator("h1")).toBeVisible();
});

test("contact form fields are labeled and the page has no critical axe violations", async ({ page }) => {
  await page.goto("/en/contact/");
  await expect(page.getByLabel(/name/i)).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/message/i)).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const critical = results.violations.filter((violation) => violation.impact === "critical");
  expect(critical).toEqual([]);
});

test("unknown paths return the generated 404 page", async ({ page }) => {
  const response = await page.goto("/not-a-real-page/");
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle(/404/i);
});
