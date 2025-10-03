from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Navigate to the home page
        page.goto("http://localhost:3000")

        # Wait for the hero section to be visible
        expect(page.locator("section[data-section='home']")).to_be_visible(timeout=10000)

        # Take a screenshot of the home page
        page.screenshot(path="jules-scratch/verification/01_home_page.png")

        # Navigate to the chairman page
        chairman_link = page.get_by_role("button", name="Meet Our Chairman")
        expect(chairman_link).to_be_visible()
        chairman_link.click()

        # Wait for the chairman page to load
        expect(page.locator("h1:has-text('MEET OUR CHAIRMAN')")).to_be_visible(timeout=10000)

        # Take a screenshot of the chairman page
        page.screenshot(path="jules-scratch/verification/02_chairman_page.png")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)