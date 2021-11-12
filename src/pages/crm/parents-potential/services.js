import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/status-parent-potentials', {
    method: 'GET',
    params: {
      ...params
    },
  });
}


export function remove(id = {}) {
  return request(`/v1/status-parent-potentials/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}