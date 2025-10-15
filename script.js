const { execSync } = require('child_process'); 
const chalk = require('chalk')

async function runSequence() {
  try {
    console.log(chalk.green('开始执行 create.js...'));
    // 执行 dev.js，等待其完成
    await execSync('node create.js'); 
    console.log(chalk.green('create.js 执行完成！'));

    console.log(chalk.green('开始执行 build.js...'));
    // 执行 build.js，等待其完成
    await execSync('node build.js'); 
    console.log(chalk.green('build.js 执行完成！'));

    console.log(chalk.green('所有脚本执行完毕！'));
  } catch (error) {
    // 任何一个脚本执行失败（退出码非0），都会进入这里
    console.error('脚本执行失败：', error.message);
    process.exit(1); // 非0退出码表示执行失败
  }
}

// 启动执行
runSequence();
