import request from '@/utils/request';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/api/product-types', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(params.page, params.limit),
    }
  });
}

export function add(data = {}) {
  return request('/api/product-types', {
    method: 'POST',
    data
  });
}

export function update(data = {}) {
  return request(`/api/product-types/${data.id}`, {
    method: 'PUT',
    data
  });
}

export function remove(id) {
  return request(`/api/product-types/${id}`, {
    method: 'DELETE',
    parse: true
  });
}

export default get;