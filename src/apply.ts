import { By, until, WebDriver } from "selenium-webdriver";
import { MAX_WAITING_TIME } from "./env";
import { recognize } from "./recognize";

const takeIdFromOnClickRE = /.*\(\"(?<id>[0-9]*?)\"\)/;

export const getAvaliableApplies = (data: string) => {
  const json = JSON.parse(data) as {
    rows: { id: number; rs: number; bmrs: number; bmkssj: string }[];
  };
  return json.rows
    .filter((report) => report.rs > report.bmrs)
    .filter((report) => new Date(report.bmkssj) <= new Date())
    .map((report) => report.id);
};

export const apply = async (driver: WebDriver, idxList: number[]) => {
  try {
    let applies = await driver.wait(
      until.elementsLocated(By.linkText("报名")),
      MAX_WAITING_TIME
    );
    while (applies.length > 0) {
      for (const apply of applies) {
        const id = (await apply.getAttribute("onclick")).match(
          takeIdFromOnClickRE
        )?.groups?.["id"];
        if (idxList.includes(Number(id))) {
          try {
            await apply.click();
            console.log("Try to apply");
            const verifyImage = await driver.wait(until.elementLocated(By.id("imgVerifi")), MAX_WAITING_TIME);
            const verifyCode = await recognize(verifyImage);
            await driver.findElement(By.id("VeriCode")).sendKeys(verifyCode);
          } catch (err) {
            console.log(err);
          } finally {
            try {
              await driver.findElement(By.linkText("确定")).click();
              await driver.findElement(By.linkText("确定")).click();  
            } catch {
              console.log()
            }
            console.log("Wating for refresh")
            applies = await driver.wait(
              until.elementsLocated(By.linkText("报名")),
              MAX_WAITING_TIME
            );
          }
        }
      }

    }
  } catch (err) {
    console.log(err);
  }
};
