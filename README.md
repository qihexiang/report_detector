# 学术报告检测工具

## 依赖项目

运行时：Node.js >= 16

浏览器和驱动（任一）：
  - Firefox和Geckdriver
  - Chrome/Chromium和Chromedriver
  - Microsoft Edge和EdgeDriver
  - Safari和SafariDriver

Node.js安装完成后请检查npm命令是否能在命令行中正常工作，若不能，请重新设置Windows Powershell的执行策略(Execution-Policy)。

浏览器驱动所在的目录需要被添加到环境变量的PATH中才能正常工作。

## 下载OCR识别训练文件

<https://raw.githubusercontent.com/tesseract-ocr/tessdata/main/eng.traineddata>，下载后，将该文件放在此项目目录下。

可以不必单独下载这个文件，但程序自动去获取该文件可能需要更长的时间。

## NPM脚本

|名称|作用|例子|
|---|---|---|
|dev|开发模式启动程序|npm run dev -- -u 20212001958 -p "BUCT@1958"|
|typeCheck|检查代码类型错误|npm run typeCheck|
|bundle|将src目录下的代码打包合并为dist/main.js|npm run bundle|
|start|以正常模式启动程序(dist/main.js)|npm run start -- -u 20212001958 -p "BUCT@1958"|
|pack|将代码打包成二进制文件(具体细节请修改package.json中pkg节)|npm run pack|

> 例子中，`dev`和`start`没有指定所用浏览器，默认使用的是Firefox

使用帮助：`npm run start -- --help`

```
Usage: main [options]

Options:
  -u, --username <username>               学号
  -p, --password <password>               密码
  -b, --browser <browser>                 浏览器，可选值为：firefox，chrome，edge或safari (default: "firefox")      
  -r, --retry_interval <ms>               设置（登录和更换验证码的）重试间隔时间 (default: "500")
  -w, --max_waiting_time <ms>             设置等待页面上元素加载的最长时间 (default: "10000")
  -m, --max_retry_times <number>          登录最大重试次数 (default: "3")
  -v, --max_verify_image_change <number>  更换验证码的最大次数 (default: "10")
  -a, --applies_amount <number>           当有多个申请可选时，最大的申请量 (default: "3")
  -f, --callback <command>                传入一个命令，在发现有新的申请时被执行
  -M, --marking <ms>                      设置一个快慢周期标度，例如每半个小时作为一个标度，设置为1800000 (default: "1800000")
  -R, --range <ms>                        设置快速段的长度，例如标度前5分钟，设置为300000 (default: "300000")       
  -S, --short <ms>                        设置快速段检查频率，例如5秒设置为5000 (default: "5000")
  -L, --long <ms>                         设置慢速段检查频率，例如60秒60000 (default: "60000")
  -h, --help                              display help for command
```

注意，所有的时间参数单位均为毫秒，使用时应该设置合理的值。

--callback参数是十分有用的，本程序不能确保总是正确的选择讲座/输入验证码/等待页面加载，你可以通过这个参数来执行一些系统命令来发出提示，例如当系统中有foobar2000播放器时（需要先将foobar2000路径添加到PATH），你可以这样来提醒你手动申请学术报告：

```Powershell
npm run start -- -u 20212001958 -p "BUCT@1958" -b firefox -f "foobar2000 alert.mp3"
```

> 在Windows中，这个命令是通过CMD执行的，一些Powershell的专属命令是无效的，请提前确认其在CMD中的执行效果。

## 快慢检查周期设置

1. 周期

在一个时间周期内，会有高频率检查阶段和低频率检查阶段，时间周期使用一个数字来描述，例如1800000表示周期长度为1800000毫秒，即半个小时，此时每个一周期的起点和终点分别为时钟的准点和半点。一般将周期设置为一小时的整数分之一，例如半小时、十五分钟等，其他的时间设置则可能带来不好的效果，例如设置为45分钟时，则会跳过过程中的若干个整点。使用-M参数指定

2. 高频率检查范围

在周期起终点前后的给定范围内，可以提高检查频率来提升及时发现讲座的几率，例如给定参数30000，则周期节点前后五分钟内会进入高频率检查。使用-R参数指定

3. 间隔时长

使用-S参数指定高频率检查的周期，使用-L参数指定低频率检查的周期。默认为5秒和1分钟
