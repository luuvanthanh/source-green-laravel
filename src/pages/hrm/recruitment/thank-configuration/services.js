import request from '@/utils/requestLavarel';

export function add(data = {}) {
  return request('/v1/configure-thanks', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function details() {
  return request(`/v1/configure-thanks`, {
    method: 'GET',
  });
}
