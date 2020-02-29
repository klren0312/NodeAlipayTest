# NodeJS对接支付宝沙箱

## 运行
先将`config.js.example`修改为`config.js`, 然后将需要的私钥和支付宝公钥填入, 修改`index.js`中初始化配置中`signType`为`RSA2`
随后运行下面命令即可

```bash
yarn
node index.js
```


---

# 文档

>最近想对接对接支付宝接口, 支付宝接口可以使用沙箱测试

## 一. 开启沙箱
可以访问开发者中心[https://openhome.alipay.com/platform/appDaily.htm?tab=info](https://openhome.alipay.com/platform/appDaily.htm?tab=info)
 进行认证后, 即可进入沙箱配置页
![image.png](https://upload-images.jianshu.io/upload_images/2245742-21c160beb3d82188.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 二. 配置密钥
### 1. 下载密钥生成工具
访问 [https://docs.open.alipay.com/291/105971](https://docs.open.alipay.com/291/105971)

![image.png](https://upload-images.jianshu.io/upload_images/2245742-1b6883748cd8b055.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 2.生成公钥私钥
![image.png](https://upload-images.jianshu.io/upload_images/2245742-63d04602920f6823.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


### 3.设置公钥
加签方式选择**公钥**
![image.png](https://upload-images.jianshu.io/upload_images/2245742-4c815cbf6cd26d6b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> **注意:** 由于我年轻的时候失误, 选了RSA2选成了证书, 没法对接node, 所以我代码只能用RSA来进行, 不过截图可以用别人的
![image.png](https://upload-images.jianshu.io/upload_images/2245742-3047e4b0d759c473.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**输入公钥后, 会生成一个支付宝公钥, 后面代码需要使用**
![image.png](https://upload-images.jianshu.io/upload_images/2245742-4a91c5f33d811e25.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 三. NodeJS请求支付接口
### 1. 初始化项目
```bash
mkdir payTest
yarn init -y
```

### 2. 安装依赖
官方提供了NodeJS的服务端SDK
前往[https://docs.open.alipay.com/54/103419](https://docs.open.alipay.com/54/103419)查看

```bash
yarn add alipay-sdk
```

### 3.查看要用到的接口
由于我们用的是PC支付, 对应的[文档](https://docs.open.alipay.com/270/105898/)中提示我们可以使用`alipay.trade.page.pay`接口来实现

`alipay.trade.page.pay`接口的必填参数如下,
![](https://upload-images.jianshu.io/upload_images/2245742-1a198677d7f76f4d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 4.代码编写
```js
const AlipaySdk = require('alipay-sdk').default
const AlipayFormData = require('alipay-sdk/lib/form').default

// 初始化插件
const alipaySdk = new AlipaySdk({
  appId: '2016100100639372',
  gateway: 'https://openapi.alipaydev.com/gateway.do',
  signType: 'RSA', // 注意这里默认是RSA2, 但是我自己只能用RSA, 所以是RSA, 正常不要配置
  privateKey: '刚刚你使用工具生成的私钥',
  alipayPublicKey: '刚刚你使用公钥在沙箱页面生成的支付宝公钥'
})

async function pay () {
  const formData = new AlipayFormData()
  // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
  formData.setMethod('get')
  // 配置回调接口
  formData.addField('notifyUrl', 'http://www.zzes1314.cn')
  // 设置参数
  formData.addField('bizContent', {
    outTradeNo: '1582976759798',
    productCode: 'FAST_INSTANT_TRADE_PAY',
    totalAmount: '0.01',
    subject: '商品',
    body: '商品详情',
  });
  // 请求接口
  const result = await alipaySdk.exec(
    'alipay.trade.page.pay',
    {},
    { formData: formData },
  );

  // result 为可以跳转到支付链接的 url
  console.log(result);
}

pay()

```

### 5. 运行结果
可以看到命令行打印了返回的跳转链接
![image.png](https://upload-images.jianshu.io/upload_images/2245742-b422e687409d4194.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

访问可以看到沙箱的支付环境
![image.png](https://upload-images.jianshu.io/upload_images/2245742-bf2c2ee6db3b236c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这是使用沙箱的账号登录支付即可
![image.png](https://upload-images.jianshu.io/upload_images/2245742-ddc1d121bd642f58.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![image.png](https://upload-images.jianshu.io/upload_images/2245742-18da2b9814123c7b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 四. 一些小问题
当我们配置好公钥的时候可以来检验下是否可以正常验签
![image.png](https://upload-images.jianshu.io/upload_images/2245742-f96ffe31d90746d2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
这里可以通过它提示下载签名工具, 但是由于签名工具是用java语言开发，所以工具的左边文本框要输入PKCS8格式的私钥文本信息。
如果您使用非java开发语言，请先将生成的私钥转换成PKCS8格式的私钥，再将PKCS8格式的私钥文本信息输入工具左边输入框。

所以我们要把私钥在`支付宝开放平台助手`里进行转换后再进行签名
![image.png](https://upload-images.jianshu.io/upload_images/2245742-ad6505255a43e83d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

然后复制生成的私钥进行签名
![image.png](https://upload-images.jianshu.io/upload_images/2245742-7aca2887020d4fd2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

最后放入验证, 通过既是可以了

## 参考资料
 - [支付宝网站支付接入](https://docs.open.alipay.com/270/105899/)
 - [开放平台文档中心](https://docs.open.alipay.com/api_1/alipay.trade.page.pay)
 - [螃蟹和骆驼先生Yvan写的JAVA支付宝沙箱对接](https://www.jianshu.com/p/a86e747079c1)

