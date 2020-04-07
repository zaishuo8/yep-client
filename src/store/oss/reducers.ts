import {Media, MediaType} from '../../components/MdeiaList';

export const StartUploadingType = 'StartUploadingType';
export const EndUploadingType = 'EndUploadingType';

export interface OssState {
  uploading: boolean;
  cover: Media; // 封面: 图片或视频路径
}

const initialState: OssState = {
  uploading: false,
  cover: {type: MediaType.Image, url: ''},
};

export function ossReducer(
  state: OssState = initialState,
  action: {type: string; cover: string},
): OssState {
  switch (action.type) {
    case StartUploadingType:
      return Object.assign({}, state, {uploading: true, cover: action.cover});
    case EndUploadingType:
      return initialState;
    default:
      return state;
  }
}
