import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/category-relationships', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/category-relationships/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}