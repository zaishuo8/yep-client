interface Host {
  env?: string;
  host?: string;
}

const env = 'dev';
const host: Host = {};

const config = {
  dev: {
    host: 'http://192.168.2.147:7001',
  },
  test: {
    host: 'http://test.jzb.web.asman.com.cn',
  },
  prod: {
    host: 'https://ironcattle.asman.com.cn',
  },
};

const api = {
  getCommunityList: '/communities', // 获取圈子
};

// @ts-ignore
Object.assign(host, config[env]);

// @ts-ignore
export default host;
export {api, env};
