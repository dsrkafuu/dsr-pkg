/**
 * 优化文件
 */
import fse from 'fs-extra';

function minify(srcfile: string, destfile: string) {
  // JSON
  if (/\.json$/i.test(srcfile)) {
    const json = fse.readJSONSync(srcfile);
    const minified = JSON.stringify(json);
    const outfile = destfile.replace(/\.json$/i, '.min.json');
    return {
      content: minified,
      outfile,
    };
  }
  // 其他
  else {
    return {
      content: null,
      outfile: destfile,
    };
  }
}

export default minify;
