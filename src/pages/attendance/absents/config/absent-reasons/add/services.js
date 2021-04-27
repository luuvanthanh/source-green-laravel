import request from '@/utils/requestLavarel';

export function getAbsentTypes() {
  return request(`/v1/absent-type-students`, {
    method: 'GET',
  });
}

export function add(data) {
  return request('/v1/absent-reason-students', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function update(data) {
  return request(`/v1/absent-reason-students/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(id) {
  return request(`/v1/absent-reason-students/${id}`, {
    method: 'GET',
  });
}
