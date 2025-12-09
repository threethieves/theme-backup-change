const fs = require('fs').promises;
const path = require('path');
const { encodeStr, checkFileExists } = require('./helper.js');
// const { writeArrayToJsFile } = require('./create.js');

const outputPath = path.join(__dirname, 'dist', 'extensions.data');
const list = require('./dist/data.js');
// const outputAfterPath = path.join(__dirname, 'dist', 'after-data.js');

async function writeArrayToFile(array, filePath) {
    try {
        // 创建文件内容，格式化为模块导出
        const fileContent = JSON.stringify(array)
  
        // 确保目录存在
        const dir = path.dirname(filePath);
        const exists = await checkFileExists(dir);
        if (!exists) {
            await fs.mkdir(dir, { recursive: true });
        }
  
        // 写入文件
        await fs.writeFile(filePath, fileContent, 'utf8');
        console.log(`成功将数据写入文件: ${filePath}`);
        return true;
    } catch (error) {
        console.error('写入文件时出错:', error.message);
        return false;
    }
}

const init = () => {
    const dataRes = []
    list.forEach(item => {
        const { data } = item

        if(data.visit !== undefined){
            data.visit = 0
        }
        if(data?.metadata?.annotations){
            const stats = data.metadata.annotations['content.halo.run/stats']

            if(stats){
                const statsData = JSON.parse(stats)
                if(statsData.visit !== undefined){
                    statsData.visit = 0
                    data.metadata.annotations['content.halo.run/stats'] = JSON.stringify(statsData)
                }
            }
        }
        const res = encodeStr(data)

        item.data = res
        dataRes.push(item)
        /* const { data } = item
        const res = encodeStr(data)

        item.data = res
        dataRes.push(item) */
    })
    // 使用示例
    writeArrayToFile(dataRes, outputPath)
}

init()