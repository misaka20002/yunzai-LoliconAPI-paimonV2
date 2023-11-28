// workaround for ver 7.x and ver 5.x
// 这个js启动云崽的时候会报错属于正常现象
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
