import request from '@/utils/request';
import { Helper, variables } from '@/utils';

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
    parse: true,
    editNotification: true,
    cancelNotification: true,
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
    editNotification: true,
    cancelNotification: true,
  });
}

export function merge(data) {
  return request(`/posts/merge`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function getRecordedFiles(params = {}) {
  return request('/recorded-files', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export function removeRecordFiles(data) {
  return request('/recorded-files/delete-list', {
    method: 'DELETE',
    data,
    parse: true,
    editNotification: true,
    cancelNotification: true,
  });
}

export default get;
