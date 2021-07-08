import request from '@/utils/requestLavarel';

export function get(params = {}) {
  return request('/v1/student-objects', {
    method: 'GET',
    params: {
      ...params
    },
  });
}
