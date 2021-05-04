import request from '@/utils/request';

export function get({ id, ...params }) {
  return request(`/posts/${id}`, {
    method: 'GET',
    params,
  });
}

export function remove(params) {
  return request(`/posts/${params.id}`, {
    method: 'DELETE',
    parse: true,
  });
}
