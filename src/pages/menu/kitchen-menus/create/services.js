import request from '@/utils/request';

export function get(params = {}) {
  return request(`/kitchen-menus/${params.id}`, {
    method: 'GET',
  });
}

export function add(data = {}) {
  return request('/kitchen-menus', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/kitchen-menus/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/kitchen-menus/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
