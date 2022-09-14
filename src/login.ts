import { By, Key, until, WebDriver } from "selenium-webdriver";

import { setTimeout } from "node:timers/promises";
import { MAX_RETRY_TIMES, RETRY_INTERVAL } from "./env";
import { recognize } from "./recognize";

export const login = async (
  driver: WebDriver,
  username: string,
  password: string,
  testTimes = 0
): Promise<WebDriver> => {
  try {
    const userIdInput = await driver.findElement(By.id("UserId"))
    await userIdInput.clear();
    await userIdInput.sendKeys(username);
    const passwordInput = await driver.findElement(By.id("Password"))
    await passwordInput.clear();
    await passwordInput.sendKeys(password);
    const verifyImage = await driver.findElement(By.id("imgVerifi"));
    const verifyCode = await recognize(verifyImage);
    const verifyCodeInput = await driver.findElement(By.id("VeriCode"));
    await verifyCodeInput.clear()
    await verifyCodeInput.sendKeys(verifyCode);
    await verifyCodeInput.sendKeys(Key.ENTER);
    const alert = driver.wait(until.alertIsPresent(), 1000);
    return alert
      .then(async (alertWindow) => {
        if (!(await alertWindow.getText()).match(/用户名|密码/)) {
          if (testTimes <= MAX_RETRY_TIMES) {
            await alertWindow.accept();
            await setTimeout(RETRY_INTERVAL);
            return login(driver, username, password, testTimes + 1);
          } else {
            console.log("失败超过五次，请检查网络连接");
            process.exit(1)
          }
        } else {
          console.log("请检查用户名和密码");
          process.exit(1)
        }
      })
      .catch(err => driver);
  } catch (err) {
    console.log(err);
    process.exit(1)
  }
};
