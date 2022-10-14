// #!/usr/bin/env zx
/**
 * 推送新数据
 */
import chalk from 'chalk';
import { $ } from 'zx';

// 防止 Windows 上会产生意外的引号 $'' 转译
$.quote = (s) => s;

// 发布新版本
const note = `${new Date().toISOString()}`;
try {
  await $`git add .`;
  await $`git commit -m "${note}"`;
  await $`git pull --rebase -X theirs`;
  await $`git push origin`;
} catch (e) {
  console.error(e);
  console.log(chalk.red('无法提交最新文件'));
  process.exit(1);
}
console.log(chalk.green(`已提交最新文件`));
