import plugin from '../../lib/plugins/plugin.js';
import {
	segment
} from "oicq";
import common from '../../lib/common/common.js';
import fetch from 'node-fetch';
import fs from "fs";

let noiseScale = 0.2  //情感控制
let noiseScaleW = 0.2 //发音时长
let lengthScale = 1 //语速
let sdp_ratio = 0.2 //SDP/DP混合比
let language = "ZH"//语言设置
let ttsapi = "https://genshinvoice.top/api"
let languageMap = {
	"ZH": "ZH",
	"JP": "JP",
	"EN": "EN"
};
let speakermap = ["埃德_ZH", "塔杰·拉德卡尼_ZH", "行秋_ZH", "深渊使徒_ZH", "凯瑟琳_ZH", "常九爷_ZH", "神里绫人_ZH", "丽莎_ZH", "纯水精灵 ？_ZH", "宛烟_ZH", "重云_ZH", "悦_ZH", "莱依拉_ZH", "鹿野奈奈_ZH", "式大将_ZH", "白术_ZH", "埃舍尔_ZH", "莫娜_ZH", "优菈_ZH", "琴_ZH", "凯亚_ZH", "西拉杰_ZH", "凝光_ZH", "石头_ZH", "达达利亚_ZH", "伊利亚斯_ZH", "艾尔海森_ZH", "慧心_ZH", "「大肉丸」_ZH", "柊千里_ZH", "玛乔丽_ZH", "神里绫华_ZH", "菲米尼_ZH", "甘雨_ZH", "掇星攫辰天君_ZH", "坎蒂丝_ZH", "上杉_ZH", "阿尔卡米_ZH", "戴因斯雷布_ZH", "艾文_ZH", "回声海螺_ZH", "九条裟罗_ZH", "迪卢克_ZH", "提纳里_ZH", "嘉良_ZH", "塞塔蕾_ZH", "琳妮特_ZH", "阿洛瓦_ZH", "蒂玛乌斯_ZH", "枫原万叶_ZH", "丹吉尔_ZH", "空_ZH", "林尼_ZH", "阿守_ZH", "七七_ZH", "嘉 玛_ZH", "恶龙_ZH", "阿巴图伊_ZH", "阿佩普_ZH", "八重神子_ZH", "迪希雅_ZH", "迈勒斯_ZH", "夜兰_ZH", "萨赫哈蒂_ZH", "欧菲 妮_ZH", "笼钓瓶一心_ZH", "芭芭拉_ZH", "瑶瑶_ZH", "天叔_ZH", "派蒙_ZH", "米卡_ZH", "玛塞勒_ZH", "胡桃_ZH", "百闻_ZH", "艾莉丝_ZH", "安柏_ZH", "阿晃_ZH", "萨齐因_ZH", "田铁嘴_ZH", "烟绯_ZH", "海妮耶_ZH", "纳比尔_ZH", "女士_ZH", "诺艾尔_ZH", "云堇_ZH", "舒伯特_ZH", "埃勒曼_ZH", "九条镰治_ZH", "留云借风真君_ZH", "言笑_ZH", "安西_ZH", "珊瑚宫心海_ZH", "托克_ZH", "哲平_ZH", "恕筠_ZH", "拉赫曼_ZH", "久利须_ZH", "天目十五_ZH", "妮露_ZH", "莺儿_ZH", "佐西摩斯_ZH", "鹿野院平藏_ZH", "温迪_ZH", "菲谢尔_ZH", "anzai_ZH", "可莉_ZH", "刻晴_ZH", "克列门特_ZH", "阿扎尔_ZH", "班尼特_ZH", "伊迪娅_ZH", "巴达维_ZH", "深渊法师_ZH", "赛诺_ZH", "大慈树王_ZH", "拉齐_ZH", "海芭夏_ZH", "香菱_ZH", "康纳_ZH", "阿祇_ZH", "卡维_ZH", "博来_ZH", "斯坦利_ZH", "霍夫曼_ZH", "北斗_ZH", "阿拉夫_ZH", "陆行岩本真蕈·元素生命_ZH", "爱贝尔_ZH", "雷泽_ZH", "毗伽尔_ZH", "莎拉_ZH", "莫塞伊思_ZH", "多莉_ZH", "珊瑚_ZH", "老孟_ZH", "宵宫_ZH", "钟离_ZH", "芙宁娜_ZH", "爱德琳_ZH", "「女士」_ZH", "博易_ZH", "长生_ZH", "查尔斯_ZH", "阿娜耶_ZH", "流浪者_ZH", "辛焱_ZH", "德沃沙克_ZH", "雷电将军_ZH", "羽生田千鹤_ZH", " 那维莱特_ZH", "沙扎曼_ZH", "纳西妲_ZH", "艾伯特_ZH", "龙二_ZH", "旁白_ZH", "克罗索_ZH", "元太_ZH", "阿贝多_ZH", "萍姥姥_ZH", "久岐忍_ZH", "埃洛伊_ZH", "托马_ZH", "迪奥娜_ZH", "荧_ZH", "夏洛蒂_ZH", "莱欧斯利_ZH", "昆钧_ZH", "塞琉斯_ZH", "埃 泽_ZH", "迪娜泽黛_ZH", "知易_ZH", "玛格丽特_ZH", "申鹤_ZH", "罗莎莉亚_ZH", "娜维娅_ZH", "珐露珊_ZH", "浮游水蕈兽·元素生 命_ZH", "奥兹_ZH", "砂糖_ZH", "绮良良_ZH", "杜拉夫_ZH", "魈_ZH", "松浦_ZH", "迈蒙_ZH", "荒泷一斗_ZH", "吴船长_ZH", "埃尔欣根_ZH", "柯莱_ZH", "阿圆_ZH", "「白老先生」_ZH", "五郎_ZH", "「博士」_ZH", "早柚_ZH", "行秋_JP", "コナー_JP", "籠釣瓶 一心_JP", "宛煙_JP", "アビスの使徒_JP", "ティマイオス_JP", "タージ·ラドカニ_JP", "望雅_JP", "イディア_JP", "フレミネ_JP", "セノ_JP", "シャリフ_JP", "アデリン_JP", "イナヤ_JP", "巫女_JP", "サーチェン_JP", "クンジュ_JP", "「淵上」と自称するもの_JP", "ニィロウ_JP", "シェイクズバイル_JP", "式大将_JP", "レオン_JP", "放浪者_JP", "レッシグ_JP", "アーラヴ_JP", "フェルディナンド_JP", "凝光_JP", "小倉澪_JP", "マーガレット_JP", "守_JP", "長生_JP", "アルバート_JP", "慧心_JP", "ヨォーヨ_JP", "柊千里_JP", "丹羽_JP", "アルカミ_JP", "甘雨_JP", "モセイス_JP", "掇星攫辰天君_JP", "龍二_JP", "スクロース_JP", "珊 瑚宮心海_JP", "ヴィハル_JP", "マル_JP", "スタンレー_JP", "御肉丸_JP", "上杉_JP", "アーロイ_JP", "サラ_JP", "純水精霊？_JP", "嘉良_JP", "申鶴_JP", "リサ_JP", "クリメント_JP", "オズ_JP", "アルハイゼン_JP", "ナヴィア_JP", "孟_JP", "淑女_JP", "傍白_JP", "空_JP", "古山_JP", "七七_JP", "サイリュス_JP", "ナビル_JP", "雷電将軍_JP", "九条裟羅_JP", "セタレ_JP", "天お じ_JP", "ロサリア_JP", "ドゥラフ_JP", "晃_JP", "ディオナ_JP", "宵宮_JP", "テウセル_JP", "銀杏_JP", "楓原万葉_JP", "夜蘭_JP", "八重神子_JP", "レザー_JP", "エルザー_JP", "エデ_JP", "神里綾人_JP", "詩筠_JP", "神里綾華_JP", "マルシラック_JP", "雲菫_JP", "ダインスレイヴ_JP", "マハールッカデヴァータ_JP", "ジン_JP", "ノエル_JP", "ゴロー_JP", "ゾシモス_JP", "アイル マン_JP", "胡桃_JP", "メイモム_JP", "アペプ_JP", "ベネット_JP", "キャンディス_JP", "ナーダワ_JP", "アイベル_JP", "綺良々_JP", "ロレンツォ_JP", "煙緋_JP", "ジョイン_JP", "ドニアザード_JP", "エルファネ_JP", "九条鎌治_JP", "バダウィ_JP", "クロッサル_JP", "鍾離_JP", "言笑_JP", "「カーブース」_JP", "トーマ_JP", "エウルア_JP", "安西_JP", "ウェンティ_JP", "プカプカ水キノコン·元素生命_JP", "ファルザン_JP", "哲平_JP", "天目十五_JP", "ナヒーダ_JP", "一平_JP", "アリス_JP", "アロイス_JP", "リネット_JP", "悪龍_JP", "アンバー_JP", "刻晴_JP", "田饒舌_JP", "クレー_JP", "ラフマン_JP", "ラエッド_JP", "スカーレ ット_JP", "シコウ_JP", "荒瀧一斗_JP", "ジェマ_JP", "ピンばあや_JP", "香菱_JP", "つみ_JP", "鹿野院平蔵_JP", "シラージ_JP", "博来_JP", "鶯_JP", "アザール_JP", "パイモン_JP", "半夏_ZH", "费斯曼_ZH", "浣溪_ZH", "伦纳德_ZH", "素裳_ZH", "明曦_ZH", "绿芙蓉_ZH", "帕姆_ZH", "娜塔莎_ZH", "三月七_ZH", "符玄_ZH", "镜流_ZH", "青镞_ZH", "霄翰_ZH", "卡波特_ZH", "希儿_ZH", "希露瓦_ZH", "彦卿_ZH", "丹枢_ZH", "公输师傅_ZH", "史瓦罗_ZH", "驭空_ZH", "青雀_ZH", "dev_成男_ZH", "卡芙卡_ZH", "罗刹_ZH", "大毫_ZH", "白露_ZH", "金人会长_ZH", "可可利亚_ZH", "卢卡_ZH", "佩拉_ZH", "丹恒_ZH", "桑博_ZH", "艾丝妲_ZH", "晴霓_ZH", "帕斯卡_ZH", "克拉拉_ZH", "螺丝咕姆_ZH", "瓦尔特_ZH", "虎克_ZH", "岩明_ZH", "斯科特_ZH", "奥列格_ZH", "阿兰_ZH", "玲可_ZH", "银狼_ZH", "黑塔_ZH", "「信使」_ZH", "布洛妮娅_ZH", "停云_ZH", "开拓者(女)_ZH", "杰帕德_ZH", "刃_ZH", "景元_ZH", "姬子_ZH", "开拓者(男)_ZH", "半夏_JP", "カポーティ_JP", "パスカル_JP", "御空_JP", "開拓者(女)_JP", "金人会長_JP", "？？？_JP", "素裳_JP", "銀狼_JP", "クラーラ_JP", "セーバル_JP", "変な雲騎軍_JP", "女の声_JP", "緑芙蓉_JP", "浣渓_JP", "隠書_JP", "明輝_JP", "停雲_JP", "レオナード_JP", "符玄_JP", "幻朧_JP", "ジェパード_JP", "霄翰_JP", "彦卿_JP", "丹枢_JP", "リ ンクス_JP", "フック_JP", "鏡流_JP", "カフカ_JP", "パム_JP", "青雀_JP", "カカリア_JP", "青鏃_JP", "三月なのか_JP", "スコ ート_JP", "大毫_JP", "ペラ_JP", "白露_JP", "ブローニャ_JP", "ヴェルト_JP", "丹恒_JP", "ゼーレ_JP", "晴霓_JP", "開拓者(男)_JP", "ナターシャ_JP", "サンポ_JP", "公輸先生_JP", "オークションのスタッフ_JP", "岩明_JP", "紫月季_JP", "スヴァローグ_JP", "フェスマン_JP", "オレグ_JP", "ルカ_JP", "アーラン_JP", "羅刹_JP", "スクリューガム_JP", "アスター_JP", "浄硯_JP", " シュウェター_JP", "ヘルタ_JP", "刃_JP", "「メッセンジャー」_JP", "景元_JP", "姫子_JP", "派蒙_EN", "纳西妲_EN", "凯亚_EN", "阿贝多_EN", "温迪_EN", "枫原万叶_EN", "钟离_EN", "荒泷一斗_EN", "八重神子_EN", "艾尔海森_EN", "迪希雅_EN", "提纳里_EN", "卡维_EN", "宵宫_EN", "莱依拉_EN", "赛诺_EN", "诺艾尔_EN", "托马_EN", "凝光_EN", "莫娜_EN", "北斗_EN", "柯莱_EN", "神里绫华_EN", "可莉_EN", "芭芭拉_EN", "雷电将军_EN", "珊瑚宫心海_EN", "鹿野院平藏_EN", "迪奥娜_EN", "琴_EN", "五郎_EN", " 班尼特_EN", "安柏_EN", "夜兰_EN", "妮露_EN", "辛焱_EN", "珐露珊_EN", "林尼_EN", "丽莎_EN", "魈_EN", "香菱_EN", "烟绯_EN", "迪卢克_EN", "砂糖_EN", "早柚_EN", "云堇_EN", "刻晴_EN", "重云_EN", "优菈_EN", "胡桃_EN", "久岐忍_EN", "神里绫人_EN", "公子_EN", "娜维娅_EN", "甘雨_EN", "戴因斯雷布_EN", "菲谢尔_EN", "行秋_EN", "白术_EN", "九条裟罗_EN", "雷泽_EN", "申鹤_EN", "荧_EN", "空_EN", "流浪者_EN", "迪娜泽黛_EN", "凯瑟琳_EN", "多莉_EN", "坎蒂丝_EN", "萍姥姥_EN", "罗莎莉亚_EN", "埃德_EN", "夏洛蒂_EN", "伊迪娅_EN", "爱贝尔_EN", "留云借风真君_EN", "散兵_EN", "那维莱特_EN", "琳妮特_EN", "七七_EN", "式大 将_EN", "瑶瑶_EN", "奥兹_EN", "米卡_EN", "达达利亚_EN", "哲平_EN", "绮良良_EN", "浮游水蕈兽·元素生命_EN", "大肉丸_EN", "托克_EN", "蒂玛乌斯_EN", "昆钧_EN", "欧菲妮_EN", "塞琉斯_EN", "拉赫曼_EN", "阿守_EN", "芙宁娜_EN", "杜拉夫_EN", "伊利亚 斯_EN", "阿晃_EN", "旁白_EN", "菲米尼_EN", "爱德琳_EN", "埃洛伊_EN", "迈勒斯_EN", "德沃沙克_EN", "玛乔丽_EN", "塞塔蕾_EN", "九条镰治_EN", "柊千里_EN", "海芭夏_EN", "阿娜耶_EN", "笼钓瓶一心_EN", "回声海螺_EN", "元太_EN", "阿扎尔_EN", "查尔斯_EN", "埃勒曼_EN", "阿洛瓦_EN", "莎拉_EN", "纳比尔_EN", "康纳_EN", "博来_EN", "阿祇_EN", "玛塞勒_EN", "博士_EN", "玛格丽特_EN", "宛烟_EN", "羽生田千鹤_EN", "海妮耶_EN", "佐西摩斯_EN", "霍夫曼_EN", "舒伯特_EN", "鹿野奈奈_EN", "天叔_EN", "龙 二_EN", "艾莉丝_EN", "莺儿_EN", "嘉良_EN", "言笑_EN", "费迪南德_EN", "珊瑚_EN", "嘉玛_EN", "久利须_EN", "艾文_EN", "女士_EN", "丹吉尔_EN", "白老先生_EN", "老孟_EN", "天目十五_EN", "巴达维_EN", "舍利夫_EN", "拉齐_EN", "吴船长_EN", "艾伯特_EN", "埃泽_EN", "松浦_EN", "阿拉夫_EN", "莫塞伊思_EN", "阿圆_EN", "石头_EN", "百闻_EN", "迈蒙_EN", "掇星攫辰天君_EN", "博 易_EN", "斯坦利_EN", "毗伽尔_EN", "诗筠_EN", "慧心_EN", "恶龙_EN", "小仓澪_EN", "知易_EN", "恕筠_EN", "克列门特_EN", "大慈树王_EN", "维多利亚_EN", "黑田_EN", "宁禄_EN", "马姆杜_EN", "西拉杰_EN", "上杉_EN", "阿尔卡米_EN", "常九爷_EN", "纯水 精灵_EN", "田铁嘴_EN", "沙扎曼_EN", "加萨尼_EN", "克罗索_EN", "莱斯格_EN", "星稀_EN", "阿巴图伊_EN", "悦_EN", "德田_EN", "阿佩普_EN", "埃尔欣根_EN", "萨赫哈蒂_EN", "洛伦佐_EN", "深渊使徒_EN", "塔杰·拉德卡尼_EN", "泽田_EN", "安西_EN", "理水 叠山真君_EN", "萨齐因_EN", "古田_EN"]

export class voicecreate extends plugin {
	constructor() {
		super({
			name: 'tts语音替换',
			dsc: 'tts语音替换',
			event: 'message',
			priority: 999,
			rule: [{
				reg: `^#tts语音替换帮助$`,
				permission: 'master',
				fnc: `voicecrehelp`
			}, 
			/* {
				reg: `^#?语音语速设置\\d+$`,
				fnc: `speedset`
			}, {
				reg: `^#?语音感情设置\\d+$`,
				fnc: `emotionset`
			}, {
				reg: `^#?语音发音时长设置\\d+$`,
				fnc: `noiseScaleWset`
			}, {
				reg: `^#?语音混合比设置\\d+$`,
				fnc: `sdp_ratioset`
			}, {
				reg: `^#?语言设置?(.*)$`,
				fnc: `languageset`
			}, {
				reg: `^#?(.*)语音?(.*)$`,
				fnc: 'voicesend'
			}, */
			]
		})
	}

	async voicesend(e) {
		let speaker = e.msg.replace(/语音?(.*)$/g, '')
			.replace(/#/g, '')
		if (!speakermap.includes(speaker + "_" + language)) {
			e.reply(`暂未支持该角色，发送"(#)语音生成帮助"查看列表`)
			return true
		}
		let text = e.msg.replace(/^#?(.*)语音?/g, '')
		let geturl = `${ttsapi}?speaker=${speaker}_${language}&text=${text}&format=mp3&language=${language}&length=${lengthScale}&sdp=${sdp_ratio}&noise=${noiseScale}&noisew=${noiseScaleW}`
		fetch(geturl)
			.then(responsel => {
				if (!responsel.ok) {
					e.reply(`服务器返回状态码异常, ${responsel.status}`)
					return false;
				}
				return responsel.buffer()
			})
			.then(async buffer => {
				await new Promise((resolve, reject) => {
					fs.writeFile('plugins/example/tts.mp3', buffer, (err) => {
						if (err) reject(err);
						else resolve();
					})
				})
				e.reply(segment.record('plugins/example/tts.mp3'))
				return;
			})
			.catch(error => {
				e.reply(`文件保存错误`)
				return false;
			})
	}

	async noiseScaleWset(e) {
		let noiseScaleWnum = e.msg.replace(/^#?语音发音时长设置/g, '')
		if (noiseScaleWnum < 0 || noiseScaleWnum > 15) {
			e.reply(`参数不符合要求！(0<=x<15)`)
			return true
		}
		noiseScaleW = noiseScaleWnum / 10;
		e.reply(`已成功设置`)
		return true;
	}

	async sdp_ratioset(e) {
		let sdp_rationum = e.msg.replace(/^#?语音混合比设置/g, '')
		if (sdp_rationum < 0 || sdp_rationum > 10) {
			e.reply(`参数不符合要求！(0<=x<10)`)
			return true
		}
		sdp_ratio = sdp_rationum / 10;
		e.reply(`已成功设置`)
		return true;
	}

	async speedset(e) {
		let lengthnum = e.msg.replace(/^#?语音语速设置/g, '')
		if (lengthnum < 5 || lengthnum > 20) {
			e.reply(`参数不符合要求！(5<x<20)`)
			return true
		}
		lengthScale = lengthnum / 10
		e.reply(`已成功设置`)
		return true
	}

	async emotionset(e) {
		let noiseScalenum = e.msg.replace(/^#?语音感情设置/g, '')
		if (noiseScalenum < 0 || noiseScalenum > 15) {
			e.reply(`参数不符合要求！(0<=x<15)`)
			return true;
		}
		noiseScale = noiseScalenum / 10;
		e.reply(`已成功设置`)
		return true;
	}

	async languageset(e) {
		let languagedata = e.msg.replace(/^#?语言设置/g, '')
		language = languageMap[languagedata.substr(0, 2)] || null;
		if (!language) {
			language = "ZH"
			e.reply(`暂未支持该语言，已重置为ZH，发送"(#)语音生成帮助"查看列表`)
		}
		else { e.reply(`已成功设置`) }
		return true;
	}

	async voicecrehelp(e) {
		let msg1 = `小呆毛tts语音替换帮助：\n` +
			`下述链接覆盖安装重启后，使用如下指令，例如：\n` +
			`#chatgpt设置语音角色派蒙_ZH\n` +
			`#chatgpt设置语音角色可莉_ZH\n` +
			`需要在ChatGPT-Plugin的锅巴插件里把lengthScale改为1.99（默认1.2）以启动本替换插件，此时强制使用默认值length=1、sdp=0.4、noise=0.6、noisewide=0.8、Language为角色语音后缀。\n` +
			`注意备份原tts.js，感谢genshinvoice.top提供的api支持。\n` +
			`安装链接（在喵崽根目录执行）：`
		let msg2 = `curl -# -L -o "./plugins/chatgpt-plugin/utils/tts.js" "https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/psign/tts.js"`
		let speakertip1 = "可选列表：\n"
		let speakertip2 = ""
		let speakertip3 = ""
		for (let i = 0; i < speakermap.length; i++) {
			if (i <= (speakermap.length / 3)) {
				speakertip1 += speakermap[i]
				if (i % 2 == 0) {
					speakertip1 += "　　"
				}
				else {
					speakertip1 += "\n"
				}
			}
			if (i <= ((speakermap.length * 2) / 3) && i > (speakermap.length / 3)) {
				speakertip2 += speakermap[i]
				if (i % 2 == 0) {
					speakertip2 += "　　"
				}
				else {
					speakertip2 += "\n"
				}
			}
			if (i > ((speakermap.length * 2) / 3)) {
				speakertip3 += speakermap[i]
				if (i % 2 == 0) {
					speakertip3 += "　　"
				}
				else {
					speakertip3 += "\n"
				}
			}

		}
		let msgx = await common.makeForwardMsg(e, [msg1, msg2, speakertip1, speakertip2, speakertip3], `tts语音替换帮助`);
		e.reply(msgx);
		return true;
	}
}
