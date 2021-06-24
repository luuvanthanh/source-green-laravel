import request from '@/utils/requestLavarel';

export function add(data = {}) {
  return request('/v1/fee-policies', {
    method: 'POST',
    data,
  });
}

export function details(params = {}) {
  return request(`/v1/fee-policies/${params.id}`, {
    method: 'GET',
    params
  });
}
