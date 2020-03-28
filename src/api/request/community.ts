import {get} from '../../lib/net';
import config, {api} from '../config';

export interface Community {
  id: number;
  name: string;
  img: string;
}

/**
 * 获取圈子
 * */

export async function getCommunityList(): Promise<Community[]> {
  try {
    return await get(`${config.host}${api.getCommunityList}`);
  } catch (e) {
    throw e;
  }
}
