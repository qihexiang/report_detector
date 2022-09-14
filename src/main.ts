import { exec } from "node:child_process";
import { setTimeout } from "node:timers/promises";
import { By } from "selenium-webdriver";
import { apply, getAvaliableApplies } from "./apply";
import { createDriver } from "./drivers";
import { BROWSER, CALLBACK, LONG, MARKING, MAX_WAITING_TIME, PASSWORD, RANGE, SHORT, USERNAME } from "./env";
import { login } from "./login";
import { rythm } from "./rythm";

export let DRIVER = createDriver(BROWSER);

(async () => {
    while (true) {
        try {
            const currentUrl = await DRIVER.getCurrentUrl();
            const matched = currentUrl.match(/https:\/\/gmis\.buct\.edu\.cn\/(?<session>.*?)\/(?<path>.*)/)
            if (matched !== null) {
                if (matched.groups!["path"] === "home/stulogin") {
                    console.log("Try to login in")
                    await login(DRIVER, USERNAME, PASSWORD);
                } else if (matched.groups!["path"] === "student/yggl/xshdbm_sqlist") {
                    console.log(`Reload at ${new Date()}`)
                    await DRIVER.get(currentUrl)
                    const content = await DRIVER.findElement(By.css("body")).getText();
                    const avaliableList = getAvaliableApplies(content);
                    if (avaliableList.length > 0) {
                        exec(CALLBACK);
                        console.log("Redirect to apply page")
                        await DRIVER.get(currentUrl.replace(matched.groups!["path"], "student/yggl/xshdbm"));
                        await apply(DRIVER, avaliableList)
                    }
                    await setTimeout(rythm(RANGE, MARKING, SHORT, LONG));
                } else {
                    console.log(`Redirect to data page.`)
                    await DRIVER.get(currentUrl.replace(matched.groups!["path"], "student/yggl/xshdbm_sqlist"))
                }
            } else {
                console.log("Go for login")
                await DRIVER.get("https://gmis.buct.edu.cn/home/stulogin")
            }
        } catch (err) {
            console.log(err);
            console.log("Restart Browser")
            DRIVER.quit();
            DRIVER = createDriver(BROWSER);
        }
    }
})()

process.on("SIGKILL", () => {
    DRIVER.quit();
})
