import { until, By, WebDriver } from "selenium-webdriver";
import { MAX_WAITING_TIME } from "./env";

export const openYGGL = async (driver: WebDriver) => {
  const 研工管理 = await driver
    .wait(until.elementLocated(By.linkText("研工管理")), MAX_WAITING_TIME)
    .catch((err) => {
      console.log(err);
      throw new Error(
        "超过载入等待时间，若网络拥塞，请设置更长的MAX_WAITING_TIME"
      );
    });
  await 研工管理.click();
  return driver;
};

export const openXSBGApply = async (driver: WebDriver) => {
  const 学术报告申请 = await driver
    .wait(until.elementLocated(By.linkText("学术报告申请")), MAX_WAITING_TIME)
    .catch((err) => {
      console.log(err);
      throw new Error(
        "超过载入等待时间，若网络拥塞，请设置更长的MAX_WAITING_TIME"
      );
    });
  await 学术报告申请.click();
  return driver;
};
