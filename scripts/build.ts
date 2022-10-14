/**
 * 复制文件
 */
import path from 'path';
import url from 'url';
import fse from 'fs-extra';
import chalk from 'chalk';
import minify from './_minify';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

console.log(chalk.blue('确保输出文件夹...'));
const distPath = path.join(__dirname, '../lib');
fse.ensureDirSync(distPath);
fse.emptyDirSync(distPath);

// 递归复制所有源文件路径
console.log(chalk.blue('开始复制文件...'));
const srcPath = path.join(__dirname, '../src');
const copyFolder = (src: string, dst: string) => {
  fse.ensureDirSync(dst);
  fse.readdirSync(src).forEach((file) => {
    const srcFile = path.join(src, file);
    const dstFile = path.join(dst, file);
    if (fse.statSync(srcFile).isDirectory()) {
      copyFolder(srcFile, dstFile);
    } else {
      const { content, outfile } = minify(srcFile, dstFile);
      if (content) {
        fse.writeFileSync(outfile, content);
      } else {
        fse.copyFileSync(srcFile, outfile);
      }
    }
  });
};
copyFolder(srcPath, distPath);

// 生成入口
function desc(str: string) {
  return str.replace(/\\/g, '/').replace(/\/\//g, '/');
}
function name(str: string) {
  return str.replace(/-/g, '_').replace(/\./g, '_');
}

console.log(chalk.blue('开始生成 JS 入口...'));
let template = '';
const genFolderHTML = (folder: string) => {
  fse.readdirSync(folder).forEach((file) => {
    const filePath = path.join(folder, file);
    if (fse.statSync(filePath).isDirectory()) {
      genFolderHTML(filePath);
    } else {
      template += `export * as ${name(path.basename(file))} from './${desc(
        path.relative(distPath, filePath)
      )}';\n`;
    }
  });
};
genFolderHTML(distPath);
fse.writeFileSync(path.join(distPath, 'index.js'), template.trim());

console.log(chalk.green('复制文件完成'));
