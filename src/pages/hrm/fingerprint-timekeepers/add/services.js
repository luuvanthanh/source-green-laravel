import request from '@/utils/requestLavarel';

export function getAbsentTypes() {
  return request(`/v1/fingerprint-timekeepers`, {
    method: 'GET',
  });
}

export function add(data) {
  return request('/v1/fingerprint-timekeepers', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function update(data) {
  return request(`/v1/fingerprint-timekeepers/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(id) {
  return request(`/v1/fingerprint-timekeepers/${id}`, {
    method: 'GET',
  });
}
