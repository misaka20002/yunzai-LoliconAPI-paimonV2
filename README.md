## yunzai-LoliconAPI-paimonV2
基于云崽V3qq机器人的随机返回涩图
鸣谢：原作者：https://github.com/SakuraTairitsu/LoliconAPI


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

（ps. 目前i.pixiv.re反代工作正常，不需要使用代理服务器）

# v4安装：

```
curl -# -L -o "./plugins/example/派蒙来份涩图.js" "https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/V4/LoliconAPI-paimonV4.js"
```
同时记得开启你的代理的http端口: 
代理如Clash Meta里面-设置-覆写-http端口和socks端口改为12811

# v5安装（推荐）:

LoliconAPI-paimonV5.js 放到plugins/example/，或直接在云/喵崽根目录执行：
```
curl -# -L -o "./plugins/example/派蒙来份涩图.js" "https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/V5/LoliconAPI-paimonV5.js"
```
LoliconAPI.yaml放到config/config/，或直接在云/喵崽根目录执行：
```
curl -# -L -o "./config/config/LoliconAPI.yaml" "https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/V5/LoliconAPI.yaml"
```

同时需要安装依赖，进入云崽/喵崽根目录(已更新兼容https-proxy-agent 5.0.1和7.0了)：
```
pnpm add sharp axios https-proxy-agent -w
```
> 如果pnpm出现ERR_PNPM_INCLUDED_DEPS_CONFLICT提示，考虑高版本pnpm问题，可尝试1、降级pnpm（pnpm add -g pnpm@7.30.0）后重启tmux，在喵崽根目录运行pnpm install，不要加-P选项，安装devDependencies依赖后再使用上面pnpm add相关指令


# 其他杂项

## 派蒙每日自动发言
每天9点发言,可自定义群号和发言内容
```
curl -# -L -o "./plugins/example/派蒙每日自动发言.js" "https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/psign/%E6%B4%BE%E8%92%99%E6%AF%8F%E6%97%A5%E8%87%AA%E5%8A%A8%E5%8F%91%E8%A8%80.js"
```

## 修改签名服务器地址
```
curl -# -L -o "./plugins/example/修改签名服务器地址.js" "https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/psign/%E4%BF%AE%E6%94%B9%E7%AD%BE%E5%90%8D%E6%9C%8D%E5%8A%A1%E5%99%A8%E5%9C%B0%E5%9D%80.js"
```
>^#派蒙来份(修改|查看)?签名服务器地址(帮助)?

## 云崽功能拉黑qq
```
curl -# -L -o "./plugins/example/派蒙崽拉黑QQ.js" "https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/psign/%E6%B4%BE%E8%92%99%E5%B4%BD%E6%8B%89%E9%BB%91QQ.js"
```
>#派蒙崽拉黑qq

## 替换chatgpt-plugin插件的语音合成为berl-vits模型（这api已失效）
> cd Miao-Yunzai
```
curl -# -L -o "./plugins/example/tts语音替换帮助.js" "https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/psign/tts%E8%AF%AD%E9%9F%B3%E6%9B%BF%E6%8D%A2.js"
```
发送#tts语音替换帮助 可获取支持的角色语音命令

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

-END-

![动态访问量](https://count.kjchmc.cn/get/@yunzai-LoliconAPI-paimonV2?theme=moebooru)<br>
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

## 杂项2
```
bash <(curl -sL https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/psign/PaimonPluginsManage.sh)
```


-END-
