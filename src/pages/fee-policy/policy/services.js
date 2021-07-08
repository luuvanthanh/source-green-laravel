import request from '@/utils/requestLavarel';

export function get(params = {}) {
  return request('/v1/fee-policies', {
    method: 'GET',
    params: {
      ...params
    },
  });
}
