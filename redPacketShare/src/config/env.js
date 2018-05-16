/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * 
 */

let baseUrl = '';
let routerMode = 'history';
let imgBaseUrl = '';
if (process.env.NODE_ENV == 'development') {
  baseUrl = "http://wyb.yindantech.com:8883/onlineRetailers-web";
} else if (process.env.NODE_ENV == 'production') {
  routerMode = 'hash';
  baseUrl = "http://wyb.yindantech.com";
  // baseUrl="http://198.168.3.50:8080/onlineRetailers-web";
}

export {
  baseUrl,
  routerMode,
  imgBaseUrl
}
