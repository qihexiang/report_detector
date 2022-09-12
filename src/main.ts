import { exec } from "node:child_process";
import { apply } from "./apply";
import { CALLBACK, DRIVER, PASSWORD, USERNAME } from "./env";
import { login } from "./login";

(async () => {
    while (true) {
        const currentUrl = await DRIVER.getCurrentUrl();
        const matched = currentUrl.match(/https:\/\/gmis\.buct\.edu\.cn\/(?<session>.*?)\/(?<path>.*)/)
        if (matched !== null) {
            if (matched.groups!["path"] === "home/stulogin") {
                console.log("Try to login in")
                await login(DRIVER, USERNAME, PASSWORD);
            } else if (matched.groups!["path"] === "student/yggl/xshdbm") {
                console.log(`${new Date()} Check if there is new appliable reports`);
                await DRIVER.get(currentUrl)
                await apply(DRIVER, () => exec(CALLBACK))
            } else {
                console.log(`Redirect to applying page.`)
                await DRIVER.get(currentUrl.replace(matched.groups!["path"], "student/yggl/xshdbm"))
            }
        } else {
            console.log("Go for login")
            await DRIVER.get("https://gmis.buct.edu.cn/home/stulogin")
        }
    }
})()

process.on("SIGKILL", () => {
    DRIVER.quit();
})
