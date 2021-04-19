import request from '@/utils/requestLogin';

export function add(data) {
  return request('/api/identity/roles', {
    method: 'POST',
    data,
  });
}

export function update(data) {
  return request(`/api/identity/roles/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(id) {
  return request(`/api/identity/roles/${id}`, {
    method: 'GET',
  });
}
