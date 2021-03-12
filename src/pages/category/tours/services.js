import request from '@/utils/request';

export function get(params = {}) {
  return request('/api/products', {
    method: 'GET',
    params
  });
}

export function add(data = {}) {
  return request('/api/category/tour', {
    method: 'POST',
    data
  });
}

export default get;