const fs = require('fs').promises;
const path = require('path');
const { decodeStr, checkFileExists } = require('./helper.js');

const outputPath = path.join(__dirname, 'dist', 'data.js');
const dataPath = path.join(__dirname, 'extensions.data');

/**
 * 解析.data文件中的数组字符串
 * @param {string} filePath - .data文件路径
 * @returns {Promise<Array>} 解析后的数组
 */
async function parseDataFileToArray(filePath) {
    try {
      // 1. 读取文件内容（字符串形式）
      // 注意：如果文件有特殊编码（如GBK），需指定编码参数，如 { encoding: 'gbk' }
      const content = await fs.readFile(filePath, 'utf8');
      
      // 2. 去除可能的空白字符（如首尾空格、换行）
      const trimmedContent = content.trim();
      
      // 3. 验证是否为数组格式（可选，但可提前发现错误）
      if (!trimmedContent.startsWith('[') || !trimmedContent.endsWith(']')) {
        throw new Error('文件内容不是有效的数组字符串（需以 [ 开头，以 ] 结尾）');
      }
      
      // 4. 解析为JavaScript数组
      const array = JSON.parse(trimmedContent);
      
      // 5. 确认解析结果是数组
      if (!Array.isArray(array)) {
        throw new Error('解析结果不是数组');
      }
      
      console.log(`成功解析数组，共 ${array.length} 个元素`);
      return array;
      
    } catch (error) {
      console.error('解析.data文件失败：', error.message);
      throw error; // 抛出错误供上层处理
    }
}

async function writeArrayToJsFile(array, filePath, exportName = 'data') {
    try {
        // 创建文件内容，格式化为模块导出
        const fileContent = `// 自动生成的JS文件
// 最后更新时间: ${new Date().toISOString()}
const ${exportName} = ${JSON.stringify(array, null, 2)};
  
module.exports = ${exportName};
`;
  
        // 确保目录存在
        const dir = path.dirname(filePath);
        const exists = await checkFileExists(dir);
        if (!exists) {
            await fs.mkdir(dir, { recursive: true });
        }
  
        // 写入文件
        await fs.writeFile(filePath, fileContent, 'utf8');
        console.log(`成功将数组写入文件: ${filePath}`);
        return true;
    } catch (error) {
        console.error('写入文件时出错:', error.message);
        return false;
    }
}

const init = async () => {
    const list = await parseDataFileToArray(dataPath)
    const res = list.map(item => {
        const {data, ...rest} = item
        const res = decodeStr(data)
        return {
            ...rest,
            data: res
        }
    })
    // 使用示例
    writeArrayToJsFile(res, outputPath)
}

init()