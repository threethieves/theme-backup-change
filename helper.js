const fs = require('fs').promises;
const fsConstants = require('fs').constants;

const encodeStr = (originalData) => {
    // 2. 将 JSON 对象转为字符串
    const jsonStr = JSON.stringify(originalData);

    // 3. 用 TextEncoder 将字符串转为 UTF-8 字节数组（处理中文等多字节字符）
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(jsonStr);

    // 4. 将字节数组转为二进制字符串（每个字节对应一个字符）
    let binaryStr = '';
    for (let i = 0; i < uint8Array.length; i++) {
        binaryStr += String.fromCharCode(uint8Array[i]);
    }

    // 5. 用 btoa 编码为 Base64 字符串
    const base64Result = btoa(binaryStr);
    return base64Result
} 

const decodeStr = (base64Str) => {
    // 1. 用 atob 解码 Base64，得到二进制字符串（每个字符对应一个字节）
    const binaryStr = atob(base64Str);

    // 2. 将二进制字符串转换为 Uint8Array（字节数组）
    const uint8Array = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
        uint8Array[i] = binaryStr.charCodeAt(i);
    }

    // 3. 用 TextDecoder 将字节数组解码为 UTF-8 字符串（支持中文）
    const decoder = new TextDecoder('utf-8');
    const jsonStr = decoder.decode(uint8Array);

    // 4. 解析为 JSON 对象
    const result = JSON.parse(jsonStr);
    return result
}

async function checkFileExists(filePath) {
    try {
      // 检查文件是否可访问（F_OK 表示仅检查存在性）
      await fs.access(filePath, fsConstants.F_OK);
    //   console.log(`文件 ${filePath} 存在`);
      return true;
    } catch (err) {
      // 捕获 "文件不存在" 错误
      console.log(`文件 ${filePath} 不存在`);
      return false;
    }
}

module.exports = {
    encodeStr,
    decodeStr,
    checkFileExists
}