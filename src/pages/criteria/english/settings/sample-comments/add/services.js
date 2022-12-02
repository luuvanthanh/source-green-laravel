import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function add(data = {}) {
  return request('/v1/sample-comments', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/sample-comments/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
    },
    parse: true,
  });
}

export function getData(params = {}) {
  return request(`/v1/sample-comments/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['sampleCommentDetail']),
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/sample-comments/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
