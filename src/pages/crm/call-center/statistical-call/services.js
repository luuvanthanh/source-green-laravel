import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/class-types', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

export function getClassByAge(params = {}) {
  return request('/v1/class-types', {
    method: 'GET',
    params: {
      ...params
    },
  });
}
