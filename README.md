## yunzai-LoliconAPI-paimonV2
基于云崽V3qq机器人的随机返回蛇图

# 命令：
```
#派蒙来份帮助
#派蒙来\\s?(${NumReg})?(张|份|点)(.*)(涩|色|瑟)(图|圖)
#派蒙来份设置涩图cd[num]
#派蒙来份设置涩图张数[num]
#派蒙来份设置(开启|关闭)(r|R)18
#派蒙来份设置我(不)要涩涩
#派蒙来份(清理|(清|删)除)?缓存图片
```

# 使用说明

v2：原始版本：已失效

v3：转发已失效

v4：有几率被风控

v5：目前可用

自行改代理为本地http代理：
(先在你的代理如Clash Meta里面-设置-覆写-http端口和socks端口改为12811)

# 安装方法:

LoliconAPI-paimonV5.js放到plugins/example/，或直接在云/喵崽根目录执行：
```
curl -# -L -o "./plugins/example/派蒙来份涩图.js" "https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/V5/LoliconAPI-paimonV5.js"
```
LoliconAPI.yaml放到config/config/，或直接在云/喵崽根目录执行：
```
curl -# -L -o "./config/config/LoliconAPI.yaml" "https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/V5/LoliconAPI.yaml"
```
```
http://127.0.0.1:12811
```
同时需要安装依赖，进入云崽/喵崽根目录：
```
pnpm add sharp@0.32.5 -w
pnpm add https-proxy-agent@5.0.1 -w
```
ps所需要的依赖如下:
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

# 跑路

但是更推荐去用椰奶插件，不过这两个的api不同，椰奶很多图片被申鹤了，这个api还算好


-END-
