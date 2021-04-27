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
  return request('/v1/insurrances', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/insurrances/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(id) {
  return request(`/v1/insurrances/${id}`, {
    method: 'GET',
    parse: true,
  });
}
