import request from '@/utils/requestLavarel';

export function getUsers(params = {}) {
  return request('/v1/employees', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getAbsentTypes() {
  return request(`/v1/absent-types`, {
    method: 'GET',
  });
}

export function add(data = {}) {
  return request('/v1/other-declarations', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/other-declarations/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(data) {
  return request(`/v1/other-declarations/${data.id}`, {
    method: 'GET',
    parse: true,
  });
}
