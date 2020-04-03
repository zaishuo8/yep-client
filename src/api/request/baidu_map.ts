import {Position} from '../../components/BaiduMap';
import {fetchWithTimeout} from '../../lib/fetchWithTimeout';

export interface Community {
  id: number;
  name: string;
  img: string;
}

const querys = ['小区'];

let queryStr = '';
for (const q of querys) {
  queryStr = queryStr + q + '$';
}

/**
 * 获取附近 poi
 * */
export async function getNearbyPoi(
  lat: number,
  lon: number,
  page_size?: number,
  page_num?: number,
): Promise<Position[]> {
  try {
    const result = await fetchWithTimeout(
      `http://api.map.baidu.com/place/v2/search?query=${queryStr}&location=${lat},${lon}&radius=2000&output=json&ak=daIKDkz9PRqU7slQ6dKTtw2cEiONo3cY&scope=2&filter=sort_name:distance|sort_rule:1&page_size=${page_size}&page_num=${page_num}`,
      {timeout: 5000},
    );
    const json = await result.json();
    // console.log(json);
    if (json.status === 0) {
      return json.results.map(joi => ({
        name: joi.name,
        address: joi.address,
        latitude: joi.location.lat,
        longitude: joi.location.lng,
      }));
    } else {
      throw json;
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}

const ak = 'daIKDkz9PRqU7slQ6dKTtw2cEiONo3cY';

interface AddressWithPoiResult {
  location: {
    lat: number;
    lng: number;
  };
  sematic_description: string;
  formatted_address: string;
  pois: {
    name: string;
    addr: string;
    point: {
      x: number;
      y: number;
    };
  }[];
}

export function mapAddressWithPoiResultToPosition(
  result: AddressWithPoiResult,
) {
  return {
    latitude: result.location.lat,
    longitude: result.location.lng,
    name: result.sematic_description,
    address: result.formatted_address,
  };
}

export enum Coordtype {
  BaiDu = 'bd09ll', // 百度经纬度坐标
  BaiDuMeter = 'bd09mc', // 百度米制坐标
  China = 'gcj02ll', // 国测局经纬度坐标，仅限中国
  GPS = 'wgs84ll', // GPS经纬度
}

export async function getAddressWithPoi(
  lat: number,
  lng: number,
  options?: {coordtype?: Coordtype},
): Promise<AddressWithPoiResult> {
  try {
    const coordtype = (options && options.coordtype) || Coordtype.China;
    const result = await fetchWithTimeout(
      `http://api.map.baidu.com/reverse_geocoding/v3/?ak=${ak}&output=json&location=${lat},${lng}&radius=4000&coordtype=${coordtype}&extensions_poi=1`,
      {timeout: 5000},
    );
    const json = await result.json();
    console.log(json);
    if (json.status === 0) {
      return json.result;
    } else {
      throw json;
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}

// http://api.map.baidu.com/place/v2/suggestion?query=%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4&region=%E6%9D%AD%E5%B7%9E&output=json&ak=daIKDkz9PRqU7slQ6dKTtw2cEiONo3cY

export async function getSearchPois(query: {
  searchText: string;
  pageNo: number;
  pageSize: number;
}): Promise<Position[]> {
  const {searchText, pageSize, pageNo} = query;
  try {
    const result = await fetchWithTimeout(
      `http://api.map.baidu.com/place/v2/search?query=${searchText}&region=杭州&output=json&ak=${ak}&page_size=${pageSize}&page_num=${pageNo}`,
      {timeout: 5000},
    );
    const json = await result.json();
    console.log(json);
    if (json.status === 0) {
      return json.results.map(poi => ({
        name: poi.name,
        address: poi.address,
        latitude: poi.location.lat,
        longitude: poi.location.lng,
        province: poi.province,
        city: poi.city,
      }));
    } else {
      throw json;
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}
