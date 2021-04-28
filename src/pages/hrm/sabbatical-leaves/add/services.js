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
  return request('/v1/sabbatical-leaves', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/sabbatical-leaves/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(data) {
  return request(`/v1/sabbatical-leaves/${data.id}`, {
    method: 'GET',
  });
}
