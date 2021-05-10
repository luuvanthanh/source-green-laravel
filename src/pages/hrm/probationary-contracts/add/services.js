import request from '@/utils/requestLavarel';

export function add(data = {}) {
  return request('/v1/probationary-contracts', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/probationary-contracts/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(data) {
  return request(`/v1/probationary-contracts/${data.id}`, {
    method: 'GET',
  });
}
