function isVideo(suffix: string): boolean {
  return /(mp4|flv|3gp|avi|rm|rmvb|wmv|mov)$/i.test(suffix);
}

export {isVideo};
