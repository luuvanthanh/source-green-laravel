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

export default get;
