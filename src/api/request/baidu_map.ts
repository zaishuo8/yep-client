import {Position} from '../../components/BaiduMap';
import {fetchWithTimeout} from '../../lib/fetchWithTimeout';

export interface Community {
  id: number;
  name: string;
  img: string;
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
      `http://api.map.baidu.com/place/v2/search?query=美食$购物$酒店$旅游景点$休闲娱乐$交通设施$生活服务&location=${lat},${lon}&radius=2000&output=json&ak=daIKDkz9PRqU7slQ6dKTtw2cEiONo3cY&scope=2&filter=sort_name:distance|sort_rule:1&page_size=${page_size}&page_num=${page_num}`,
      {timeout: 5000},
    );
    const json = await result.json();
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
