// // new Crawler().init();
// require("./downloadZHIHUPic")({
//   dir: "./imgs", // 图片存放位置
//   questionId: "34078228", // 知乎帖子id，比如https://www.zhihu.com/question/49364343/answer/157907464，输入49364343即可
//   proxyUrl: "https://www.zhihu.com", // 当请求知乎的数量达到一定的阈值的时候，会被知乎认为是爬虫（好像是封ip），这时如果你如果有一个代理服务器来转发请求数据，便又可以继续下载了。
// });
const { downloadPic } = require("./downloadPic");
const requestJson = require("./request.json");
// 0 gril,1 man 2 设计 3 视觉 4 壁纸girl 空
downloadPic(0, requestJson, 4);
