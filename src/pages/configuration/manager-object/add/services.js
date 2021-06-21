import request from '@/utils/requestLavarel';

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
  return request(`/v1/student-objects/${data?.id}`, {
    method: 'GET',
  });
}
