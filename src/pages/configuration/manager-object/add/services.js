import request from '@/utils/request';

export function add(data = {}) {
  return request('/v1/student-objects', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/manager-level/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/manager-level/${data.id}`, {
    method: 'GET',
  });
}
