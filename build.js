const fs = require('fs').promises;
const path = require('path');
const { encodeStr, checkFileExists } = require('./helper.js');

const outputPath = path.join(__dirname, 'dist', 'extensions.data');
const list = require('./dist/data.js');

async function writeArrayToFile(array, filePath) {
    try {
        // 创建文件内容，格式化为模块导出
        const fileContent = JSON.stringify(array)
  
        // 确保目录存在
        const dir = path.dirname(filePath);
        const exists = await checkFileExists(dir);
        if (!exists) {
            await fs.mkdirSync(dir, { recursive: true });
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
    const res = list.map(item => {
        const {data, ...rest} = item
        if(data.visit !== undefined){
            data.visit = 0
        }
        const res = encodeStr(data)
        return {
            ...rest,
            data: res
        }
    })
    // 使用示例
    writeArrayToFile(res, outputPath)
}

init()