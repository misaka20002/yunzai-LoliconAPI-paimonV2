#!/bin/env bash
export grey="\033[30m"
export red="\033[31m"
export green="\033[32m"
export yellow="\033[33m"
export blue="\033[34m"
export purple="\033[35m"
export cyan="\033[36m"
export white="\033[37m"
export background="\033[0m"
URL="https://ipinfo.io"
Address=$(curl -sL ${URL} | sed -n 's/.*"country": "\(.*\)",.*/\1/p')
if [ "${Address}" = "CN" ]
then
    GitHubMirror="github.moeyy.xyz"
    # GitHubMirror="mirrors.chenby.cn"
fi

if [ -d /usr/local/node/bin ];then
    PATH=$PATH:/usr/local/node/bin
    if [ ! -d $HOME/.local/share/pnpm ];then
        mkdir -p $HOME/.local/share/pnpm
    fi
    PATH=$PATH:/root/.local/share/pnpm
    PNPM_HOME=/root/.local/share/pnpm
fi

function backmain(){
echo
echo -en ${cyan}回车返回${background}
read
main
exit
}

Install_GIT_Plugin(){
EchoPluginPage(){
echo
echo
echo -e ${white}"#######"${green}呆毛版-Plug-In${white}"#######"${background}
echo -e m1.  ${cyan}auto-plugin"             "呆毛-自动插件${background}
echo -e m2.  ${cyan}nai-plugin"              "呆毛-nai插件${background}
echo -e m3.  ${cyan}yenai-plugin"            "呆毛-椰奶插件${background}
echo -e m4.  ${cyan}chatgpt-plugin"          "呆毛-Chatgpt${background}
echo -e m5.  ${cyan}ap-plugin"               "呆毛-sd绘图${background}
echo -e m6.  ${cyan}xiaoyao-cvs-plugin"      "呆毛-原神扫码${background}
echo -e m7.  ${cyan}xiaofei-plugin"          "呆毛-点歌${background}
echo -e m8.  ${cyan}reset-qianyu-plugin"     "呆毛-千羽插件${background}
echo -e m9.  ${cyan}gpti-plugin"             "呆毛-免费gpt${background}
echo -e 1.  ${cyan}miao-plugin"               "喵喵插件${background}
echo -e 2.  ${cyan}xiaoyao-cvs-plugin"        "逍遥图鉴${background}
echo -e 3.  ${cyan}Guoba-Plugin"              "锅巴插件${background}
echo -e 4.  ${cyan}zhi-plugin"                "白纸插件${background}
echo -e 5.  ${cyan}xitian-plugin"             "戏天插件${background}
echo -e 6.  ${cyan}Akasha-Terminal-plugin"    "虚空插件${background}
echo -e 7.  ${cyan}xiuxian-plugin"            "修仙插件${background}
echo -e 8.  ${cyan}Yenai-Plugin"              "椰奶插件${background}
echo -e 9.  ${cyan}xiaofei-plugin"            "小飞插件${background}
echo -e 10. ${cyan}earth-k-plugin"           "土块插件${background}
echo -e 11. ${cyan}py-plugin"                "py插件${background}
echo -e 12. ${cyan}xianxin-plugin"           "闲心插件${background}
echo -e 13. ${cyan}lin-plugin"               "麟插件${background}
echo -e 14. ${cyan}L-plugin"                 "L插件${background}
echo -e 15. ${cyan}qianyu-plugin"            "千羽插件${background}
echo -e 16. ${cyan}ql-plugin"                "清凉图插件${background}
echo -e 17. ${cyan}flower-plugin"            "抽卡插件${background}
echo -e 18. ${cyan}auto-plugin"              "自动化插件${background}
echo -e 19. ${cyan}recreation-plugin"        "娱乐插件${background}
echo -e 20. ${cyan}suiyue-plugin"            "碎月插件${background}
echo -e 21. ${cyan}windoge-plugin"           "风歌插件${background}
echo -e 22. ${cyan}Atlas"                    "原神图鉴${background}
echo -e 23. ${cyan}zhishui-plugin"           "止水插件${background}
echo -e 24. ${cyan}TRSS-Plugin"              "trss插件${background}
echo -e 25. ${cyan}Jinmaocuicuisha"          "脆脆鲨插件${background}
echo -e 26. ${cyan}useless-plugin"           "无用插件${background}
echo -e 27. ${cyan}liulian-plugin"           "榴莲插件${background}
echo -e 28. ${cyan}xiaoye-plugin"            "小叶插件${background}
echo -e 29. ${cyan}rconsole-plugin"          "R插件${background}
echo -e 30. ${cyan}expand-plugin"            "扩展插件${background}
echo -e 31. ${cyan}XiaoXuePlugin"            "小雪插件${background}
echo -e 32. ${cyan}Icepray"                  "冰祈插件${background}
echo -e 33. ${cyan}Tlon-Sky"                 "光遇插件${background}
echo -e 34. ${cyan}hs-qiqi-plugin"           "枫叶插件${background}
echo -e 35. ${cyan}call_of_seven_saints"     "七圣召唤插件${background}
echo -e 36. ${cyan}QQGuild-Plugin"           "QQ频道插件${background}
echo -e 37. ${cyan}xiaoyue-plugin"           "小月插件${background}
echo -e 38. ${cyan}FanSky_Qs"                "繁星插件${background}
echo -e 39. ${cyan}phi-plugin"               "phigros辅助插件${background}
echo -e 40. ${cyan}ap-plugin"                "AI绘图插件${background}
echo -e 41. ${cyan}sanyi-plugin"             "三一插件${background}
echo -e 42. ${cyan}chatgpt-plugin"           "聊天插件${background}
echo -e 43. ${cyan}y-tian-plugin"            "阴天插件${background}
echo -e 44. ${cyan}xianyu-plugin"            "咸鱼插件${background}
echo -e 45. ${cyan}StarRail-plugin"          "星穹铁道插件${background}
echo -e 46. ${cyan}panel-plugin"             "面板图插件${background}
echo -e 47. ${cyan}hanhan-plugin"            "憨憨插件${background}
echo -e 48. ${cyan}avocado-plugin"           "鳄梨插件${background}
echo -e 49. ${cyan}cunyx-plugin"             "寸幼萱插件${background}
echo -e 50. ${cyan}TianRu-plugin"            "天如插件${background}
echo -e 51. ${cyan}ws-plugin"                "ws连接插件${background}
echo -e 52. ${cyan}WeLM-plugin"              "AI对话插件${background}
echo -e 53. ${cyan}Yunzai-Kuro-Plugin"       "库洛插件${background}
echo -e 54. ${cyan}mj-plugin"                "AI绘图插件${background}
echo -e 55. ${cyan}qinghe-plugin"            "卿何插件${background}
echo -e 56. ${cyan}BlueArchive-plugin"       "碧蓝档案插件${background}
echo -e 57. ${cyan}impart-pro-plugin"        "牛牛大作战${background}
echo -e 58. ${cyan}Gi-plugin"                "群互动插件${background}
echo -e 59. ${cyan}MC-PLUGIN"                "MC服务器插件${background}
echo -e 60. ${cyan}mz-plugin"                "名字插件${background}
echo -e 61. ${cyan}nsfwjs-plugin"            "涩图监听插件${background}
echo -e 62. ${cyan}biscuit-plugin"           "饼干插件${background}
echo -e 63. ${cyan}xrk-plugin"               "向日葵插件${background}
echo -e 64. ${cyan}WeChat-Web-plugin"        "微信插件${background}
echo -e 65. ${cyan}btc-memz-plugin"          "BTC插件${background}
echo -e 66. ${cyan}wind-plugin"              "风插件${background}
echo -e 67. ${cyan}ttsapi-yunzai-Plugin"     "TTS语音合成${background}
echo -e 68. ${cyan}Xs-plugin"                "XS插件${background}
echo -e 69. ${cyan}GT-Manual"                "米游社手动验证${background}
echo -e 70. ${cyan}gpti-plugin"              "简化GPT插件${background}
echo -e 71. ${cyan}mijia-plugin"             "米家插件${background}
echo -e 72. ${cyan}1999-plugin"              "1999插件${background}
echo -e 73. ${cyan}Lain-plugin"              "喵崽适配器插件${background}
}

DWPluginPage(){
        if (${dialog_whiptail} \
        --title "呆毛版-Bot-Plugin" \
        --yes-button "单选" \
        --no-button "多选" \
        --yesno "           请选择Git插件安装方式" \
        10 50)
        then
            Single_Choice="true"
            checklist_menu=menu
            OFF=
            tips=
        else
            Single_Choice="false"
            checklist_menu=checklist
            OFF=OFF
            tips="[空格选择 回车确定 空选取消]"
        fi
        if ! number=$(${dialog_whiptail} \
        --title "呆毛版-QQ群:285744328" \
        --${checklist_menu} "选择您喜欢的插件吧! ${tips}" \
        26 60 20 \
        "m1" "auto-plugin                    呆毛-自动插件" ${OFF} \
        "m2" "nai-plugin                     呆毛-nai插件" ${OFF} \
        "m3" "yenai-plugin                   呆毛-椰奶插件" ${OFF} \
        "m4" "chatgpt-plugin                 呆毛-Chatgpt" ${OFF} \
        "m5" "ap-plugin                      呆毛-sd绘图" ${OFF} \
        "m6" "xiaoyao-cvs-plugin             呆毛-原神扫码" ${OFF} \
        "m7" "xiaofei-plugin                 呆毛-点歌" ${OFF} \
        "m8" "reset-qianyu-plugin            呆毛-千羽插件" ${OFF} \
        "m9" "gpti-plugin                    呆毛-免费gpt" ${OFF} \
        "1" "miao-plugin                    喵喵插件" ${OFF} \
        "2" "xiaoyao-cvs-plugin             逍遥图鉴" ${OFF} \
        "3" "Guoba-Plugin                   锅巴插件" ${OFF} \
        "4" "zhi-plugin                     白纸插件" ${OFF} \
        "5" "xitian-plugin                  戏天插件" ${OFF} \
        "6" "Akasha-Terminal-plugin         虚空插件" ${OFF} \
        "7" "xiuxian-plugin                 修仙插件" ${OFF} \
        "8" "Yenai-Plugin                   椰奶插件" ${OFF} \
        "9" "xiaofei-plugin                 小飞插件" ${OFF} \
        "10" "earth-k-plugin                 土块插件" ${OFF} \
        "11" "py-plugin                      py插件" ${OFF} \
        "12" "xianxin-plugin                 闲心插件" ${OFF} \
        "13" "lin-plugin                     麟插件" ${OFF} \
        "14" "L-plugin                       L插件" ${OFF} \
        "15" "qianyu-plugin                  千羽插件" ${OFF} \
        "16" "ql-plugin                      清凉图插件" ${OFF} \
        "17" "flower-plugin                  抽卡插件" ${OFF} \
        "18" "auto-plugin                    自动化插件" ${OFF} \
        "19" "recreation-plugin              娱乐插件" ${OFF} \
        "20" "suiyue-plugin                  碎月插件" ${OFF} \
        "21" "windoge-plugin                 风歌插件" ${OFF} \
        "22" "Atlas                          原神图鉴" ${OFF} \
        "23" "zhishui-plugin                 止水插件" ${OFF} \
        "24" "TRSS-Plugin                    trss插件" ${OFF} \
        "25" "Jinmaocuicuisha                脆脆鲨插件" ${OFF} \
        "26" "useless-plugin                 无用插件" ${OFF} \
        "27" "liulian-plugin                 榴莲插件" ${OFF} \
        "28" "xiaoye-plugin                  小叶插件" ${OFF} \
        "29" "rconsole-plugin                R插件" ${OFF} \
        "30" "expand-plugin                  扩展插件" ${OFF} \
        "31" "XiaoXuePlugin                  小雪插件" ${OFF} \
        "32" "Icepray                        冰祈插件" ${OFF} \
        "33" "Tlon-Sky                       光遇插件" ${OFF} \
        "34" "hs-qiqi-plugin                 枫叶插件" ${OFF} \
        "35" "call_of_seven_saints           七圣召唤插件" ${OFF} \
        "36" "QQGuild-Plugin                 QQ频道插件" ${OFF} \
        "37" "xiaoyue-plugin                 小月插件" ${OFF} \
        "38" "FanSky_Qs                      繁星插件" ${OFF} \
        "39" "phi-plugin                     phigros辅助插件" ${OFF} \
        "40" "ap-plugin                      ap绘图插件" ${OFF} \
        "41" "sanyi-plugin                   三一插件" ${OFF} \
        "42" "chatgpt-plugin                 聊天插件" ${OFF} \
        "43" "y-tian-plugin                  阴天插件" ${OFF} \
        "44" "xianyu-plugin                  咸鱼插件" ${OFF} \
        "45" "StarRail-plugin                星穹铁道插件" ${OFF} \
        "46" "panel-plugin                   面板图插件" ${OFF} \
        "47" "hanhan-plugin                  憨憨插件" ${OFF} \
        "48" "avocado-plugin                 鳄梨插件" ${OFF} \
        "49" "cunyx-plugin                   寸幼萱插件" ${OFF} \
        "50" "TianRu-plugin                  天如插件" ${OFF} \
        "51" "ws-plugin                      ws连接插件" ${OFF} \
        "52" "WeLM-plugin                    AI对话插件" ${OFF} \
        "53" "Yunzai-Kuro-Plugin             库洛插件" ${OFF} \
        "54" "mj-plugin                      AI绘图插件" ${OFF} \
        "55" "qinghe-plugin                  卿何插件" ${OFF} \
        "56" "BlueArchive-plugin             碧蓝档案插件" ${OFF} \
        "57" "impart-pro-plugin              牛牛大作战" ${OFF} \
        "58" "Gi-plugin                      群互动插件" ${OFF} \
        "59" "MC-PLUGIN                      MC服务器插件" ${OFF} \
        "60" "mz-plugin                      名字插件" ${OFF} \
        "61" "nsfwjs-plugin                  涩图监听插件" ${OFF} \
        "62" "biscuit-plugin                 饼干插件" ${OFF} \
        "63" "xrk-plugin                     向日葵插件" ${OFF} \
        "64" "WeChat-Web-plugin              微信插件" ${OFF} \
        "65" "btc-memz-plugin                BTC插件" ${OFF} \
        "66" "wind-plugin                    风插件" ${OFF} \
        "67" "ttsapi-yunzai-Plugin           TTS语音合成" ${OFF} \
        "68" "Xs-plugin                      XS插件" ${OFF} \
        "69" "GT-Manual                      米游社手动验证" ${OFF} \
        "70" "gpti-plugin                    简化GPT插件" ${OFF} \
        "71" "mijia-plugin                   米家插件" ${OFF} \
        "72" "1999-plugin                    1999插件" ${OFF} \
        "73" "Lain-plugin                    喵崽适配器插件" ${OFF} \
        3>&1 1>&2 2>&3)
        then
            backmain
        fi
}

Plugin_name(){
for plugin_number in ${number}
do
    case ${plugin_number} in
        m1)
          Name="${Name} 呆毛-自动插件"
          ;;
        m2)
          Name="${Name} 呆毛-nai插件"
          ;;
        m3)
          Name="${Name} 呆毛-椰奶插件"
          ;;
        m4)
          Name="${Name} 呆毛-Chatgpt"
          ;;
        m5)
          Name="${Name} 呆毛-sd绘图"
          ;;
        m6)
          Name="${Name} 呆毛-原神扫码"
          ;;
        m7)
          Name="${Name} 呆毛-点歌"
          ;;
        m8)
          Name="${Name} 呆毛-千羽插件"
          ;;
        m9)
          Name="${Name} 呆毛-免费gpt"
          ;;
        1)
          Name="${Name} 喵喵插件"
          ;;
        2)
          Name="${Name} 逍遥图鉴"
          ;;
        3)
          Name="${Name} 锅巴插件"
          ;;
        4)
          Name="${Name} 白纸插件"
         ;;
        5)
          Name="${Name} 戏天插件"
          ;;
        6)
          Name="${Name} 虚空插件"
          ;;
        7)
          Name="${Name} 修仙插件"
          ;;
        8)
          Name="${Name} 椰奶插件"
          ;;
        9)
          Name="${Name} 小飞插件"
          ;;
        10)
          Name="${Name} 土块插件"
          ;;
        11)
          Name="${Name} py插件"
          ;;   
        12)
          Name="${Name} 闲心插件"
          ;;
        13)
          Name="${Name} 麟插件"
          ;;
        14)
          Name="${Name} L插件"
          ;;
        15)
          Name="${Name} 千羽插件"
          ;;
        16)
          Name="${Name} 清凉图插件"
          ;;
        17)
          Name="${Name} 抽卡插件"
          ;;
        18)
          Name="${Name} 自动化插件"
          ;;
        19)
          Name="${Name} 娱乐插件"
          ;;
        20)
          Name="${Name} 碎月插件"
          ;;
        21)
          Name="${Name} 风歌插件"
          ;;
        22)
          Name="${Name} Atlas[图鉴]"
          ;;
        23)
          Name="${Name} 止水插件"
          ;;
        24)
          Name="${Name} trss插件"
          ;;
        25)
          Name="${Name} 脆脆鲨插件"
          ;;
        26)
          Name="${Name} 无用插件"
          ;;
        27)
          Name="${Name} 榴莲插件"
          ;;
        28)
          Name="${Name} 小叶插件"
          ;;
        29)
          Name="${Name} R插件"
          ;;
        30)
          Name="${Name} 扩展插件"
          ;;
        31)
          Name="${Name} 小雪插件"
          ;;
        32)
          Name="${Name} 冰祈插件"
          ;;
        33)
          Name="${Name} 光遇插件"
          ;;
        34)
          Name="${Name} 枫叶插件"
          ;;
        35)
          Name="${Name} 七圣召唤插件"
          ;;
        36)
          Name="${Name} QQ频道插件"
          ;;
        37)
          Name="${Name} 小月插件"
          ;;
        38)
          Name="${Name} 繁星插件"
          ;;
        39)
          Name="${Name} phigros辅助插件"
          ;;
        40)
          Name="${Name} ap绘图插件"
          ;;
        41)
          Name="${Name} 三一插件"
          ;;
        42)
          Name="${Name} 聊天插件"
          ;;
        43)
          Name="${Name} 阴天插件"
          ;;
        44)
          Name="${Name} 咸鱼插件"
          ;;
        45)
          Name="${Name} 星穹铁道插件"
          ;;
        46)
          Name="${Name} 面板图插件"
          ;;
        47)
          Name="${Name} 憨憨插件"
          ;;
        48)
          Name="${Name} 鳄梨插件"
          ;;
        49)
          Name="${Name} 寸幼萱插件"
          ;;
        50)
          Name="${Name} 天如插件"
          ;;
        51)
          Name="${Name} ws连接插件"
          ;;
        52)
          Name="${Name} AI对话插件"
          ;;
        53)
          Name="${Name} 库洛插件"
          ;;
        54)
          Name="${Name} mj绘图插件"
          ;;
        55)
          Name="${Name} 卿何插件"
          ;;
        56)
          Name="${Name} 碧蓝档案插件"
          ;;
        57)
          Name="${Name} 牛牛大作战"
          ;;
        58)
          Name="${Name} 群互动插件"
          ;;
        59)
          Name="${Name} MC服务器插件"
          ;;
        60)
          Name="${Name} 名字插件"
          ;;
        61)
          Name="${Name} 涩图监听插件"
          ;;
        62)
          Name="${Name} 饼干插件"
          ;;
        63)
          Name="${Name} 向日葵插件"
          ;;
        64)
          Name="${Name} 微信插件"
          ;;
        65)
          Name="${Name} BTC插件"
          ;;
        66)
          Name="${Name} 风插件"
          ;;
        67)
          Name="${Name} TTS语音合成"
          ;;
        68)
          Name="${Name} XS插件"
          ;;
        69)
          Name="${Name} 米游社手动验证"
          ;;
        70)
          Name="${Name} 简化GPT插件"
          ;;
        71)
          Name="${Name} 简化GPT插件"
          ;;
        71)
          Name="${Name} 米家插件"
          ;;
        72)
          Name="${Name} 1999插件"
          ;;
        73)
          Name="${Name} 喵崽适配器插件"
          ;;
        0)
          echo
          break
          return
          ;;
         esac
    done
}

Plugin_Install(){
Plugin_name
dialog_whiptail_page(){
if [ "${Single_Choice}" = "false" ]
then
  if ! ${dialog_whiptail} --title "呆毛版-Bot-Plugin" \
  --yesno "将会为您安装\n[${Name} ]" \
  20 50
  then
    Name=
    backmain
  fi
else
  if ! ${dialog_whiptail} --title "呆毛版-Bot-Plugin" \
  --yesno "是否安装 ${Name}" \
  8 50
  then
    Name=
    backmain
  fi
fi
}
echo_page(){
echo -e ${cyan}将会为你安装'\n'${blue}${Name}${background}
echo -en ${cyan}是否继续 [Y/N]${background};read YN
if [[ "${YN}" == "Y" ]] || [[ "${YN}" == "y" ]]
then
  YN=Y
elif [[ "${YN}" == "N" ]] || [[ "${YN}" == "n" ]]
then
  Name=
  backmain
else
  Name=
  backmain
fi
}
choose_page
PluginInstall(){
if [ -d plugins/${PluginFolder} ]
then
  if [ "${Single_Choice}" == "false" ]
    then
      echo -e ${cyan}${Name}${green} 已安装${cyan} 跳过${background}
    else
      echo -en ${cyan}${Name} ${green}已安装 ${cyan}是否删除 ${yellow}[N/y]${background}
      read YN
      case ${YN} in
      y)
        echo -e ${red}正在删除${Name}${background}
        rm -rf plugins/${PluginFolder} > /dev/null 2>&1
        rm -rf plugins/${PluginFolder} > /dev/null 2>&1
        echo -en ${green}删除完成 ${background}
        backmain
        ;;
      N)
        echo -en ${green}取消删除${Name} ${background}
        backmain
        ;;
      esac
  fi
else
  if [ "${Single_Choice}" == "false" ]
  then
    echo -e ${white}==================================${background}
    echo -e ${cyan}插件名称: ${yellow}${Name}'/'${PluginFolder}${background}
    echo -e ${cyan}Git 仓库: ${yellow}${Git}${background}
  fi
  echo -e ${white}==================================${background}
  echo -e ${cyan}正在安装: ${yellow}${Name} ${cyan}稍安勿躁~${background}
  echo -e ${white}==================================${background}
  echo
  if git clone --depth=1 ${Git} ./plugins/${PluginFolder}
  then
    if [ -e plugins/${PluginFolder}/package.json ]
    then
      echo -e ${cyan}正在为 ${Name} 安装依赖${background}
      cd plugins/${PluginFolder}
      if ! echo "Y" | pnpm install
      then
        echo ${yellow}${Name} 依赖安装失败 跳过${background}
        rm -rf plugins/${PluginFolder} > /dev/null 2>&1
        rm -rf plugins/${PluginFolder} > /dev/null 2>&1
      fi
      cd ../../
    else
      echo -e ${cyan}${Name} ${green}安装成功${background}
      echo
    fi
  else
    echo -e ${yellow}${Name} 安装失败 跳过${background}
    rm -rf plugins/${PluginFolder} > /dev/null 2>&1
    rm -rf plugins/${PluginFolder} > /dev/null 2>&1
  fi
fi
}
Name=
for plugin_number in ${number}
do
    case ${plugin_number} in
        m1)
          Name="呆毛版-自动插件"
          Git="https://${GitHubMirror}/https://github.com/misaka20002/auto-plugin.git"
          PluginFolder="auto-plugin"
          PluginInstall
          ;;
        m2)
          Name="nai插件"
          Git="https://${GitHubMirror}/https://github.com/misaka20002/nai-plugin.git"
          PluginFolder="nai-plugin"
          PluginInstall
          ;;
        m3)
          Name="呆毛版-椰奶插件"
          Git="https://${GitHubMirror}/https://github.com/misaka20002/yenai-plugin.git"
          PluginFolder="yenai-plugin"
          PluginInstall
          ;;
        m4)
          Name="呆毛版-Chatgpt"
          Git="https://${GitHubMirror}/https://github.com/misaka20002/chatgpt-plugin.git"
          PluginFolder="chatgpt-plugin"
          PluginInstall
          ;;
        m5)
          Name="呆毛版-sd绘图"
          Git="https://${GitHubMirror}/https://github.com/misaka20002/ap-plugin.git"
          PluginFolder="ap-plugin"  
          PluginInstall
          ;;
        m6)
          Name="呆毛版-原神扫码登录"
          Git="https://${GitHubMirror}/https://github.com/misaka20002/xiaoyao-cvs-plugin.git"
          PluginFolder="xiaoyao-cvs-plugin"
          PluginInstall
          ;;
        m7)
          Name="呆毛版-点歌"
          Git="https://${GitHubMirror}/https://github.com/misaka20002/xiaofei-plugin.git"
          PluginFolder="xiaofei-plugin"
          PluginInstall
          ;;
        m8)
          Name="呆毛版-千羽插件"
          Git="https://${GitHubMirror}/https://github.com/misaka20002/-reset-qianyu-plugin.git"
          PluginFolder="reset-qianyu-plugin"
          PluginInstall
          ;;
        m9)
          Name="呆毛版-免费gpt4"
          Git="https://${GitHubMirror}/https://github.com/misaka20002/gpti-plugin.git"
          PluginFolder="gpti-plugin"
          PluginInstall
          ;;
        1)
          Name="喵喵插件"
          Git="https://gitee.com/yoimiya-kokomi/miao-plugin.git"
          PluginFolder="miao-plugin"
          PluginInstall
          ;;
        2)
          Name="逍遥图鉴"
          Git="https://gitee.com/Ctrlcvs/xiaoyao-cvs-plugin.git"
          PluginFolder="xiaoyao-cvs-plugin"
          PluginInstall
          ;;
        3)
          Name="锅巴插件"
          Git="https://gitee.com/guoba-yunzai/guoba-plugin.git"
          PluginFolder="Guoba-Plugin"
          PluginInstall
          ;;
        4)
          Name="白纸插件"
          Git="https://gitee.com/headmastertan/zhi-plugin.git"
          PluginFolder="zhi-plugin"
          PluginInstall
          ;;
        5)
          Name="戏天插件"
          Git="https://gitee.com/XiTianGame/xitian-plugin.git"
          PluginFolder="xitian-plugin"
          PluginInstall
          ;;
        6)
          Name="虚空插件"
          Git="akasha-terminal-plugin"
          PluginFolder="https://gitee.com/go-farther-and-farther/akasha-terminal-plugin.git"
          PluginInstall
          ;;
        7)
          Name="修仙插件"
          Git="-b build https://gitee.com/ningmengchongshui/xiuxian-plugin.git"
          PluginFolder="xiuxian-plugin"
          PluginInstall
          ;;
        8)
          Name="椰奶插件"
          Git="https://gitee.com/yeyang52/yenai-plugin.git"
          PluginFolder="yenai-plugin"
          PluginInstall
          ;;
        9)
          Name="小飞插件"
          Git="https://gitee.com/xfdown/xiaofei-plugin.git"
          PluginFolder="xiaofei-plugin"
          PluginInstall
          ;;
        10)
          Name="土块插件"
          Git="https://gitee.com/SmallK111407/earth-k-plugin.git"
          PluginFolder="earth-k-plugin"
          PluginInstall
          ;;
        11)
          Name="py插件 (需要手动装依赖)"
          Git="https://gitee.com/realhuhu/py-plugin.git"
          PluginFolder="py-plugin"
          PluginInstall
          ;;   
        12)
          Name="闲心插件"
          Git="https://gitee.com/xianxincoder/xianxin-plugin.git"
          PluginFolder="xianxin-plugin"
          PluginInstall
          ;;
        13)
          Name="麟插件"
          Git="https://gitee.com/go-farther-and-farther/lin-plugin.git"
          PluginFolder="lin-plugin"
          PluginInstall
          ;;
        14)
          Name="L插件"
          Git="https://${GitHubMirror}/https://github.com/liuly0322/l-plugin.git"
          PluginFolder="l-plugin"
          PluginInstall
          ;;
        15)
          Name="千羽插件"
          Git="https://gitee.com/think-first-sxs/reset-qianyu-plugin.git"
          PluginFolder="reset-qianyu-plugin"
          PluginInstall
          ;;
        16)
          Name="清凉图插件"
          Git="https://gitee.com/xwy231321/ql-plugin.git"
          PluginFolder="ql-plugin"
          PluginInstall
          ;;
        17)
          Name="抽卡插件"
          Git="https://gitee.com/Nwflower/flower-plugin.git"
          PluginFolder="flower-plugin"
          PluginInstall
          ;;
        18)
          Name="自动化插件"
          Git="https://gitee.com/Nwflower/auto-plugin.git"
          PluginFolder="auto-plugin"
          PluginInstall
          ;;
        19) #已跑路
          Name="参考插件"
          Git="https://${GitHubMirror}/https://github.com/Cold-666/refer-plugin.git"
          PluginFolder="refer-plugin"
          PluginInstall
          ;;
        20)
          Name="碎月插件"
          Git="https://gitee.com/Acceleratorsky/suiyue.git"
          PluginFolder="suiyue"
          PluginInstall
          ;;
        21)
          Name="风歌插件"
          Git="https://gitee.com/windoge/windoge-plugin.git"
          PluginFolder="windoge-plugin"
          PluginInstall
          ;;
        22)
          Name="Atlas[图鉴]"
          Git="https://gitee.com/Nwflower/atlas"
          PluginFolder="Atlas"
          PluginInstall
          ;;
        23)
          Name="止水插件"
          Git="https://gitee.com/fjcq/zhishui-plugin.git"
          PluginFolder="zhishui-plugin"
          PluginInstall
          ;;
        24)
          Name="trss插件"
          Git="https://gitee.com/TimeRainStarSky/TRSS-Plugin.git"
          PluginFolder="TRSS-Plugin"
          PluginInstall
          ;;
        25) #已跑路
          Name="脆脆鲨插件"
          Git="https://gitee.com/JMCCS/jinmaocuicuisha.git"
          PluginFolder="Jinmaocuicuisha-plugin"
          PluginInstall
          ;;
        26)
          Name="无用插件"
          Git="https://gitee.com/SmallK111407/useless-plugin.git"
          PluginFolder="useless-plugin"
          PluginInstall
          ;;
        27)
          Name="榴莲插件"
          Git="https://gitee.com/huifeidemangguomao/liulian-plugin.git"
          PluginFolder="liulian-plugin"
          PluginInstall
          ;;
        28)
          Name="小叶插件"
          Git="https://gitee.com/xiaoye12123/xiaoye-plugin.git"
          PluginFolder="xiaoye-plugin"
          PluginInstall
          ;;
        29)
          Name="R插件"
          Git="https://gitee.com/kyrzy0416/rconsole-plugin.git"
          PluginFolder="rconsole-plugin"
          PluginInstall
          ;;
        30) #已跑路
          Name="扩展插件"
          Git="https://gitee.com/SmallK111407/expand-plugin.git"
          PluginFolder="expand-plugin"
          PluginInstall
          ;;
        31)
          Name="小雪插件"
          Git="https://gitee.com/XueWerY/XiaoXuePlugin.git"
          PluginFolder="XiaoXuePlugin"
          PluginInstall
          ;;
        32)
          Name="冰祈插件"
          Git="https://gitee.com/koinori/Icepray.git"
          PluginFolder="Icepray"
          PluginInstall
          ;;
        33)
          Name="光遇插件"
          Git="https://gitee.com/Tloml-Starry/Tlon-Sky.git"
          PluginFolder="Tlon-Sky"
          PluginInstall
          ;;
        34)
          Name="枫叶插件"
          Git="https://gitee.com/kesally/hs-qiqi-cv-plugin.git"
          PluginFolder="hs-qiqi-plugin"
          PluginInstall
          ;;
        35) #已跑路
          Name="七圣召唤插件"
          Git="https://gitee.com/huangshx2001/call_of_seven_saints.git"
          PluginFolder="call_of_seven_saints"
          PluginInstall
          ;;
        36) #已跑路
          Name="QQ频道插件"
          Git="https://gitee.com/Zyy955/QQGuild-plugin"
          PluginFolder="QQGuild-Plugin"
          PluginInstall
          ;;
        37)
          Name="小月插件"
          Git="https://gitee.com/bule-Tech/xiaoyue-plugin.git"
          PluginFolder="xiaoyue-plugin"
          PluginInstall
          ;;
        38)
          Name="繁星插件"
          Git="https://gitee.com/FanSky_Qs/FanSky_Qs.git"
          PluginFolder="FanSky_Qs"
          PluginInstall
          ;;
        39)
          Name="phigros辅助插件"
          Git="https://${GitHubMirror}/https://github.com/Catrong/phi-plugin.git"
          PluginFolder="phi-plugin"
          PluginInstall
          ;;
        40)
          Name="ap绘图插件"
          Git="https://gitee.com/yhArcadia/ap-plugin.git"
          PluginFolder="ap-plugin"
          PluginInstall
          ;;
        41)
          Name="三一插件"
          Git="https://gitee.com/ThreeYi/sanyi-plugin.git"
          PluginFolder="sanyi-plugin"
          PluginInstall
          ;;
        42)
          Name="聊天插件"
          Git="https://gitee.com/ikechan/chatgpt-plugin.git"
          PluginFolder="chatgpt-plugin"
          PluginInstall
          ;;
        43)
          Name="阴天插件"
          Git="https://gitee.com/wan13877501248/y-tian-plugin.git"
          PluginFolder="y-tian-plugin"
          PluginInstall
          ;;
        44)
          Name="咸鱼插件"
          Git="https://gitee.com/suancaixianyu/xianyu-plugin.git"
          PluginFolder="xianyu-plugin"
          PluginInstall
          ;;
        45)
          Name="星穹铁道插件"
          Git="https://gitee.com/hewang1an/StarRail-plugin.git"
          PluginFolder="StarRail-plugin"
          PluginInstall
          ;;
        46) #删除
          Name="面板图插件"
          PluginFolder="panel-plugin"
          Git="https://gitee.com/yunzai-panel/panel-plugin.git"
          PluginInstall
          ;;
        47)
          Name="憨憨插件"
          Git="https://gitee.com/han-hanz/hanhan-plugin.git"
          PluginFolder="hanhan-plugin"
          PluginInstall
          ;;
        48)
          Name="鳄梨插件"
          Git="https://gitee.com/sean_l/avocado-plugin.git"
          PluginFolder="avocado-plugin"
          PluginInstall
          ;;
        49)
          Name="寸幼萱插件"
          Git="https://gitee.com/cunyx/cunyx-plugin.git"
          PluginFolder="cunyx-plugin"
          PluginInstall
          ;;
        50)
          Name="天如插件"
          Git="https://gitee.com/HDTianRu/TianRu-plugin.git"
          PluginFolder="TianRu-plugin"
          PluginInstall
          ;;
        51)
          Name="ws连接插件"
          Git="https://gitee.com/xiaoye12123/ws-plugin.git"
          PluginFolder="ws-plugin"
          PluginInstall
          ;;
        52)
          Name="AI对话插件"
          Git="https://gitee.com/shuciqianye/yunzai-custom-dialogue-welm.git"
          PluginFolder="WeLM-plugin"
          PluginInstall
          ;;
        53)
          Name="库洛插件"
          Git="https://gitee.com/TomyJan/Yunzai-Kuro-Plugin.git"
          PluginFolder="Yunzai-Kuro-Plugin"
          PluginInstall
          ;;
        54)
          Name="mj绘图插件"
          Git="https://gitee.com/CikeyQi/mj-plugin.git"
          PluginFolder="mj-plugin"
          PluginInstall
          ;;
        55) #删除
          Name="卿何插件"
          Git="https://gitee.com/Tloml-Starry/qinghe-plugin.git"
          PluginFolder="qinghe-plugin"
          PluginInstall
          ;;
        56)
          Name="碧蓝档案插件"
          Git="https://gitee.com/all-thoughts-are-broken/blue-archive.git"
          PluginFolder="BlueArchive-plugin"
          PluginInstall
          ;;
        57)
          Name="牛牛大作战"
          Git="https://gitee.com/sumght/impart-pro-plugin.git"
          PluginFolder="impart-pro-plugin"
          PluginInstall
          ;;
        58)
          Name="群互动插件"
          Git="https://gitee.com/qiannqq/gi-plugin.git"
          PluginFolder="Gi-plugin"
          PluginInstall
          ;;
        59)
          Name="MC服务器插件"
          Git="https://gitee.com/CikeyQi/mc-plugin.git"
          PluginFolder="mc-plugin"
          PluginInstall
          ;;
        60)
          Name="名字插件"
          Git="https://gitee.com/xyb12345678qwe/mz-plugin.git"
          PluginFolder="mz-plugin"
          PluginInstall
          ;;
        61)
          Name="涩图监听插件"
          Git="https://gitee.com/CikeyQi/nsfwjs-plugin.git"
          PluginFolder="nsfwjs-plugin"
          PluginInstall
          ;;
        62)
          Name="饼干插件"
          Git="https://gitee.com/Yummy-cookie/biscuit-plugin.git"
          PluginFolder="biscuit-plugin"
          PluginInstall
          ;;
        63)
          Name="向日葵插件"
          Git="https://gitee.com/xrk114514/xrk-plugin.git"
          PluginFolder="xrk-plugin"
          PluginInstall
          ;;
        64)
          Name="微信插件"
          Git="https://gitee.com/Zyy955/WeChat-Web-plugin.git"
          PluginFolder="WeChat-Web-plugin"
          PluginInstall
          ;;
        65)
          Name="BTC插件"
          Git="https://gitee.com/memz2007/btc-memz-plugin.git"
          PluginFolder="btc-memz-plugin"
          PluginInstall
          ;;
        66)
          Name="风插件"
          Git="https://gitee.com/wind-trace-typ/wind-plugin.git"
          PluginFolder="wind-plugin"
          PluginInstall
          ;;
        67)
          Name="TTS语音合成"
          Git="https://gitee.com/TsaiXingyu/ttsapi-yunzai-Plugin.git"
          PluginFolder="ttsapi-yunzai-Plugin"
          PluginInstall
          ;;
        68)
          Name="XS插件"
          Git="https://gitee.com/hsxfk/Xs-plugin"
          PluginFolder="Xs-plugin"
          PluginInstall
          ;;
        69)
          Name="米游社手动验证"
          Git="https://gitee.com/haanxuan/GT-Manual"
          PluginFolder="GT-Manual"
          PluginInstall
          ;;
        70)
          Name="简化GPT插件"
          Git="${GitHubMirror}/https://github.com/CikeyQi/gpti-plugin"
          PluginFolder="gpti-plugin"
          PluginInstall
          ;;
        71)
          Name="米家插件"
          Git="${GitHubMirror}/https://github.com/CikeyQi/mijia-plugin"
          PluginFolder="mijia-plugin"
          PluginInstall
          ;;
        72)
          Name="1999插件"
          Git="https://gitee.com/fantasy-hx/1999-plugin"
          PluginFolder="1999-plugin"
          PluginInstall
          ;;
        73)
          Name="喵崽适配器插件"
          Git="https://gitee.com/Zyy955/Lain-plugin"
          PluginFolder="Lain-plugin"
          PluginInstall
          ;;
        0)
          echo
          break
          return
          ;;
         esac
done
}
    number=
    function dialog_whiptail_page(){
        DWPluginPage
        if [[ -z ${number} ]];then
            echo
            echo -en ${red}输入错误 ${cyan}回车返回${background};read
            main
            exit
        fi
    }
    function echo_page(){
        EchoPluginPage      
        echo
        echo -e ${green}0. ${cyan}返回${background}
        echo "#####################################"
        echo
        echo -en ${green}请输入您需要安装插件的序号,可以多选,用[空格]分开:${background}
        Single_Choice="false"
        read -p " " number
        if [ "${number}" == "0" ];then
            main
            exit
        elif [ -z ${number} ];then
            echo
            echo -en ${red}输入错误 ${cyan}回车返回${background};read
            main
            exit
        fi
    } #echo_page
        choose_page
        number=$(echo ${number} | sed 's|"||g')
        name=$(Plugin_name)
        Plugin_Install
        echo
        echo -en ${cyan}全部插件安装完成 ${background}
        backmain
}

Install_JS_Plugin(){
echo
echo
echo "#######################"
echo -e ${green}1. ${blue}通过 gitee/github 链接安装${background}
echo -e ${green}2. ${blue}通过 Download 文件夹安装[仅限termux]${background}
echo -e ${green}3. ${blue}一键安装呆毛版单独js包${background}
echo
echo -e ${green}0. ${blue}返回${background}
echo "#######################"
echo -en ${green}请输入选项${background};read number
    if [ -z ${number} ];then
            main
            exit
    fi
    if [ "${number}" == "1" ];then
        echo
        echo -en ${green}请输入链接: ${background};read js
        jsname=`echo $js | awk -F/ '{print $NF}'`
        if [[ ${js} != https://* ]] || [[ ${js} != *.js ]];then
          echo -e ${red}输入错误${background}
          exit
        fi
        cd ${Plugin_Path}/plugins/example
        if [[ ${js} = *gitee* ]]
            then
                if [[ ${js} = *raw* ]]
                    then
                       curl ${js} > ${jsname}
                elif [[ ${js} = *blob* ]]
                    then
                       js=$(echo ${js} | sed "s/blob/raw/g")
                       curl ${js} > ${jsname}
                fi
        elif [[ ${js} = *github* ]]
            then
                if [[ ${js} = *raw* ]]
                    then
                        curl "https://${GitHubMirror}/${js}" > ${jsname}
                elif [[ ${js} = *blob* ]]
                    then
                        js=$(echo ${js} | sed "s|blob/||g" | sed "s|github|raw.githubusercontent|g" )
                        curl "https://${GitHubMirror}/${js}" > ${jsname}
                fi
        fi
        cd ../
        echo -en ${yellow}安装完成${background}
        backmain
    elif [ "${number}" == 2 ];then
        if [ -d "/media/sd" ];then
            sdpath=/media/sd
        fi
        if [ -d "/media/sd/Download" ];then
            sdpath=/media/sd/Download
        fi
        if [ -d "/sdcard/Download" ];then
            sdpath=/sdcard/Download
        fi
        if [ -d "/storage/emulated/0/Download" ];then
            sdpath=/storage/emulated/0/Download
        fi
        if [ ! -z "${sdpath}" ];then
            echo -e ${red}目录不存在!${background}
            backmain
        fi
    i=1
    if ls ${sdpath} | grep *.js;then
        echo -e ${red}该目录没有JS插件${background}
        backmain
    fi
    for file in $(ls ${sdpath})
    do
        if [[ ${file} = *".js" ]];then
           echo -e ${green}${i}". "${blue}${file}${background}
           i=$((${i}+1))
        fi
    done
        echo
        echo -e ${green}0. ${blue}返回${background}
        echo "#######################"
        echo -en ${green}请输入您要安装的插件的序号[多个插件请用空格分开]:${background}
        read -p " " Number
        Number=$(echo ${Number} | sed 's|"||g')
        for Num in ${Number}
        do
            js_file=$(ls *.js -1 | grep .js | sed -n "${Num}p")
            mv -f ${sdpath}/js_file ${Plugin_Path}/plugins/example/js_file
        done
        echo -en ${yellow}安装完成${background}
        backmain
    elif [ "${number}" == "3" ];then
        curl "https://${GitHubMirror}/https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/V5/LoliconAPI-paimonV5.js" > "./plugins/example/派蒙来份涩图.js"
        curl "https://${GitHubMirror}/https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/V5/LoliconAPI.yaml" > "./config/config/LoliconAPI.yaml"
        curl "https://${GitHubMirror}/https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/psign/%E4%BF%AE%E6%94%B9%E7%AD%BE%E5%90%8D%E6%9C%8D%E5%8A%A1%E5%99%A8%E5%9C%B0%E5%9D%80.js" > "./plugins/example/修改签名服务器地址.js"
        curl "https://${GitHubMirror}/https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/psign/%E6%B4%BE%E8%92%99%E5%B4%BD%E6%8B%89%E9%BB%91QQ.js" > "./plugins/example/派蒙崽拉黑QQ.js"
        curl "https://${GitHubMirror}/https://gitee.com/little-flower-flower/yzjs/raw/master/%E5%A4%87%E4%BB%BD&%E8%BF%98%E5%8E%9F.js" > "./plugins/example/备份还原config.js"
        curl "https://${GitHubMirror}/https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/psign/%E7%B1%B3%E6%B8%B8%E7%A4%BE%E6%89%8B%E5%8A%A8%E9%AA%8C%E8%AF%81%E7%A0%81.js" > "./plugins/example/米游社手动验证码.js"
        echo -en ${yellow}安装完成${background}
        backmain
    fi
}

Update_GIT_Plugin(){
    cd ${Plugin_Path}
    git_pull(){
    echo -e ${yellow}正在更新 ${Name}${background}
    if ! git pull -f
    then
        echo -en ${red}${Name}更新失败 ${yellow}是否强制更新 [Y/N]${background};read YN
        case ${YN} in
        Y|y)
            remote=$(grep 'remote =' .git/config | sed 's/remote =//g')
            remote=$(echo ${remote})
            branch=$(grep branch .git/config | sed "s/\[branch \"//g" | sed 's/"//g' | sed "s/\]//g")
            branch=$(echo ${branch})
            git fetch --all
            git reset --hard ${remote}/${branch}
            git_pull
        esac
    fi
    }
    for folder in $(ls plugins)
    do
        if [ -d plugins/${folder}/.git ];then
            cd plugins/${folder}
            Name=${folder}
            git_pull
            cd ../../
        fi
    done
    echo -en ${yellow}更新完成 回车返回${background};read
}

Delete_GIT_Plugin(){
    dialog_whiptail_page(){
        files=$(ls -I example -I bin -I other -I system -I genshin plugins)
        options=""
        i=1
        for file in ${files}
        do
          options="${options} ${i} ${file} OFF"
          i=$((${i}+1))
        done
        options="${options} 0. 返回 OFF"
        Number=$(${dialog_whiptail} \
        --title "呆毛版" \
        --checklist "请选择要删除的GIT插件" \
        28 45 20 ${options} \
        3>&1 1>&2 2>&3)
    }
    echo_page(){
        i=1
        echo
        echo "#######################"
        for file in $(ls -I example -I bin -I other -I system -I genshin plugins)
        do
            echo -e ${green}${i}". "${cyan}${file}${background}
            i=$((${i}+1))
            done
            echo
            echo -e ${green}0.${cyan}返回${background}
            echo "#######################"
        echo -en ${cyan}请输入您要删除的插件序号[多个插件请用空格分开]:${background}
        read Number
    }
    choose_page
    if [ "${Number}" == "0" ];then
        backmain
    elif [[ -z ${Number} ]];then
        echo -en ${red}输入错误${background}
        backmain
    fi
    file_folder=
    Git_Plugin=
    Number=$(echo ${Number} | sed 's|"||g' | sed 's|0.||g')
    for Num in ${Number}
    do
        file_folder=$(ls -1 -I example -I bin -I other -I system -I genshin plugins | sed -n "${Num}p")
        Git_Plugin="${Git_Plugin} ${file_folder}"
    done
    echo -en ${red}是否删除${Git_Plugin} ${cyan}[N/Y]${background}
    read YN
    case ${YN} in
    Y)
        for Num in ${Number}
        do
            file_folder=$(ls -1 -I example -I bin -I other -I system -I genshin plugins | sed -n "${Num}p")
            rm -rf plugins/${file_folder} > /dev/null 2>&1
            rm -rf plugins/${file_folder} > /dev/null 2>&1
            echo -e ${cyan}已删除${file_folder}${background}
        done
        echo
        echo -en ${yellow}删除完成${background}
        backmain
    ;;
    N|n|*)
        echo -en ${green}取消${background}
        backmain
    ;;
    esac
}

Delete_JS_Plugin(){
    dialog_whiptail_page(){
        files=$(ls -I example -I bin -I other -I system -I genshin plugins/example)
        options=""
        i=1
        for file in ${files}
        do
          options="${options} ${i} ${file} OFF"
          i=$((${i}+1))
        done
        options="${options} 0. 返回 OFF"
        Number=$(${dialog_whiptail} \
        --title "呆毛版" \
        --checklist "请选择要删除的GIT插件" \
        28 45 20 ${options} \
        3>&1 1>&2 2>&3)
    }
    echo_page(){
        i=1
        echo
        echo "#######################"
        for file in $(ls -I example -I bin -I other -I system -I genshin plugins/example)
        do
            echo -e ${green}${i}". "${cyan}${file}${background}
            i=$((${i}+1))
            done
            echo
            echo -e ${green}0.${cyan}返回${background}
            echo "#######################"
        echo -en ${cyan}请输入您要删除的插件序号[多个插件请用空格分开]:${background}
        read Number
    }
    choose_page
    if [ "${Number}" == "0" ];then
        backmain
    elif [[ -z ${Number} ]];then
        echo -en ${red}输入错误${background}
        backmain
    fi
    file=
    Git_Plugin=
    Number=$(echo ${Number} | sed 's|"||g' | sed 's|0.||g')
    for Num in ${Number}
    do
        file=$(ls -1 -I example -I bin -I other -I system -I genshin plugins/example | sed -n "${Num}p")
        JS_Plugin="${JS_Plugin} ${file}"
    done
    echo -en ${red}是否删除${JS_Plugin} ${cyan}[N/Y]${background}
    read YN
    case ${YN} in
    Y)
        for Num in ${Number}
        do
            file=$(ls -1 -I example -I bin -I other -I system -I genshin plugins/example | sed -n "${Num}p")
            rm -rf plugins/example/${file} > /dev/null 2>&1
            rm -rf plugins/example/${file} > /dev/null 2>&1
            echo -e ${cyan}已删除${file}${background}
        done
        echo
        echo -en ${yellow}删除完成${background}
        backmain
    ;;
    N|n|*)
        echo -en ${green}取消${background}
        backmain
    ;;
    esac
}

function main(){
function dialog_whiptail_page(){
number=$(${dialog_whiptail} \
--title "呆毛版" \
--menu "呆毛版的QQ群:285744328" \
20 40 10 \
"1" "安装GIT插件" \
"2" "安装JS插件" \
"3" "更新GIT插件" \
"4" "删除GIT插件" \
"5" "删除JS插件" \
"0" "返回/退出" \
3>&1 1>&2 2>&3)
feedback=$?
feedback
}
function echo_page(){
    echo
    echo
    echo -e ${white}"#####"${green}呆毛版-Yunzai-Bot${white}"#####"${background}
    echo -e ${blue}请选择您要为哪一个bot管理插件${background}
    echo "#########################"
    echo -e ${green}1.  ${cyan}安装GIT插件${background}
    echo -e ${green}2.  ${cyan}安装JS插件${background}
    echo -e ${green}3.  ${cyan}更新GIT插件${background}
    echo -e ${green}4.  ${cyan}删除GIT插件${background}
    echo -e ${green}5.  ${cyan}删除JS插件${background}
    echo -e ${green}0.  ${cyan}返回\/退出${background}
    echo "#########################"
    echo -e ${green}QQ群:${cyan}狐狸窝:285744328${background}
    echo "#########################"
    echo
    echo -en ${green}请输入您的选项: ${background};read number
}
choose_page
if [ -z ${number} ];then
    main
    exit
fi
if [ "${number}" == "1" ];then
    Install_GIT_Plugin
elif [ "${number}" == "2" ];then
    Install_JS_Plugin
elif [ "${number}" == "3" ];then
    Update_GIT_Plugin
elif [ "${number}" == "4" ];then
    Delete_GIT_Plugin
elif [ "${number}" == "5" ];then
    Delete_JS_Plugin
elif [ "${number}" == "0" ];then
    return
fi
}


function choose_path(){
function dialog_whiptail_page(){ 
number=$(${dialog_whiptail} \
--title "呆毛版 QQ群:285744328" \
--menu "请选择您要为哪一个bot管理插件" \
20 40 10 \
"1" "Yunzai-Bot" \
"2" "Miao-Yunzai" \
"3" "yunzai-bot-lite" \
"4" "TRSS-Yunzai" \
"5" "Yxy-Bot" \
"6" "切换文字版菜单" \
"0" "退出" \
3>&1 1>&2 2>&3)
feedback=$?
feedback
}
function echo_page(){
    echo
    echo
    echo -e ${white}"#####"${green}呆毛版-Yunzai-Bot${white}"#####"${background}
    echo -e ${blue}请选择您要为哪一个bot管理插件${background}
    echo "#########################"
    echo -e ${green}1.  ${cyan}Yunzai-Bot${background}
    echo -e ${green}2.  ${cyan}Miao-Yunzai${background}
    echo -e ${green}3.  ${cyan}yunzai-bot-lite${background}
    echo -e ${green}4.  ${cyan}TRSS-Yunzai${background}
    echo -e ${green}5.  ${cyan}Yxy-Bot${background}
    echo -e ${green}0.  ${cyan}退出${background}
    echo "#########################"
    echo -e ${green}QQ群:${cyan}狐狸窝:285744328${background}
    echo "#########################"
    echo
    echo -en ${green}请输入您的选项: ${background};read number
    #clear
}
choose_page

case ${number} in
1)
if [ -d /root/TRSS_AllBot ];then
  Bot_Name=Yunzai
else
  Bot_Name=Yunzai-Bot
fi
;;
2)
Bot_Name=Miao-Yunzai
;;
3)
Bot_Name=yunzai-bot-lite
;;
4)
Bot_Name=TRSS-Yunzai
;;
5)
Bot_Name=yxybot
;;
6)
Linux
page=echo_page
pnpm_install
path
main
;;
0)
exit
;;
*)
echo
echo -e ${red}输入错误${background}
exit
;;
esac
if [ -d "/root/${Bot_Name}/node_modules" ];then
    Plugin_Path="/root/${Bot_Name}"
    cd ${Plugin_Path}
elif [ -d "/root/.fox@bot/${Bot_Name}/node_modules" ];then
    Plugin_Path="/root/.fox@bot/${Bot_Name}"
    cd ${Plugin_Path}
elif [ -d "/home/lighthouse/ubuntu/${Bot_Name}/node_modules" ];then
    Plugin_Path="/home/lighthouse/ubuntu/${Bot_Name}"
    cd ${Plugin_Path}
elif [ -d "/home/lighthouse/centos/${Bot_Name}/node_modules" ];then
    Plugin_Path="/home/lighthouse/centos/${Bot_Name}"
    cd ${Plugin_Path}
elif [ -d "/home/lighthouse/debian/${Bot_Name}/node_modules" ];then
    Plugin_Path="/home/lighthouse/debian/${Bot_Name}"
    cd ${Plugin_Path}
elif [ -d "/root/TRSS_AllBot/${Bot_Name}/node_modules" ];then
    Plugin_Path="/root/TRSS_AllBot/${Bot_Name}"
    cd ${Plugin_Path}
else
    function dialog_whiptail_page(){
        ${dialog_whiptail} --title "呆毛版≧▽≦" \
        --msgbox "自动判断路径失败 \n请进入${Bot_Name}目录后 使用本脚本" 10 43
        exit
    }
    function echo_page(){
        echo
        echo -e ${red}未在此目录下找到${name}的插件文件夹${background}
        echo -e ${red}请进入 ${name}目录 之后使用本脚本${background}
        exit
    }
    choose_page
fi
}

function package_install(){
if [ $(command -v apt) ];then
    pkg_install="apt install -y"
elif [ $(command -v yum) ];then
    pkg_install="yum install -y"
elif [ $(command -v dnf) ];then
    pkg_install="dnf install -y"
elif [ $(command -v pacman) ];then
    pkg_install="pacman -Syy --noconfirm --needed"
fi

function pkg_install(){
i=0
echo -e ${yellow}未安装${pkg} 开始安装${background}
if [ ! -z "$1" ];then
    pkg="$1"
fi
until ${pkg_install} ${pkg}
do
    if [ "${i}" == "3" ]
        then
            echo -e ${red}错误次数过多 退出${background}
            exit
    fi
    i=$((${i}+1))
    echo -en ${red}命令执行失败 ${green}3秒后重试${background}
    sleep 3s
    echo
done
}

pkg_list=("curl" "git")

for package in ${pkg_list[@]}
do
    if [ -x "$(command -v pacman)" ];then
        if ! pacman -Qs "${package}" > /dev/null 2>&1;then
            pkg="${package} ${pkg}" 
        fi
    elif [ -x "$(command -v apt)" ];then
        if ! dpkg -s "${package}" > /dev/null 2>&1;then
            pkg="${package} ${pkg}"
        fi
    elif [ -x "$(command -v yum)" ];then
        if ! yum list installed "${package}" > /dev/null 2>&1;then
            pkg="${package} ${pkg}"
        fi
    elif [ -x "$(command -v dnf)" ];then
        if ! dnf list installed "${package}" > /dev/null 2>&1;then
            pkg="${package} ${pkg}"
        fi
    fi
done

if [ ! -z "${pkg}" ]; then
    if [ -x "$(command -v pacman)" ];then
        if ! pacman -Qs "${package}" > /dev/null 2>&1;then
            pkg_install
        fi
    elif [ -x "$(command -v apt)" ];then
        if ! dpkg -s "${package}" > /dev/null 2>&1;then
            apt update
            pkg_install
        fi
    elif [ -x "$(command -v yum)" ];then
        if ! yum list installed "${package}" > /dev/null 2>&1;then
            yum update
            pkg_install
        fi
    elif [ -x "$(command -v dnf)" ];then
        if ! dnf list installed "${package}" > /dev/null 2>&1;then
         pkg_install
        fi
    fi
fi

if [ -x "$(command -v whiptail)" ];then
    dialog_whiptail=whiptail
elif [ -x "$(command -v dialog)" ];then
    dialog_whiptail=dialog
else
    package=dialog
    pkg_install dialog
    dialog_whiptail=dialog
fi
}

function pnpm_install(){
if [ ! -x "$(command -v pnpm)" ];then
    echo -e ${cyan}检测到未安装pnpm 开始安装${background}
    if [ ! -x "$(command -v npm)" ];then
        echo -e ${red}未安装npm${background}
        exit
    fi
    npm install -g pnpm --registry=https://registry.npmmirror.com
fi
}

function Linux(){
if [ ! -x "$(command -v curl)" ];then
    echo -e ${cyan}检测到未安装${red}curl${background}
    package_install
fi
if [ ! -x "$(command -v git)" ];then
    echo -e ${cyan}检测到未安装${red}git${background}
    package_install
fi
}

function unLinux(){
if [ ! -x "$(command -v curl)" ];then
    echo -e ${cyan}检测到未安装${red}curl${background}
    exit
fi
if [ ! -x "$(command -v git)" ];then
    echo -e ${cyan}检测到未安装${red}git${background}
    exit
fi
}

function feedback(){
if [ ! "${feedback}" == "0" ];then
    exit
fi
}

function path(){
if [ -d "./node_modules" ];then
    Plugin_Path="."
    cd ${Plugin_Path}
elif [ -d "../node_modules" ];then
    Plugin_Path=".."
    cd ${Plugin_Path}
else
    choose_path
fi
}

function choose_page(){
if [ ${page} = dialog_whiptail_page ];then
    dialog_whiptail_page
elif [ ${page} = echo_page ];then
    echo_page
fi
}

function choose_echo_dialog_whiptail(){
if [ -x "$(command -v whiptail)" ];then
    dialog_whiptail=whiptail
    page=dialog_whiptail_page
elif [ -x "$(command -v dialog)" ];then
    dialog_whiptail=dialog
    page=dialog_whiptail_page
else 
    page=echo_page
fi
}

if [ -e "/etc/issue" ];then
    Linux
    choose_echo_dialog_whiptail
    pnpm_install
    path
    main
elif [ -e "/etc/os-release" ];then
    Linux
    choose_echo_dialog_whiptail
    pnpm_install
    path
    main
else
    unLinux
    choose_echo_dialog_whiptail
    pnpm_install
    path
    main
fi
function mainbak()
{
   while true
   do
       main
       mainbak
   done
}
mainbak