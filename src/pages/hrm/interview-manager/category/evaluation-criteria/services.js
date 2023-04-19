import request from '@/utils/requestLavarel';

export function get(params = {}) {
  return request('/v1/evaluation-criterias-interview', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/evaluation-criterias-interview/${id}`, {
    method: 'DELETE',
    parse: true,
    data: {
      id,
    },
  });
}
