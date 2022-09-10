import path from "node:path";
import { setTimeout } from "node:timers/promises";
import { WebElement } from "selenium-webdriver";
import Tesseract from "tesseract.js";
import { MAX_VERIFY_IMAGE_CHANGE, RETRY_INTERVAL } from "./env";

export const recognize = async (imageElement: WebElement) => {
  let verifyCode: string | undefined = undefined;
  let testTimes = 0;
  while (verifyCode === undefined && testTimes < MAX_VERIFY_IMAGE_CHANGE) {
    const verify_img = await imageElement.takeScreenshot();
    const verify_code = await Tesseract.recognize(
      `data:image/png;base64,"${verify_img}"`, "eng").then(({ data }) => data.text);
    if (verify_code.match(/^[0-9]{4}\n$/)) {
      verifyCode = verify_code;
    } else {
      await setTimeout(RETRY_INTERVAL);
      await imageElement.click();
    }
  }
  if (verifyCode === undefined) {
    throw new Error("最大验证码识别次数达到");
  } else {
    return verifyCode;
  }
};
