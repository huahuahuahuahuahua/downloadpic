# node-图片爬虫

请求接口路径：https://www.jianshu.com/p/fb1d1ad58a0b

实现效果：

![image-20220703152511500](./img/image-20220703152511500.png)

![image-20220703152532593](./img/image-20220703152532593.png)

## how to use

```js
node index.js
```

会自动创建文件夹，然后下载文件下来

## 项目结构 tree

```js
├───request.json ---请求配置
├───downloadPic ---下载图片的包
├───downloadZHIHUPic ---下载知乎的，已弃用
└───index ---主入口
```

## 搭建过程

`download` 是 npm 大神 [sindresorhus](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fkevva%2Fdownload%2Fcommits%3Fauthor%3Dsindresorhus "https://github.com/kevva/download/commits?author=sindresorhus") 写的，非常好用

```js
npm install download
```

下面是从网站下载图片的代码。下载函数接收文件和文件路径。

```js
const download = require("download");

// Url of the image
const file = "GFG.jpeg";
// Path at which image will get downloaded
const filePath = `${__dirname}/files`;

download(file, filePath).then(() => {
  console.log("Download Completed");
});
```

完整代码请查看 github 仓库：

[downloadpic](https://github.com/huahuahuahuahuahua/downloadpic)

欢迎访问我的其他项目：
[md 文件转换为 pdf](https://juejin.cn/post/7115433895041957925)

[GitBook Introduction 教程](https://juejin.cn/post/7115072679127810079)

[使用 mdx 开发一个酷炫的 ppt](https://juejin.cn/post/7100230419013959710)

[学习用 ts+gulp+rollup 写一个工具库](https://juejin.cn/post/7083911355509506055)
