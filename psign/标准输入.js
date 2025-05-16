import chalk from "chalk"
import { createInterface } from "readline"
import fs from 'fs'
import os from "os"
import { exec } from "child_process";

/**
 *  该JS插件的绝大多数代码来自于该仓库 （https://gitee.com/Zyy955/Yunzai-Bot-plugin/blob/main/apps.js） 
 *  因此可以认定其原作者为Zyy955(该仓库所有者) 
 *  
 *  原作者：Zyy955 (gitee.com/Zyy955)
 *  修改者：千奈千祁 (gitee.com/qiannqq)
 *  
 *  标准输入的所有版本发布于 该仓库(https://gitee.com/qiannqq/yunzai-plugin-JS)
 *  本插件遵循的开源协议遵循原仓库的开源协议，若原仓库无开源协议，则本插件不遵循任何开源协议
 *
 *  如有侵权，联系删除
 */

import fetch from "node-fetch"
global.fetch = fetch //此处全局声明fetch是为了修复部分插件内使用但不导入fetch而导致的报错

const pluginsLoader = (await import("../../lib/plugins/loader.js")).default

/** 检查图片文件夹是否存在 */
if (!fs.existsSync("temp/stdin")) fs.mkdirSync("temp/stdin")

/** 监听控制台输入 */
const rl = createInterface({ input: process.stdin, output: process.stdout })
rl.on('SIGINT', () => { rl.close(); process.exit() })
function getInput() {
    rl.question('', async (input) => {
        logger.info(`${chalk.hex("#868ECC")(`[标准输入]`)}收到消息：${input}`)
        await pluginsLoader.deal(msg(input.trim()))
        getInput()
    })
}
getInput()

function msg(msg) {
    const user_id = 55555
    const name = "标准输入"
    const time = Date.now() / 1000

    let e = {
        adapter: "cmd",
        message_id: "test123456",
        message_type: "private",
        post_type: "message",
        sub_type: "friend",
        self_id: Bot.uin,
        seq: 888,
        time,
        uin: Bot.uin,
        user_id,
        message: [{ type: "text", text: msg }],
        raw_message: msg,
        isMaster: true,
        toString: () => { return msg },
    }
    /** 用户个人信息 */
    e.sender = {
        card: name,
        nickname: name,
        role: "",
        user_id
    }

    /** 构建member */
    const member = {
        info: {
            user_id,
            nickname: name,
            last_sent_time: time,
        },
        /** 获取头像 */
        getAvatarUrl: () => {
            return `https://q1.qlogo.cn/g?b=qq&s=0&nk=528952540`
        }
    }

    /** 赋值 */
    e.member = member

    /** 构建场景对应的方法 */
    e.friend = {
        sendMsg: async (reply) => {
            return await sendMsg(reply)
        },
        recallMsg: (msg_id) => {
            return logger.mark(`${chalk.hex("#868ECC")(`[${name}]`)}撤回消息：${msg_id}`)

        },
        makeForwardMsg: async (forwardMsg) => {
            const msg = []
            try {
                for (const i of forwardMsg) {
                    if (i?.message) {
                        msg.push(i.message)
                    } else {
                        msg.push(JSON.stringify(i).slice(0, 2000))
                    }
                }
                return msg
            } catch (error) {
                return forwardMsg
            }
        }
    }

    /** 快速撤回 */
    e.recall = () => {
        return logger.mark(`${chalk.hex("#868ECC")(`[${name}]`)}撤回消息：${msg.id}`)
    }
    /** 快速回复 */
    e.reply = async (reply) => {
        return await sendMsg(reply)
    }

    /** 发送消息 */
    async function sendMsg(msg) {
        if (!Array.isArray(msg)) msg = [msg]
        let log = []
        let raw_log = []
        for (const i of msg) {
            if (typeof i === "string") {
                log.push(i)
                raw_log.push(i)
            } else {
                log.push(JSON.stringify(msg).slice(0, 1000))
                raw_log.push(JSON.stringify(msg))
            }
        }
        let image
        /** 尝试存储图片，若报错则不做任何处理 */
        try {
            raw_log = JSON.parse(raw_log[0])
            for (let item of raw_log) {
                try{
                    image = Buffer.from(item.file.data)
                    image = image.toString('base64')
                    fs.writeFileSync('temp/stdin/stdin.jpg', image, `base64`)
                    if(os.platform() == "win32") exec(`start .\\temp\\stdin\\stdin.jpg`)
                    logger.mark(`${chalk.hex("#868ECC")(`[${name}]`)}图片已存储至temp/stdin/stdin.jpg`)
                } catch(error) { }
            }
        } catch(error) { }
        
        return logger.info(`${chalk.hex("#868ECC")(`[${name}]`)}发送消息：${log.join('\n')}`)
    }
    return e
}

logger.mark(`${chalk.hex("#868ECC")(`[标准输入]`)}加载完成，现在你可以在控制台输入指令啦~`)