import request from '@/utils/requestLavarel';

export function add(data = {}) {
  return request('/v1/config-notifications', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function update(data = {}) {
  return request(`/v1/branches/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details() {
  return request(`/v1/employee-birthday`, {
    method: 'GET',
  });
}
