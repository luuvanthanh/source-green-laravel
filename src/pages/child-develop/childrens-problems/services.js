import request from '@/utils/requestLavarel';

export function get(params = {}) {
  return request('/v1/category-child-issues', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/category-child-issues/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}