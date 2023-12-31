import { Config } from './config.js'
import fetch from 'node-fetch'
import _ from 'lodash'
import { wrapTextByLanguage } from './common.js'
import { getProxy } from './proxy.js'
let proxy = getProxy()

const newFetch = (url, options = {}) => {
  const defaultOptions = Config.proxy
    ? {
        agent: proxy(Config.proxy)
      }
    : {}

  const mergedOptions = {
    ...defaultOptions,
    ...options
  }

  return fetch(url, mergedOptions)
}

function randomNum (minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10)
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
    default:
      return 0
  }
}

/**
 * 生成VitsTTSMode下的wav音频
 * @param text
 * @param speaker
 * @param language
 * @param noiseScale
 * @param noiseScaleW
 * @param lengthScale
 * @returns {Promise<string>}
 */
export async function generateVitsAudio (text, speaker = '随机', language = '中日混合（中文用[ZH][ZH]包裹起来，日文用[JA][JA]包裹起来）', noiseScale = parseFloat(Config.noiseScale), noiseScaleW = parseFloat(Config.noiseScaleW), lengthScale = parseFloat(Config.lengthScale)) {
  if (lengthScale === 1.99)
  {
	  let character_voice_language = speaker.substr(-2)
	  let audioLink = `https://genshinvoice.top/api?speaker=${speaker}&text=${text}&format=wav&language=${character_voice_language}&length=1&sdp=0.4&noise=0.6&noisew=0.8`
	  return audioLink
  }
  else
  {
  if (!speaker || speaker === '随机') {
    logger.info('随机角色！这次哪个角色这么幸运会被选到呢……')
    speaker = speakers[randomNum(0, speakers.length)]
  }
  text = wrapTextByLanguage(text)
  logger.info(`正在使用${speaker}，基于文本：'${text}'生成语音`)
  let body = {
    data: [
      text, language, speaker,
      noiseScale, noiseScaleW, lengthScale
    ]
  }
  let space = Config.ttsSpace
  if (space.endsWith('/api/generate')) {
    let trimmedSpace = space.substring(0, space.length - 13)
    logger.warn(`vits api 当前为${space}，已校正为${trimmedSpace}`)
    space = trimmedSpace
  }
  if (space.endsWith('/')) {
    let trimmedSpace = _.trimEnd(space, '/')
    logger.warn(`vits api 当前为${space}，已校正为${trimmedSpace}`)
    space = trimmedSpace
  }
  let url = `${space}/api/generate`
  if (Config.huggingFaceReverseProxy) {
    url = `${Config.huggingFaceReverseProxy}/api/generate?space=${_.trimStart(space, 'https://')}`
  }
  logger.info(`正在使用接口${url}`)
  let response = await newFetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json'
    }
  })
  let responseBody = await response.text()
  try {
    let json = JSON.parse(responseBody)
    if (Config.debug) {
      logger.info(json)
    }
    if (response.status > 299) {
      logger.info(json)
      throw new Error(JSON.stringify(json))
    }
    let [message, audioInfo, take] = json?.data
    logger.info(message, take)
    let audioLink = `${space}/file=${audioInfo.name}`
    if (Config.huggingFaceReverseProxy) {
      if (Config.debug) {
        logger.info('使用huggingface加速反代下载生成音频' + Config.huggingFaceReverseProxy)
      }
      let spaceHost = _.trimStart(space, 'https://')
      audioLink = `${Config.huggingFaceReverseProxy}/file=${audioInfo.name}?space=${spaceHost}`
    }
    return audioLink
  } catch (err) {
    logger.error('生成语音api发生错误，请检查是否配置了正确的api，且仓库是否开放为public', response.status)
    throw new Error(responseBody)
  }
  }
}

export function convertSpeaker (speaker) {
  switch (speaker) {
    case '派蒙':
    case '小派蒙': return '派蒙_ZH'
	case '纳西妲': return '纳西妲_ZH'
	case '可莉': return '可莉_ZH'
	case '早柚': return '早柚_ZH'
	case '迪奥娜': return '迪奥娜_ZH'
	case '瑶瑶': return '瑶瑶_ZH'
	case '七七': return '七七_ZH'
	case '神里绫华': return '神里绫华_ZH'
	case '胡桃': return '胡桃_ZH'
	case '雷电将军': return '雷电将军_ZH'
	case '芙宁娜': return '芙宁娜_ZH'
	case '绮良良': return '绮良良_ZH'
	case '刻晴': return '刻晴_ZH'
	case '珊瑚宫心海': return '珊瑚宫心海_ZH'
	case '迪卢克': return '迪卢克_ZH'
  }

  return speaker
}
export const speakers = ["埃德_ZH", "塔杰·拉德卡尼_ZH", "行秋_ZH", "深渊使徒_ZH", "凯瑟琳_ZH", "常九爷_ZH", "神里绫人_ZH", "丽莎_ZH", "纯水精灵 ？_ZH", "宛烟_ZH", "重云_ZH", "悦_ZH", "莱依拉_ZH", "鹿野奈奈_ZH", "式大将_ZH", "白术_ZH", "埃舍尔_ZH", "莫娜_ZH", "优菈_ZH", "琴_ZH", "凯亚_ZH", "西拉杰_ZH", "凝光_ZH", "石头_ZH", "达达利亚_ZH", "伊利亚斯_ZH", "艾尔海森_ZH", "慧心_ZH", "「大肉丸」_ZH", "柊千里_ZH", "玛乔丽_ZH", "神里绫华_ZH", "菲米尼_ZH", "甘雨_ZH", "掇星攫辰天君_ZH", "坎蒂丝_ZH", "上杉_ZH", "阿尔卡米_ZH", "戴因斯雷布_ZH", "艾文_ZH", "回声海螺_ZH", "九条裟罗_ZH", "迪卢克_ZH", "提纳里_ZH", "嘉良_ZH", "塞塔蕾_ZH", "琳妮特_ZH", "阿洛瓦_ZH", "蒂玛乌斯_ZH", "枫原万叶_ZH", "丹吉尔_ZH", "空_ZH", "林尼_ZH", "阿守_ZH", "七七_ZH", "嘉 玛_ZH", "恶龙_ZH", "阿巴图伊_ZH", "阿佩普_ZH", "八重神子_ZH", "迪希雅_ZH", "迈勒斯_ZH", "夜兰_ZH", "萨赫哈蒂_ZH", "欧菲 妮_ZH", "笼钓瓶一心_ZH", "芭芭拉_ZH", "瑶瑶_ZH", "天叔_ZH", "派蒙_ZH", "米卡_ZH", "玛塞勒_ZH", "胡桃_ZH", "百闻_ZH", "艾莉丝_ZH", "安柏_ZH", "阿晃_ZH", "萨齐因_ZH", "田铁嘴_ZH", "烟绯_ZH", "海妮耶_ZH", "纳比尔_ZH", "女士_ZH", "诺艾尔_ZH", "云堇_ZH", "舒伯特_ZH", "埃勒曼_ZH", "九条镰治_ZH", "留云借风真君_ZH", "言笑_ZH", "安西_ZH", "珊瑚宫心海_ZH", "托克_ZH", "哲平_ZH", "恕筠_ZH", "拉赫曼_ZH", "久利须_ZH", "天目十五_ZH", "妮露_ZH", "莺儿_ZH", "佐西摩斯_ZH", "鹿野院平藏_ZH", "温迪_ZH", "菲谢尔_ZH", "anzai_ZH", "可莉_ZH", "刻晴_ZH", "克列门特_ZH", "阿扎尔_ZH", "班尼特_ZH", "伊迪娅_ZH", "巴达维_ZH", "深渊法师_ZH", "赛诺_ZH", "大慈树王_ZH", "拉齐_ZH", "海芭夏_ZH", "香菱_ZH", "康纳_ZH", "阿祇_ZH", "卡维_ZH", "博来_ZH", "斯坦利_ZH", "霍夫曼_ZH", "北斗_ZH", "阿拉夫_ZH", "陆行岩本真蕈·元素生命_ZH", "爱贝尔_ZH", "雷泽_ZH", "毗伽尔_ZH", "莎拉_ZH", "莫塞伊思_ZH", "多莉_ZH", "珊瑚_ZH", "老孟_ZH", "宵宫_ZH", "钟离_ZH", "芙宁娜_ZH", "爱德琳_ZH", "「女士」_ZH", "博易_ZH", "长生_ZH", "查尔斯_ZH", "阿娜耶_ZH", "流浪者_ZH", "辛焱_ZH", "德沃沙克_ZH", "雷电将军_ZH", "羽生田千鹤_ZH", " 那维莱特_ZH", "沙扎曼_ZH", "纳西妲_ZH", "艾伯特_ZH", "龙二_ZH", "旁白_ZH", "克罗索_ZH", "元太_ZH", "阿贝多_ZH", "萍姥姥_ZH", "久岐忍_ZH", "埃洛伊_ZH", "托马_ZH", "迪奥娜_ZH", "荧_ZH", "夏洛蒂_ZH", "莱欧斯利_ZH", "昆钧_ZH", "塞琉斯_ZH", "埃 泽_ZH", "迪娜泽黛_ZH", "知易_ZH", "玛格丽特_ZH", "申鹤_ZH", "罗莎莉亚_ZH", "娜维娅_ZH", "珐露珊_ZH", "浮游水蕈兽·元素生 命_ZH", "奥兹_ZH", "砂糖_ZH", "绮良良_ZH", "杜拉夫_ZH", "魈_ZH", "松浦_ZH", "迈蒙_ZH", "荒泷一斗_ZH", "吴船长_ZH", "埃尔欣根_ZH", "柯莱_ZH", "阿圆_ZH", "「白老先生」_ZH", "五郎_ZH", "「博士」_ZH", "早柚_ZH", "行秋_JP", "コナー_JP", "籠釣瓶 一心_JP", "宛煙_JP", "アビスの使徒_JP", "ティマイオス_JP", "タージ·ラドカニ_JP", "望雅_JP", "イディア_JP", "フレミネ_JP", "セノ_JP", "シャリフ_JP", "アデリン_JP", "イナヤ_JP", "巫女_JP", "サーチェン_JP", "クンジュ_JP", "「淵上」と自称するもの_JP", "ニィロウ_JP", "シェイクズバイル_JP", "式大将_JP", "レオン_JP", "放浪者_JP", "レッシグ_JP", "アーラヴ_JP", "フェルディナンド_JP", "凝光_JP", "小倉澪_JP", "マーガレット_JP", "守_JP", "長生_JP", "アルバート_JP", "慧心_JP", "ヨォーヨ_JP", "柊千里_JP", "丹羽_JP", "アルカミ_JP", "甘雨_JP", "モセイス_JP", "掇星攫辰天君_JP", "龍二_JP", "スクロース_JP", "珊 瑚宮心海_JP", "ヴィハル_JP", "マル_JP", "スタンレー_JP", "御肉丸_JP", "上杉_JP", "アーロイ_JP", "サラ_JP", "純水精霊？_JP", "嘉良_JP", "申鶴_JP", "リサ_JP", "クリメント_JP", "オズ_JP", "アルハイゼン_JP", "ナヴィア_JP", "孟_JP", "淑女_JP", "傍白_JP", "空_JP", "古山_JP", "七七_JP", "サイリュス_JP", "ナビル_JP", "雷電将軍_JP", "九条裟羅_JP", "セタレ_JP", "天お じ_JP", "ロサリア_JP", "ドゥラフ_JP", "晃_JP", "ディオナ_JP", "宵宮_JP", "テウセル_JP", "銀杏_JP", "楓原万葉_JP", "夜蘭_JP", "八重神子_JP", "レザー_JP", "エルザー_JP", "エデ_JP", "神里綾人_JP", "詩筠_JP", "神里綾華_JP", "マルシラック_JP", "雲菫_JP", "ダインスレイヴ_JP", "マハールッカデヴァータ_JP", "ジン_JP", "ノエル_JP", "ゴロー_JP", "ゾシモス_JP", "アイル マン_JP", "胡桃_JP", "メイモム_JP", "アペプ_JP", "ベネット_JP", "キャンディス_JP", "ナーダワ_JP", "アイベル_JP", "綺良々_JP", "ロレンツォ_JP", "煙緋_JP", "ジョイン_JP", "ドニアザード_JP", "エルファネ_JP", "九条鎌治_JP", "バダウィ_JP", "クロッサル_JP", "鍾離_JP", "言笑_JP", "「カーブース」_JP", "トーマ_JP", "エウルア_JP", "安西_JP", "ウェンティ_JP", "プカプカ水キノコン·元素生命_JP", "ファルザン_JP", "哲平_JP", "天目十五_JP", "ナヒーダ_JP", "一平_JP", "アリス_JP", "アロイス_JP", "リネット_JP", "悪龍_JP", "アンバー_JP", "刻晴_JP", "田饒舌_JP", "クレー_JP", "ラフマン_JP", "ラエッド_JP", "スカーレ ット_JP", "シコウ_JP", "荒瀧一斗_JP", "ジェマ_JP", "ピンばあや_JP", "香菱_JP", "つみ_JP", "鹿野院平蔵_JP", "シラージ_JP", "博来_JP", "鶯_JP", "アザール_JP", "パイモン_JP", "半夏_ZH", "费斯曼_ZH", "浣溪_ZH", "伦纳德_ZH", "素裳_ZH", "明曦_ZH", "绿芙蓉_ZH", "帕姆_ZH", "娜塔莎_ZH", "三月七_ZH", "符玄_ZH", "镜流_ZH", "青镞_ZH", "霄翰_ZH", "卡波特_ZH", "希儿_ZH", "希露瓦_ZH", "彦卿_ZH", "丹枢_ZH", "公输师傅_ZH", "史瓦罗_ZH", "驭空_ZH", "青雀_ZH", "dev_成男_ZH", "卡芙卡_ZH", "罗刹_ZH", "大毫_ZH", "白露_ZH", "金人会长_ZH", "可可利亚_ZH", "卢卡_ZH", "佩拉_ZH", "丹恒_ZH", "桑博_ZH", "艾丝妲_ZH", "晴霓_ZH", "帕斯卡_ZH", "克拉拉_ZH", "螺丝咕姆_ZH", "瓦尔特_ZH", "虎克_ZH", "岩明_ZH", "斯科特_ZH", "奥列格_ZH", "阿兰_ZH", "玲可_ZH", "银狼_ZH", "黑塔_ZH", "「信使」_ZH", "布洛妮娅_ZH", "停云_ZH", "开拓者(女)_ZH", "杰帕德_ZH", "刃_ZH", "景元_ZH", "姬子_ZH", "开拓者(男)_ZH", "半夏_JP", "カポーティ_JP", "パスカル_JP", "御空_JP", "開拓者(女)_JP", "金人会長_JP", "？？？_JP", "素裳_JP", "銀狼_JP", "クラーラ_JP", "セーバル_JP", "変な雲騎軍_JP", "女の声_JP", "緑芙蓉_JP", "浣渓_JP", "隠書_JP", "明輝_JP", "停雲_JP", "レオナード_JP", "符玄_JP", "幻朧_JP", "ジェパード_JP", "霄翰_JP", "彦卿_JP", "丹枢_JP", "リ ンクス_JP", "フック_JP", "鏡流_JP", "カフカ_JP", "パム_JP", "青雀_JP", "カカリア_JP", "青鏃_JP", "三月なのか_JP", "スコ ート_JP", "大毫_JP", "ペラ_JP", "白露_JP", "ブローニャ_JP", "ヴェルト_JP", "丹恒_JP", "ゼーレ_JP", "晴霓_JP", "開拓者(男)_JP", "ナターシャ_JP", "サンポ_JP", "公輸先生_JP", "オークションのスタッフ_JP", "岩明_JP", "紫月季_JP", "スヴァローグ_JP", "フェスマン_JP", "オレグ_JP", "ルカ_JP", "アーラン_JP", "羅刹_JP", "スクリューガム_JP", "アスター_JP", "浄硯_JP", " シュウェター_JP", "ヘルタ_JP", "刃_JP", "「メッセンジャー」_JP", "景元_JP", "姫子_JP", "派蒙_EN", "纳西妲_EN", "凯亚_EN", "阿贝多_EN", "温迪_EN", "枫原万叶_EN", "钟离_EN", "荒泷一斗_EN", "八重神子_EN", "艾尔海森_EN", "迪希雅_EN", "提纳里_EN", "卡维_EN", "宵宫_EN", "莱依拉_EN", "赛诺_EN", "诺艾尔_EN", "托马_EN", "凝光_EN", "莫娜_EN", "北斗_EN", "柯莱_EN", "神里绫华_EN", "可莉_EN", "芭芭拉_EN", "雷电将军_EN", "珊瑚宫心海_EN", "鹿野院平藏_EN", "迪奥娜_EN", "琴_EN", "五郎_EN", " 班尼特_EN", "安柏_EN", "夜兰_EN", "妮露_EN", "辛焱_EN", "珐露珊_EN", "林尼_EN", "丽莎_EN", "魈_EN", "香菱_EN", "烟绯_EN", "迪卢克_EN", "砂糖_EN", "早柚_EN", "云堇_EN", "刻晴_EN", "重云_EN", "优菈_EN", "胡桃_EN", "久岐忍_EN", "神里绫人_EN", "公子_EN", "娜维娅_EN", "甘雨_EN", "戴因斯雷布_EN", "菲谢尔_EN", "行秋_EN", "白术_EN", "九条裟罗_EN", "雷泽_EN", "申鹤_EN", "荧_EN", "空_EN", "流浪者_EN", "迪娜泽黛_EN", "凯瑟琳_EN", "多莉_EN", "坎蒂丝_EN", "萍姥姥_EN", "罗莎莉亚_EN", "埃德_EN", "夏洛蒂_EN", "伊迪娅_EN", "爱贝尔_EN", "留云借风真君_EN", "散兵_EN", "那维莱特_EN", "琳妮特_EN", "七七_EN", "式大 将_EN", "瑶瑶_EN", "奥兹_EN", "米卡_EN", "达达利亚_EN", "哲平_EN", "绮良良_EN", "浮游水蕈兽·元素生命_EN", "大肉丸_EN", "托克_EN", "蒂玛乌斯_EN", "昆钧_EN", "欧菲妮_EN", "塞琉斯_EN", "拉赫曼_EN", "阿守_EN", "芙宁娜_EN", "杜拉夫_EN", "伊利亚 斯_EN", "阿晃_EN", "旁白_EN", "菲米尼_EN", "爱德琳_EN", "埃洛伊_EN", "迈勒斯_EN", "德沃沙克_EN", "玛乔丽_EN", "塞塔蕾_EN", "九条镰治_EN", "柊千里_EN", "海芭夏_EN", "阿娜耶_EN", "笼钓瓶一心_EN", "回声海螺_EN", "元太_EN", "阿扎尔_EN", "查尔斯_EN", "埃勒曼_EN", "阿洛瓦_EN", "莎拉_EN", "纳比尔_EN", "康纳_EN", "博来_EN", "阿祇_EN", "玛塞勒_EN", "博士_EN", "玛格丽特_EN", "宛烟_EN", "羽生田千鹤_EN", "海妮耶_EN", "佐西摩斯_EN", "霍夫曼_EN", "舒伯特_EN", "鹿野奈奈_EN", "天叔_EN", "龙 二_EN", "艾莉丝_EN", "莺儿_EN", "嘉良_EN", "言笑_EN", "费迪南德_EN", "珊瑚_EN", "嘉玛_EN", "久利须_EN", "艾文_EN", "女士_EN", "丹吉尔_EN", "白老先生_EN", "老孟_EN", "天目十五_EN", "巴达维_EN", "舍利夫_EN", "拉齐_EN", "吴船长_EN", "艾伯特_EN", "埃泽_EN", "松浦_EN", "阿拉夫_EN", "莫塞伊思_EN", "阿圆_EN", "石头_EN", "百闻_EN", "迈蒙_EN", "掇星攫辰天君_EN", "博 易_EN", "斯坦利_EN", "毗伽尔_EN", "诗筠_EN", "慧心_EN", "恶龙_EN", "小仓澪_EN", "知易_EN", "恕筠_EN", "克列门特_EN", "大慈树王_EN", "维多利亚_EN", "黑田_EN", "宁禄_EN", "马姆杜_EN", "西拉杰_EN", "上杉_EN", "阿尔卡米_EN", "常九爷_EN", "纯水 精灵_EN", "田铁嘴_EN", "沙扎曼_EN", "加萨尼_EN", "克罗索_EN", "莱斯格_EN", "星稀_EN", "阿巴图伊_EN", "悦_EN", "德田_EN", "阿佩普_EN", "埃尔欣根_EN", "萨赫哈蒂_EN", "洛伦佐_EN", "深渊使徒_EN", "塔杰·拉德卡尼_EN", "泽田_EN", "安西_EN", "理水 叠山真君_EN", "萨齐因_EN", "古田_EN"]

/* 原版的
export function convertSpeaker (speaker) {
  switch (speaker) {
    case '空':
    case '空哥': return '空（空哥）'
    case '荧':
    case '荧妹': return '荧（荧妹）'
    case '神里绫华':
    case '龟龟': return '神里绫华（龟龟）'
    case '菲谢尔':
    case '皇女': return '菲谢尔（皇女）'
    case '公子':
    case '达达利亚': return '达达利亚（公子）'
    case '诺艾尔':
    case '女仆': return '诺艾尔（女仆）'
    case '甘雨':
    case '椰羊': return '甘雨（椰羊）'
    case '雷神':
    case '雷电将军': return '雷电将军（雷神）'
    case '珊瑚宫心海':
    case '心海': return '珊瑚宫心海（心海，扣扣米）'
    case '荒泷一斗':
    case '一斗': return '荒泷一斗（一斗）'
    case '神子':
    case '八重神子': return '八重神子（神子）'
    case '绫人':
    case '神里绫人': return '神里绫人（绫人）'
    case '万叶':
    case '枫原万叶': return '枫原万叶（万叶）'
    case '猫猫':
    case '迪奥娜': return '迪奥娜（猫猫）'
    case '草神':
    case '纳西妲': return '纳西妲（草神）'
  }

  return speaker
}
export const speakers = ['特别周', '无声铃鹿', '东海帝皇（帝宝，帝王）', '丸善斯基', '富士奇迹',
  '小栗帽', '黄金船', '伏特加', '大和赤骥', '大树快车', '草上飞', '菱亚马逊',
  '目白麦昆', '神鹰', '好歌剧', '成田白仁', '鲁道夫象征（皇帝）', '气槽',
  '爱丽数码', '星云天空', '玉藻十字', '美妙姿势', '琵琶晨光', '摩耶重炮',
  '曼城茶座', '美浦波旁', '目白赖恩', '菱曙', '雪中美人', '米浴', '艾尼斯风神',
  '爱丽速子（爱丽快子）', '爱慕织姬', '稻荷一', '胜利奖券', '空中神宫', '荣进闪耀',
  '真机伶', '川上公主', '黄金城（黄金城市）', '樱花进王', '采珠', '新光风',
  '东商变革', '超级小海湾', '醒目飞鹰（寄寄子）', '荒漠英雄', '东瀛佐敦',
  '中山庆典', '成田大进', '西野花', '春丽（乌拉拉）', '青竹回忆', '微光飞驹',
  '美丽周日', '待兼福来', 'mr cb（cb先生）', '名将怒涛（名将户仁）', '目白多伯',
  '优秀素质', '帝王光辉', '待兼诗歌剧', '生野狄杜斯', '目白善信', '大拓太阳神',
  '双涡轮（两立直，两喷射，二锅头，逆喷射）', '里见光钻（萨托诺金刚石）', '北部玄驹',
  '樱花千代王', '天狼星象征', '目白阿尔丹', '八重无敌', '鹤丸刚志', '目白光明',
  '成田拜仁（成田路）', '也文摄辉', '小林历奇', '北港火山', '奇锐骏', '苦涩糖霜',
  '小小蚕茧', '骏川手纲（绿帽恶魔）', '秋川弥生（小小理事长）', '乙名史悦子（乙名记者）',
  '桐生院葵', '安心泽刺刺美', '樫本理子', '神里绫华（龟龟）', '琴', '空（空哥）',
  '丽莎', '荧（荧妹）', '芭芭拉', '凯亚', '迪卢克', '雷泽', '安柏', '温迪',
  '香菱', '北斗', '行秋', '魈', '凝光', '可莉', '钟离', '菲谢尔（皇女）',
  '班尼特', '达达利亚（公子）', '诺艾尔（女仆）', '七七', '重云', '甘雨（椰羊）',
  '阿贝多', '迪奥娜（猫猫）', '莫娜', '刻晴', '砂糖', '辛焱', '罗莎莉亚',
  '胡桃', '枫原万叶（万叶）', '烟绯', '宵宫', '托马', '优菈', '雷电将军（雷神）',
  '早柚', '珊瑚宫心海（心海，扣扣米）', '五郎', '九条裟罗', '荒泷一斗（一斗）',
  '埃洛伊', '申鹤', '八重神子（神子）', '神里绫人（绫人）', '夜兰', '久岐忍',
  '鹿野苑平藏', '提纳里', '柯莱', '多莉', '云堇', '纳西妲（草神）', '深渊使徒',
  '妮露', '赛诺', '债务处理人', '坎蒂丝', '真弓快车', '秋人', '望族', '艾尔菲',
  '艾莉丝', '艾伦', '阿洛瓦', '天野', '天目十五', '愚人众-安德烈', '安顺', '安西',
  '葵', '青木', '荒川幸次', '荒谷', '有泽', '浅川', '麻美', '凝光助手', '阿托',
  '竺子', '百识', '百闻', '百晓', '白术', '贝雅特丽奇', '丽塔', '失落迷迭',
  '缭乱星棘', '伊甸', '伏特加女孩', '狂热蓝调', '莉莉娅', '萝莎莉娅', '八重樱',
  '八重霞', '卡莲', '第六夜想曲', '卡萝尔', '姬子', '极地战刃', '布洛妮娅',
  '次生银翼', '理之律者%26希儿', '理之律者', '迷城骇兔', '希儿', '魇夜星渊',
  '黑希儿', '帕朵菲莉丝', '不灭星锚', '天元骑英', '幽兰黛尔', '派蒙bh3',
  '爱酱', '绯玉丸', '德丽莎', '月下初拥', '朔夜观星', '暮光骑士', '格蕾修',
  '留云借风真君', '梅比乌斯', '仿犹大', '克莱因', '圣剑幽兰黛尔', '妖精爱莉',
  '特斯拉zero', '苍玄', '若水', '西琳', '戴因斯雷布', '贝拉', '赤鸢', '镇魂歌',
  '渡鸦', '人之律者', '爱莉希雅', '天穹游侠', '琪亚娜', '空之律者', '薪炎之律者',
  '云墨丹心', '符华', '识之律者', '特瓦林', '维尔薇', '芽衣', '雷之律者',
  '断罪影舞', '阿波尼亚', '榎本', '厄尼斯特', '恶龙', '范二爷', '法拉',
  '愚人众士兵', '愚人众士兵a', '愚人众士兵b', '愚人众士兵c', '愚人众a', '愚人众b',
  '飞飞', '菲利克斯', '女性跟随者', '逢岩', '摆渡人', '狂躁的男人', '奥兹',
  '芙萝拉', '跟随者', '蜜汁生物', '黄麻子', '渊上', '藤木', '深见', '福本',
  '芙蓉', '古泽', '古田', '古山', '古谷昇', '傅三儿', '高老六', '矿工冒',
  '元太', '德安公', '茂才公', '杰拉德', '葛罗丽', '金忽律', '公俊', '锅巴',
  '歌德', '阿豪', '狗三儿', '葛瑞丝', '若心', '阿山婆', '怪鸟', '广竹', '观海',
  '关宏', '蜜汁卫兵', '守卫1', '傲慢的守卫', '害怕的守卫', '贵安', '盖伊', '阿创',
  '哈夫丹', '日语阿贝多（野岛健儿）', '日语埃洛伊（高垣彩阳）', '日语安柏（石见舞菜香）',
  '日语神里绫华（早见沙织）', '日语神里绫人（石田彰）', '日语白术（游佐浩二）',
  '日语芭芭拉（鬼头明里）', '日语北斗（小清水亚美）', '日语班尼特（逢坂良太）',
  '日语坎蒂丝（柚木凉香）', '日语重云（齐藤壮马）', '日语柯莱（前川凉子）',
  '日语赛诺（入野自由）', '日语戴因斯雷布（津田健次郎）', '日语迪卢克（小野贤章）',
  '日语迪奥娜（井泽诗织）', '日语多莉（金田朋子）', '日语优菈（佐藤利奈）',
  '日语菲谢尔（内田真礼）', '日语甘雨（上田丽奈）', '日语（畠中祐）',
  '日语鹿野院平藏（井口祐一）', '日语空（堀江瞬）', '日语荧（悠木碧）',
  '日语胡桃（高桥李依）', '日语一斗（西川贵教）', '日语凯亚（鸟海浩辅）',
  '日语万叶（岛崎信长）', '日语刻晴（喜多村英梨）', '日语可莉（久野美咲）',
  '日语心海（三森铃子）', '日语九条裟罗（濑户麻沙美）', '日语丽莎（田中理惠）',
  '日语莫娜（小原好美）', '日语纳西妲（田村由加莉）', '日语妮露（金元寿子）',
  '日语凝光（大原沙耶香）', '日语诺艾尔（高尾奏音）', '日语奥兹（增谷康纪）',
  '日语派蒙（古贺葵）', '日语琴（斋藤千和）', '日语七七（田村由加莉）', '日语雷电将军（泽城美雪）',
  '日语雷泽（内山昂辉）', '日语罗莎莉亚（加隈亚衣）', '日语早柚（洲崎绫）', '日语散兵（柿原彻也）',
  '日语申鹤（川澄绫子）', '日语久岐忍（水桥香织）', '日语女士（庄子裕衣）', '日语砂糖（藤田茜）',
  '日语达达利亚（木村良平）', '日语托马（森田成一）', '日语提纳里（小林沙苗）', '日语温迪（村濑步）',
  '日语香菱（小泽亚李）', '日语魈（松冈祯丞）', '日语行秋（皆川纯子）', '日语辛焱（高桥智秋）',
  '日语八重神子（佐仓绫音）', '日语烟绯（花守由美里）', '日语夜兰（远藤绫）', '日语宵宫（植田佳奈）',
  '日语云堇（小岩井小鸟）', '日语钟离（前野智昭）', '杰克', '阿吉', '江舟', '鉴秋', '嘉义',
  '纪芳', '景澄', '经纶', '景明', '晋优', '阿鸠', '酒客', '乔尔', '乔瑟夫', '约顿',
  '乔伊斯', '居安', '君君', '顺吉', '纯也', '重佐', '大岛纯平', '蒲泽', '勘解由小路健三郎',
  '枫', '枫原义庆', '荫山', '甲斐田龍馬', '海斗', '惟神晴之介', '鹿野奈奈', '卡琵莉亚',
  '凯瑟琳', '加藤信悟', '加藤洋平', '胜家', '茅葺一庆', '和昭', '一正', '一道', '桂一',
  '庆次郎', '阿贤', '健司', '健次郎', '健三郎', '天理', '杀手a', '杀手b', '木南杏奈',
  '木村', '国王', '木下', '北村', '清惠', '清人', '克列门特', '骑士', '小林', '小春',
  '康拉德', '大肉丸', '琴美', '宏一', '康介', '幸德', '高善', '梢', '克罗索', '久保',
  '九条镰治', '久木田', '昆钧', '菊地君', '久利须', '黑田', '黑泽京之介', '响太', '岚姐',
  '兰溪', '澜阳', '劳伦斯', '乐明', '莱诺', '莲', '良子', '李当', '李丁', '小乐', '灵',
  '小玲', '琳琅a', '琳琅b', '小彬', '小德', '小楽', '小龙', '小吴', '小吴的记忆', '理正',
  '阿龙', '卢卡', '洛成', '罗巧', '北风狼', '卢正', '萍姥姥', '前田', '真昼', '麻纪',
  '真', '愚人众-马克西姆', '女性a', '女性b', '女性a的跟随者', '阿守', '玛格丽特', '真理',
  '玛乔丽', '玛文', '正胜', '昌信', '将司', '正人', '路爷', '老章', '松田', '松本', '松浦',
  '松坂', '老孟', '孟丹', '商人随从', '传令兵', '米歇尔', '御舆源一郎', '御舆源次郎', '千岩军教头',
  '千岩军士兵', '明博', '明俊', '美铃', '美和', '阿幸', '削月筑阳真君', '钱眼儿', '森彦',
  '元助', '理水叠山真君', '理水疊山真君', '朱老板', '木木', '村上', '村田', '永野',
  '长野原龙之介', '长濑', '中野志乃', '菜菜子', '楠楠', '成濑', '阿内', '宁禄', '牛志', '信博',
  '伸夫', '野方', '诺拉', '纪香', '诺曼', '修女', '纯水精灵', '小川', '小仓澪', '冈林',
  '冈崎绘里香', '冈崎陆斗', '奥拉夫', '老科', '鬼婆婆', '小野寺', '大河原五右卫门', '大久保大介',
  '大森', '大助', '奥特', '派蒙', '派蒙2', '病人a', '病人b', '巴顿', '派恩', '朋义',
  '围观群众', '围观群众a', '围观群众b', '围观群众c', '围观群众d', '围观群众e', '铜雀',
  '阿肥', '兴叔', '老周叔', '公主', '彼得', '乾子', '芊芊', '乾玮', '绮命', '杞平',
  '秋月', '昆恩', '雷电影', '兰道尔', '雷蒙德', '冒失的帕拉德', '伶一', '玲花', '阿仁',
  '家臣们', '梨绘', '荣江', '戎世', '浪人', '罗伊斯', '如意', '凉子', '彩香', '酒井',
  '坂本', '朔次郎', '武士a', '武士b', '武士c', '武士d', '珊瑚', '三田', '莎拉', '笹野',
  '聪美', '聪', '小百合', '散兵', '害怕的小刘', '舒伯特', '舒茨', '海龙', '世子',
  '谢尔盖', '家丁', '商华', '沙寅', '阿升', '柴田', '阿茂', '式大将', '清水', '志村勘兵卫',
  '新之丞', '志织', '石头', '诗羽', '诗筠', '石壮', '翔太', '正二', '周平', '舒杨',
  '齐格芙丽雅', '女士', '思勤', '六指乔瑟', '愚人众小兵d', '愚人众小兵a', '愚人众小兵b',
  '愚人众小兵c', '吴老五', '吴老二', '滑头鬼', '言笑', '吴老七', '士兵h', '士兵i',
  '士兵a', '士兵b', '士兵c', '士兵d', '士兵e', '士兵f', '士兵g', '奏太', '斯坦利',
  '掇星攫辰天君', '小头', '大武', '陶义隆', '杉本', '苏西', '嫌疑人a', '嫌疑人b', '嫌疑人c',
  '嫌疑人d', '斯万', '剑客a', '剑客b', '阿二', '忠胜', '忠夫', '阿敬', '孝利', '鹰司进',
  '高山', '九条孝行', '毅', '竹内', '拓真', '卓也', '太郎丸', '泰勒', '手岛', '哲平',
  '哲夫', '托克', '大boss', '阿强', '托尔德拉', '旁观者', '天成', '阿大', '蒂玛乌斯',
  '提米', '户田', '阿三', '一起的人', '德田', '德长', '智树', '利彦', '胖乎乎的旅行者',
  '藏宝人a', '藏宝人b', '藏宝人c', '藏宝人d', '阿祇', '恒雄', '露子', '话剧团团长',
  '内村', '上野', '上杉', '老戴', '老高', '老贾', '老墨', '老孙', '天枢星', '老云',
  '有乐斋', '丑雄', '乌维', '瓦京', '菲尔戈黛特', '维多利亚', '薇尔', '瓦格纳',
  '阿外', '侍女', '瓦拉', '望雅', '宛烟', '琬玉', '战士a', '战士b', '渡辺', '渡部', '阿伟',
  '文璟', '文渊', '韦尔纳', '王扳手', '武沛', '晓飞', '辛程', '星火', '星稀', '辛秀',
  '秀华', '阿旭', '徐刘师', '矢部', '八木', '山上', '阿阳', '颜笑', '康明', '泰久',
  '安武', '矢田幸喜', '矢田辛喜', '义坚', '莺儿', '盈丰', '宜年', '银杏', '逸轩', '横山',
  '永贵', '永业', '嘉久', '吉川', '义高', '用高', '阳太', '元蓉', '玥辉', '毓华', '有香',
  '幸也', '由真', '结菜', '韵宁', '百合', '百合华', '尤苏波夫', '裕子', '悠策', '悠也',
  '于嫣', '柚子', '老郑', '正茂', '志成', '芷巧', '知易', '支支', '周良', '珠函', '祝明', '祝涛'] */
