//已失效

import { Config, Plugin_Path } from '../../components/index.js'
import { HttpsProxyAgent } from './httpsProxyAgentMod.js'
import fetch from 'node-fetch'
import { Agent } from 'https'
import crypto from 'crypto'
import sharp from 'sharp'
import path from 'path'
import _ from 'lodash'
import fs from 'fs'

const cacheImgUrl = `${process.cwd()}/data/image`
const CHROME_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36'
const POSTMAN_UA = 'PostmanRuntime/7.29.0'

class HTTPResponseError extends Error {
  constructor(response) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`)
    this.response = response
  }
}

const checkStatus = response => {
  if (response.ok) {
    return response
  } else {
    throw new HTTPResponseError(response)
  }
}

export const qs = (obj) => {
  let res = ''
  for (const [k, v] of Object.entries(obj)) {
    res += `${k}=${encodeURIComponent(v)}&`
  }
  return res.slice(0, res.length - 1)
}

export default new class {
  /**
   * 发送HTTP GET请求并返回响应
   * @async
   * @function
   * @param {string} url - 请求的URL
   * @param {Object} [options={}] - 请求的配置项
   * @param {Object} [options.params] - 请求的参数
   * @param {Object} [options.headers] - 请求的HTTP头部
   * @param {boolean} [options.closeCheckStatus=false] - 是否关闭状态检查
   * @param {'buffer'|'json'|'text'|'arrayBuffer'|'formData'|'blob'}[options.statusCode] - 期望的返回数据，如果设置了该值，则返回响应数据的特定的方法（如json()、text()等）
   * @returns {Promise<Response|*>} - HTTP响应或响应数据
   * @throws {Error} - 如果请求失败，则抛出错误
   */
  async get(url, options = {}) {
    // 处理参数
    if (options.params) url = url + '?' + qs(options.params)
    options.headers = {
      'User-Agent': CHROME_UA,
      ...options.headers
    }
    if (!options.agent) options.agent = this.getAgent()
    try {
      let res = await fetch(url, options)
      if (!options.closeCheckStatus) {
        res = checkStatus(res)
      }
      if (options.statusCode) {
        return res[options.statusCode]()
      }
      return res
    } catch (err) { }
  }

  /**
   * 发送HTTP POST请求并返回响应
   * @async
   * @function
   * @param {string} url - 请求的URL
   * @param {object} [options={}] - 请求的配置项
   * @param {object} [options.params] - 请求的参数
   * @param {object} [options.headers] - 请求的HTTP头部
   * @param {object} [options.data] - 请求的数据
   * @param {boolean} [options.closeCheckStatus=false] - 是否关闭状态检查
   * @param {'buffer'|'json'|'text'|'arrayBuffer'|'formData'|'blob'} [options.statusCode] - 期望的返回数据，如果设置了该值，则返回响应数据的特定的方法（如json()、text()等）
   * @returns {Promise<Response|*>} - HTTP响应或响应数据
   * @throws {Error} - 如果请求失败，则抛出错误
   */
  async post(url, options = {}) {
    options.method = 'POST'
    options.headers = {
      'User-Agent': CHROME_UA,
      'Content-Type': 'application/json',
      ...options.headers
    }
    if (options.params) url = url + '?' + qs(options.params)
    logger.debug(`[Yenai-Plugin] POST请求：${decodeURI(url)}`)
    if (options.data) {
      if (/json/.test(options.headers['Content-Type'])) {
        options.body = JSON.stringify(options.data)
      } else if (
        /x-www-form-urlencoded/.test(options.headers['Content-Type'])
      ) {
        options.body = qs(options.data)
      } else {
        options.body = options.data
      }
      delete options.data
    }
    if (!options.agent) options.agent = this.getAgent()
    try {
      let res = await fetch(url, options)
      if (!options.closeCheckStatus) {
        res = checkStatus(res)
      }
      if (options.statusCode) {
        return res[options.statusCode]()
      }
      return res
    } catch (err) { }
  }

  /**
   * @description: 绕cf Get请求
   * @param {String} url
   * @param {Object} options 同fetch第二参数
   * @param {Object} options.params 请求参数
   * @return {FetchObject}
   */
  async cfGet(url, options = {}) {
    options.agent = this.getAgent(true)
    options.headers = {
      'User-Agent': POSTMAN_UA,
      ...options.headers
    }
    return this.get(url, options)
  }

  /**
   * @description: 绕cf Post请求
   * @param {String} url
   * @param {Object} options 同fetch第二参数
   * @param {Object|String} options.data 请求参数
   * @return {FetchObject}
   */
  async cfPost(url, options = {}) {
    options.agent = this.getAgent(true)
    options.headers = {
      'User-Agent': POSTMAN_UA,
      ...options.headers
    }
    return this.post(url, options)
  }

  getAgent(cf) {
    const { proxyAddress, switchProxy } = Config.proxy
    const { cfTLSVersion } = Config.picSearch
    return cf ? this.getTlsVersionAgent(proxyAddress, cfTLSVersion) : switchProxy ? new HttpsProxyAgent(proxyAddress) : false
  }

  /**
   * 从代理字符串获取指定 TLS 版本的代理
   * @param {string} str
   * @param {import('tls').SecureVersion} tlsVersion
   */
  getTlsVersionAgent(str, tlsVersion) {
    const tlsOpts = {
      maxVersion: tlsVersion,
      minVersion: tlsVersion
    }
    if (typeof str === 'string') {
      const isHttp = str.startsWith('http')
      if (isHttp && Config.proxy.switchProxy) {
        const opts = {
          ..._.pick(new URL(str), [
            'protocol',
            'hostname',
            'port',
            'username',
            'password'
          ]),
          tls: tlsOpts
        }
        return new HttpsProxyAgent(opts)
      }
    }
    return new Agent(tlsOpts)
  }

  /**
   * @description: 代理请求图片
   * @param {String} url 图片链接
   * @param {Boolean} cache 是否缓存
   * @param {Number} timeout 超时时间
   * @param {Object} headers 请求头
   * @return {Porimes<import('icqq').ImageElem>} 构造图片消息
   */
  async proxyRequestImg(url, { cache, timeout, headers } = {}) {
    if (!this.getAgent()) return segment.image(url, cache, timeout, headers)
    const Request = await this.get(url, { headers }).catch(err => logger.warn(err))
    if (Request && Request.body) {
      const image = await processImage(Request.body)
      return await segment.image(image, cache, timeout)
    } else {
      return await segment.image(`${Plugin_Path}/resources/img/imgerror.png`, cache, timeout)
    }
  }
}

async function processImage(imageData) {
  try {
    // 生成唯一的临时文件名
    const uniqueFilename = crypto.randomBytes(4).toString('hex')
    const uniqueOutputFilename = crypto.randomBytes(4).toString('hex')

    // 保存处理前的图像数据为临时文件
    const tempInputFilePath = path.join(cacheImgUrl, `${uniqueFilename}`)

    // 保存处理后的图像数据为临时文件
    const tempOutputFilePath = path.join(cacheImgUrl, `${uniqueOutputFilename}`)

    // 将PassThrough流直接保存为临时文件
    const writeStream = fs.createWriteStream(tempInputFilePath)
    imageData.pipe(writeStream)

    await new Promise(
      (resolve, reject) => {
        writeStream.on('finish', resolve)
        writeStream.on('error', reject)
      }
    )

    // 随机选择一个选项
    const options = ['brightness', 'contrast', 'saturation', 'hue', 'width', 'height']
    const option = options[Math.floor(Math.random() * options.length)]

    // 根据选择的选项进行修改
    switch (option) {
      case 'brightness':
        // 修改亮度
        await sharp(tempInputFilePath).modulate({ brightness: 1 + Math.random() * 0.02 }).toFile(tempOutputFilePath)
        break
      case 'contrast':
        // 修改对比度
        await sharp(tempInputFilePath).modulate({ contrast: 1 + Math.random() * 0.02 }).toFile(tempOutputFilePath)
        break
      case 'saturation':
        // 修改饱和度
        await sharp(tempInputFilePath).modulate({ saturation: 1 + Math.random() * 0.02 }).toFile(tempOutputFilePath)
        break
      case 'hue':
        // 修改色调
        await sharp(tempInputFilePath).modulate({ hue: Math.floor(Math.random() * 3.6) }).toFile(tempOutputFilePath)
        break
      case 'width':
        // 修改宽度
        const newWidth = (await sharp(tempInputFilePath).metadata()).width - 1 + Math.floor(Math.random() * 2)
        await sharp(tempInputFilePath).resize(newWidth, null, { withoutEnlargement: true }).toFile(tempOutputFilePath)
        break
      case 'height':
        // 修改高度
        const newHeight = (await sharp(tempInputFilePath).metadata()).height - 1 + Math.floor(Math.random() * 2)
        await sharp(tempInputFilePath).resize(null, newHeight, { withoutEnlargement: true }).toFile(tempOutputFilePath)
        break
    }

    await fs.promises.unlink(tempInputFilePath)
    // 返回临时文件的路径，这个路径将作为图像的URL或者路径
    return tempOutputFilePath
  } catch (err) {
    logger.warn(err)
    return imageData
  }
}
