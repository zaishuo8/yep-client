export function fetchWithTimeout(url, options) {
  const timeout = options.timeout;

  delete options.timeout;

  return new Promise((resolve, reject) => {
    if (typeof timeout === 'number') {
      setTimeout(() => { reject(new Error('请求超时')) }, timeout);
    }

    fetch(url, options).then(resolve, reject);
  })
}
