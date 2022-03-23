import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/extensions', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
