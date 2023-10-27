#!/bin/env bash
export red="\033[31m"
export green="\033[32m"
export yellow="\033[33m"
export blue="\033[34m"
export purple="\033[35m"
export cyan="\033[36m"
export white="\033[37m"
export background="\033[0m"

function main(){
function Install_GIT_Plugin(){
Name=
Plugin=
Git=
    function delete_plugin(){
    case ${YN} in
    Y)
        rm -rf ${Plugin_Path}/plugins/${Plugin_tp} > /dev/null 2>&1
        rm -rf ${Plugin_Path}/plugins/${Plugin_tp} > /dev/null 2>&1
        if [ ${Plugin_Path}/plugins/${Plugin_tp} ];then
            echo -en ${red}删除失败 ${cyan}回车返回${background};read
        fi
        echo -en ${yellow}删除完成 ${cyan}回车返回${background};read
    ;;
    N|n|*)
        echo -en ${green}取消 ${cyan}回车返回${background};read
    ;;
    esac
    }
    function Install(){
        if [[ -z ${Name} ]];then
            main
            exit
        elif [ "[${Name}]" == "[]" ];then
            main
            exit
        fi
        function dialog_whiptail_page(){
            if ! ${dialog_whiptail} --title "呆毛-Bot-Plugin" \
            --yesno "将会为您安装\n[${Name} ]" \
            20 50
            then
                Name=
                Plugin=
                Git=
                main
                exit
            fi
        }
        function echo_page(){
            echo -e ${cyan}将会为您安装"\n"[${Name} ]${background}
            echo -e ${yellow}是否继续${background};read YN
            case ${YN} in
                N|n)
                    Name=
                    Plugin=
                    Git=
                    main
                    exit
                ;;
            esac
        }
        choose_page
        install_(){
        if [ -d plugins/${Plugin_tp} ]
        then
            if [ "${Single_Choice}" == "true" ]
            then
                delete_plugin
            else
                echo -e ${cyan}${Name_tp} ${green}已安装 ${yellow}跳过${background}
                echo
            fi
        else
            echo -e ${green}==================================${background}
            echo
            echo -e ${cyan}正在安装${yellow}${Name_tp} ${cyan}稍安勿躁~${background}
            echo
            echo -e ${green}==================================${background}
            echo
            git clone --depth=1 ${Git_tp} ./plugins/${Plugin_tp}
            if [ -d plugins/${Plugin_tp} ]
            then
                if [ -e plugins/${Plugin_tp}/package.json ];then
                    echo -e ${cyan}正在为 ${Name_tp} 安装依赖${background}
                    cd plugins/${Plugin_tp}
                    if ! echo "Y" | pnpm install --registry=https://registry.npmmirror.com
                    then
                        echo ${yellow}${Name_tp} 依赖安装失败 跳过${background}
                    fi
                    cd ../../
                fi
                echo -e ${cyan}${Name_tp} ${green}安装成功${background}
                echo
            else
                echo -e ${yellow}${Name_tp} 安装失败 跳过${background}
            fi
        fi
        }
        for num_ in ${Git[@]}
        do
            for Name_tp in ${Name[@]}
            do
                Name=$(echo ${Name} | sed "s|${Name_tp}||g")
                for Git_tp in ${Git[@]}
                do
                    Git=$(echo ${Git} | sed "s|${Git_tp}||g")
                    for Plugin_tp in ${Plugin[@]}
                    do
                        Plugin=$(echo ${Plugin} | sed "s|${Plugin_tp}||g")
                            install_
                        break 2
                    done
                done
            done
        done
        echo
        echo -en ${green}插件安装完成 ${cyan}回车返回${background};read
    }
    function dialog_whiptail_page(){
        if (${dialog_whiptail} \
        --title "呆毛-Bot-Plugin" \
        --yes-button "单选" \
        --no-button "多选" \
        --yesno "           请选择Git插件安装方式 多选时使用空格键选择" \
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
            tips="[空格选择 回车确定]"
        fi
        number=
        if ! number=$(${dialog_whiptail} \
        --title "插件选择" \
        --${checklist_menu} "选择您喜欢的插件吧! ${tips}" \
        26 60 20 \
        "1" "miao-plugin                    喵喵插件" ${OFF} \
        "2" "xiaoyao-cvs-plugin             逍遥图鉴" ${OFF} \
        "3" "Guoba-Plugin                   锅巴插件" ${OFF} \
        "4" "zhi-plugin                     白纸插件" ${OFF} \
        "5" "xitian-plugin                  戏天插件" ${OFF} \
        "6" "Akasha-Terminal-plugin         虚空插件" ${OFF} \
        "7a" "xiuxian-plugin                 修仙插件" ${OFF} \
        "7b" "xiuxian-association            修仙-宗门" ${OFF} \
        "7c" "xiuxian-home                   修仙-家园" ${OFF} \
        "8" "Yenai-Plugin                   椰奶插件" ${OFF} \
        "9" "xiaofei-plugin                 小飞插件" ${OFF} \
        "10" "earth-k-plugin                 土块插件" ${OFF} \
        "11" "py-plugin                      py插件" ${OFF} \
        "12" "xianxin-plugin                 闲心插件" ${OFF} \
        "13" "lin-plugin                     麟插件" ${OFF} \
        "14" "l-plugin                       L插件" ${OFF} \
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
        3>&1 1>&2 2>&3)
        then
            main
            exit
        fi
        if [[ -z ${number} ]];then
            echo
            echo -en ${red}输入错误 ${cyan}回车返回${background};read
            main
            exit
        fi
    }
    
    function echo_page(){
        echo
        echo
        echo -e ${white}"#######"${green}呆毛-Plug-In${white}"#######"${background}
        echo -e ${green_red}1.  ${cyan}miao-plugin"               "喵喵插件${background}
        echo -e ${green_red}2.  ${cyan}xiaoyao-cvs-plugin"        "逍遥图鉴${background}
        echo -e ${green_red}3.  ${cyan}Guoba-Plugin"              "锅巴插件${background}
        echo -e ${green_red}4.  ${cyan}zhi-plugin"                "白纸插件${background}
        echo -e ${green_red}5.  ${cyan}xitian-plugin"             "戏天插件${background}
        echo -e ${green_red}6.  ${cyan}Akasha-Terminal-plugin"    "虚空插件${background}
        echo -e ${green_red}7a.  ${cyan}xiuxian-plugin"           "修仙插件${background}
        echo -e ${green_red}7b.  ${cyan}xiuxian-association"      "修仙-宗门${background}
        echo -e ${green_red}7c.  ${cyan}xiuxian-home"             "修仙-家园${background}
        echo -e ${green_red}8.  ${cyan}Yenai-Plugin"              "椰奶插件${background}
        echo -e ${green_red}9.  ${cyan}xiaofei-plugin"            "小飞插件${background}
        echo -e ${green_red}10. ${cyan}earth-k-plugin"           "土块插件${background}
        echo -e ${green_red}11. ${cyan}py-plugin"                "py插件${background}
        echo -e ${green_red}12. ${cyan}xianxin-plugin"           "闲心插件${background}
        echo -e ${green_red}13. ${cyan}lin-plugin"               "麟插件${background}
        echo -e ${green_red}14. ${cyan}l-plugin"                 "L插件${background}
        echo -e ${green_red}15. ${cyan}qianyu-plugin"            "千羽插件${background}
        echo -e ${green_red}16. ${cyan}ql-plugin"                "清凉图插件${background}
        echo -e ${green_red}17. ${cyan}flower-plugin"            "抽卡插件${background}
        echo -e ${green_red}18. ${cyan}auto-plugin"              "自动化插件${background}
        echo -e ${green_red}19. ${cyan}recreation-plugin"        "娱乐插件${background}
        echo -e ${green_red}20. ${cyan}suiyue-plugin"            "碎月插件${background}
        echo -e ${green_red}21. ${cyan}windoge-plugin"           "风歌插件${background}
        echo -e ${green_red}22. ${cyan}Atlas"                    "原神图鉴${background}
        echo -e ${green_red}23. ${cyan}zhishui-plugin"           "止水插件${background}
        echo -e ${green_red}24. ${cyan}TRSS-Plugin"              "trss插件${background}
        echo -e ${green_red}25. ${cyan}Jinmaocuicuisha"          "脆脆鲨插件${background}
        echo -e ${green_red}26. ${cyan}useless-plugin"           "无用插件${background}
        echo -e ${green_red}27. ${cyan}liulian-plugin"           "榴莲插件${background}
        echo -e ${green_red}28. ${cyan}xiaoye-plugin"            "小叶插件${background}
        echo -e ${green_red}29. ${cyan}rconsole-plugin"          "R插件${background}
        echo -e ${green_red}30. ${cyan}expand-plugin"            "扩展插件${background}
        echo -e ${green_red}31. ${cyan}XiaoXuePlugin"            "小雪插件${background}
        echo -e ${green_red}32. ${cyan}Icepray"                  "冰祈插件${background}
        echo -e ${green_red}33. ${cyan}Tlon-Sky"                 "光遇插件${background}
        echo -e ${green_red}34. ${cyan}hs-qiqi-plugin"           "枫叶插件${background}
        echo -e ${green_red}35. ${cyan}call_of_seven_saints"     "七圣召唤插件${background}
        echo -e ${green_red}36. ${cyan}QQGuild-Plugin"           "QQ频道插件${background}
        echo -e ${green_red}37. ${cyan}xiaoyue-plugin"           "小月插件${background}
        echo -e ${green_red}38. ${cyan}FanSky_Qs"                "繁星插件${background}
        echo -e ${green_red}39. ${cyan}phi-plugin"               "phigros辅助插件${background}
        echo -e ${green_red}40. ${cyan}ap-plugin"                "AI绘图插件${background}
        echo -e ${green_red}41. ${cyan}sanyi-plugin"             "三一插件${background}
        echo -e ${green_red}42. ${cyan}chatgpt-plugin"           "聊天插件${background}
        echo -e ${green_red}43. ${cyan}y-tian-plugin"            "阴天插件${background}
        echo -e ${green_red}44. ${cyan}xianyu-plugin"            "咸鱼插件${background}
        echo -e ${green_red}45. ${cyan}StarRail-plugin"          "星穹铁道插件${background}
        echo -e ${green_red}46. ${cyan}panel-plugin"             "面板图插件${background}
        echo -e ${green_red}47. ${cyan}hanhan-plugin"            "憨憨插件${background}
        echo -e ${green_red}48. ${cyan}avocado-plugin"           "鳄梨插件${background}
        echo -e ${green_red}49. ${cyan}cunyx-plugin"             "寸幼萱插件${background}
        echo -e ${green_red}50. ${cyan}TianRu-plugin"            "天如插件${background}
        echo -e ${green_red}51. ${cyan}ws-plugin"                "ws连接插件${background}
        echo -e ${green_red}52. ${cyan}WeLM-plugin"              "AI对话插件${background}
        echo -e ${green_red}53. ${cyan}Yunzai-Kuro-Plugin"       "库洛插件${background}
        echo -e ${green_red}54. ${cyan}mj-plugin"                "AI绘图插件${background}
        echo -e ${green_red}55. ${cyan}qinghe-plugin"            "卿何插件${background}
        echo -e ${green_red}56. ${cyan}BlueArchive-plugin"       "碧蓝档案插件${background}
        echo -e ${green_red}57. ${cyan}impart-pro-plugin"        "牛牛大作战${background}
        echo -e ${green_red}58. ${cyan}Gi-plugin"                "群互动插件${background}
        echo -e ${green_red}59. ${cyan}MC-PLUGIN"                "MC服务器插件${background}
        echo -e ${green_red}60. ${cyan}mz-plugin"                "名字插件${background}
        echo -e ${green_red}61. ${cyan}nsfwjs-plugin"            "涩图监听插件${background}
        echo -e ${green_red}62. ${cyan}biscuit-plugin"           "饼干插件${background}
        echo -e ${green_red}63. ${cyan}xrk-plugin"               "向日葵插件${background}
        echo -e ${green_red}64. ${cyan}WeChat-Web-plugin"        "微信插件${background}
        echo -e ${green_red}65. ${cyan}btc-memz-plugin"          "BTC插件${background}
        echo -e ${green_red}66. ${cyan}wind-plugin"              "风插件${background}
        echo -e ${green_red}67. ${cyan}ttsapi-yunzai-Plugin"     "TTS语音合成${background}
        echo -e ${green_red}68. ${cyan}Xs-plugin"                "XS插件${background}
        echo
        echo -e ${green}0. ${cyan}返回${background}
        echo "#####################################"
        echo
        echo -en ${green}请输入您需要安装插件的序号,可以多选,用[空格]分开:${background}
        number=
        Single_Choice="false"
        read -p " " number
        if [ "${Number}" == "0" ];then
            main
            exit
        elif [ -z "${Number}" ];then
            echo
            echo -en ${red}输入错误 ${cyan}回车返回${background};read
            main
            exit
        fi
        } #echo_page
        choose_page
        number=$(echo ${number} | sed 's|"||g')
        for plugin_number in ${number}
        do
          case ${plugin_number} in
           1)
             Name="${Name} 喵喵插件"
             Plugin="${Plugin} miao-plugin"
             Git="${Git} https://gitee.com/yoimiya-kokomi/miao-plugin.git"
             ;;
           2)
             Name="${Name} 逍遥图鉴"
             Plugin="${Plugin} xiaoyao-cvs-plugin"
             Git="${Git} https://gitee.com/Ctrlcvs/xiaoyao-cvs-plugin.git"
             ;;
           3)
             Name="${Name} 锅巴插件"
             Plugin="${Plugin} Guoba-Plugin"
             Git="${Git} https://gitee.com/guoba-yunzai/guoba-plugin.git"
             ;;
           4)
             Name="${Name} 白纸插件"
             Plugin="${Plugin} zhi-plugin"
             Git="${Git} https://gitee.com/headmastertan/zhi-plugin.git"
             ;;
           5)
             Name="${Name} 戏天插件"
             Plugin="${Plugin} xitian-plugin"
             Git="${Git} https://gitee.com/XiTianGame/xitian-plugin.git"
             ;;
           6)
             Name="${Name} 虚空插件"
             Plugin="${Plugin} akasha-terminal-plugin"
             Git="${Git} https://gitee.com/go-farther-and-farther/akasha-terminal-plugin.git"
             ;;
           7a)
             Name="${Name} 修仙插件"
             Plugin="${Plugin} xiuxian-2.0"
             Git="${Git} https://gitee.com/ningmengchongshui/xiuxian-plugin.git"
             ;;
           7b)
             Name="${Name} 修仙插件-宗门扩展"
             Plugin="${Plugin} xiuxian-association"
             Git="${Git} https://gitee.com/mg1105194437/xiuxian-association-plugin.git"
             ;;
           7c)
             Name="${Name} 修仙插件-家园扩展"
             Plugin="${Plugin} xiuxian-home"
             Git="${Git} '-b home https://gitee.com/ningmengchongshui/xiuxian-plugin.git'"
             ;;
           8)
             Name="${Name} 椰奶插件"
             Plugin="${Plugin} yenai-plugin"
             Git="${Git} https://gitee.com/yeyang52/yenai-plugin.git"
             ;;
           9)
             Name="${Name} 小飞插件"
             Plugin="${Plugin} xiaofei-plugin"
             Git="${Git} https://gitee.com/xfdown/xiaofei-plugin.git"
             ;;
           10)
             Name="${Name} 土块插件"
             Plugin="${Plugin} earth-k-plugin"
             Git="${Git} https://gitee.com/SmallK111407/earth-k-plugin.git"
             ;;
           11)
             if [ ! -x "$(command -v pip)" ];then
               echo -en ${cyan}检测到未安装pip 回车返回${background};read
               exit
             fi 
             if [ ! -x "$(command -v poetry)" ];then
               echo -en ${cyan}检测到未安装poetry 回车返回${background};read
             fi
             Name="${Name} py插件"
             Plugin="${Plugin} py-plugin"
             Git="${Git} https://gitee.com/realhuhu/py-plugin.git"
           if [ -d plugins/py-plugin ]
           then
             function dialog_whiptail_page(){
             if (${dialog_whiptail} \
             --title "呆毛-Bot-Plugin" \
             --yes-button "本地" \
             --no-button "远程" \
             --yesno "请选择py运算的服务器" \
             10 60)
             then
               cd plugins/py-plugin
               pip_mirrors
               cd ../../
             else
               py_server
             fi  
             }
             function echo_page(){
             echo -en ${green}是否启用py远程服务器 ${cyan}[N/y] ${background}
             read -p "" num
                case $num in
             y|Y)
               py_server
               ;;
             N|n)
               cd plugins/py-plugin
               pip_mirrors
               cd ../../
               ;;
             *)
               echo ${red}输入错误${background}
               ;;
             esac
             }
             choose_page
             else
             exit
             fi
             ;;   
           12)
             Name="${Name} 闲心插件"
             Plugin="${Plugin} xianxin-plugin"
             Git="${Git} https://gitee.com/xianxincoder/xianxin-plugin.git"
             ;;
           13)
             Name="${Name} 麟插件"
             Plugin="${Plugin} lin-plugin"
             Git="${Git} https://gitee.com/go-farther-and-farther/lin-plugin.git"
             ;;
           14)
             Name="${Name} L插件"
             Plugin="${Plugin} L-plugin"
             Git="${Git} https://ghproxy.com/https://github.com/liuly0322/l-plugin.git"
             ;;
           15)
             Name="${Name} 千羽插件"
             Plugin="${Plugin} reset-qianyu-plugin"
             Git="${Git} https://gitee.com/think-first-sxs/reset-qianyu-plugin"
             ;;
           16)
             Name="${Name} 清凉图插件"
             Plugin="${Plugin} ql-plugin"
             Git="${Git} https://gitee.com/xwy231321/ql-plugin.git"
             ;;
           17)
             Name="${Name} 抽卡插件"
             Plugin="${Plugin} flower-plugin"
             Git="${Git} https://gitee.com/Nwflower/flower-plugin.git"
             ;;
           18)
             Name="${Name} 自动化插件"
             Plugin="${Plugin} auto-plugin"
             Git="${Git} https://gitee.com/Nwflower/auto-plugin.git"
             ;;
           19)
             Name="${Name} 娱乐插件"
             Plugin="${Plugin} recreation-plugin"
             Git="${Git} https://gitee.com/zzyAJohn/recreation-plugin"
             ;;
           20)
             Name="${Name} 碎月插件"
             Plugin="${Plugin} suiyue"
             Git="${Git} https://gitee.com/Acceleratorsky/suiyue.git"
             ;;
           21)
             Name="${Name} 风歌插件"
             Plugin="${Plugin} windoge-plugin"
             Git="${Git} https://ghproxy.com/https://github.com/gxy12345/windoge-plugin"
             ;;
           22)
             Name="${Name} Atlas[图鉴]"
             Plugin="${Plugin} Atlas"
             Git="${Git} https://gitee.com/Nwflower/atlas"
             ;;
           23)
             Name="${Name} 止水插件"
             Plugin="${Plugin} zhishui-plugin"
             Git="${Git} https://gitee.com/fjcq/zhishui-plugin.git"
             ;;
           24)
             Name="${Name} trss插件"
             Plugin="${Plugin} TRSS-Plugin"
             Git="${Git} https://gitee.com/TimeRainStarSky/TRSS-Plugin.git"
             ;;
           25)
             Name="${Name} 脆脆鲨插件"
             Plugin="${Plugin} Jinmaocuicuisha-plugin"
             Git="${Git} https://gitee.com/JMCCS/jinmaocuicuisha.git"
             ;;
           26)
             Name="${Name} 无用插件"
             Plugin="${Plugin} useless-plugin"
             Git="${Git} https://gitee.com/SmallK111407/useless-plugin.git"
             ;;
           27)
             Name="${Name} 榴莲插件"
             Plugin="${Plugin} liulian-plugin"
             Git="${Git} https://gitee.com/huifeidemangguomao/liulian-plugin.git"
             ;;
           28)
             Name="${Name} 小叶插件"
             Plugin="${Plugin} xiaoye-plugin"
             Git="${Git} https://gitee.com/xiaoye12123/xiaoye-plugin.git"
             ;;
           29)
             Name="${Name} R插件"
             Plugin="${Plugin} rconsole-plugin"
             Git="${Git} https://gitee.com/kyrzy0416/rconsole-plugin.git"
             ;;
           30)
             Name="${Name} 扩展插件"
             Plugin="${Plugin} expand-plugin"
             Git="${Git} https://gitee.com/SmallK111407/expand-plugin.git"
             ;;
           31)
             Name="${Name} 小雪插件"
             Plugin="${Plugin} XiaoXuePlugin"
             Git="${Git} https://gitee.com/XueWerY/XiaoXuePlugin.git"
             ;;
           32)
             Name="${Name} 冰祈插件"
             Plugin="${Plugin} Icepray"
             Git="${Git} https://gitee.com/koinori/Icepray.git"
             ;;
           33)
             Name="${Name} 光遇插件"
             Plugin="${Plugin} Tlon-Sky"
             Git="${Git} https://gitee.com/Tloml-Starry/Tlon-Sky.git"
             ;;
           34)
             Name="${Name} 枫叶插件"
             Plugin="${Plugin} hs-qiqi-plugin"
             Git="${Git} https://gitee.com/kesally/hs-qiqi-cv-plugin.git"
             ;;
           35)
             Name="${Name} 七圣召唤插件"
             Plugin="${Plugin} call_of_seven_saints"
             Git="${Git} https://gitee.com/huangshx2001/call_of_seven_saints.git"
             ;;
           36)
             Name="${Name} QQ频道插件"
             Plugin="${Plugin} QQGuild-Plugin"
             Git="${Git} https://gitee.com/Zyy955/QQGuild-plugin"
             ;;
           37)
             Name="${Name} 小月插件"
             Plugin="${Plugin} xiaoyue-plugin"
             Git="${Git} https://gitee.com/bule-Tech/xiaoyue-plugin.git"
             ;;
           38)
             Name="${Name} 繁星插件"
             Plugin="${Plugin} FanSky_Qs"
             Git="${Git} https://gitee.com/FanSky_Qs/FanSky_Qs.git"
             ;;
           39)
             Name="${Name} phigros辅助插件"
             Plugin="${Plugin} phi-plugin"
             Git="${Git} https://ghproxy.com/https://github.com/Catrong/phi-plugin.git"
             ;;
           40)
             Name="${Name} ap绘图插件"
             Plugin="${Plugin} ap-plugin"
             Git="${Git} https://gitee.com/yhArcadia/ap-plugin.git"
             ;;
           41)
             Name="${Name} 三一插件"
             Plugin="${Plugin} sanyi-plugin"
             Git="${Git} https://gitee.com/ThreeYi/sanyi-plugin.git"
             ;;
           42)
             Name="${Name} 聊天插件"
             Plugin="${Plugin} chatgpt-plugin"
             Git="${Git} https://ghproxy.com/https://github.com/ikechan8370/chatgpt-plugin.git"
             ;;
           43)
             Name="${Name} 阴天插件"
             Plugin="${Plugin} y-tian-plugin"
             Git="${Git} https://gitee.com/wan13877501248/y-tian-plugin.git"
             ;;
           44)
             Name="${Name} 咸鱼插件"
             Plugin="${Plugin} xianyu-plugin"
             Git="${Git} https://gitee.com/suancaixianyu/xianyu-plugin.git"
             ;;
           45)
             Name="${Name} 星穹铁道插件"
             Plugin="${Plugin} StarRail-plugin"
             Git="${Git} https://gitee.com/hewang1an/StarRail-plugin.git"
             ;;
           46)
             Name="${Name} 面板图插件"
             Plugin="${Plugin} panel-plugin"
             Git="${Git} https://gitee.com/yunzai-panel/panel-plugin.git"
             ;;
           47)
             Name="${Name} 憨憨插件"
             Plugin="${Plugin} hanhan-plugin"
             Git="${Git} https://gitee.com/han-hanz/hanhan-plugin.git"
             ;;
           48)
             Name="${Name} 鳄梨插件"
             Plugin="${Plugin} avocado-plugin"
             Git="${Git} https://gitee.com/sean_l/avocado-plugin.git"
             ;;
           49)
             Name="${Name} 寸幼萱插件"
             Plugin="${Plugin} cunyx-plugin"
             Git="${Git} https://gitee.com/cunyx/cunyx-plugin.git"
             ;;
           50)
             Name="${Name} 天如插件"
             Plugin="${Plugin} tianru-plugin"
             Git="${Git} https://gitee.com/HDTianRu/TianRu-plugin.git"
             ;;
           51)
             Name="${Name} ws连接插件"
             Plugin="${Plugin} ws-plugin"
             Git="${Git} https://gitee.com/xiaoye12123/ws-plugin.git"
             ;;
           52)
             Name="${Name} AI对话插件"
             Plugin="${Plugin} WeLM-plugin"
             Git="${Git} https://gitee.com/shuciqianye/yunzai-custom-dialogue-welm.git"
             ;;
           53)
             Name="${Name} 库洛插件"
             Plugin="${Plugin} Yunzai-Kuro-Plugin"
             Git="${Git} https://gitee.com/TomyJan/Yunzai-Kuro-Plugin.git"
             ;;
           54)
             Name="${Name} mj绘图插件"
             Plugin="${Plugin} mj-plugin"
             Git="${Git} https://gitee.com/CikeyQi/mj-plugin.git"
             ;;
           55)
             Name="${Name} 卿何插件"
             Plugin="${Plugin} qinghe-plugin"
             Git="${Git} https://gitee.com/Tloml-Starry/qinghe-plugin.git"
             ;;
           56)
             Name="${Name} 碧蓝档案插件"
             Plugin="${Plugin} BlueArchive-plugin"
             Git="${Git} https://gitee.com/all-thoughts-are-broken/blue-archive.git"
             ;;
           57)
             Name="${Name} 牛牛大作战"
             Plugin="${Plugin} impart-pro-plugin"
             Git="${Git} https://gitee.com/sumght/impart-pro-plugin.git"
             ;;
           58)
             Name="${Name} 群互动插件"
             Plugin="${Plugin} Gi-plugin"
             Git="${Git} https://gitee.com/qiannqq/gi-plugin.git"
             ;;
           59)
             Name="${Name} MC服务器插件"
             Plugin="${Plugin} mc-plugin"
             Git="${Git} https://gitee.com/CikeyQi/mc-plugin.git"
             ;;
           60)
             Name="${Name} 名字插件"
             Plugin="${Plugin} mz-plugin"
             Git="${Git} https://gitee.com/xyb12345678qwe/mz-plugin.git"
             ;;
           61)
             Name="${Name} 涩图监听插件"
             Plugin="${Plugin} nsfwjs-plugin"
             Git="${Git} https://gitee.com/CikeyQi/nsfwjs-plugin.git"
             ;;
           62)
             Name="${Name} 饼干插件"
             Plugin="${Plugin} biscuit-plugin"
             Git="${Git} https://gitee.com/Yummy-cookie/biscuit-plugin.git"
             ;;
           63)
             Name="${Name} 向日葵插件"
             Plugin="${Plugin} xrk-plugin"
             Git="${Git} https://gitee.com/xrk114514/xrk-plugin.git"
             ;;
           64)
             Name="${Name} 微信插件"
             Plugin="${Plugin} WeChat-Web-plugin"
             Git="${Git} https://gitee.com/Zyy955/WeChat-Web-plugin.git"
             ;;
           65)
             Name="${Name} BTC插件"
             Plugin="${Plugin} btc-memz-plugin"
             Git="${Git} https://gitee.com/memz2007/btc-memz-plugin.git"
             ;;
           66)
             Name="${Name} 风插件"
             Plugin="${Plugin} wind-plugin"
             Git="${Git} https://gitee.com/wind-trace-typ/wind-plugin.git"
             ;;
           67)
             Name="${Name} TTS语音合成"
             Plugin="${Plugin} ttsapi-yunzai-Plugin"
             Git="${Git} https://gitee.com/TsaiXingyu/ttsapi-yunzai-Plugin.git"
             ;;
           68)
             Name="${Name} XS插件"
             Plugin="${Plugin} Xs-plugin"
             Git="${Git} https://gitee.com/hsxfk/Xs-plugin"
             ;;
           0)
             echo
             main
             ;;
          esac
        done
        Install
}

function Install_JS_Plugin(){
    echo
    echo
    echo "#######################"
    echo -e ${green}1. ${blue}通过 gitee/github 链接安装${background}
    echo -e ${green}2. ${blue}通过 Download 文件夹安装[仅限termux]${background}
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
                        curl "https://ghproxy.com/${js}" > ${jsname}
                elif [[ ${js} = *blob* ]]
                    then
                        js=$(echo ${js} | sed "s|blob/||g" | sed "s|github|raw.githubusercontent|g" )
                        curl "https://ghproxy.com/${js}" > ${jsname}
                fi
        fi
        cd ../../
        echo -en ${yellow}安装完成 回车返回${background};read
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
            exit
        fi
    i=1
    for file in $(ls ${sdpath})
    do
        if [[ ${file} = *".js" ]];then
           echo -e ${green}${i}". "${blue}${file}${background}
        fi
        i=$((${i}+1))
    done
        echo
        echo -e ${green}0. ${blue}返回${background}
        echo "#######################"
        echo -en ${green}请输入您要安装的插件的序号[多个插件请用空格分开]:${background}
        read -p " " Number
        Number=$(echo ${Number} | sed 's|"||g')
        for Num in ${Number}
        do
            js_file=$(ls -1 | grep .js | sed -n "${Num}p")
            mv -f ${sdpath}/js_file ${Plugin_Path}/plugins/example/js_file
        done
        echo -en ${yellow}安装完成 回车返回${background};read
    fi
}

function Update_GIT_Plugin(){
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

function Delete_GIT_Plugin(){
    function dialog_whiptail_page(){
        files=$(ls -1 -I example -I bin -I other -I system plugins)
        options=""
        i=0
        for file in ${files}
        do
          i=$((${i}+1))
          options="${options} ${i} ${file} OFF"
        done
        options="${options} 0. 返回 OFF"
        Number=$(${dialog_whiptail} \
        --title "呆毛" \
        --checklist "请选择要删除的GIT插件" \
        28 45 20 ${options} \
        3>&1 1>&2 2>&3)
    }
    function echo_page(){
        i=0
        echo
        echo "#######################"
        for file in $(ls -I example -I bin -I other -I system plugins)
        do
            i=$((${i}+1))
            echo -e ${green}${i}". "${cyan}${file}${background}
            done
            echo
            echo -e ${green}0.${cyan}返回${background}
            echo "#######################"
        echo -en ${cyan}请输入您要删除的插件序号[多个插件请用空格分开]:${background}
        read Number
    }
    choose_page
    if [ "${Number}" == "0" ];then
        main
        exit
    elif [[ -z ${Number} ]];then
        echo
        echo -en ${red}输入错误 ${cyan}回车返回${background};read
        main
        exit
    fi
    Number=$(echo ${Number} | sed 's|"||g')
    for Num in ${Number}
    do
        file_folder=$(ls -1 -I example -I bin -I other -I system plugins | sed -n "${Num}p")
        Git_Plugin="${file_folder} ${Git_Plugin}"
    done
    echo -en ${red}是否删除${Git_Plugin} ${cyan}[N/Y]${background}
    read YN
    case ${YN} in
    Y)
        for Num in ${Number}
        do
            file_folder=$(ls -1 -I example -I bin -I other -I system plugins | sed -n "${Num}p")
            rm -rf plugins/${file_folder} > /dev/null 2>&1
            rm -rf plugins/${file_folder} > /dev/null 2>&1
            echo -e ${cyan}已删除${file_folder}${background}
        done
        echo
        echo -en ${yellow}删除完成 ${cyan}回车返回${background};read
    ;;
    N|n|*)
        echo -en ${green}取消 ${cyan}回车返回${background};read
    ;;
    esac
}

function Delete_JS_Plugin(){
    function dialog_whiptail_page(){
        files=$(ls -1 -I example -I bin -I other -I system ${Plugin_Path}/plugins/example)
        options=""
        i=0
        for file in ${files}
        do
          i=$((${i}+1))
          options="${options} ${i} ${file} OFF"
        done
        Number=$(${dialog_whiptail} \
        --title "呆毛" \
        --checklist "请选择要删除的JS插件" \
        28 45 20 ${options} \
        3>&1 1>&2 2>&3)
    }
    function echo_page(){
        i=0
        echo
        echo "#######################"
        for file in $(ls -I example -I bin -I other -I system ${Plugin_Path}/plugins/example)
        do
            i=$((${i}+1))
            echo -e ${green}${i}". "${cyan}${file}${background}
            done
            echo
            echo -e ${green}0.${cyan}返回${background}
            echo "#######################"
        echo -en ${cyan}请输入您要删除的插件序号[多个插件请用空格分开]:${background}
        read Number
    }
    choose_page
    Number=$(echo ${Number} | sed 's|"||g')
    if [ "${Number}" == "0" ];then
        main
        exit
    elif [ -z "${Number}" ];then
        echo
        echo -en ${red}输入错误 ${cyan}回车返回${background};read
        main
        exit
    fi
    for Num in ${Number}
    do
        file_folder=$(ls -1 -I example -I bin -I other -I system plugins/example | sed -n "${Num}p")
        JS_Plugin="${file_folder} ${JS_Plugin}"
    done
    echo -en ${red}是否删除${JS_Plugin} ${cyan}[N/Y]${background}
    read YN
    case ${YN} in
    Y)
        for Num in ${Number}
        do
            file_folder=$(ls -1 -I example -I bin -I other -I system plugins/example | sed -n "${Num}p")
            rm -rf plugins/example/${file_folder}/ > /dev/null 2>&1
            rm -rf plugins/example/${file_folder} > /dev/null 2>&1
            echo -e ${cyan}已删除${file_folder}${background}
        done
        echo -en ${yellow}删除完成 回车返回${background};read
    ;;
    N|n|*)
        echo -e ${green}取消${background}
    ;;
    esac
}

function dialog_whiptail_page(){
number=$(${dialog_whiptail} \
--title "呆毛" \
--menu "派蒙插件管理" \
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
    echo -e ${white}"#####"${green}呆毛-Yunzai-Bot${white}"#####"${background}
    echo -e ${blue}请选择您要为哪一个bot管理插件${background}
    echo "#########################"
    echo -e ${green}1.  ${cyan}安装GIT插件${background}
    echo -e ${green}2.  ${cyan}安装JS插件${background}
    echo -e ${green}3.  ${cyan}更新GIT插件${background}
    echo -e ${green}4.  ${cyan}删除GIT插件${background}
    echo -e ${green}5.  ${cyan}删除JS插件${background}
    echo -e ${green}0.  ${cyan}返回\/退出${background}
    echo "#########################"
    echo -e ${green}帮助:${cyan}多选时请按 空格${background}
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

function package_install(){
if [ $(command -v apk) ];then
    pkg_install="apk add"
elif [ $(command -v apt) ];then
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

pkg_list=("wget" "curl" "git")

for package in ${pkg_list[@]}
do
    if [ -x "$(command -v apk)" ];then
        if ! apk info -e "${package}" > /dev/null 2>&1;then
            pkg="${package} ${pkg}"
        fi
    elif [ -x "$(command -v pacman)" ];then
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
    if [ -x "$(command -v apk)" ];then
        if ! apk info -e "${package}" > /dev/null 2>&1;then
            apk update
            pkg_install
        fi
    elif [ -x "$(command -v pacman)" ];then
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
if [ ! -x "$(command -v wget)" ];then
    echo -e ${cyan}检测到未安装${red}wget${background}
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
if [ ! -x "$(command -v wget)" ];then
    echo -e ${cyan}检测到未安装${red}wget${background}
    exit
fi
}

function choose_path(){
function dialog_whiptail_page(){
    number=$(${dialog_whiptail} \
    --title "派蒙插件管理" \
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
    echo -e ${white}"#####"${green}呆毛-Yunzai-Bot${white}"#####"${background}
    echo -e ${blue}请选择您要为哪一个bot管理插件${background}
    echo "#########################"
    echo -e ${green}1.  ${cyan}Yunzai-Bot${background}
    echo -e ${green}2.  ${cyan}Miao-Yunzai${background}
    echo -e ${green}3.  ${cyan}yunzai-bot-lite${background}
    echo -e ${green}4.  ${cyan}TRSS-Yunzai${background}
    echo -e ${green}5.  ${cyan}Yxy-Bot${background}
    echo -e ${green}0.  ${cyan}退出${background}
    echo "#########################"
    echo -e ${green}帮助:${cyan}多选时请按 空格${background}
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
export page=echo_page
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
    export Plugin_Path="/root/${Bot_Name}"
    cd ${Plugin_Path}
elif [ -d "/root/.fox@bot/${Bot_Name}/node_modules" ];then
    export Plugin_Path="/root/.fox@bot/${Bot_Name}"
    cd ${Plugin_Path}
elif [ -d "/home/lighthouse/ubuntu/${Bot_Name}/node_modules" ];then
    export Plugin_Path="/home/lighthouse/ubuntu/${Bot_Name}"
    cd ${Plugin_Path}
elif [ -d "/home/lighthouse/centos/${Bot_Name}/node_modules" ];then
    export Plugin_Path="/home/lighthouse/centos/${Bot_Name}"
    cd ${Plugin_Path}
elif [ -d "/home/lighthouse/debian/${Bot_Name}/node_modules" ];then
    export Plugin_Path="/home/lighthouse/debian/${Bot_Name}"
    cd ${Plugin_Path}
elif [ -d "/root/TRSS_AllBot/${Bot_Name}/node_modules" ];then
    export Plugin_Path="/root/TRSS_AllBot/${Bot_Name}"
    cd ${Plugin_Path}
else
    function dialog_whiptail_page(){
        ${dialog_whiptail} --title "喵QAQ" \
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

function feedback(){
if [ ! "${feedback}" == "0" ];then
    exit
fi
}

function path(){
if [ -d "./node_modules" ];then
    export Plugin_Path="."
    cd ${Plugin_Path}
elif [ -d "../node_modules" ];then
    export Plugin_Path=".."
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
    export dialog_whiptail=whiptail
    export page=dialog_whiptail_page
elif [ -x "$(command -v dialog)" ];then
    export dialog_whiptail=dialog
    export page=dialog_whiptail_page
else 
    export page=echo_page
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
