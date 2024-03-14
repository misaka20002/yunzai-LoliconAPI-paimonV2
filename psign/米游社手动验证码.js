// 10-16 02:00 (需要最新版喵崽)
import plugin from '../../lib/plugins/plugin.js'
import fetch from 'node-fetch'

/**
 * @param {Object} cfg
 * @param {Number} [cfg.verify] 手动验证 0-关闭 1-开启 2-仅原神 3-仅星铁
 * @param {String} [cfg.verifyAddr] 手动验证API, demo: https://gitee.com/QQ1146638442/GT-Manual
 * @param {Object} [cfg.blackList] 黑名单QQ，不使用手动过码，有其他过码插件会next下一个过码服务
 */
let cfg = {
  verify: 1,
  verifyAddr: 'http://gt.qsign.icu/GTest/register?key=免费开源项目-您如果是交易获得则是被骗-请及时退款并举报',
  blackList: [10001, 10002]
}

export class bbsVerificationHandler extends plugin {
  constructor () {
    super({
      name: 'mys请求错误处理',
      priority: -(9 ** 9),
      namespace: 'GT-Manual',
      handler: [{
        key: 'mys.req.err',
        fn: 'mysReqErrHandler'
      }]
    })
  }

  async mysReqErrHandler (e, options, reject) {
    let { mysApi, type, data } = options
    let self = new bbsVerificationHandler()
    self.e = e
    self.mysApi = mysApi
    self.mysApi.getUrl = (...args) => self.getUrl.call(self.mysApi, ...args)

    if (
      options.res.retcode !== 1034 ||
      cfg.blackList.includes(e.user_id) ||
      !(cfg.verify && cfg.verifyAddr) ||
      (cfg.verify == 3 && !e.isSr) ||
      (cfg.verify == 2 && e.isSr)
    ) return reject()

    /** 已验证 */
    if (e.isVerify) return await mysApi.getData(type, data)

    let verify = await self.bbsVerification()
    if (!verify) logger.error(`[米游社验证失败][uid:${e.uid || mysApi.uid}][qq:${e.user_id}]`)

    /** 仅调用过码 (即刷新米游社验证，该ltuid后续N小时内不会再触发验证码) */
    if (options.OnlyGtest) return verify

    return verify ? await mysApi.getData(type, data) : options.res
  }

  /** 刷新米游社验证 */
  async bbsVerification () {
    let create = await this.mysApi.getData('createVerification')
    if (!create || create.retcode !== 0) return false

    let verify = await this.verify(this.e, { uid: this.mysApi.uid || this.e?.uid, ...create.data })
    if (!verify) return false

    let submit = await this.mysApi.getData('verifyVerification', verify)
    if (!submit || submit.retcode !== 0) return false

    this.e.isVerify = true
    return true
  }

  /** 手动验证, 返回validate等参数 */
  async verify (e, data) {
    if (!data.gt || !data.challenge || !e?.reply) return false

    let res = await fetch(cfg.verifyAddr, {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data)
    })
    res = await res.json()
    if (!res.data) return false

    await e.reply(`请复制到浏览器打开链接并完成验证\n${res.data.link}`, true)

    for (let i = 0; i < 80; i++) {
      let validate = await fetch(res.data.result)
      validate = await validate.json()
      if (validate.data) {
        logger.mark(`[米游社验证成功][uid:${e.uid || data.uid}][qq:${e.user_id}]`)
        return validate.data
      }
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }

    return false
  }

  getUrl (type, data = {}) {
    let urlMap = {
      ...this.apiTool.getUrlMap({ ...data, deviceId: this.device }),
      createVerification: {
        url: 'https://api-takumi-record.mihoyo.com/game_record/app/card/wapi/createVerification',
        query: 'is_high=true'
      },
      verifyVerification: {
        url: 'https://api-takumi-record.mihoyo.com/game_record/app/card/wapi/verifyVerification',
        body: data
      }
    }
    if (!urlMap[type]) return false

    let { url, query = '', body = '', sign = '' } = urlMap[type]

    if (query) url += `?${query}`
    if (body) body = JSON.stringify(body)

    let headers = this.getHeaders(query, body, sign)
    if (this.isSr) headers['x-rpc-challenge_game'] = '6'

    return { url, headers, body }
  }
}
