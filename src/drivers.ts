import { Browser, Builder, WebDriver } from "selenium-webdriver";

export function createDriver(
  browser: "firefox" | "chrome" | "safari" | "edge"
): WebDriver {
  const builder = new Builder();
  if (browser === "firefox") {
    return builder.forBrowser(Browser.FIREFOX).build();
  } else if (browser === "chrome") {
    return builder.forBrowser(Browser.CHROME).build();
  } else if (browser === "safari") {
    return builder.forBrowser(Browser.SAFARI).build();
  } else if (browser === "edge") {
    return builder.forBrowser(Browser.EDGE).build();    
  } else {
    throw new Error(
      "Unsupported browsers. If you're using Opera or Edge, you can modify the code to support it."
    );
  }
}
