import request from '@/utils/request';

export function add(data = {}) {
  return request('/sensitive-periods/set-config', {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details() {
  return request(`/sensitive-periods/get-config`, {
    method: 'GET',
  });
}
