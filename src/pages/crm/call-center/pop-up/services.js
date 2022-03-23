import request from '@/utils/requestCrm';

export function getToken(params = {}) {
  return request('/v1/token', {
    method: 'POST',
    params: {
      ...params,
    },
  });
}

export function getExtensions(params = {}) {
  return request('/v1/extensions', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
