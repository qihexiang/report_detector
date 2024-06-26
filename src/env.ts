import { program } from "commander";

program
  .requiredOption("-u, --username <username>", "学号")
  .requiredOption("-p, --password <password>", "密码")
  .option("-c, --channel <channel>", "选择通道", "xshdbm")
  .option("-b, --browser <browser>", "浏览器，可选值为：firefox，chrome，edge或safari", "firefox")
  .option("-h, --headless", "开启headless模式(不显示浏览器界面，可用于各类单片机上)")
  .option("-r, --retry_interval <ms>", "设置（登录和更换验证码的）重试间隔时间", "500")
  .option(
    "-w, --max_waiting_time <ms>",
    "设置等待页面上元素加载的最长时间",
    "10000"
  )
  .option(
    "-m, --max_retry_times <number>",
    "登录最大重试次数",
    "10"
  )
  .option(
    "-v, --max_verify_image_change <number>",
    "更换验证码的最大次数",
    "10"
  )
  .option(
    "-e, --max_restart <number>", "最大重启次数", "5"
  )
  .option("-a, --applies_amount <number>", "当有多个申请可选时，最大的申请量", "3")
  .option("-f, --callback <command>", "传入一个命令，在发现有新的申请时被执行", "echo 发现了新讲座")
  .option("-M, --marking <ms>", "设置一个快慢周期标度，例如每半个小时作为一个标度，设置为1800000", "1800000")
  .option("-R, --range <ms>", "设置快速段的长度，例如标度前5分钟，设置为300000", "300000")
  .option("-S, --short <ms>", "设置快速段检查频率，例如5秒设置为5000", "5000")
  .option("-L, --long <ms>", "设置慢速段检查频率，例如60秒60000", "60000")
  .parse();

const result = program.opts();

console.log(result)

const str2Num = (str: string) => {
  try {
    return parseInt(str,10);
  } catch(err) {
    console.log(err);
    process.exit(1)
  }
};

export const RETRY_INTERVAL = str2Num(result["retry_interval"]);
export const MAX_RETRY_TIMES = str2Num(result["max_retry_times"]);
export const MAX_VERIFY_IMAGE_CHANGE = str2Num(result["max_verify_image_change"]);
export const MAX_WAITING_TIME = str2Num(result["max_waiting_time"]);
export const MAX_APPLY_NUMBER = str2Num(result["applies_amount"]);
export const MAX_RESTART = str2Num(result["max_restart"]);
export const RANGE = str2Num(result["range"]);
export const MARKING = str2Num(result["marking"]);
export const SHORT = str2Num(result["short"]);
export const LONG = str2Num(result["long"]);
export const BROWSER: string = result["browser"];
export const CALLBACK: string = result["callback"];
export const USERNAME: string = result["username"];
export const PASSWORD: string = result["password"];
export const HEADLESS: boolean = result["headless"];
export const CHANNEL: string = result["channel"]
