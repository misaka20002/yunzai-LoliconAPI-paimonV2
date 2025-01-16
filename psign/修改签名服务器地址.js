import plugin from '../../lib/plugins/plugin.js'
import common from '../../lib/common/common.js';
import yaml from 'yaml'
import fs from 'fs'

const Config_PATH = `${process.cwd()}/config/config/bot.yaml`

export class Paimon_update_bot_sign_api_addr extends plugin {
	constructor() {
		super({
			name: '派蒙来份(修改|查看)签名服务器地址',
			event: 'message',
			priority: 999,
			rule: [
				{
					reg: '^#派蒙来份(修改|查看)?签名服务器地址(和密码)?(帮助)?',
					fnc: 'update_bot_sign_api_addr',
					permission: 'master',
					log: true
				},
			]
		})
	}

	/** ^#派蒙来份(修改|查看)?签名服务器地址 */
	async update_bot_sign_api_addr(e) {
		const Bot_config = yaml.parse(fs.readFileSync(Config_PATH, 'utf8'))
		let input_sign_api = e.msg.replace(/^#派蒙来份(修改|查看)?签名服务器地址(和密码)?(帮助)?/, '').trim()
		let sign_version = ""
		if (!input_sign_api) {
			let show_msg1 = '当前签名服务器地址：'
			let show_msg2 = `${Bot_config.sign_api_addr}`
			let show_msg3 = '例如：'
			let show_msg4_1 = '#派蒙来份修改签名服务器地址和密码http://0.0.0.0:5200/sign?key=20001'
			let show_msg4_2 = '#派蒙来份修改签名服务器地址和密码https://misaka20001-qqsign.hf.space/sign?key=114514'
			let show_msg5 = '修改成功后发送#重启'
			let show_msgx = await common.makeForwardMsg(e, [show_msg1, show_msg2, show_msg3, show_msg4_1, show_msg4_2, show_msg5], '签名服务器地址');
			return e.reply(show_msgx, false);
		} else if (/(^\w+[^\s]+(\.[^\s]+){1,}$)/.test(input_sign_api)) {
			const match = input_sign_api.match(/ver=(\d+(.\d+(.\d+)?)?)/)
			if (match) {
				sign_version = match[1]
				await updateConfig('ver', sign_version)
			}
			await updateConfig('sign_api_addr', input_sign_api)
			return e.reply(`[派蒙来份] 已修改签名服务器地址：\n${input_sign_api}${sign_version ? `\n签名版本：${sign_version}\n发送#重启 后生效` : ''}`, true)
		} else {
			return e.reply(`[派蒙来份] 你的输入为"${input_sign_api}"，请输入正确的签名服务器地址。\n#派蒙来份签名服务器地址帮助`, true)
		}
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

/** 更新YAML文件 */
async function updateConfig(key, value) {
	const data = readYaml(Config_PATH)
	data[key] = value
	writeYaml(Config_PATH, data)
	return data
}
