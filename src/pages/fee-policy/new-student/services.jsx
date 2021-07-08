import request from '@/utils/requestLavarel';

export function get(params = {}) {
  return request('/v1/charge-students', {
    method: 'GET',
    params: {
      ...params
    },
  });
}
