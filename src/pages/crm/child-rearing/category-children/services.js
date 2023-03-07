import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/post-knowledge-to-teach-childrens', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/post-knowledge-to-teach-childrens/${id}`, {
    method: 'DELETE',
    parse: true,
    data: {
      id,
    },
  });
}
