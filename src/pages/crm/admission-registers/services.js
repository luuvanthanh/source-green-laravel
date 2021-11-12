import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/status-admission-registers', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/status-admission-registers/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}