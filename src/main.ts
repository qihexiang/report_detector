import { exec } from "node:child_process";
import { setTimeout } from "node:timers/promises";
import { By } from "selenium-webdriver";
import { apply, getAvaliableApplies } from "./apply";
import { createDriver } from "./drivers";
import { BROWSER, CALLBACK, CHANNEL, LONG, MARKING, MAX_RESTART, PASSWORD, RANGE, SHORT, USERNAME } from "./env";
import { login } from "./login";
import { rythm } from "./rythm";

let restarted = 0;

export let DRIVER = createDriver(BROWSER);
console.log(`Current channel is : ${CHANNEL}`);

(async () => {
    while (true) {
        try {
            const currentUrl = await DRIVER.getCurrentUrl();
            const matched = currentUrl.match(/https:\/\/gmis\.buct\.edu\.cn\/(?<path>.*)/)
            if (matched !== null) {
                if (matched.groups!["path"] === "home/stulogin") {
                    console.log("Try to login in")
                    await login(DRIVER, USERNAME, PASSWORD);
                    console.log("Logged in")
                } else if (matched.groups!["path"] === `student/yggl/${CHANNEL}_sqlist`) {
                    console.log(`Reload at ${new Date()}`)
                    await DRIVER.get(currentUrl)
                    const content = await DRIVER.findElement(By.css("body")).getText();
                    const avaliableList = getAvaliableApplies(content);
                    if (avaliableList.length > 0) {
                        exec(CALLBACK);
                        console.log("Redirect to apply page")
                        await DRIVER.get(currentUrl.replace(matched.groups!["path"], `student/yggl/${CHANNEL}`));
                        await apply(DRIVER, avaliableList)
                    }
                    await setTimeout(rythm(RANGE, MARKING, SHORT, LONG));
                } else {
                    console.log(`Redirect to data page.`)
                    await DRIVER.get(currentUrl.replace(matched.groups!["path"], `student/yggl/${CHANNEL}_sqlist`))
                }
            } else {
                console.log("Go for login")
                await DRIVER.get("https://gmis.buct.edu.cn/home/stulogin")
            }
        } catch (err) {
            console.log(err);
            if (restarted <= MAX_RESTART) {
                console.log("Restart Browser")
                DRIVER.quit();
                DRIVER = createDriver(BROWSER);
                restarted += 1;
            } else {
                console.log("Max restart times meet.")
                process.exit(1)
            }
        }
    }
})()

// process.on("SIGKILL", () => {
//     DRIVER.quit();
// })
