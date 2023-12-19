import plugin from '../../lib/plugins/plugin.js'
import common from '../../lib/common/common.js';
import yaml from 'yaml'
import fs from 'fs'

const Config_PATH = `${process.cwd()}/config/config/bot.yaml`

export class Paimon_update_bot_sign_api_addr extends plugin {
	constructor() {
		super({
			name: '��������(�޸�|�鿴)ǩ����������ַ',
			event: 'message',
			priority: 999,
			rule: [
				{
					reg: '^#��������(�޸�|�鿴)?ǩ����������ַ(����)?',
					fnc: 'update_bot_sign_api_addr',
					permission: 'master',
					log: true
				},
			]
		})
	}

	/** ^#��������(�޸�|�鿴)?ǩ����������ַ */
	async update_bot_sign_api_addr(e) {
		const Bot_config = yaml.parse(fs.readFileSync(Config_PATH, 'utf8'))
		let input_sign_api = e.msg.replace(/^#��������(�޸�|�鿴)?ǩ����������ַ(����)?/, '').trim()
		if (!input_sign_api) {
			let show_msg1 = '��ǰǩ����������ַ��'
			let show_msg2 = `${Bot_config.sign_api_addr}`
			let show_msg3 = '���磺'
			let show_msg4_1 = '#���������޸�ǩ����������ַhttp://0.0.0.0:5200/sign?key=20001'
			let show_msg4_2 = '#���������޸�ǩ����������ַhttps://misaka20001-qqsign.hf.space/sign?key=114514'
			let show_msg5 = '�޸ĳɹ�����#����'
			let show_msgx = await common.makeForwardMsg(e, [show_msg1, show_msg2, show_msg3, show_msg4_1, show_msg4_2, show_msg5], 'ǩ����������ַ');
			return e.reply(show_msgx, false);
		} else if (/(^\w+[^\s]+(\.[^\s]+){1,}$)/.test(input_sign_api)) {
			await updateConfig('sign_api_addr', input_sign_api)
			return e.reply(`[��������] ���޸�ǩ����������ַΪ${input_sign_api}`)
		} else {
			return e.reply(`[��������] �������Ϊ"${input_sign_api}"����������ȷ��ǩ����������ַ��\n#��������ǩ����������ַ����`, false)
		}
	}
	
}

/** ��ȡYAML�ļ� */
function readYaml(filePath) {
	return yaml.parse(fs.readFileSync(filePath, 'utf8'))
}

/** д��YAML�ļ� */
function writeYaml(filePath, data) {
	fs.writeFileSync(filePath, yaml.stringify(data), 'utf8')
}

/** ����YAML�ļ� */
async function updateConfig(key, value) {
	const data = readYaml(Config_PATH)
	data[key] = value
	writeYaml(Config_PATH, data)
	return data
}
