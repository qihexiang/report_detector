import { exec } from "child_process";
import { apply } from "./apply";
import { CALLBACK, DRIVER, PASSWORD, USERNAME } from "./env";
import { login } from "./login";

login(DRIVER, USERNAME, PASSWORD)
    .then(async driver => {
        while(true) {
            console.log(`Refreshed at ${new Date()}`)
            await apply(driver, () => {
                exec(CALLBACK)
            })
        }
    })

process.on("exit", () => {
    DRIVER.quit();
})
