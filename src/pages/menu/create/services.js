import request from '@/utils/request';

export function add(data = {}) {
  return request('/menus', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/menus/${data.id}`, {
    method: 'PUT',
    data,
  });
}
