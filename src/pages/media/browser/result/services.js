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
    data,
  });
}

export function remove({ id }) {
  return request(`/posts/${id}`, {
    method: 'DELETE',
  });
}

export function removeImage({ postId, fileId }) {
  return request(`/posts/${postId}/files/${fileId}`, {
    method: 'DELETE',
  });
}

export function removeAll(data) {
  return request(`/posts/delete-list`, {
    method: 'DELETE',
    data,
    parse: true,
  });
}

export function merge(data) {
  return request(`/posts/merge`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export default get;
