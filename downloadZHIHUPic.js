let path = require("path");
let fs = require("fs");
let rp = require("request-promise");
let originUrl = "https://www.zhihu.com";
// 已弃用，知乎升级了
class Crawler {
  constructor(options) {
    // 构造函数中主要是一些属性的初始化
    const {
      dir = "./zhihuPic",
      proxyUrl = originUrl,
      questionId = "49364343",
      offset = 0,
      limit = 100,
      timeout = 10000,
    } = options;
    // 非代理模式下请求知乎的原始url默认是 https://www.zhihu.com
    this.originUrl = originUrl;
    // 代理模式下请求的实际路径, 这里默认也是https://www.zhihu.com
    // 当你的电脑ip被封了之后，可以通过代理服务器，请求知乎，而我们是向代理服务器获取数据
    this.proxyUrl = proxyUrl;
    // 请求的最终url
    this.uri = `${proxyUrl}/api/v4/questions/${questionId}/answers?limit=${limit}&offset=${offset}&include=data%5B%2A%5D.is_normal%2Cadmin_closed_comment%2Creward_info%2Cis_collapsed%2Cannotation_action%2Cannotation_detail%2Ccollapse_reason%2Cis_sticky%2Ccollapsed_by%2Csuggest_edit%2Ccomment_count%2Ccan_comment%2Ccontent%2Ceditable_content%2Cvoteup_count%2Creshipment_settings%2Ccomment_permission%2Ccreated_time%2Cupdated_time%2Creview_info%2Crelevant_info%2Cquestion%2Cexcerpt%2Crelationship.is_authorized%2Cis_author%2Cvoting%2Cis_thanked%2Cis_nothelp%3Bdata%5B%2A%5D.mark_infos%5B%2A%5D.url%3Bdata%5B%2A%5D.author.follower_count%2Cbadge%5B%3F%28type%3Dbest_answerer%29%5D.topics&sort_by=default`;
    // 是否已经是最后的数据
    this.isEnd = false;
    // 知乎的帖子id
    this.questionId = questionId;
    // 设置请求的超时时间（获取帖子答案和下载图片的超时时间目前相同）
    this.timeout = timeout;
    // 解析答案后获取的图片链接
    this.imgs = [];
    // 图片下载路径的根目录
    this.dir = dir;
    // 根据questionId和dir拼接的最终图片下载的目录
    this.folderPath = "";
    // 已下载的图片的数量
    this.downloaded = 0;
    // 初始化方法
    this.init();
  }

  async init() {
    if (this.isEnd) {
      console.log("已经全部下载完成, 请欣赏");
      return;
    }
    // 获取帖子答案
    let { isEnd, uri, imgs, question } = await this.getAnswers();

    this.isEnd = isEnd;
    this.uri = uri;
    this.imgs = imgs;
    this.downloaded = 0;
    this.question = question;
    console.log(imgs, imgs.length);
    // 创建图片下载目录
    this.createFolder();
    // 遍历下载图片
    this.downloadAllImg(() => {
      // 当前请求回来的所有图片都下载完成之后，继续请求下一波数据
      if (this.downloaded >= this.imgs.length) {
        setTimeout(() => {
          console.log("休息3秒钟继续下一波");
          this.init();
        }, 3000);
      }
    });
  }
  // 获取答案
  async getAnswers() {
    let { uri, timeout } = this;
    let response = {};

    try {
      const { paging, data } = await rp({ uri, json: true, timeout });
      const { is_end: isEnd, next } = paging;
      const { question } = Object(data[0]);
      // 将多个答案聚合到content中
      const content = data.reduce((content, it) => content + it.content, "");
      // 匹配content 解析图片url
      const imgs = this.matchImg(content);

      response = {
        isEnd,
        uri: next.replace(originUrl, this.proxyUrl),
        imgs,
        question,
      };
    } catch (error) {
      console.log("调用知乎api出错,请重试");
      console.log(error);
    }

    return response;
  }
  // 匹配字符串，从中找出所有的图片链接
  matchImg(content) {
    let imgs = [];
    let matchImgOriginRe = /<img.*?data-original="([^"\?]*?)[?"]/g;

    content.replace(matchImgOriginRe, ($0, $1) => imgs.push($1));

    return [...new Set(imgs)];
  }
  // 创建文件目录
  createFolder() {
    let { dir, questionId } = this;
    let folderPath = `${dir}/${questionId}`;
    let dirs = [dir, folderPath];

    dirs.forEach((dir) => !fs.existsSync(dir) && fs.mkdirSync(dir));

    this.folderPath = folderPath;
  }
  // 遍历下载图片
  downloadAllImg(cb) {
    let { folderPath, timeout } = this;
    this.imgs.forEach((imgUrl) => {
      let fileName = path.basename(imgUrl);
      let filePath = `${folderPath}/${fileName}`;

      rp({ uri: imgUrl, timeout })
        .on("error", () => {
          console.log(`${imgUrl} 下载出错`);
          this.downloaded += 1;
          cb();
        })
        .pipe(fs.createWriteStream(filePath))
        .on("close", () => {
          this.downloaded += 1;
          console.log(`${imgUrl} 下载完成`);
          cb();
        });
    });
  }
}

module.exports = (payload = {}) => {
  return new Crawler(payload);
};
