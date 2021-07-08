import request from '@/utils/requestLavarel';

export function get(params = {}) {
  return request('/v1/class-types', {
    method: 'GET',
    params: {
      ...params
    },
  });
}
