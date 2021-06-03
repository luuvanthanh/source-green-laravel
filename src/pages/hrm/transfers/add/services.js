import request from '@/utils/requestLavarel';

export function add(data = {}) {
  return request('/v1/transfers', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/transfers/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(data) {
  return request(`/v1/transfers/${data.id}`, {
    method: 'GET',
  });
}
