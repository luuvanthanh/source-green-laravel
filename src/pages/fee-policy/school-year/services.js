import request from '@/utils/requestLavarel';

export function get(params = {}) {
  return request('/v1/school-years', {
    method: 'GET',
    params: {
      ...params
    },
  });
}
