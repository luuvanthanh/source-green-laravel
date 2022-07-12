import request from '@/utils/requestLavarel';

export function get(params = {}) {
  return request('/v1/number-form-contracts', {
    method: 'GET',
    params,
  });
}

export function remove(id = {}) {
  return request(`/v1/number-form-contracts/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
