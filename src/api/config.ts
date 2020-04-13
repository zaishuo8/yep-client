interface Host {
  env?: string;
  host?: string;
}

const env = 'dev';
const host: Host = {};

const config = {
  dev: {
    host: 'http://192.168.0.106:7001',
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
  // 帖子
  submitPosting: '/posting', // 发帖
  getPostings: '/posting', // 获取帖子
  submitComment: '/posting/comment', // 回复
  getOnePosting: '/posting/one', // 获取单个帖子
  // 用户
  getCurrentUser: '/user', // 获取当前用户
};

// @ts-ignore
Object.assign(host, config[env]);

// @ts-ignore
export default host;
export {api, env};
