import request from '@/utils/requestLavarel';

export function getUsers(params = {}) {
  return request('/v1/employees', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function add(data = {}) {
  return request('/v1/holidays', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/holidays/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(data) {
  return request(`/v1/holidays/${data.id}`, {
    method: 'GET',
  });
}
