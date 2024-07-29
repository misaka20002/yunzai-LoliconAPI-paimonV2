//作者860563585
//项目地址https://gitee.com/HanaHimeUnica/yzjs
import plugin from '../../lib/plugins/plugin.js'
import common from "../../lib/common/common.js"
import path from 'path'
import fs from 'fs'

const bfPath = path.join(process.cwd(), '/resources/bf/')
const pluginsPath = path.join(process.cwd(), '/plugins/')
export class updateLog extends plugin {
  constructor(e) {
    super({
      name: '[备份|还原]',
      dsc: '备份',
      event: 'message',
      priority: 10,
      rule: [
        {
          reg: '^#?(配置文件)?备份$',
          fnc: 'bf'
        },
        {
          reg: '^#?(配置文件)?还原$',
          fnc: 'hy'
        },
      ]
    })
  }

  async bf(e) {
    if (!e.isMaster) {
      e.reply(`哒咩，你可不是老娘的master
      (*/ω＼*)`)
      return false
    }
    let ok = []
    let err = []
    let srcPath
    let destPath
    let plugins = fs.readdirSync(pluginsPath)
    this.reply('开始备份插件配置文件，请稍后......\n会同时备份面板,礼记数据,喵喵帮助,\n抽卡记录,stoken,js哦!')
    await common.sleep(10000)
    try{
      copyFiles('./config/config', bfPath + 'config/config')
      copyFiles('./data', bfPath + 'data')
      ok.push('config')
      ok.push('data')
    } catch(err) {err.push('本体配置文件')}

    for (let p of plugins) {
      try{
      if (p == 'example') {
        srcPath = p
      } else {
        srcPath = `${p}/config`
      }
      if (!fs.existsSync(pluginsPath + srcPath)) {
        continue
      }
      destPath = bfPath + srcPath
      copyFiles(`./plugins/${srcPath}/`, destPath)
      if (p == 'xiaoyao-cvs-plugin') {
        srcPath = `${p}/data`
        destPath = bfPath + srcPath
        copyFiles(`./plugins/${srcPath}/`, destPath)
      }
      if (p == 'miao-plugin') {
        srcPath = `${p}/resources/help`
        destPath = bfPath + srcPath
        copyFiles(`./plugins/${srcPath}/`, destPath)
      }
      ok.push(p)
    } catch (err) {err.push(p)}
  }
    let msg = [`共备份${ok.length + err.length}个插件配置文件，\n已保存到Bot/resources/bf下\n成功${ok.length}个\n${ok.toString().replace(/,/g, '，\n')}\n\n失败${err.length}个\n${err.toString().replace(/,/g, '，\n')}`]
    this.reply(await common.makeForwardMsg(e, msg, '备份成功,点击查看备份内容'))
  }

  async hy(e) {
    if (!e.isMaster) {
      e.reply(`哒咩，你可不是老娘的master
      (*/ω＼*)`)
      return false
    }
    this.reply('还原中......,PS:请先下载所有插件后还原\n还原时请将resources/bf下的文件放到对应位置')
    await common.sleep(10000)
    let ok = []
    let err = []
    let bfs = fs.readdirSync(bfPath)
    for (let b of bfs) {
      try {
        if (b == 'data' || b == 'config') copyFiles(bfPath + b , `./${b}`)
        else
      copyFiles(bfPath + b , pluginsPath + b)
      ok.push(b)
      } catch(err) {err.push(b)}
    }
   
    let msg = [`共还原${ok.length + err.length}个插件配置文件，成功${ok.length}个\n${ok.toString().replace(/,/g, '，\n')}\n\n失败${err.length}个\n${err.toString().replace(/,/g, '，\n')}`]
    this.reply(await common.makeForwardMsg(e, msg, '还原成功,点击查看还原内容'))
  }

}
function copyFiles(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
  fs.readdir(src, { withFileTypes: true }, (err, files) => {
    // files 结果是一个对象
    if (err) {
      console.log(err);
    }
    // 遍历所有的文件
    files.forEach(function (srcFile) {
      // 判断是否为文件夹
      if (srcFile.isDirectory()) {
        // 源目标路径加上文件名即为新创建文件夹的路径
        const destFile1 = path.resolve(dest, srcFile.name);
        const srcFile1 = path.resolve(src, srcFile.name);
        // 同步创建文件夹
        if (!fs.existsSync(destFile1)) {
          fs.mkdirSync(destFile1, (err) => {
            console.log(err);
          });
        }
        // 如果是文件夹递归调用复制该文件夹中的文件
        copyFiles(srcFile1, destFile1);
      } else {
        if (srcFile.name != '备份.js') {
          // 拼接源文件的路径
          const srcFileDir = path.resolve(src, srcFile.name);
          // 拼接复制目标文件路径
          const destFile = path.resolve(dest, srcFile.name);
          // 如果该路径下不存在同名文件则复制该文件
            fs.promises.copyFile(srcFileDir, destFile);
        }
      }
    });
  });
}


