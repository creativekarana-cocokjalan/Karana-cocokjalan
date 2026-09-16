from playwright.sync_api import sync_playwright
import time

SECTIONS = ["hero", "intro", "work", "gallery", "about", "services", "moment", "locations", "clients", "contact"]

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    page.goto("http://localhost:3000/", wait_until="networkidle")
    time.sleep(5)  # let the preloader finish + hero enter animation play out
    page.screenshot(path="/tmp/mobile-hero.png")

    for sec in SECTIONS[1:]:
        page.evaluate(f"window.__karanaScrollTo && window.__karanaScrollTo('#{sec}')")
        time.sleep(1.6)
        page.screenshot(path=f"/tmp/mobile-{sec}.png")

    browser.close()
print("done")
