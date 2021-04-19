import request from '@/utils/requestLavarel';

export function getAbsentTypes() {
  return request(`/v1/absent-types`, {
    method: 'GET',
  });
}

export function add(data) {
  return request('/v1/absent-reasons', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function update(data) {
  return request(`/v1/absent-reasons/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(id) {
  return request(`/v1/absent-reasons/${id}`, {
    method: 'GET',
  });
}
