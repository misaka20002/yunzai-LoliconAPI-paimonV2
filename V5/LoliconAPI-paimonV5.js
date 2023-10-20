import plugin from '../../lib/plugins/plugin.js'
import HttpsProxyAgent from 'https-proxy-agent'
import fetch from 'node-fetch'
import crypto from 'crypto'
import moment from 'moment'
import lodash from 'lodash'
import sharp from 'sharp'
import path from 'path'
import yaml from 'yaml'
import fs from 'fs'

const NumReg = '[零一壹二两三四五六七八九十百千万亿\\d]+'
const Lolicon_KEY = new RegExp(`^#派蒙来\\s?(${NumReg})?(张|份|点)(.*)(涩|色|瑟)(图|圖)`)
const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:12811')
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
                    reg: '^#派蒙来份设置我(不)?要涩涩$',
                    fnc: 'setMaster_r18',
                    permission: 'master',
                    log: false
                },
                {
                    reg: '^#派蒙来份帮助$',
                    fnc: 'paimonlaifenhelp',
                    log: false
                },
                {
                    reg: '^#派蒙来份(清理|(清|删)除)?缓存图片$',
                    fnc: 'delete_img',
                    permission: 'master',
                    log: false
                }
            ]
        })
        init()
    }

    async key_setu(e) {
        const { config, random_pic } = yaml.parse(fs.readFileSync(Config_PATH, 'utf8'))
        if (config.num_Max > 20) return e.reply('请，，，请不要超过20张QAQ')

        if (!e.isMaster && await checkCooldown(e, 'LoliconAPI', config.CD)) return false

        const tag = e.msg.replace(new RegExp(`^#派蒙来\\s?(${NumReg})?(?:张|份|点)\|(?:涩|色|瑟)(?:图|圖)`, 'g'), '')
        const tags = tag.split(/[\s|,.\u3002\uff0c、]+/)
        if (tags.length > 3) return e.reply('tag标签数量太多啦QAQ', true, { recallMsg: 60 })
        let tagValue = tags.map(t => `&tag=${t}`).join('')
        if (!tagValue || tagValue === '&tag=') tagValue = lodash.sample(random_pic).map(tags => `&tag=${tags.join('|')}`).join('')

        let num = e.msg.match(new RegExp(NumReg))
        if (num) { num = convertChineseNumberToArabic(num[0]) } else num = 1
        if (num > config.num_Max && !e.isMaster) {
            return e.reply(`最多只能获取 ${config.num_Max} 张图片哦~`)
        } else if (num === 0) {
            return e.reply('？')
        } else if (num === '' || num === null) {
            num = 1
        }
        if (num > 5) {
            await e.reply('嘎嘎~机械~嘎嘎', true, { recallMsg: 60 })
        } else {
            await e.reply('派蒙这就去帮你找哦~', false, { recallMsg: 60 })
        }

        const r18Value = e.isGroup ? (e.isMaster ? config.r18_Master : config.r18) : (e.isMaster ? config.r18_Master : 2)
        const url = `https://api.lolicon.app/setu/v2?=${config.proxy}&size=${config.size}&r18=${r18Value}${tagValue}&excludeAI=${config.excludeAI}&num=${num}`

        try {
            const response = await fetch(url)
            const result = await response.json()
            if (Array.isArray(result.data) && result.data.length === 0) return e.reply('[派蒙来份]未获取到相关数据', false, { recallMsg: 60 })

            let msgs = []
            let successCount = 0
            let failureCount = 0

            for (const item of result.data) {
                const response = await fetch(item.urls.original, { agent: proxyAgent })
                if (!response.ok) {
                    failureCount++
                    continue
                }
                const imageUrl = e.isGroup ? await processImage(response, item.urls.original) : await downloadImage(response, item.urls.original)
                const msg = [
                    `标题：${item.title}\n`,
                    `画师：${item.author}\n`,
                    `Pid：${item.pid}\n`,
                    `R18：${item.r18}\n`,
                    `Tags：${item.tags.join('，')}\n`,
                    segment.image(imageUrl)
                ]
                msgs.push(msg)
                successCount++
            }

            if (successCount === 0) {
                return e.reply('[派蒙来份] 获取图片失败！', false, { recallMsg: 60 })
            } else if (failureCount > 0) {
                msgs.push(`[派蒙来份] 获取图片成功 ${successCount} 张，失败 ${failureCount} 张~`)
            }

            return e.reply(await makeForwardMsg(e, msgs, '主人，主人，>_<派蒙找到了哦'))
        } catch (err) {
            logger.warn(err)
            return e.reply('[派蒙来份]请检查网络环境', false, { recallMsg: 60 })
        }
    }

    /** 设置涩图CD */
    async set_cd(e) {
        const match = e.msg.match(/^#派蒙来份设置(c|C)(d|D)(.*)$/)
        if (match) {
            const input = match[10].trim()
            if (/^\d+$/.test(input)) {
                await updateConfig('CD', parseInt(input))
                return e.reply(`[派蒙来份] 已修改CD为${parseInt(input)}秒！`)
            } else {
                return e.reply('[派蒙来份] 请输入正确的数字（秒）喵！', true)
            }
        }
        return false
    }

    /** 设置单次获取图片数量限制 */
    async set_num(e) {
        const match = e.msg.match(/^#派蒙来份设置(张|份|点)数(.*)$/)
        if (match) {
            const input = match[10].trim()
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

    /** 发送帮助 */
    async paimonlaifenhelp (e) {
        e.reply('派蒙涩图帮助：\n  #派蒙来\\s?(${NumReg})?(张|份|点)(.*)(涩|色|瑟)(图|圖)\n       例如：#派蒙来15份可莉 白丝涩图\n  #派蒙来份设置cd[num]\n  #派蒙来份设置张数[num]\n  #派蒙来份设置(开启|关闭)(r|R)18 ：设置群友\n  #派蒙来份设置我(不)要涩涩 ：设置主人\n  #派蒙来份(清理|(清|删)除)?缓存图片')
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
        return await downloadImage(response, url)
    }
}

/** 下载处理 */
async function downloadImage(response, url) {
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
