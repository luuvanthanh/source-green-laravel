import request from '@/utils/requestLavarel';

export function add(data = {}) {
  return request('/v1/student-objects', {
    method: 'POST',
    data,
  });
}

export function details(data = {}) {
  return request(`/v1/student-objects/${data?.id}`, {
    method: 'GET',
  });
}
