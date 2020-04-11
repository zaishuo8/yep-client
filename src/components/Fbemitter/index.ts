const {EventEmitter} = require('fbemitter');
const emitter = new EventEmitter();

export enum CustomEvent {
  OssProgress = 'OssProgress', // 自定义的进度事件，加权照片数量的进度
  HomeFresh = 'HomeFresh', // 首页刷新事件
}

export default emitter;
