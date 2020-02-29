const AlipaySdk = require('alipay-sdk').default
const AlipayFormData = require('alipay-sdk/lib/form').default
const config = require('./config')

const alipaySdk = new AlipaySdk({
  appId: '2016100100639372',
  gateway: 'https://openapi.alipaydev.com/gateway.do',
  signType: 'RSA',
  privateKey: config.privateKey,
  alipayPublicKey: config.alipayPublicKey
})

async function pay () {
  const formData = new AlipayFormData();
  // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
  formData.setMethod('get');

  formData.addField('notifyUrl', 'http://www.zzes1314.cn');
  formData.addField('bizContent', {
    outTradeNo: '1582976759798',
    productCode: 'FAST_INSTANT_TRADE_PAY',
    totalAmount: '0.01',
    subject: '商品',
    body: '商品详情',
  });

  const result = await alipaySdk.exec(
    'alipay.trade.page.pay',
    {},
    { formData: formData },
  );

  // result 为可以跳转到支付链接的 url
  console.log(result);
}

pay()
