import plugin from '../../lib/plugins/plugin.js'
import cfg from '../../lib/config/config.js'
import yaml from 'yaml'
import fs from 'fs'


const path = `${process.cwd()}/config/config/other.yaml`

export class paimon_blackQQ extends plugin {
    constructor() {
        super({
            name: '派蒙崽拉黑QQ',
            dsc: '派蒙崽拉黑QQ',
            event: 'message',
            priority: 5000,
            rule: [
                {
                    reg: '^#派蒙崽拉黑(QQ|qq)',
                    fnc: 'paimon_black_qq_add',
                    permission: 'master',
                },
                {
                    reg: '^#派蒙崽查看拉黑(QQ|qq)$',
                    fnc: 'paimon_black_qq_list',
                    permission: 'master',
                },
                {
                    reg: '^#派蒙崽解除拉黑(QQ|qq)',
                    fnc: 'paimon_black_qq_remove',
                    permission: 'master',
                },
            ]
        })
    }

    /** ^#派蒙崽拉黑(QQ|qq) */
    async paimon_black_qq_add(e) {
        // 处理@at
        let qq_at = e.message.find(item => item.type == 'at')?.qq

        const match = e.msg.trim().match(/^#派蒙崽拉黑(QQ|qq)([\s\S]*)$/)
        if (match[2].trim() == '帮助') return e.reply('喵？请输入正确的QQ号哦；禁止指定qq使用bot的所有功能\n#派蒙崽[解除]拉黑qq[qqnum/@at]\n#派蒙崽查看拉黑qq', false, { recallMsg: 115 })
        if (match) {
            if (!match[2]) {
                match[2] = qq_at
            } else {
                if (qq_at) return e.reply(`到底是要拉黑${match[2]}还是${qq_at}？`, false, { recallMsg: 115 })
            }

            const qq_num = Number(match[2])
            if (Number.isInteger(qq_num)) {
                if (e.user_id == qq_num) {
                    e.reply('不可以拉黑你自己哦', false, { recallMsg: 115 })
                    return
                }
                else if (cfg.masterQQ.includes(qq_num)) {
                    e.reply('不可以拉黑主人哦', false, { recallMsg: 115 })
                    return
                }
                else if (cfg.qq == qq_num) {
                    e.reply('不可以拉黑人家哦', false, { recallMsg: 115 })
                    return
                }
                else {
                    let data = readYaml(path)
                    if (data.blackQQ.includes(qq_num)) return e.reply('这个QQ早就被拉黑惹>_<', false, { recallMsg: 115 })
                    data.blackQQ.push(qq_num)
                    writeYaml(path, data)
                    e.reply('派蒙崽已成功拉黑' + qq_num)
                    return
                }
            }
            else {
                e.reply(`当前输入match为${match[2]}，请输入正确的QQ号哦，或输入#派蒙崽拉黑QQ帮助`, false, { recallMsg: 115 })
                return
            }
        }
        return e.reply('喵？请输入正确的QQ号哦；禁止指定qq使用bot的所有功能\n#派蒙崽[解除]拉黑qq[qqnum/@at]\n#派蒙崽查看拉黑qq', false, { recallMsg: 115 })
    }

    /**^#派蒙崽查看拉黑(QQ|qq)$ */
    async paimon_black_qq_list(e) {
        let data = readYaml(path)
        if (data.blackQQ.length == 0) {
            e.reply('派蒙崽目前没有拉黑任何QQ号哦', false, { recallMsg: 115 })
            return
        }
        else {
            let str = ''
            for (let i = 0; i < data.blackQQ.length; i++) {
                str += `${data.blackQQ[i]}\n`
            }
            e.reply(str)
            return
        }
    }

    /**^#派蒙崽解除拉黑(QQ|qq) */
    async paimon_black_qq_remove(e) {
        // 处理@at
        let qq_at = e.message.find(item => item.type == 'at')?.qq

        const match = e.msg.trim().match(/^#派蒙崽解除拉黑(QQ|qq)([\s\S]*)$/)
        if (match[2].trim() == '帮助') return e.reply('喵？请输入正确的QQ号哦；禁止指定qq使用bot的所有功能\n#派蒙崽[解除]拉黑qq[qqnum/@at]\n#派蒙崽查看拉黑qq', false, { recallMsg: 115 })

        if (match) {
            if (!match[2]) {
                match[2] = qq_at
            } else {
                if (qq_at) return e.reply(`到底是要拉黑${match[2]}还是${qq_at}？`, false, { recallMsg: 115 })
            }

            const qq_num = Number(match[2])
            if (Number.isInteger(qq_num)) {
                let data = readYaml(path)
                if (data.blackQQ.includes(qq_num)) {
                    data.blackQQ.splice(data.blackQQ.indexOf(qq_num), 1)
                    writeYaml(path, data)
                    e.reply('已成功解除拉黑' + qq_num)
                    return
                }
                else {
                    e.reply(`该QQ${qq_num}不在黑名单中哦`, false, { recallMsg: 115 })
                    return
                }
            }
            else {
                e.reply(`当前输入match为${match[2]}，请输入正确的QQ号哦，或输入#派蒙崽拉黑QQ帮助`, false, { recallMsg: 115 })
                return
            }
        }
        return e.reply('喵？请输入正确的QQ号哦；禁止指定qq使用bot的所有功能\n#派蒙崽[解除]拉黑qq[qqnum/@at]\n#派蒙崽查看拉黑qq', false, { recallMsg: 115 })
    }




}

/** 读取YAML文件 */
function readYaml(filePath) {
    return yaml.parse(fs.readFileSync(filePath, 'utf8'))
}

/** 写入YAML文件 */
function writeYaml(filePath, data) {
    fs.writeFileSync(filePath, yaml.stringify(data), 'utf8')
}
