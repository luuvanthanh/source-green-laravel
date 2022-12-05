import request from '@/utils/requestLavarel';

export function get(params = {}) {
  return request('/v1/evaluation-criterias', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/evaluation-criterias/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
