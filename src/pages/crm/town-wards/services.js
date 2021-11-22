import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/town-wards', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/town-wards/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}