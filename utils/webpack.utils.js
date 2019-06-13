const fs = require('fs')
const path = require('path')
module.exports = {
    // 扫描文件夹
    fileDisplay(filePath) {
        //根据文件路径读取文件，返回文件列表
        fs.readdir(filePath, function (err, files) {
            if (err) {
                console.warn(err)
            } else {
                //遍历读取到的文件列表
                files.forEach(function (filename) {
                    //获取当前文件的绝对路径
                    var filedir = path.join(filePath, filename);
                    //根据文件路径获取文件信息，返回一个fs.Stats对象
                    fs.stat(filedir, function (eror, stats) {
                        if (eror) {
                            console.warn('获取文件stats失败');
                        } else {
                            var isFile = stats.isFile();//是文件
                            var isDir = stats.isDirectory();//是文件夹
                            if (isFile) {
                                // console.log(filedir);
                                // // 读取文件内容
                                // var content = fs.readFileSync(filedir, 'utf-8');
                                // console.log(content);
                            }
                            if (isDir) {
                                // fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                                console.log(filename)
                            }
                        }
                    })
                });
            }
        });
    },
    clearConsole() {
        process.stdout.write(
            process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
        );
    }

}