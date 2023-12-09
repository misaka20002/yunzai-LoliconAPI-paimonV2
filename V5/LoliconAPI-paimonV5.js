/* version 2023
做了https-proxy-agent 7.x 和 5.x 的兼容，需要安装以下proxy.js,
本插件需要在喵崽根目录依次执行以下后重启生效：
curl -# -L -o "./plugins/example/proxy.js" "https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/V5/proxy.js"
curl -# -L -o "./config/config/LoliconAPI.yaml" "https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/V5/LoliconAPI.yaml"
pnpm add sharp -w
pnpm add axios -w
pnpm add https-proxy-agent -w
readme: https://github.com/misaka20002/yunzai-LoliconAPI-paimonV2/tree/main#readme
*/
import plugin from '../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
import crypto from 'crypto'
import moment from 'moment'
import lodash from 'lodash'
import sharp from 'sharp'
import path from 'path'
import yaml from 'yaml'
import fs from 'fs'
import { getProxy } from '../other/proxy.js'

let nproxy = getProxy()
const NumReg = '[零一壹二两三四五六七八九十百千万亿\\d]+'
const Lolicon_KEY = new RegExp(`^#派蒙来\\s?(${NumReg})?(张|份|点)(.*)(涩|色|瑟)(图|圖)`)
const Config_PATH = `${process.cwd()}/config/config/LoliconAPI.yaml`
const Directory = `${process.cwd()}/LoliconAPI`

export class LoliconAPI extends plugin {
    constructor() {
        super({
            name: '派蒙来份',
            dsc: 'https://api.lolicon.app',
            event: 'message',
            priority: -1011,
            rule: [
                {
                    reg: Lolicon_KEY,
                    fnc: 'key_setu',
                    log: false
                },
                {
                    reg: '^#派蒙来份设置(c|C)(d|D)(.*)$',
                    fnc: 'set_cd',
                    permission: 'master',
                    log: false
                },
                {
                    reg: '^#派蒙来份设置撤回时间(.*)$',
                    fnc: 'set_withdrawal_cd',
                    permission: 'master',
                    log: false
                },
                {
                    reg: '^#派蒙来份设置代理地址(.*)$',
                    fnc: 'set_Proxy_server_address',
                    permission: 'master',
                    log: false
                },
                {
                    reg: '^#派蒙来份设置反向代理地址(.*)$',
                    fnc: 'set_Reverse_proxy',
                    permission: 'master',
                    log: false
                },
                {
                    reg: '^#派蒙来份设置图片大小(.*)$',
                    fnc: 'set_size',
                    permission: 'master',
                    log: false
                },
                {
                    reg: '^#派蒙来份设置(份|张|点)数(.*)$',
                    fnc: 'set_num',
                    permission: 'master',
                    log: false
                },
                {
                    reg: '^#派蒙来份设置(开启|关闭)(r|R)18$',
                    fnc: 'set_r18',
                    permission: 'master',
                    log: false
                },
                {
                    reg: '^#派蒙来份设置我(不)?要(a|A)(i|I)作品$',
                    fnc: 'set_excludeAI',
                    permission: 'master',
                    log: false
                },
                {
                    reg: '^#派蒙来份设置(开启|关闭)使用代理$',
                    fnc: 'set_Use_proxy_server',
                    permission: 'master',
                    log: false
                },
                {
                    reg: '^#派蒙来份设置我(不)?要涩涩$',
                    fnc: 'setMaster_r18',
                    permission: 'master',
                    log: false
                },
                /* {
                    reg: '^#派蒙来份设置(p|P)站直连$',
                    fnc: 'set_Reverse_proxy_void',
                    permission: 'master',
                    log: false
                }, */
                {
                    reg: '^#派蒙来份(清理|(清|删)除)?缓存图片$',
                    fnc: 'delete_img',
                    permission: 'master',
                    log: false
                },
                {
                    reg: '^#派蒙来份设置我可以要涩涩$',
                    fnc: 'setMaster_r18_2',
                    permission: 'master',
                    log: false
                },
                {
                    reg: '^#派蒙来份设置可以(r|R)18$',
                    fnc: 'set_r18_2',
                    permission: 'master',
                    log: false
                },
                {
                    reg: '^#派蒙来份(当|目)前设置$',
                    fnc: 'paimonlaifenshowconfig',
                    permission: 'master',
                    log: false
                },
                {
                    reg: '^#派蒙来份帮助$',
                    fnc: 'paimonlaifenhelp',
                    log: false
                }
            ]
        })
        init()
    }

    async key_setu(e) {
        const { config, random_pic } = yaml.parse(fs.readFileSync(Config_PATH, 'utf8'))
                let proxyAgent
                if (config.Use_proxy_server == 0) {
                        proxyAgent = 1
                } else if (!(/^\w+[^\s]+(\.[^\s]+){1,}$/.test(config.Proxy_server_address))) {
                        return e.reply(`代理服务器设置错误，当前的设置为"${config.Proxy_server_address}"，请#派蒙来份帮助`)
                }
                else {
                        proxyAgent = nproxy(config.Proxy_server_address)
                }
		
        if (config.num_Max > 20) return e.reply('请，，，请不要超过20张QAQ')

        if (!e.isMaster && await checkCooldown(e, 'LoliconAPI', config.CD)) return false

        const tag = e.msg.replace(new RegExp(`^#派蒙来\\s?(${NumReg})?(?:张|份|点)\|(?:涩|色|瑟)(?:图|圖)`, 'g'), '')
        const tags = tag.split(/[\s,.\u3002\uff0c、]+/)
        if (tags.length > 3) return e.reply('tag标签不能超过3个哦~', true)
        let tagValue = tags.map(t => `&tag=${t}`).join('')
        if (!tagValue || tagValue === '&tag=') tagValue = lodash.sample(random_pic).map(tags => `&tag=${tags.join('|')}`).join('')

        let num = e.msg.match(new RegExp(NumReg))
        if (num) { num = convertChineseNumberToArabic(num[0]) } else num = 1
        if (num > config.num_Max && !e.isMaster) {
            return e.reply(`最多只能获取 ${config.num_Max} 张图片哦~`)
        } else if (num === 0) {
            return e.reply('喵？')
        } else if (num === '' || num === null) {
            num = 1
        }
        if (num > 5) {
            await e.reply('嘎嘎~机械~嘎嘎', true)
        } else {
            await e.reply('派蒙这就去帮你找哦~', false)
        }

        const r18Value = e.isGroup ? (e.isMaster ? config.r18_Master : config.r18) : (e.isMaster ? config.r18_Master : 2)
        const url = `https://api.lolicon.app/setu/v2?proxy=${config.Reverse_proxy}&size=${config.size}&r18=${r18Value}${tagValue}&excludeAI=${config.excludeAI}&num=${num}`

        try {
            const response = await fetch(url)
            const result = await response.json()
            if (Array.isArray(result.data) && result.data.length === 0) return e.reply('派蒙...没有找到QAQ', false)

            let msgs = []
            let successCount = 0
            let failureCount = 0

            for (const item of result.data) {
                const response = config.Use_proxy_server ? await fetch(item.urls?.original || item.urls?.regular || item.urls?.small || item.urls?.thumb || item.urls?.mini, { agent: proxyAgent }) : await fetch(item.urls?.original || item.urls?.regular || item.urls?.small || item.urls?.thumb || item.urls?.mini)
		/* 是否通过代理下载图片，response为下载的图片 */
                if (!response.ok) {
                    failureCount++
                    continue
                }
                const imageUrl = e.isGroup ? await processImage(response, item.urls?.original || item.urls?.regular || item.urls?.small || item.urls?.thumb || item.urls?.mini) : await reNameAndSavePic(response, item.urls?.original || item.urls?.regular || item.urls?.small || item.urls?.thumb || item.urls?.mini)
		/* reNameAndSavePic()用于下载好的图片存档在 localPath,其传递的url仅用作文件重命名;仅存档私聊未处理过的文件,processImage()不保存处理过的文件 */
                
                const msg = [
                    `标题：${item.title}\n`,
                    `画师：${item.author}\n`,
                    `Uid：${item.uid}\n`,
                    `Pid：${item.pid}\n`,
                    `R18：${item.r18}\n`,
                    `AI生成：${item.aiType ? item.aiType == 1 ? '是' : '未知' : '否'}\n`,
                    `Tags：${item.tags.join('，')}\n`,
                    segment.image(imageUrl)
                ]
                msgs.push(msg)
                successCount++
            }

            if (successCount === 0) {
                return e.reply('[派蒙来份] 获取图片失败，请确认反代地址能否直连', false, { recallMsg: 60 })
            } else if (failureCount > 0) {
                msgs.push(`[派蒙来份] 获取图片成功 ${successCount} 张，失败 ${failureCount} 张~`)
            }

            return e.reply(await makeForwardMsg(e, msgs, '主人，主人，>_<派蒙找到了哦') ,false, { recallMsg: config.withdrawal_pic_CD })
        } catch (err) {
            logger.warn(err)
            return e.reply('[派蒙来份]loliapi返回错误，请检查网络环境或重新下载yaml', false, { recallMsg: 60 })
	/* 还要检查api.lolicon.app能否直连 */
        }
    }

    /** 设置涩图CD */
    async set_cd(e) {
        const match = e.msg.match(/^#派蒙来份设置(c|C)(d|D)(.*)$/)
        if (match) {
            const input = match[3].trim()
            if (/^\d+$/.test(input)) {
                await updateConfig('CD', parseInt(input))
                return e.reply(`[派蒙来份] 已修改CD为${parseInt(input)}秒！`)
            } else {
                return e.reply('[派蒙来份] 请输入正确的数字（秒）喵！', true)
            }
        }
        return false
    }
	
    /** 设置涩图撤回CD */
    async set_withdrawal_cd(e) {
        const match = e.msg.match(/^#派蒙来份设置撤回时间(.*)$/)
        if (match) {
            const input = match[1].trim()
            if (/^\d+$/.test(input)) {
		    if (input>120) {
			    await e.reply('[派蒙来份] 只有管理员才可以撤回超过2分钟的信息哦', true)
		    }
                await updateConfig('withdrawal_pic_CD', parseInt(input))
                return e.reply(`[派蒙来份] 已修改撤回时间为${parseInt(input)}秒！`)
            } else {
                return e.reply('[派蒙来份] 请输入正确的数字（秒）喵！', true)
            }
        }
        return false
    }
	
    /** 设置代理服务器地址 */
    async set_Proxy_server_address(e) {
        const match = e.msg.match(/^#派蒙来份设置代理地址(.*)$/)
        if (match) {
            const input = match[1].trim()
            if (/^\w+[^\s]+(\.[^\s]+){1,}$/.test(input)) {
                await updateConfig('Proxy_server_address', input)
                return e.reply(`[派蒙来份] 已修改代理服务器地址为${input}`)
            } else {
                return e.reply(`[派蒙来份] 你的输入为"${input}"，请输入正确的代理服务器地址`, true)
            }
        }
        return false
    }
	
    /** 设置反代地址 */
    async set_Reverse_proxy(e) {
        const match = e.msg.match(/^#派蒙来份设置反向代理地址(.*)$/)
        if (match) {
            const input = match[1].trim()
            if (/(^\w+[^\s]+(\.[^\s]+){1,}$)/.test(input)) {
                await updateConfig('Reverse_proxy', input)
                return e.reply(`[派蒙来份] 已修改反向代理地址为${input}`)
            } 
	    /* else if (/^0$|^false$|^null$/.test(input)) {
            	await updateConfig('Reverse_proxy', 0)
            	return e.reply(`[派蒙来份] 已修改反向代理地址为${input},请确保你的网络环境可p站直连`)
            } */
	    else {
                return e.reply(`[派蒙来份] 你的输入为"${input}"，请输入正确的反向代理地址。\n由于P站资源域名pximg具有防盗链措施，不含pixiv referrer的请求均会 403，所以必须依靠反代服务`, true)
            }
        }
        return false
    }

    /** 设置图片大小 */
    async set_size(e) {
        const match = e.msg.match(/^#派蒙来份设置图片大小(.*)$/)
        if (match) {
            const input = match[1].trim()
            if (/^(original|regular|small|thumb|mini)$/g.test(input)) {
                await updateConfig('size', input)
                return e.reply(`[派蒙来份] 已修改图片的大小为${input}`)
            } else {
                return e.reply(`[派蒙来份] 你的输入为"${input}"，请输入正确的值（original|regular|small|thumb|mini）`, true)
            }
        }
        return false
    }

    /** 设置单次获取图片数量限制 */
    async set_num(e) {
        const match = e.msg.match(/^#派蒙来份设置(张|份|点)数(.*)$/)
        if (match) {
            const input = match[2].trim()
            if (/^\d+$/.test(input)) {
                await updateConfig('num_Max', parseInt(input))
                return e.reply(`[派蒙来份] 已修改限制为${parseInt(input)}张！`)
            } else {
                return e.reply('[派蒙来份] 请输入正确的数字（张）喵！', true)
            }
        }
        return false
    }

    /** 开启R18 */
    async set_r18(e) {
        const type = e.msg.replace(/^#派蒙来份设置(开启|关闭)(r|R)18$/g, '$1')
        if (type === '开启' || type === '关闭') {
            await updateConfig('r18', type === '开启' ? 1 : 0)
            return e.reply(`[派蒙来份] 已${type}涩涩！`)
        } else {
            return false
        }
    }
	
     /** 开启关闭使用代理服务器 */
    async set_Use_proxy_server(e) {
        const type = e.msg.replace(/^#派蒙来份设置(开启|关闭)使用代理$/g, '$1')
        if (type === '开启' || type === '关闭') {
            await updateConfig('Use_proxy_server', type === '开启' ? 1 : 0)
            return e.reply(`[派蒙来份] 已${type}使用代理服务器！`)
        } else {
            return false
        }
    }

    /** 开启R18=2 */
    async set_r18_2(e) {
        await updateConfig('r18', 2)
        return e.reply(`[派蒙来份] 已设置成功！`)
    }
	
    /** 设置反向代理为空用于p站直连（已弃用） */
    async set_Reverse_proxy_void(e) {
        await updateConfig('Reverse_proxy', 0)
        return e.reply(`[派蒙来份] 已设置p站直连（请确保你的网络环境）！`)
    }

    /** 开启主人R18 */
    async setMaster_r18(e) {
        const type = e.msg.replace(/^#派蒙来份设置我(不)?要涩涩$/g, '$1')
        if (type === '不' || type === '') {
            await updateConfig('r18_Master', type === '' ? 1 : 0)
            return e.reply(`[派蒙来份] 已设置成功！`)
        } else {
            return false
        }
    }
	
    /** 开启ai作品 */
    async set_excludeAI(e) {
        const type = e.msg.replace(/^#派蒙来份设置我(不)?要(a|A)(i|I)作品$/g, '$1')
        if (type === '不' || type === '') {
            await updateConfig('excludeAI', type === '' ? 0 : 1)
            return e.reply(`[派蒙来份] 已设置成功！`)
        } else {
            return false
        }
    }

    /** 开启主人R18=2 */
    async setMaster_r18_2(e) {
        await updateConfig('r18_Master', 2)
        return e.reply(`[派蒙来份] 已设置成功！`)
    }

    /** 发送帮助 */
    async paimonlaifenhelp (e) {
        let paimonlaifenhelpmsg2 = '  #派蒙来[n](张|份|点)[tag](涩|色|瑟)(图|圖)\n\t#派蒙来份涩图\n\t#派蒙来5份涩图\n\t#派蒙来5份可莉 白丝涩图\n\t#派蒙来5份派蒙 可莉 萝莉|女孩子涩图'
        let paimonlaifenhelpmsg1 = '派蒙涩图帮助：'
        let paimonlaifenhelpmsg3 = '派蒙来份管理员设置:\n  #派蒙来份设置cd[num]\n  #派蒙来份设置撤回时间[num]：0则不撤回\n  #派蒙来份设置张数[num]\n  #派蒙来份设置(开启|关闭|可以)r18 ：设置群友\n  #派蒙来份设置我(不|可以)要涩涩 ：设置主人\n  #派蒙来份设置我(不)要ai作品\n  #派蒙来份设置图片大小(original|regular|small|thumb|mini)\n  #派蒙来份设置(开启|关闭)使用代理\n  #派蒙来份设置代理地址http://127.0.0.1:12811\n  #派蒙来份设置反向代理地址i.pixiv.re\n  #派蒙来份当前设置\n  #派蒙来份清理缓存图片'
        let paimonlaifenhelpmsgx = await makeForwardMsg(e, [paimonlaifenhelpmsg1, paimonlaifenhelpmsg2, paimonlaifenhelpmsg3], '派蒙涩图帮助');
        return e.reply(paimonlaifenhelpmsgx);
    }
	
    /** 发送当前设置 */
    async paimonlaifenshowconfig (e) {
	const { config, random_pic } = yaml.parse(fs.readFileSync(Config_PATH, 'utf8'))
        let paimonlaifenhelpmsg1 = '派蒙涩图当前设置：'
        let paimonlaifenhelpmsg2 = `  群聊CD：${config.CD}秒\n  撤回时间：${config.withdrawal_pic_CD}秒\n  搜图最大张数：${config.num_Max}张\n  群友r18：${config.r18}\n  主人r18：${config.r18_Master}\n  排除ai作品（api不能全部排除）：${config.excludeAI}\n  图片大小：${config.size}\n  使用代理：${config.Use_proxy_server}\n  代理地址：${config.Proxy_server_address}\n  反向代理地址：${config.Reverse_proxy}`
        let paimonlaifenhelpmsgx = await makeForwardMsg(e, [paimonlaifenhelpmsg1, paimonlaifenhelpmsg2], '派蒙涩图当前设置');
        return e.reply(paimonlaifenhelpmsgx);
    }

    /** 清理缓存图片 */
    async delete_img(e) {
        await e.reply(`开始清理…`)
        let successCount = 0
        const files = await fs.promises.readdir(Directory)
        for (const file of files) {
            const filePath = path.join(Directory, file)
            await fs.promises.unlink(filePath)
            successCount++
        }
        return e.reply(`[派蒙来份]共清理缓存图片${successCount}张`)
    }
}

/** 冷却时间 */
async function checkCooldown(e, command, cooldownTime) {
    const CDTIME = await redis.get(`${command}_${e.group_id}_${e.user_id}_CD`)
    if (CDTIME) {
        const remainingTime = cooldownTime - (moment().unix() - moment(CDTIME, 'YYYY-MM-DD HH:mm:ss').unix())
        return e.reply(`派蒙累了喵，请等待 ${remainingTime} 秒~`)
    }
    const GetTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    await redis.set(`${command}_${e.group_id}_${e.user_id}_CD`, GetTime, { EX: cooldownTime })
}

/** 读取YAML文件 */
function readYaml(filePath) {
    return yaml.parse(fs.readFileSync(filePath, 'utf8'))
}

/** 写入YAML文件 */
function writeYaml(filePath, data) {
    fs.writeFileSync(filePath, yaml.stringify(data), 'utf8')
}

/** 更新YAML文件 */
async function updateConfig(key, value) {
    const data = readYaml(Config_PATH)
    data.config[key] = value
    writeYaml(Config_PATH, data)
    return data.config
}

/** 图片处理 */
async function processImage(response, url) {
    try {
        let imageData = await response.arrayBuffer()
        // 获取图片元数据
        const metadata = await sharp(imageData).metadata()

        // 定义一个数组，包含所有可能的修改选项
        const options = ['brightness', 'contrast', 'saturation', 'hue', 'width', 'height']

        // 随机选择一个选项
        const option = options[Math.floor(Math.random() * options.length)]

        // 根据选择的选项进行修改
        switch (option) {
            case 'brightness':
                // 修改亮度
                imageData = await sharp(imageData).modulate({ brightness: 1 + Math.random() * 0.02 }).toBuffer()
                break
            case 'contrast':
                // 修改对比度
                imageData = await sharp(imageData).modulate({ contrast: 1 + Math.random() * 0.02 }).toBuffer()
                break
            case 'saturation':
                // 修改饱和度
                imageData = await sharp(imageData).modulate({ saturation: 1 + Math.random() * 0.02 }).toBuffer()
                break
            case 'hue':
                // 修改色调
                imageData = await sharp(imageData).modulate({ hue: Math.floor(Math.random() * 3.6) }).toBuffer()
                break
            case 'width':
                // 修改宽度
                const newWidth = metadata.width - 1 + Math.floor(Math.random() * 2)
                imageData = await sharp(imageData).resize(newWidth, null, { withoutEnlargement: true }).toBuffer()
                break
            case 'height':
                // 修改高度
                const newHeight = metadata.height - 1 + Math.floor(Math.random() * 2)
                imageData = await sharp(imageData).resize(null, newHeight, { withoutEnlargement: true }).toBuffer()
                break
        }
        return imageData
    } catch (err) {
        return await reNameAndSavePic(response, url)
    }
}

/** 下载好的图片重命名并存档在 localPath */
async function reNameAndSavePic(response, url) {
    try {
        // 计算URL的哈希值并将其作为文件名
        const hash = crypto.createHash('sha256').update(url).digest('hex')
        const filename = hash + path.extname(url)
        const localPath = path.join(Directory, filename)

        // 检查文件是否已经存在
        if (fs.existsSync(localPath)) return localPath

        const imageData = await response.arrayBuffer()
        fs.writeFileSync(localPath, Buffer.from(imageData))
        return localPath
    } catch (err) {
        return `${process.cwd()}/resources/error.png`
    }
}

/** 制作json转发消息 */
async function makeForwardMsg(e, msg = [], dec = '') {
    if (!Array.isArray(msg)) msg = [msg]

    const userInfo = {
        user_id: e.user_id,
        nickname: e.nickname
    }

    let forwardMsg = []
    for (const message of msg) {
        if (!message) continue
        forwardMsg.push({
            ...userInfo,
            message: message
        })
    }

    /** 制作转发内容 */
    if (e?.group?.makeForwardMsg) {
        forwardMsg = await e.group.makeForwardMsg(forwardMsg)
    } else if (e?.friend?.makeForwardMsg) {
        forwardMsg = await e.friend.makeForwardMsg(forwardMsg)
    } else {
        return msg.join('\n')
    }

    if (dec) {
        /** 处理描述 */
        if (typeof (forwardMsg.data) === 'object') {
            const detail = forwardMsg.data?.meta?.detail
            if (detail) {
                detail.news = [{ text: dec }]
                forwardMsg.data.prompt = '派蒙，最好用的伙伴！'
            }
        } else {
            forwardMsg.data = forwardMsg.data
                .replace(/\n/g, '')
                .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
                .replace(/___+/, `<title color="#777777" size="26">${dec}</title>`)
        }
    }
    return forwardMsg
}

/**
 * @description: 字库
 * @param {string} convert
 * @return {number}
 */
function convertChineseNumberToArabic(input) {
    if (!input && input != 0) return input
    // 如果是纯数字直接返回
    if (/^\d+$/.test(input)) return Number(input)
    // 字典
    const dictionary = new Map()
    dictionary.set('一', 1)
    dictionary.set('壹', 1) // 特殊
    dictionary.set('二', 2)
    dictionary.set('两', 2) // 特殊
    dictionary.set('三', 3)
    dictionary.set('四', 4)
    dictionary.set('五', 5)
    dictionary.set('六', 6)
    dictionary.set('七', 7)
    dictionary.set('八', 8)
    dictionary.set('九', 9)
    // 按照亿、万为分割将字符串划分为三部分
    let splitString = ''
    splitString = input.split('亿')
    const billionAndRest = splitString.length > 1 ? splitString : ['', input]
    const rest = billionAndRest[1]
    const billion = billionAndRest[0]
    splitString = rest.split('万')
    const tenThousandAndRemainder = splitString.length > 1 ? splitString : ['', rest]
    const tenThousand = tenThousandAndRemainder[0]
    const remainder = tenThousandAndRemainder[1]
    let parts = [billion, tenThousand, remainder]

    parts = parts.map(item => {
        let result = ''
        result = item.replace('零', '')
        const reg = new RegExp(`[${Array.from(dictionary.keys()).join('')}]`, 'g')
        result = result.replace(reg, substring => {
            return dictionary.get(substring)
        })
        let temp
        temp = /\d(?=千)/.exec(result)
        const thousand = temp ? temp[0] : '0'
        temp = /\d(?=百)/.exec(result)
        const hundred = temp ? temp[0] : '0'
        temp = /\d?(?=十)/.exec(result)
        let ten
        if (temp === null) {
            ten = '0'
        } else if (temp[0] === '') {
            ten = '1'
        } else {
            ten = temp[0]
        }
        temp = /\d$/.exec(result)
        const num = temp ? temp[0] : '0'
        return thousand + hundred + ten + num
    })
    // 借助parseInt自动去零
    return parseInt(parts.join(''))
}

function init() {
    if (!fs.existsSync(Directory)) fs.mkdirSync(Directory)
}
