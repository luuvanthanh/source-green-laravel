import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function getUsers() {
  return request('/v1/users', {
    method: 'GET',
  });
}

export function getShifts() {
  return request('/v1/shifts', {
    method: 'GET',
    params: {
      include: Helper.convertIncludes(['user', 'shift']),
    },
  });
}

export function add(data) {
  return request('/v1/work-declarations', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function update(data) {
  return request(`/v1/work-declarations/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(id) {
  return request(`/v1/work-declarations/${id}`, {
    method: 'GET',
    params: {
      include: 'shiftDetail',
    },
  });
}
