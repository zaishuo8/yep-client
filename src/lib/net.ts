import {AsyncStorage, Platform} from 'react-native';
import Asrn from '../asrn_ui';
import {fetchWithTimeout} from './fetchWithTimeout';

async function get(url: string, query?: object) {
  try {
    if (query) url += `?${join(query)}`;
    return await http(url, 'GET');
  } catch (e) {
    throw e;
  }
}

async function post(url: string, body?: object, options?: {query?: object}) {
  try {
    if (options && options.query) url += `?${join(options.query)}`;
    return await http(url, 'POST', body);
  } catch (e) {
    throw e;
  }
}

async function put(url: string, body?: object, options?: {query?: object}) {
  try {
    if (options && options.query) url += `?${join(options.query)}`;
    return await http(url, 'PUT', body);
  } catch (e) {
    throw e;
  }
}

async function http(url: string, method: string, body?: object) {
  try {
    const token = (await AsyncStorage.getItem('x-application-token')) || '';
    const userId = (await AsyncStorage.getItem('x-application-user-id')) || '';
    // const appVersion = await NativeAppInfo.getAppVersionName() || '1.0.0';
    let options: RequestInit = {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // 'x-application-token': token,
        // 'x-application-user-id': userId,

        'x-application-token': 'ooo-xxx-aaa-ccc-222-888',
        'x-application-user-id': '35789014',

        'x-application-os': Platform.OS,
        'x-application-version': '1.0.0',
      },
      // @ts-ignore
      timeout: 10000,
    };
    if (method === 'POST' || method === 'PUT') {
      options.body = body ? JSON.stringify(body) : '{}';
    }

    console.log(url);
    console.log(options);

    const result = await fetchWithTimeout(url, options);
    const json = await result.json();

    console.log(json);

    // @ts-ignore
    if (json.code === '10000') {
      return json.result;
    } else {
      throw json;
    }
  } catch (e) {
    Asrn.toast(e.message || '非业务错误');
    throw e;
  }
}

function join(query: object): string {
  let result = '';
  const keys = Object.keys(query);
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    // @ts-ignore
    if (query[key] === null || query[key] === undefined) {
      continue;
    }
    if (index === 0) {
      // @ts-ignore
      result += `${key}=${query[key]}`;
    } else {
      // @ts-ignore
      result += `&${key}=${query[key]}`;
    }
  }
  return result;
}

export {get, post, put, http};
