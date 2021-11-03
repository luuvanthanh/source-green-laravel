import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/branches', {
    method: 'GET',
    params: {
      ...params
    },
  });
}
