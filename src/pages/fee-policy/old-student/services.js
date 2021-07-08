import request from '@/utils/requestLavarel';

export function get(params = {}) {
  return request('/v1/fees', {
    method: 'GET',
    params: {
      ...params
    },
  });
}
