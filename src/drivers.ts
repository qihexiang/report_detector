import { Browser, Builder, WebDriver } from "selenium-webdriver";
import { Options as ChromeOptions } from "selenium-webdriver/chrome";
import { Options } from "selenium-webdriver/edge";
import { Options as FirefoxOptions } from "selenium-webdriver/firefox";
import { HEADLESS } from "./env";

export function createDriver(
  browser: "firefox" | "chrome" | "safari" | "edge" | string
): WebDriver {
  const builder = new Builder();
  if (browser === "firefox") {
    const option = new FirefoxOptions()
    if (HEADLESS) option.addArguments("-headless");
    return builder.forBrowser(Browser.FIREFOX).setFirefoxOptions(option).build();
  } else if (browser === "chrome") {
    const option = new ChromeOptions();
    if (HEADLESS) option.addArguments("-headless");
    return builder.forBrowser(Browser.CHROME).build();
  } else if (browser === "safari") {
    if (HEADLESS) console.log("Safari does not support headless mode");
    return builder.forBrowser(Browser.SAFARI).build();
  } else if (browser === "edge") {
    const option = new Options();
    if (HEADLESS) option.addArguments("-headless");
    return builder.forBrowser(Browser.EDGE).build();    
  } else {
    throw new Error(
      "Unsupported browsers. If you're using Opera or Edge, you can modify the code to support it."
    );
  }
}
