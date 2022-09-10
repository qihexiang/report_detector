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
    await driver.get("http://gmis.buct.edu.cn/home/stulogin");
    await driver.findElement(By.id("UserId")).sendKeys(username);
    await driver.findElement(By.id("Password")).sendKeys(password);
    const verifyImage = await driver.findElement(By.id("imgVerifi"));
    const verifyCode = await recognize(verifyImage);
    await driver.findElement(By.id("VeriCode")).sendKeys(verifyCode);
    await driver.findElement(By.id("VeriCode")).sendKeys(Key.ENTER);
    const alert = driver.wait(until.alertIsPresent(), 1000);
    return alert
      .then(async (alertWindow) => {
        if (!(await alertWindow.getText()).match(/用户名|密码/)) {
          if (testTimes <= MAX_RETRY_TIMES) {
            await alertWindow.accept();
            await setTimeout(RETRY_INTERVAL);
            return login(driver, username, password, testTimes + 1);
          } else {
            throw new Error("失败超过五次，请检查网络连接");
          }
        } else {
          throw new Error("请检查用户名或密码");
        }
      })
      .catch(err => driver);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to start driver");
  }
};
