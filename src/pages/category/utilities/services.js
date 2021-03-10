import request from '@/utils/request';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/api/utilities', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function add(data = {}) {
  return request('/api/utilities', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/api/utilities/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/api/utilities/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export default get;
