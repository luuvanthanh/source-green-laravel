import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function add(data = {}) {
  return request('/news', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/news/${data.id}`, {
    method: 'PUT',
    data,
  });
}
