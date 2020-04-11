import {get} from '../../lib/net';
import config, {api} from '../config';

export interface User {
  id: number;
  name: string;
  phone: string;
  avatars: string;
}

/**
 * 获取当前用户
 * */
export async function getCurrentUser(): Promise<User[]> {
  try {
    return await get(`${config.host}${api.getCurrentUser}`);
  } catch (e) {
    throw e;
  }
}
