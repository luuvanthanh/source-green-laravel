import request from '@/utils/request';
import { Helper } from '@/utils';

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
