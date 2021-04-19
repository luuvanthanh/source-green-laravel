import request from '@/utils/request';

export function get({ id, ...params }) {
  return request(`/posts/${id}`, {
    method: 'GET',
    params
  });
}
