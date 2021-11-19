import request from '@/utils/requestCrm';

export function add(data = {}) {
  return request('/v1/category-events', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/category-events/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/v1/category-events/${data.id}`, {
    method: 'GET',
  });
}

export function remove(id = {}) {
  return request(`/v1/category-events/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
