import request from '@/utils/request';

export function get(params = {}) {
  return request('/configs/by-type', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function remove(id) {
  return request(`/configs/by-type/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
