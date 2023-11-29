// 修复椰奶代理
// curl -# -L -o "./plugins/yenai-plugin/lib/request/httpsProxyAgentMod.js" "https://raw.githubusercontent.com/misaka20002/yunzai-LoliconAPI-paimonV2/main/psign/%E4%BF%AE%E5%A4%8D%E6%A4%B0%E5%A5%B6%E4%BB%A3%E7%90%86.js"

import HttpsProxyAgentOrig from 'https-proxy-agent'

export class HttpsProxyAgent extends HttpsProxyAgentOrig.HttpsProxyAgent {
  constructor (opts) {
    super(opts)
    this.tlsConnectionOptions = opts.tls
    const callback = (req, opts) => callback(req, Object.assign(opts, this.tlsConnectionOptions)).bind(this)
  }
}
