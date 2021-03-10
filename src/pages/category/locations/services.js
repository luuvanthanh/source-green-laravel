import request from '@/utils/request';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/api/locations', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(params.page, params.limit),
    }
  });
}

export function add(data = {}) {
  return request('/api/locations', {
    method: 'POST',
    data
  });
}

export function update(data = {}) {
  return request(`/api/locations/${data.id}`, {
    method: 'PUT',
    data
  });
}

export function remove(id) {
  return request(`/api/locations/${id}`, {
    method: 'DELETE',
    parse: true
  });
}

export default get;