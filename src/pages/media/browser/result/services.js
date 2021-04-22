import request from '@/utils/request';

export function get(params = {}) {
  return request('/posts', {
    method: 'GET',
    params,
  });
}

export function validate(data) {
  return request('/posts/send', {
    method: 'PUT',
    data
  });
}

export default get;
