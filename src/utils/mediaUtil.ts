export function isVideo(suffix: string): boolean {
  return /(mp4|flv|3gp|avi|rm|rmvb|wmv|mov)$/i.test(suffix);
}

export function resizeOssImgSize(
  url: string,
  option?: {size?: number; style?: {width: number; height: number}},
): string {
  let w = 32;
  let h = 32;
  if (option && option.size) {
    w = option.size;
    h = option.size;
  } else if (option && option.style) {
    w = option.style.width;
    h = option.style.height;
  }
  return `${url}?x-oss-process=image/resize,m_lfit,w_${w * 2},h_${h * 2}`;
}
