import request from '@/utils/requestLavarel';

export function get(params = {}) {
  return request(`/v1/refunds`, {
    method: 'GET',
    params,
  });
}
