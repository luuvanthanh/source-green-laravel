import request from '@/utils/requestLavarel';

export function get(params = {}) {
  return request('/v1/decision-number-samples', {
    method: 'GET',
    params,
  });
}

export function remove(id = {}) {
  return request(`/v1/decision-number-samples/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
