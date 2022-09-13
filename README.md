# 学术报告检测工具

该程序依赖于特定的浏览器和驱动，可以选择的选项为：

浏览器|驱动
---|---
[Firefox](https://www.mozilla.org/zh-CN/firefox/)|[Geckodriver](https://github.com/mozilla/geckodriver/releases)
[Chrome](https://www.google.cn/intl/zh-CN/chrome/)|[ChromeDriver](https://chromedriver.chromium.org/)
[Edge](https://www.microsoft.com/zh-cn/edge)|[EdgeDriver](https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/)
Safari|[SafariDriver](https://developer.apple.com/library/archive/releasenotes/General/WhatsNewInSafari/Introduction/Introduction.html#//apple_ref/doc/uid/TP40014305-CH1-SW1)

由于时间限制，目前仅对Firefox做了完整的测试，如果在其他浏览器上遇到问题可以提交issue，着急使用优先使用Firefox。

下面以Firefox为例介绍安装和启动的步骤。

## Step1：安装浏览器

从上方的表格中，下载对应的浏览器后，按照安装向导的指引，完成安装。请尽可能选择和计算机架构对应的版本安装，而不要使用转译版本，如在使用Intel处理器的macOS上应该下载x64版本，而在使用高通平台的Windows 11上应该安装ARM64版本。

## Step2：安装驱动

此处只对Windows的浏览器驱动安装和配置做说明。

下载对应平台和架构（和浏览器同步）的驱动后，将其解压放置到一个你可以确定目录路径的地方，例如你可以在C盘根目录创建一个文件夹C:\webdriver。例如使用Firefox和Geckdriver时，Geckodriver存放的路径应该为：C:\webdriver\geckodriver.exe。

随后，在任务栏搜索按钮或开始菜单中搜索关键词“环境变量”，选择第一个结果“编辑系统环境变量”，在弹出窗口后，按下键盘上的N，可以看到环境变量对话框，在上方的“XXX的用户变量”表中找到变量名一列为Path的变量，双击，会打开一个新的“编辑环境变量”对话框，点击右侧的“新建”，将路径“C:\webdriver”，然后点击确定关闭对话框。注意，三个对话框中的确定都要点击才能完成保存。

此时，右键点击开始菜单，选择“终端”（Windows 11）或“Windows Powershell”（Windows 10），在弹出框中输入geckodriver.exe，并按下回车，应该能看到类似于`1662814628157   geckodriver     INFO    Listening on 127.0.0.1:4444`这样的输出，此时配置已经完成，关闭窗口即可。

## Step3：拉取本仓库

使用Git克隆此仓库或直接下载均可，完成后，使用NPM安装项目依赖，完成后，进行打包`npm run bundle`

## Step4：下载OCR识别训练文件

<https://raw.githubusercontent.com/tesseract-ocr/tessdata/main/eng.traineddata>，下载后，将该文件和本项目放在目录下。

## Step5：启动软件

 `npm run start -u 学号 -p 密码 -b 浏览器的名字`来启动程序。例如

```Powershell
npm run start -u 2021114514 -p "hx#114514" -b firefox
```

注意密码中若有特殊字符，则必须用英文双引号进行包裹，若密码中有英文双引号，则在其前方加入反引号进行转义，更复杂的转义请自行研究；而学号和浏览器名称由于是纯数字和字母，则可以不必这么做。

程序启动后，会弹出一个浏览器窗口，并自动完成登录和进入页面的操作，在自动申请期间，请不要关闭这个窗口，但是可以放在后台。

由于验证码识别有一定的错误率，在连续登陆失败指定的次数，或连续更换指定次数的验证码图片无果后，程序应该会失败退出，但目前还没有这样的案例发生，一般重新启动程序尝试几次即可。

更多选项：使用--help参数查看命令行帮助。

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
npm run start -u 2021114514 -p "hx#114514" -b firefox -f "foobar2000 alert.mp3"
```

> 在Windows中，这个命令是通过CMD执行的，一些Powershell的专属命令是无效的，请提前确认其在CMD中的执行效果。

## 快慢检查周期设置

1. 周期

在一个时间周期内，会有高频率检查阶段和低频率检查阶段，时间周期使用一个数字来描述，例如1800000表示周期长度为1800000毫秒，即半个小时，此时每个一周期的起点和终点分别为时钟的准点和半点。一般将周期设置为一小时的2^n分之一，例如半小时、十五分钟等，其他的时间设置则可能带来不好的效果，例如设置为45分钟时，则会跳过过程中的若干个整点。使用-M参数指定

2. 高频率检查范围

在周期起终点前后的给定范围内，可以提高检查频率来提升及时发现讲座的几率，例如给定参数30000，则周期节点前后五分钟内会进入高频率检查。使用-R参数指定

3. 间隔时长

使用-S参数指定高频率检查的周期，使用-L参数指定低频率检查的周期。默认为5秒和1分钟
