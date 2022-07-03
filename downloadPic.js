const download = require("download");
const axios = require("axios");
const fs = require("fs");
let headers = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
};
function sleep(time) {
  return new Promise((reslove) => setTimeout(reslove, time));
}
/**
 * @msg:
 * @param {*} skip 分页数，从哪一页开始
 * @param {*} requestJson 请求配置文件
 * @param {*} index requestJson中 第几个配置
 * @return {*}
 * @Descripttion:加载图片
 */
async function load(skip = 0, requestJson, index) {
  const request = requestJson[index];
  const dir = `${__dirname}/${request.dir}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const res = await axios
    .get(request.beautyUrl, {
      headers,
      params: {
        ...request.params,
        skip: skip,
      },
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
  await handleDiffRequest(res, request, dir);
  // await downloadFile(data, dir);
  await sleep(3000);
  if (skip < 10000) {
    load(skip + 30, requestJson, index);
  } else {
    console.log("下载完成");
  }
}

function isFileExisted(filePath) {
  return new Promise(function (resolve, reject) {
    fs.access(filePath, (err) => {
      if (err) {
        resolve("notexisted");
      } else {
        resolve("existed");
      }
    });
  });
}

async function handleDiffRequest(res, request, dir) {
  let data = {};
  if (request.type === "wallpaperGirl") {
    data = res.data.res.wallpaper;
    if (data.length === 0) {
      console.log("已无数据，退出程序");
      process.exit(1);
    }
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      const filename = item.id + ".jpeg";
      var res = await isFileExisted(`${dir}\\${filename}`);
      // Path at which image will get downloaded
      if (res === "existed") {
        console.log(`${dir}\\${filename}`, res, "continue");
        continue;
      }
      downloadFile(item.img, filename, dir);
    }
  } else {
    data = res.data.res.vertical;
    if (data.length === 0) {
      console.log("已无数据，退出程序");
      process.exit(1);
    }
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      const filename = item.id + ".jpeg";
      var res = await isFileExisted(`${dir}\\${filename}`);
      // Path at which image will get downloaded
      if (res === "existed") {
        console.log(`${dir}\\${filename}`, res, "continue");
        continue;
      }
      downloadFile(item.wp, filename, dir);
    }
  }
}

async function downloadFile(picUrl, filename, dir) {
  await download(picUrl, dir, {
    filename: filename,
    headers,
  }).then(() => {
    console.log(`Download ${filename} Completed`);
    return;
  });
}

// load();
module.exports = {
  downloadPic: load,
};
