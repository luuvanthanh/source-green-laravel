import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/status-parent-leads', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/status-parent-leads/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}