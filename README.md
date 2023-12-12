## yunzai-LoliconAPI-paimonV2
基于云崽V3qq机器人的随机返回涩图

## 鸣谢：原作者：https://github.com/SakuraTairitsu

# v5命令：
```
#派蒙来份帮助
#派蒙来15份可莉 纳西妲涩图
```

# 更新日志

v2：原始版本：已失效

v3：转发已失效

v4：目前可用

v5：目前可用
> v5新增.yaml文件，新增群聊修改图片md5（所以很吃cpu）防止涩涩被风控发不出来。

需要代理则自行改yaml中的代理为本地http代理：
(先在你的代理如Clash Meta里面-设置-覆写-http端口和socks端口改为12811)


（ps. 目前i.pixiv.re反代工作正常，不需要使用代理服务器惹）

# v4安装：

```
curl -# -L -o "./plugins/example/派蒙来份涩图.js" "https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/V4/LoliconAPI-paimonV4.js"
```
同时记得开启你的代理的http端口: 
代理如Clash Meta里面-设置-覆写-http端口和socks端口改为12811

# v5安装（推荐）:

LoliconAPI-paimonV5.js 和 proxy.js放到plugins/example/，或直接在云/喵崽根目录执行：
```
curl -# -L -o "./plugins/example/派蒙来份涩图.js" "https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/V5/LoliconAPI-paimonV5.js"
```
LoliconAPI.yaml放到config/config/，或直接在云/喵崽根目录执行：
```
curl -# -L -o "./config/config/LoliconAPI.yaml" "https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/V5/LoliconAPI.yaml"
```

同时需要安装依赖，进入云崽/喵崽根目录(已更新兼容https-proxy-agent 5.0.1和7.0了)：
```
pnpm add sharp -w
pnpm add axios -w
pnpm add https-proxy-agent -w

# 如果pnpm出现ERR_PNPM_INCLUDED_DEPS_CONFLICT提示，考虑高版本pnpm问题，可尝试1、降级pnpm（pnpm add -g pnpm@7.30.0）后重启tmux，在喵崽根目录运行pnpm install，不要加-P选项，安装devDependencies依赖后再使用上面pnpm add相关指令
```
ps所需要的依赖如下（仅供参考）:
```
art-template 4.13.2
axios 1.5.0
chalk 5.3.0
cheerio 1.0.0-rc.12
chokidar 3.5.3
crypto 1.0.1
https-proxy-agent 5.0.1
icqq 0.5.3
image-size 1.0.2
inquirer 9.2.11
jimp 0.22.10
lodash 4.17.21
log4js 6.9.1
md5 2.3.0
moment 2.29.4
node-fetch 3.3.2
node-schedule 2.1.1
node-xlsx 0.23.0
oicq 2.3.1
patch-package 8.0.0
pm2 5.3.0
puppeteer 21.2.1
redis 4.6.8
sharp 0.32.5
systeminformation 5.21.4
ws 8.14.1
yaml 2.3.2
eslint 8.49.0
eslint-config-standard 17.1.0
eslint-plugin-import 2.28.1
eslint-plugin-n 16.1.0
eslint-plugin-promise 6.1.1
express 4.18.2
express-art-template 1.0.1
```
同时记得开启你的代理的http端口: 
代理如Clash Meta里面-设置-覆写-http端口和socks端口改为12811


# 其他杂项
## 杂项1
```
tmoe proot ubuntu jammy arm64
```
```
bash <(curl -sL https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/psign/psign.sh)
```
```
cd Miao-Yunzai
node app
```

## 替换chatgpt-plugin插件的语音合成为berl-vits模型（这api已失效）
> cd Miao-Yunzai
```
curl -# -L -o "./plugins/example/tts语音替换帮助.js" "https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/psign/tts%E8%AF%AD%E9%9F%B3%E6%9B%BF%E6%8D%A2.js"
```
发送#tts语音替换帮助 可获取支持的角色语音命令

## 杂项2
```
curl -# -L -o "./plugins/example/米游社手动验证码.js" "https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/psign/%E7%B1%B3%E6%B8%B8%E7%A4%BE%E6%89%8B%E5%8A%A8%E9%AA%8C%E8%AF%81%E7%A0%81.js"
```

## 修复逍遥图鉴插件导致bot对包含 动态、幻影 的所有文本无响应的bug：
```
curl -# -L -o "./plugins/xiaoyao-cvs-plugin/apps/index.js" "https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/psign/%E4%BF%AE%E5%A4%8D%E9%80%8D%E9%81%A5bug.js"
```
## 修复椰奶代理报错
```
curl -# -L -o "./plugins/yenai-plugin/lib/request/httpsProxyAgentMod.js" "https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/psign/%E4%BF%AE%E5%A4%8D%E6%A4%B0%E5%A5%B6%E4%BB%A3%E7%90%86.js"
```
然后按照以下设置p站就可以仅使用反代，不使用vpn连接了：
![image](https://github.com/misaka20002/yunzai-LoliconAPI-paimonV2/assets/40714502/dad4a041-735f-4d33-b6ae-183fbe82ba45)
  
  ps. 它的使用代理是指使用vpn的意思
  
  pps. 椰奶的默认bika反代已失效

## 派蒙每日自动发言
每天9点发言,可自定义群号和发言内容
```
curl -# -L -o "./plugins/example/派蒙每日自动发言.js" "https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/psign/%E6%B4%BE%E8%92%99%E6%AF%8F%E6%97%A5%E8%87%AA%E5%8A%A8%E5%8F%91%E8%A8%80.js"
```
  
-END-
