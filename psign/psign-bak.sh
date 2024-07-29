#!/bin/env bash
export red="\033[31m"
export green="\033[32m"
export yellow="\033[33m"
export blue="\033[34m"
export purple="\033[35m"
export cyan="\033[36m"
export white="\033[37m"
export background="\033[0m"

cd $HOME
if [ "$(uname -o)" = "Android" ];then
echo -e ${red}你是大聪明吗?${background}
exit
fi
if [ ! "$(uname)" = "Linux" ]; then
	echo -e ${red}你是大聪明吗?${background}
    exit
fi
if [ ! "$(id -u)" = "0" ]; then
    echo -e ${red}请使用root用户${background}
    exit 0
fi
if [ -d $HOME/QSignServer/JRE ];then
    export PATH=$PATH:$HOME/QSignServer/JRE/bin
    export JAVA_HOME=$HOME/QSignServer/JRE
fi

case $(uname -m) in
    x86_64|amd64)
    ARCH=x64
;;
    arm64|aarch64)
    ARCH=aarch64   
;;
*)
    echo ${red}您的框架为${yellow}$(uname -m)${red},快让白狐做适配.${background}
    exit
;;
esac

URL="https://ipinfo.io"
Address=$(curl -sL ${URL} | sed -n 's/.*"country": "\(.*\)",.*/\1/p')
if [ "${Address}" = "CN" ]
then
  GitMirror="gitee.com"
  GithubMirror="https://github.moeyy.xyz/"
else
  GitMirror="github.com"
  GithubMirror=""
fi
JRE_URL=${GithubMirror}https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.2+13/OpenJDK21U-jre_${ARCH}_linux_hotspot_21.0.2_13.tar.gz

function tmux_new(){
Tmux_Name="$1"
Shell_Command="$2"
if ! tmux new -s ${Tmux_Name} -d "${Shell_Command}"
then
    echo -e ${yellow}QSignServer启动错误"\n"错误原因:${red}${tmux_new_error}${background}
    echo
    echo -en ${yellow}回车返回${background};read
    main
    exit
fi
}
function tmux_attach(){
Tmux_Name="$1"
tmux attach -t ${Tmux_Name} > /dev/null 2>&1
}
function tmux_kill_session(){
Tmux_Name="$1"
tmux kill-session -t ${Tmux_Name}
}
function tmux_ls(){
Tmux_Name="$1"
tmux_windows=$(tmux ls 2>&1)
if echo ${tmux_windows} | grep -q ${Tmux_Name}
then
    return 0
else
    return 1
fi
}
function qsign_curl(){
LibraryVersion=$(grep "LibraryVersion" ${config} | sed 's/LibraryVersion: //g')
file=$HOME/QSignServer/txlib/${LibraryVersion}/config.json
Port=$(grep -E port ${file} | awk '{print $2}' | sed 's/"//g' | sed "s/://g")
if curl -sL 127.0.0.1:${Port} > /dev/null 2>&1
then
    return 0
else
    return 1
fi
}
function tmux_gauge(){
i=0
Tmux_Name="$1"
tmux_ls ${Tmux_Name} & > /dev/null 2>&1
until qsign_curl
do
    i=$((${i}+1))
    a="${a}#"
    echo -ne "\r${i}% ${a}\r"
    if [[ ${i} == 40 ]];then
        echo
        return 1
    fi
done
echo
}
bot_tmux_attach_log(){
Tmux_Name="$1"
if ! tmux attach -t ${Tmux_Name} > /dev/null 2>&1
then
    tmux_windows_attach_error=$(tmux attach -t ${Tmux_Name} 2>&1 > /dev/null)
    echo
    echo -e ${yellow}QSignServer打开错误"\n"错误原因:${red}${tmux_windows_attach_error}${background}
    echo
    echo -en ${yellow}回车返回${background};read
fi
}

Git="https://${GitMirror}/baihu433/QSignServer"
ScriptVersion="1.1.1"
config=$HOME/QSignServer/config.yaml

ModifyVersion(){
echo -e ${white}"====="${green}白狐-QSignServer${white}"====="${background}
echo -e ${cyan}请选择签名服务器适配的QQ共享库版本${background}
echo -e  ${green} 1.  ${cyan}HD: 8.9.58${background}
echo -e  ${green} 2.  ${cyan}HD: 8.9.63${background}
echo -e  ${green} 3.  ${cyan}HD: 8.9.68${background}
echo -e  ${green} 4.  ${cyan}HD: 8.9.70${background}
echo -e  ${green} 5.  ${cyan}HD: 8.9.71${background}
echo -e  ${green} 6.  ${cyan}HD: 8.9.73${background}
echo -e  ${green} 7.  ${cyan}HD: 8.9.75${background}
echo -e  ${green} 8.  ${cyan}HD: 8.9.76${background}
echo -e  ${green} 9.  ${cyan}HD: 8.9.78${background}
echo -e  ${green}10.  ${cyan}HD: 8.9.80${background}
echo -e  ${green}11.  ${cyan}HD: 8.9.83${background}
echo -e  ${green}12.  ${cyan}HD: 8.9.85${background}
echo -e  ${green}13.  ${cyan}HD: 8.9.88${background}
echo -e  ${green}14.  ${cyan}HD: 8.9.90${background}
echo -e  ${green}15.  ${cyan}HD: 8.9.93${background}
echo -e  ${green}16.  ${cyan}HD: 8.9.96${background}
echo "========================="
echo -en ${green}请输入您的选项: ${background};read num
case ${num} in
1|8.9.58)
LibraryVersion=8.9.58
;;
2|8.9.63)
LibraryVersion=8.9.63
;;
3|8.9.68)
LibraryVersion=8.9.68
;;
4|8.9.70)
LibraryVersion=8.9.70
;;
5|8.9.71)
LibraryVersion=8.9.71
;;
6|8.9.73)
LibraryVersion=8.9.73
;;
7|8.9.75)
LibraryVersion=8.9.75
;;
8|8.9.76)
LibraryVersion=8.9.76
;;
9|8.9.78)
LibraryVersion=8.9.78
;;
10|8.9.80)
LibraryVersion=8.9.80
;;
11|8.9.83)
LibraryVersion=8.9.83
;;
12|8.9.85)
LibraryVersion=8.9.85
;;
13|8.9.88)
LibraryVersion=8.9.88
;;
14|8.9.90)
LibraryVersion=8.9.90
;;
15|8.9.93)
LibraryVersion=8.9.93
;;
16|8.9.96)
LibraryVersion=8.9.96
;;
*)
echo
echo -e ${red}输入错误${background}
exit
;;
esac
NewLibraryVersion=${LibraryVersion}
OldLibraryVersion=$(grep "LibraryVersion" ${config} | sed 's/LibraryVersion: //g')
sed -i "s/${OldLibraryVersion}/${NewLibraryVersion}/g" ${config}
}


install_QSignServer(){
if [ -e QSignServer/bin/unidbg-fetch-qsign ];then
  echo -e ${yellow}您已安装签名服务器${background}
  exit
fi

if [ -e /etc/resolv.conf ]; then
  if ! grep -q "8.8.8.8" /etc/resolv.conf ;then
    cp -f /etc/resolv.conf /etc/resolv.conf.backup
    echo -e ${yellow}DNS已备份至 /etc/resolv.conf.backup${background}
    echo "nameserver 8.8.8.8" > /etc/resolv.conf
    echo -e ${yellow}DNS已修改为 8.8.8.8${background}
  fi
fi

if [ $(command -v apt) ];then
  apt update -y
  apt install -y tar gzip wget curl unzip git tmux pv
elif [ $(command -v yum) ];then
  yum makecache -y
  yum install -y tar gzip wget curl unzip git tmux pv
elif [ $(command -v dnf) ];then
  dnf makecache -y
  dnf install -y tar gzip wget curl unzip git tmux pv
elif [ $(command -v pacman) ];then
  pacman -Syy --noconfirm --needed tar gzip wget curl unzip git tmux pv
else
  echo -e ${red}不受支持的Linux发行版${background}
  exit
fi
until git clone --depth=1 ${Git}
do
  if [ ${i} -eq 3 ]
  then
    echo -e ${red}错误次数过多 退出${background}
    exit
  fi
  i=$((${i}+1))
  echo -en ${red}命令执行失败 ${green}3秒后重试${background}
  rm -rf QSignServer
  sleep 3s
  echo
done

JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
if [[ ! "${JAVA_VERSION}" == "21.*"* ]]; then
    rm -rf $HOME/QSignServer/JRE > /dev/null 2>&1
    rm -rf $HOME/jre.tar.gz > /dev/null 2>&1
    until wget -O jre.tar.gz -c ${JRE_URL}
    do
      echo -e ${red}下载失败 ${green}正在重试${background}
    done
    if [ ! -d $HOME/QSignServer ];then
        mkdir QSignServer
    fi
    echo -e ${yellow}正在解压JRE文件,请耐心等候${background}
    mkdir JRE
    pv jre.tar.gz | tar -zxf - -C JRE
    mv JRE/$(ls JRE) QSignServer/JRE
    rm -rf jre.tar.gz
    rm -rf JRE
    export PATH=$PATH:$HOME/QSignServer/JRE/bin
    export JAVA_HOME=$HOME/QSignServer/JRE
fi
ModifyVersion
if [ ! "${install_QSignServer}" == "true" ]
then
    echo -en ${yellow}安装完成 是否启动?[Y/n]${background};read yn
    case ${yn} in
    Y|y)
    start_QSignServer
    ;;
    esac
fi
}
start_QSignServer(){
LibraryVersion=$(grep "LibraryVersion" ${config} | sed 's/LibraryVersion: //g')
file=$HOME/QSignServer/txlib/${LibraryVersion}/config.json
Port=$(grep -E port ${file} | awk '{print $2}' | sed 's/"//g' | sed "s/://g")
if curl 127.0.0.1:${Port} > /dev/null 2>&1
then
    echo -en ${yellow}签名服务器已启动 ${cyan}回车返回${background};read
    echo
    return
fi
Foreground_Start(){
export Boolean=true
while ${Boolean}
do 
  sh $HOME/QSignServer/bin/unidbg-fetch-qsign --basePath=$HOME/QSignServer/txlib/${LibraryVersion}
  echo -e ${red}签名服务器关闭 正在重启${background}
  sleep 2s
done
echo -en ${cyan}回车返回${background}
read
echo
}
Tmux_Start(){
Start_Stop_Restart="启动"
export Boolean=true
tmux_new qsignserver "while ${Boolean}; do sh $HOME/QSignServer/bin/unidbg-fetch-qsign --basePath=$HOME/QSignServer/txlib/${LibraryVersion}; echo -e ${red}签名服务器关闭 正在重启${background}; done"
if tmux_gauge qsignserver
then
    echo
    echo -en ${green}${Start_Stop_Restart}成功 是否打开窗口 [Y/N]:${background}
    read YN
    case ${YN} in
    Y|y)
        bot_tmux_attach_log qsignserver
    ;;
    *)
        echo -en ${cyan}回车返回${background}
        read
        echo
    ;;
    esac
fi
}
Pm2_Start(){
if [ -x "$(command -v pm2)" ]
then
    if ! pm2 show qsignserver | grep -q online > /dev/null 2>&1
    then
        export Boolean=true
        pm2 start --name qsignserver "while ${Boolean}; do sh $HOME/QSignServer/bin/unidbg-fetch-qsign --basePath=$HOME/QSignServer/txlib/${LibraryVersion}; echo -e ${red}签名服务器关闭 正在重启${background}; done"
        echo
        echo -en ${yellow}签名服务器已经启动,是否打开日志 [Y/n]${background}
        read YN
        case ${YN} in
        Y|y)
            pm2 log qsignserver
            echo
            ;;
        esac
    fi
else
    echo -e ${red}没有pm2!!!${background}
    exit
fi
}
echo
echo -e ${white}"====="${green}白狐-QSignServer${white}"====="${background}
echo -e ${cyan}请选择启动方式${background}
echo -e  ${green}1.  ${cyan}前台启动${background}
echo -e  ${green}2.  ${cyan}TMUX后台启动${background}
echo -e  ${green}3.  ${cyan}PM2后台启动${background}
echo "========================="
echo -en ${green}请输入您的选项: ${background};read num
case ${num} in 
1)
Foreground_Start
;;
2)
Tmux_Start
;;
3)
Pm2_Start
;;
*)
echo
echo -e ${red}输入错误${background}
exit
;;
esac
}
stop_QSignServer(){
LibraryVersion=$(grep "LibraryVersion" ${config} | sed 's/LibraryVersion: //g')
file=$HOME/QSignServer/txlib/${LibraryVersion}/config.json
Port=$(grep -E port ${file} | awk '{print $2}' | sed 's/"//g' | sed "s/://g")
if curl 127.0.0.1:${Port} > /dev/null 2>&1
then
    echo -e ${yellow}正在停止签名服务器${background}
    export Boolean=false
    tmux_kill_session qsignserver > /dev/null 2>&1
    pm2 delete qsignserver > /dev/null 2>&1
    PID=$(ps aux | grep qsign | sed '/grep/d' | awk '{print $2}')
    if ! [ -z ${PID} ];then
        kill ${PID}
    fi
    echo -en ${red}签名服务器停止成功 ${cyan}回车返回${background}
    read
    echo
    return
else
    echo -en ${red}签名服务器未启动 ${cyan}回车返回${background}
    read
    echo
    return
fi
}
restart_QSignServer(){
if tmux_ls qsignserver > /dev/null 2>&1 
then
    tmux_kill_session qsignserver
    export Start_Stop_Restart="重启"
    start_QSignServer
elif pm2 show qsignserver | grep -q online > /dev/null 2>&1
then
    pm2 delete qsignserver
    start_QSignServer
else
    echo -e ${red}签名服务器未启动或为后台运行${background}
    echo
    return
fi
}

update_QSignServer(){
LibraryVersion=$(grep "LibraryVersion" ${config} | sed 's/LibraryVersion: //g')
file=$HOME/QSignServer/txlib/${LibraryVersion}/config.json
Port=$(grep -E port ${file} | awk '{print $2}' | sed 's/"//g' | sed "s/://g")
if curl 127.0.0.1:${Port} > /dev/null 2>&1
then
    echo -e ${yellow}正在停止签名服务器${background}
    tmux_kill_session qsignserver > /dev/null 2>&1
    pm2 delete qsignserver > /dev/null 2>&1
    PID=$(ps aux | grep qsign | sed '/grep/d' | awk '{print $2}')
    if [ ! -z ${PID} ];then
        kill -9 ${PID}
    fi
    echo
fi
Port=$(grep -E port ${file} | awk '{print $2}' | sed 's/"//g' | sed "s/://g")
Key=$(grep -E key ${file} | awk '{print $2}' | sed 's/"//g' | sed "s/,//g")
cd $HOME/QSignServer
git fetch --all
git reset --hard origin/master
git pull
cd -
}

uninstall_QSignServer(){
if [ ! -d $HOME/QSignServer ];then
    echo -en ${red}您还没有部署签名服务器!!! ${cyan}回车返回${background};read
    return
fi
cd $HOME
echo -e ${yellow}正在停止服务器运行${background}
tmux_kill_session qsignserver > /dev/null 2>&1
pm2 delete qsignserver > /dev/null 2>&1
rm -rf $HOME/QSignServer > /dev/null 2>&1
rm -rf $HOME/QSignServer > /dev/null 2>&1
Version="${red}[未部署]"
}

log_QSignServer(){
LibraryVersion=$(grep "LibraryVersion" ${config} | sed 's/LibraryVersion: //g')
file=$HOME/QSignServer/txlib/${LibraryVersion}/config.json
Port=$(grep -E port ${file} | awk '{print $2}' | sed 's/"//g' | sed "s/://g")
if ! curl 127.0.0.1:${Port} > /dev/null 2>&1
then
    echo -en ${red}签名服务器 未启动 ${cyan}回车返回${background};read
    echo
    return
fi
if tmux_ls qsignserver > /dev/null 2>&1 
then
    bot_tmux_attach_log qsignserver
elif pm2 show qsignserver | grep -q online > /dev/null 2>&1
then
    pm2 logs qsignserver
fi
}

link_QSignServer(){
LibraryVersion=$(grep "LibraryVersion" ${config} | sed 's/LibraryVersion: //g')
file=$HOME/QSignServer/txlib/${LibraryVersion}/config.json
Port=$(grep -E port ${file} | awk '{print $2}' | sed 's/"//g' | sed "s/://g")
Key=$(grep -E key ${file} | awk '{print $2}' | sed 's/"//g' | sed "s/,//g")
Host=$(grep -E host ${file} | awk '{print $2}' | sed 's/"//g' | sed "s/,//g")
echo -e ${white}"====="${green}白狐-QSignServer${white}"====="${background}
echo -e ${cyan}版本: ${green}${LibraryVersion}${background}
echo -e ${cyan}端口: ${green}${Port}${background}
echo -e ${cyan}key值: ${green}${Key}${background}
echo -e ${cyan}链接: ${green}"http://""${Host}":"${Port}"/sign?key="${Key}"${background}
echo "========================="
echo -en ${yellow}回车返回${background};read
}

function config_QSignServer(){
LibraryVersion=$(grep "LibraryVersion" ${config} | sed 's/LibraryVersion: //g')
file=$HOME/QSignServer/txlib/${LibraryVersion}/config.json
echo -e ${white}"====="${green}白狐-QSignServer${white}"====="${background}
echo -e  ${green} 1.  ${cyan}修改端口${background}
echo -e  ${green} 2.  ${cyan}修改key值${background}
echo -e  ${green} 3.  ${cyan}修改共享库版本${background}
echo -e  ${green} 4.  ${cyan}设置共享token${background}
echo -e  ${green} 5.  ${cyan}修改最大实例数量${background}
echo -e  ${green} 6.  ${cyan}设置高并发${background}
echo -e  ${green} 7.  ${cyan}设置自动注册${background}
echo -e  ${green} 8.  ${cyan}设置kvm${background}
echo -e  ${green} 9.  ${cyan}设置unicorn${background}
echo -e  ${green} 0.  ${cyan}返回${background}
echo "========================="
echo -e ${green}注意: 各版本之间的配置不通用${background}
echo "========================="
echo -en ${green}请输入您的选项: ${background};read num
case ${num} in
1)
OldPort=$(grep -E port ${file} | awk '{print $2}' | sed 's/"//g' | sed "s/://g")
echo -e ${cyan}请输入您的新端口${background};read NewPort
if [[ ! ${NewPort} =~ ^[0-9]+$ ]];then
  echo -e ${red}请输入数字!!!${background}
  return
fi
sed -i "s/${OldPort}/${NewPort}/g" ${file}
echo -en ${green}修改完成 ${cyan}回车返回${background};read
;;
2)
OldKey=$(grep -E key ${file} | awk '{print $2}' | sed 's/"//g' | sed "s/,//g")
echo -e ${cyan}请输入您的新Key${background};read NewKey
if [ -z ${NewKey} ];then
  echo -e ${red}输入错误${background}
  return
fi
sed -i "s/${OldKey}/${NewKey}/g" ${file}
echo -en ${green}修改完成 ${cyan}回车返回${background};read
;;
3)
ModifyVersion
;;
4)
share_token="$(grep -E share_token ${file})"
value_share_token=$(echo ${share_token} | sed "s/\"share_token\"://g" | sed "s/,//g")
if echo ${value_share_token} | grep -q false
then
  sed -i "s/${share_token}/  \"share_token\": true,/g" ${file}
  echo -e ${cyan}共享token已设置为${green} 开启${background}
elif echo ${value_share_token} | grep -q true
then
  sed -i "s/${share_token}/  \"share_token\": false,/g" ${file}
  echo -e ${cyan}共享token已设置为${green} 关闭${background}
fi
echo -en${cyan}回车返回${background};read
;;
5)
OldNum=$(grep -E count ${file})
echo -e ${cyan}请输入最大实例数${background};read NewNum
if [[ ! ${NewPort} =~ ^[0-9]+$ ]];then
  echo -e ${red}请输入数字!!!${background}
  return
fi
sed -i "s/${OldNum}/  \"count\": ${NewNum},/g" ${file}
echo  -e ${cyan}最大实例数已设置为${green} ${NewNum}${background}
;;
*)
echo -e ${red}暂时没做完${background}
;;
esac
}
main(){
if [ -e QSignServer/bin/unidbg-fetch-qsign ];then
    LibraryVersion=$(grep "LibraryVersion" ${config} | sed 's/LibraryVersion: //g')
    file=$HOME/QSignServer/txlib/${LibraryVersion}/config.json
    Port=$(grep -E port ${file} | awk '{print $2}' | sed 's/"//g' | sed "s/://g")
    if curl -sL 127.0.0.1:${Port} > /dev/null 2>&1
    then
        QsignVersion=$(curl -sL 127.0.0.1:${Port} | grep version | sed 's|"||g' | sed 's|:||g' | sed 's|,||g')
        QsignVersion=$(echo ${QsignVersion} | awk '{print $4}')
        condition="${cyan}[${QsignVersion}]"
    else
        condition="${red}[未启动]"
    fi
    if [ -e $HOME/QSignServer/config.yaml ];then
        Version=$(cat $HOME/QSignServer/config.yaml | grep ScriptVersion | sed 's/ScriptVersion: //g')
    fi
    if [ "${Version}" = "${ScriptVersion}" ]
    then
        Version="${cyan}[${ScriptVersion}]"
    else
        Version="${red}${Version}[请更新]"
    fi
else
    Version="${red}[未部署]"
    condition="${red}[未部署]"
fi

echo -e ${white}"====="${green}白狐-QSignServer${white}"====="${background}
echo -e  ${green} 1.  ${cyan}安装签名服务器${background}
echo -e  ${green} 2.  ${cyan}启动签名服务器${background}
echo -e  ${green} 3.  ${cyan}关闭签名服务器${background}
echo -e  ${green} 4.  ${cyan}重启签名服务器${background}
echo -e  ${green} 5.  ${cyan}更新签名服务器${background}
echo -e  ${green} 6.  ${cyan}卸载签名服务器${background}
echo -e  ${green} 7.  ${cyan}签名服务器日志${background}
echo -e  ${green} 8.  ${cyan}签名服务器链接${background}
echo -e  ${green} 9.  ${cyan}签名服务器配置${background}
echo -e  ${green} 0.  ${cyan}退出${background}
echo "========================="
echo -e ${green}签名服务器脚本版本: ${Version}${background}
echo -e ${green}签名服务器适配版本: ${condition}${background}
echo -e ${green}QQ群:${cyan}狐狸窝:705226976${background}
echo "========================="
echo
echo -en ${green}请输入您的选项: ${background};read number
case ${number} in
1)
echo
install_QSignServer
;;
2)
echo
start_QSignServer
;;
3)
echo
stop_QSignServer
;;
4)
echo
restart_QSignServer
;;
5)
echo
update_QSignServer
;;
6)
echo
uninstall_QSignServer
;;
7)
log_QSignServer
;;
8)
echo
link_QSignServer
;;
9)
config_QSignServer
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
}
function mainbak()
{
    while true
    do
        main
        mainbak
    done
}
mainbak