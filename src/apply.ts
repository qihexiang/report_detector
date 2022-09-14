import { By, until, WebDriver } from "selenium-webdriver";
import { MAX_WAITING_TIME } from "./env";
import { recognize } from "./recognize";

const takeIdFromOnClickRE = /show_add\(\"(?<id>[0-9]*?)\"\)/

export const getAvaliableApplies = (data: string) => {
  const json = JSON.parse(data) as {rows: {id: number, rs: number, bmrs: number}[]}
  return json.rows.filter(report => report.rs > report.bmrs).map(report => report.id)
}

export const apply = async (driver: WebDriver, idxList: number[]) => {
  try {
    const applies = await driver.wait(
      until.elementsLocated(By.linkText("报名")),
      MAX_WAITING_TIME
    );
    for (const apply of applies) {
      const id = (await apply.getAttribute("onclick")).match(takeIdFromOnClickRE)?.groups?.["id"]
      if (idxList.includes(Number(id))) {
        try {
          await apply.click();
          console.log("Try to apply")
          const verifyImage = await driver.findElement(By.id("imgVerifi"));
          const verifyCode = await recognize(verifyImage);
          await driver.findElement(By.id("VeriCode")).sendKeys(verifyCode);
          await driver.findElement(By.linkText("确定")).click();
        } catch (err) {
          console.log(err)
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
};
