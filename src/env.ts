import { program } from "commander";
import { createDriver } from "./drivers";

program
  .requiredOption("-u, --username <username>", "学号")
  .requiredOption("-p, --password <password>", "密码")
  .option("-b, --browser <browser>", "浏览器，值为：firefox, chrome, edge 或 safari", "firefox")
  .option("-r, --retry_interval <ms>", "设置（登录和更换验证码的）重试间隔时间", "500")
  .option(
    "-w, --max_waiting_time <ms>",
    "设置等待页面上元素加载的最长时间",
    "10000"
  )
  .option(
    "-c, --check_interval <ms>",
    "设置两次检查是否有新申请之间的间隔时间，实际间隔时间还受到加载等待时间的影响",
    "90000"
  )
  .option(
    "-m, --max_retry_times <number>",
    "登录最大重试次数",
    "3"
  )
  .option(
    "-v, --max_verify_image_change <number>",
    "更换验证码的最大次数",
    "10"
  )
  .option("-a, --applies_amount <number>", "当有多个申请可选时，最大的申请量", "3")
  .option("-f, --callback <command>", "传入一个命令，在发现有新的申请时被执行")
  .parse();

const result = program.opts();

const str2Num = (str: string) => {
  return Number(str);
};

export const RETRY_INTERVAL = str2Num(result["retry_interval"]);
export const MAX_RETRY_TIMES = str2Num(result["max_retry_times"]);
export const MAX_VERIFY_IMAGE_CHANGE = str2Num(result["max_verify_image_change"]);
export const MAX_WAITING_TIME = str2Num(result["max_waiting_time"]);
export const CHECK_INTERNVAL = str2Num(result["check_interval"]);
export const MAX_APPLY_NUMBER = str2Num(result["applies_amount"]);
export const DRIVER = createDriver(result["browser"]);
export const CALLBACK = result["callback"];
export const USERNAME = result["username"];
export const PASSWORD = result["password"];
