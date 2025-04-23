import plugin from '../../lib/plugins/plugin.js'
import cfg from '../../lib/config/config.js'
import yaml from 'yaml'
import fs from 'fs'


const path = `${process.cwd()}/config/config/other.yaml`
const isTrss = Array.isArray(Bot.uin)

export class paimon_blackQQ extends plugin {
    constructor() {
        super({
            name: '派蒙崽拉黑QQ',
            dsc: '派蒙崽拉黑QQ',
            event: 'message',
            priority: 5000,
            rule: [
                {
                    reg: '^#派蒙(崽)?拉黑(QQ|qq)?',
                    fnc: 'paimon_black_qq_add',
                    permission: 'master',
                },
                {
                    reg: '^#派蒙(崽)?查看拉黑(QQ|qq)?$',
                    fnc: 'paimon_black_qq_list',
                    permission: 'master',
                },
                {
                    reg: '^#派蒙(崽)?(解除|删除|取消)拉黑(QQ|qq)?',
                    fnc: 'paimon_black_qq_remove',
                    permission: 'master',
                },
            ]
        })
    }

    /** ^#派蒙(崽)?拉黑(QQ|qq)? */
    async paimon_black_qq_add(e) {
        // 处理@at
        let qq_at = e.message.find(item => item.type == 'at')?.qq

        const match = e.msg.trim().match(/^#派蒙(崽)?拉黑(QQ|qq)?([\s\S]*)$/)
        if (match[3].trim() == '帮助') return e.reply('喵？请输入正确的QQ号哦；禁止指定qq使用bot的所有功能\n#派蒙崽[解除]拉黑qq[qqnum/@at]\n#派蒙崽查看拉黑qq\n 注意: 解除拉黑只能使用qq号不能使用@at, 因为云崽底层代码...', false)
        if (match) {
            if (!match[3]) {
                match[3] = qq_at
            } else {
                if (qq_at) return e.reply(`到底是要拉黑${match[3]}还是${qq_at}？`, false)
            }

            const qq_num = Number(match[3])
            if (Number.isInteger(qq_num)) {
                if (e.user_id == qq_num) {
                    e.reply('不可以拉黑你自己哦', false)
                    return
                }
                else if (cfg.masterQQ.includes(qq_num)) {
                    e.reply('不可以拉黑主人哦', false)
                    return
                }
                else if (cfg.qq == qq_num) {
                    e.reply('不可以拉黑人家哦', false)
                    return
                }
                else {
                    let data = readYaml(path)
                    let blackKey = "blackQQ"
                    if (isTrss)
                        blackKey = "blackUser"
                    if (data[blackKey].includes(qq_num)) return e.reply('这个QQ早就被拉黑惹>_<', false)
                    data[blackKey].push(qq_num)
                    writeYaml(path, data)
                    e.reply('派蒙崽已成功拉黑' + qq_num)
                    return
                }
            }
            else {
                e.reply(`当前输入match为${match[3]}，请输入正确的QQ号哦，或输入#派蒙崽拉黑QQ帮助`, false)
                return
            }
        }
        return e.reply('喵？请输入正确的QQ号哦；禁止指定qq使用bot的所有功能\n#派蒙崽[解除]拉黑qq[qqnum/@at]\n#派蒙崽查看拉黑qq\n 注意: 解除拉黑只能使用qq号不能使用@at, 因为云崽底层代码...', false)
    }

    /**^#派蒙(崽)?查看拉黑(QQ|qq)?$ */
    async paimon_black_qq_list(e) {
        let data = readYaml(path)
        let blackKey = "blackQQ"
        if (isTrss)
            blackKey = "blackUser"
        if (data[blackKey].length == 0) {
            e.reply('派蒙崽目前没有拉黑任何QQ号哦', false)
            return
        }
        else {
            let str = ''
            for (let i = 0; i < data[blackKey].length; i++) {
                str += `${data[blackKey][i]}\n`
            }
            e.reply(str)
            return
        }
    }

    /**^#派蒙(崽)?(解除|删除|取消)拉黑(QQ|qq)? */
    async paimon_black_qq_remove(e) {
        // 处理@at
        let qq_at = e.message.find(item => item.type == 'at')?.qq

        const match = e.msg.trim().match(/^#派蒙(崽)?(解除|删除|取消)拉黑(QQ|qq)?([\s\S]*)$/)
        if (match[4].trim() == '帮助') return e.reply('喵？请输入正确的QQ号哦；禁止指定qq使用bot的所有功能\n#派蒙崽[解除]拉黑qq[qqnum/@at]\n#派蒙崽查看拉黑qq\n 注意: 解除拉黑只能使用qq号不能使用@at, 因为云崽底层代码...', false)

        if (match) {
            if (!match[4]) {
                match[4] = qq_at
            } else {
                if (qq_at) return e.reply(`到底是要拉黑${match[4]}还是${qq_at}？`, false)
            }

            const qq_num = Number(match[4])
            if (Number.isInteger(qq_num)) {
                let data = readYaml(path)
                let blackKey = "blackQQ"
                if (isTrss)
                    blackKey = "blackUser"
                if (data[blackKey].includes(qq_num)) {
                    data[blackKey].splice(data[blackKey].indexOf(qq_num), 1)
                    writeYaml(path, data)
                    e.reply('已成功解除拉黑' + qq_num)
                    return
                }
                else {
                    e.reply(`该QQ${qq_num}不在黑名单中哦`, false)
                    return
                }
            }
            else {
                e.reply(`当前输入match为${match[4]}，请输入正确的QQ号哦，或输入#派蒙崽拉黑QQ帮助`, false)
                return
            }
        }
        return e.reply('喵？请输入正确的QQ号哦；禁止指定qq使用bot的所有功能\n#派蒙崽[解除]拉黑qq[qqnum/@at]\n#派蒙崽查看拉黑qq\n 注意: 解除拉黑只能使用qq号不能使用@at, 因为云崽底层代码...', false)
    }




}

/** 读取YAML文件 */
function readYaml(filePath) {
    return yaml.parse(fs.readFileSync(filePath, 'utf8'))
}

/** 写入YAML文件 */
function writeYaml(filePath, data) {
    fs.writeFileSync(filePath, yaml.stringify(data), 'utf8');
}
