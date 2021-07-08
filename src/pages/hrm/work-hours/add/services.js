import request from '@/utils/requestLavarel';

export function getUsers() {
  return request('/v1/employees', {
    method: 'GET',
  });
}

export function getAbsentTypes() {
  return request(`/v1/absent-types`, {
    method: 'GET',
    params: {
      type: 'ADD_TIME',
    },
  });
}

export function add(data) {
  return request('/v1/work-hours', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function update(data) {
  return request(`/v1/work-hours/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(id) {
  return request(`/v1/work-hours/${id}`, {
    method: 'GET',
    params: {
      include: 'shiftDetail',
    },
  });
}
