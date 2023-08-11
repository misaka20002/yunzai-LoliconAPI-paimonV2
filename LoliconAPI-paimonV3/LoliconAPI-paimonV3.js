/** 
配置文件放在：
/plugins/example/LoliconAPI-paimonV3.yaml
配置文件内容：
config:
  CD: 60
  proxy: i.pixiv.re
  size: original
  excludeAI: true
  r18_Master: 2
  r18: 1
  num_Max: 20

*/


import plugin from '../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
import moment from 'moment'
import yaml from 'yaml'
import fs from 'fs'

// 正则匹配数字和汉字数字
const NumReg = '[零一壹二两三四五六七八九十百千万亿\\d]+'
// 取消zgh let Lolicon_KEY = new RegExp(`^派蒙来\\s?(${NumReg})?(张|份|点)(.*)(涩|色|瑟)(图|圖)`)

export class LoliconAPI extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'LoliconAPI-paimonV3',
            /** 功能描述 */
            dsc: 'https://api.lolicon.app',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 500,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: '^(派蒙来|派蒙找)\\s?(${NumReg})?(张|份|点)(.*)(涩|色|瑟)(图|圖)$',
                    /** 执行方法 */
                    fnc: 'key_setu',
                    /** 禁用日志 */
                    log: false
                },
                {
                    /** 命令正则匹配 */
                    reg: '^派蒙(涩|色|瑟)(图|圖)(c|C)(d|D)(.*)$',
                    /** 执行方法 */
                    fnc: 'set_cd',
                    /** 权限控制 */
                    permission: 'master',
                    /** 禁用日志 */
                    log: false
                },
                {
                    /** 命令正则匹配 */
                    reg: '^派蒙(涩|色|瑟)(图|圖)(份|张|点)数(.*)$',
                    /** 执行方法 */
                    fnc: 'set_num',
                    /** 权限控制 */
                    permission: 'master',
                    /** 禁用日志 */
                    log: false
                },
                {
                    /** 命令正则匹配 */
                    reg: '^派蒙(涩|色|瑟)(图|圖)(开启|关闭)(r|R)18$',
                    /** 执行方法 */
                    fnc: 'set_r18',
                    /** 权限控制 */
                    permission: 'master',
                    /** 禁用日志 */
                    log: false
                }
            ]
        })
    }

    async key_setu(e) {
        const { config } = yaml.parse(fs.readFileSync(`${process.cwd()}/plugins/example/LoliconAPI-paimonV3.yaml`, 'utf8'))
        // 检查配置参数
        if (config.num_Max > 20) return e.reply('[喵！] 呜QAQ，数量不可超过20张哦')

        // 检测是否处于CD中
        let CDTIME = await redis.get(`LoliconAPI_${e.group_id}_${e.user_id}_CD`)
        if (CDTIME && !e.isMaster) {
            let remainingTime = config.CD - (moment().unix() - moment(CDTIME, 'YYYY-MM-DD HH:mm:ss').unix())
            return e.reply(`「冷却喵」太，，，太快啦>////<！请等待 ${remainingTime} 秒哦`)
        }

        // 计入CD存入Redis
        let GetTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        await redis.set(`LoliconAPI_${e.group_id}_${e.user_id}_CD`, GetTime, { EX: config.CD })

        // 使用正则提取tag
        let tag = e.msg.replace(new RegExp(`^(派蒙来|派蒙找)\\s?(${NumReg})?(?:张|份|点)\|(?:涩|色|瑟)(?:图|圖)`, 'g'), '')

        // 分隔tag（以空格为标准，如果想修改成其他标准如“|”修改单引号内容即可
        let tags = tag.split(' ')

        // 判断tag数量
        if (tags.length > 3) {
            return e.reply('标签数量不可以超过3个哦QAQ', true)
        }

        // tag合并赋值
        let tagValue = tags.map(t => `&tag=${t}`).join('')
        if (!tagValue || tagValue === '&tag=') return false

        // 使用正则提取图片数量
        let num = e.msg.match(new RegExp(NumReg))
        if (num) num = this.translateChinaNum(num[0])
        else num = 1

        // 限制请求图片数量最大值
        if (num > config.num_Max) {
            return e.reply(`不，，，不可以一次要这么多啦QAQ！最多只能获取 ${config.num_Max} 张图片哦~`)
        } else if (num === 0) {
            return e.reply('0张，可以哦，喵>_< ')
        } else if (num === '' || num === null) {
            num = 1
        }

        // 执行指令时的回复，使用await关键字同步执行
        await e.reply('派蒙正在为你寻找中ing~')

        // 三元表达式
        let r18Value = e.isGroup ? (e.isMaster ? config.r18_Master : config.r18) : (e.isMaster ? config.r18_Master : 2)
        let url = `https://api.lolicon.app/setu/v2?proxy=${config.proxy}&size=${config.size}&r18=${r18Value}${tagValue}&excludeAI=${config.excludeAI}&num=${num}`

        // 异常处理
        try {
            let response = await fetch(url)

            // 检测响应是否返回空数据
            let result = await response.json()
            if (Array.isArray(result.data) && result.data.length === 0) return e.reply('Σσ(・Д・；)派蒙未找到到相关数据哦QAQ', true)

            // 封装同作品各个元素为一个数组下标
            let msgs = []
            let successCount = 0
            let failureCount = 0
            for (let item of result.data) {
                try {
                    let isValid = await checkImageURL(item.urls.original)
                    if (isValid) {
                        successCount++

                        let msg = [
                            '标题：' + item.title + '\n',
                            '画师：' + item.author + '\n',
                            'Pid：' + item.pid + '\n',
                            'R18：' + item.r18 + '\n',
                            'Tag：' + item.tags.join('，') + '\n',
                            segment.image(item.urls.original)
                        ]
                        msgs.push(msg)
                    } else {
                        failureCount++
                        // 如果图片 URL 无效，可以在这里添加操作，比如继续获取新的图片以填补失败图片的空缺（你说得对，但是懒得写了
                    }
                } catch (error) {
                    console.error(error)
                }
            }

            // 当返回图片仅有一张还他妈失败的返回消息
            if (successCount === 0 && failureCount === 1) return e.reply('Σσ(・Д・；)怎么回事QAQ，派蒙获取图片失败惹')

            // 为获取图片不全的数组添加提示信息，但所有图片都获取成功时，不显示成功和失败数量（不想尾部添加提示信息注释掉本行代码即可
            if (failureCount > 0) msgs.push(`派蒙找到啦>_<，成功 ${successCount} 张，失败 ${failureCount} 张~`)

            // 制作并发送转发消息
            return e.reply(await this.makeForwardMsg(e, msgs))
        } catch (error) {
            // 输出错误信息
            console.error(error)
            return e.reply('Σσ(・Д・；)请检查网络环境哦，派蒙搜图失败')
        }
    }

    /** 设置涩图CD */
    async set_cd(e) {
        const match = e.msg.match(/^派蒙(涩|色|瑟)(图|圖)(c|C)(d|D)(.*)$/)
        if (match) {
            const input = match[5].trim()
            if (/^\d+$/.test(input)) {
                await updateConfig('CD', parseInt(input))
                return e.reply(`派蒙搜图已修改CD为${parseInt(input)}秒~`)
            } else {
                return e.reply('[喵？] 请输入正确的数字哦！', true)
            }
        }
        return false
    }

    /** 设置单次获取图片数量限制 */
    async set_num(e) {
        const match = e.msg.match(/^派蒙(涩|色|瑟)(图|圖)(张|份|点)数(.*)$/)
        if (match) {
            const input = match[4].trim()
            if (/^\d+$/.test(input)) {
                await updateConfig('num_Max', parseInt(input))
                return e.reply(`已修改限制为${parseInt(input)}张哩！`)
            } else {
                return e.reply('[喵！] 请输入正确的数字哦！', true)
            }
        }
        return false
    }

    /** 是否开启R18（但是全局 */
    async set_r18(e) {
        const type = e.msg.replace(/^派蒙(涩|色|瑟)(图|圖)(开启|关闭)(r|R)18$/g, '$1')
        if (type === '开启' || type === '关闭') {
            await updateConfig('r18', type === '开启' ? 1 : 0)
            return e.reply(`派蒙，已${type}涩涩啦！`)
        } else {
            return false
        }
    }

    /**
     * 制作转发消息
     * @param {Array} msgs 转发内容
     */
   async makeForwardMsg(e , msgs) {
        let userInfo = {
            /** 转发人昵称 */
            nickname: e.nickname,
            /** 转发人QQ */
            user_id: e.user_id
        }

        let forwardMsg = []
        for (let msg of msgs) {
            forwardMsg.push({
                ...userInfo,
                message: msg
            })
        }

        /** 制作转发内容 */
        if (this.e.isGroup) {
            forwardMsg = await this.e.group.makeForwardMsg(forwardMsg)
        } else {
            forwardMsg = await this.e.friend.makeForwardMsg(forwardMsg)
        }

        /** 处理描述 */
        forwardMsg.data = forwardMsg.data
            .replace('<?xml version="1.0" encoding="utf-8"?>', '<?xml version="1.0" encoding="utf-8" ?>')
            .replace(/\n/g, '')
            .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
            .replace(/___+/, `<title color="#777777" size="26">派蒙找到啦，快点进来看看吧~</title>`)
            
        return forwardMsg
    }

    // ------------------------------------------------- 以下代码copy自椰羊 -------------------------------------------------

    /**
     * @description: 使用JS将数字从汉字形式转化为阿拉伯形式
     * @param {string} convert
     * @return {number}
     */
    translateChinaNum(convert) {
        if (!convert && convert != 0) return convert
        // 如果是纯数字直接返回
        if (/^\d+$/.test(convert)) return Number(convert)
        // 字典
        let map = new Map()
        map.set('一', 1)
        map.set('壹', 1) // 特殊
        map.set('二', 2)
        map.set('两', 2) // 特殊
        map.set('三', 3)
        map.set('四', 4)
        map.set('五', 5)
        map.set('六', 6)
        map.set('七', 7)
        map.set('八', 8)
        map.set('九', 9)
        // 按照亿、万为分割将字符串划分为三部分
        let split = ''
        split = convert.split('亿')
        let s_1_23 = split.length > 1 ? split : ['', convert]
        let s_23 = s_1_23[1]
        let s_1 = s_1_23[0]
        split = s_23.split('万')
        let s_2_3 = split.length > 1 ? split : ['', s_23]
        let s_2 = s_2_3[0]
        let s_3 = s_2_3[1]
        let arr = [s_1, s_2, s_3]

        // -------------------------------------------------- 对各个部分处理 --------------------------------------------------
        arr = arr.map(item => {
            let result = ''
            result = item.replace('零', '')
            // [ '一百三十二', '四千五百', '三千二百一十三' ] ==>
            let reg = new RegExp(`[${Array.from(map.keys()).join('')}]`, 'g')
            result = result.replace(reg, substring => {
                return map.get(substring)
            })
            // [ '1百3十2', '4千5百', '3千2百1十3' ] ==> ['0132', '4500', '3213']
            let temp
            temp = /\d(?=千)/.exec(result)
            let thousand = temp ? temp[0] : '0'
            temp = /\d(?=百)/.exec(result)
            let hundred = temp ? temp[0] : '0'
            temp = /\d?(?=十)/.exec(result)
            let ten
            if (temp === null) { // 说明没十：一百零二
                ten = '0'
            } else if (temp[0] === '') { // 说明十被简写了：十一
                ten = '1'
            } else { // 正常情况：一百一十一
                ten = temp[0]
            }
            temp = /\d$/.exec(result)
            let num = temp ? temp[0] : '0'
            return thousand + hundred + ten + num
        })
        // 借助parseInt自动去零
        return parseInt(arr.join(''))
    }
}

/** 响应判断 */
async function checkImageURL(url) {
    try {
        let response = await fetch(url, { method: 'HEAD' })
        return response.ok
    } catch (error) {
        return console.log(error)
    }
}

/** 读取YAML文件操作 */
function readYaml(filePath) {
    return yaml.parse(fs.readFileSync(filePath, 'utf8'))
}

/** 写入YAML文件操作 */
function writeYaml(filePath, data) {
    fs.writeFileSync(filePath, yaml.stringify(data), 'utf8')
}

/** 更新YAML文件操作 */
async function updateConfig(key, value) {
    try {
        // 读取 YAML 文件
        const data = readYaml(`${process.cwd()}/plugins/example/LoliconAPI-paimonV3.yaml`)
        // 更新配置值
        data.config[key] = value
        // 将更新后的数据写回 YAML 文件
        writeYaml(`${process.cwd()}/plugins/example/LoliconAPI-paimonV3.yaml`, data)
        // 返回更新后的配置数据
        return data.config
    } catch (error) {
        console.error(error)
    }
}
