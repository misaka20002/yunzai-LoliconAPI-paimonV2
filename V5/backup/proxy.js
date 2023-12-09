// workaround for ver 7.x and ver 5.x
// 云崽启动的时候这个.js会报错属于正常现象
// 已经不需要这个了
import HttpsProxyAgent from 'https-proxy-agent'

let proxy = HttpsProxyAgent
if (typeof proxy !== 'function') {
  proxy = (p) => {
    return new HttpsProxyAgent.HttpsProxyAgent(p)
  }
}

/**
 * return a proxy function
 * @returns {*|createHttpsProxyAgent|((opts: (string | createHttpsProxyAgent.HttpsProxyAgentOptions)) => HttpsProxyAgent)}
 */
export function getProxy () {
  return proxy
}
