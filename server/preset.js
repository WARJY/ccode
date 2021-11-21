const fs = require('fs');
const { is } = require('cutil')

module.exports = {
    add: async function (data) {
        let content = `export default ${JSON.stringify(data)}`
        // 文件生成
        let fileName = `${__dirname}/../src/preset/${data.name}.js`
        fs.writeFileSync(fileName, content)
        console.log("文件生成成功")

        return Promise.resolve(true)
    }
}