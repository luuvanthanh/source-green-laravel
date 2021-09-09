import request from '@/utils/request';

export function add(data) {
  return request('/roles', {
    method: 'POST',
    data,
  });
}

export function update(data) {
  return request(`/roles/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(params) {
  return request(`/roles/${params.id}`, {
    method: 'GET',
  });
}
