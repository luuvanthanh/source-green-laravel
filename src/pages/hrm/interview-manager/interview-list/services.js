import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/test', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/test/${id}`, {
    method: 'DELETE',
    parse: true,
    data: {
      id,
    },
  });
}
