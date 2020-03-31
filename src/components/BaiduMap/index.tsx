import {
  BaiduMapManager,
  MapView,
  MapTypes,
  Geolocation,
  Overlay,
  MapApp,
} from 'react-native-baidu-map';
BaiduMapManager.initSDK('kYTGRTS84pG1FuymHZ1bk0uF4ezGeDyB');

export interface Position {
  latitude?: number;
  longitude?: number;
  province?: string;
  city?: string;
  district?: string;
  address?: string;
  streetName?: string;
  cityCode?: string;
  name?: string;
}

export const defaultPosition = {
  longitude: 116.465175,
  latitude: 39.938522,
};

export interface MapStatusChangeParams {
  target: {
    latitude: number;
    longitude: number;
  };
}

export async function getCurrentPosition(): Promise<Position> {
  return await Geolocation.getCurrentPosition();
}

let mapStatusChangetimeoutId: number | undefined;
export function onMapStatusChange(
  params: MapStatusChangeParams,
  callback: (position: Position) => void,
) {
  mapStatusChangetimeoutId && clearTimeout(mapStatusChangetimeoutId);
  mapStatusChangetimeoutId = setTimeout(async () => {
    const {latitude, longitude} = params.target;
    callback(await Geolocation.reverseGeoCode(latitude, longitude));
  }, 500);
}

export {BaiduMapManager, MapView, MapTypes, Geolocation, Overlay, MapApp};
