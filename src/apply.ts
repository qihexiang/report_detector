import { setTimeout } from "node:timers/promises";
import { By, until, WebDriver, WebElement } from "selenium-webdriver";
import { CHECK_INTERNVAL, MAX_APPLY_NUMBER, MAX_WAITING_TIME } from "./env";
import { recognize } from "./recognize";

let existedFailedApplies = 0;

export const apply = async (driver: WebDriver, callback: () => void) => {
  const url = await driver
    .getCurrentUrl()
    .then((url) => url.replace("/default/index", "/yggl/xshdbm"));
  await driver.get(url);
  try {
    const applies = await driver.wait(
      until.elementsLocated(By.linkText("报名")),
      MAX_WAITING_TIME
    );
    let updateApplies: WebElement[] = [];
    if (applies.length > existedFailedApplies) {
      callback()
      for (let i = 0; i <= applies.length; i++) {
        updateApplies = await driver.wait(
          until.elementsLocated(By.linkText("报名")), MAX_WAITING_TIME
        );
        const successed = applies.length - updateApplies.length;
        if (successed >= MAX_APPLY_NUMBER) {
          console.log("以达到最大申请数");
          process.exit(0);
        }
        const apply = updateApplies[i - successed];
        await apply.click();
        const verifyImage = await driver.findElement(By.id("imgVerifi"));
        const verifyCode = await recognize(verifyImage);
        await driver.findElement(By.id("VeriCode")).sendKeys(verifyCode);
        await driver.findElement(By.linkText("确定")).click();
      }
      existedFailedApplies = updateApplies.length;
    }
  } catch {
    existedFailedApplies = 0
  }
  await setTimeout(CHECK_INTERNVAL);
  return driver;
};
