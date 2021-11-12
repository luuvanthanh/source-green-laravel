import request from '@/utils/requestCrm';

export function add(data = {}) {
  return request('/v1/category-relationships', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/category-relationships/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/v1/category-relationships/${data.id}`, {
    method: 'GET',
  });
}

export function remove(id = {}) {
  return request(`/v1/category-relationships/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
