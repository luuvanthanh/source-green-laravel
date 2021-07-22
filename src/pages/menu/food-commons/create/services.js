import request from '@/utils/request';

export function get(params = {}) {
  return request(`/food-commons/${params.id}`, {
    method: 'GET',
  });
}

export function add(data = {}) {
  return request('/food-commons', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/food-commons/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/food-commons/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
