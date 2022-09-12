import { setTimeout } from "node:timers/promises";
import { By, until, WebDriver, WebElement } from "selenium-webdriver";
import { CHECK_INTERNVAL, MAX_APPLY_NUMBER, MAX_WAITING_TIME } from "./env";
import { recognize } from "./recognize";

let existedFailedApplies = 0;

export const apply = async (driver: WebDriver, callback: () => void) => {
  try {
    const applies = await driver.wait(
      until.elementsLocated(By.linkText("报名")),
      MAX_WAITING_TIME
    );
    let updateApplies: WebElement[] = [];
    if (applies.length > existedFailedApplies) {
      console.log("start to apply")
      callback()
      console.log("callback finished")
      for (let i = 0; i < applies.length; i++) {
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
        console.log("Try to apply")
        const verifyImage = await driver.findElement(By.id("imgVerifi"));
        const verifyCode = await recognize(verifyImage);
        await driver.findElement(By.id("VeriCode")).sendKeys(verifyCode);
        await driver.findElement(By.linkText("确定")).click();
      }
      existedFailedApplies = updateApplies.length;
    } else if (applies.length === existedFailedApplies) {
      console.log(`有${existedFailedApplies}个申请，但均已尝试过并失败了`)
    } else {
      console.log(`一些申请消失了`);
      existedFailedApplies = applies.length
    }
  } catch(err) {
    console.log(err)
    existedFailedApplies = 0
  }
  await setTimeout(CHECK_INTERNVAL);
  return driver;
};
