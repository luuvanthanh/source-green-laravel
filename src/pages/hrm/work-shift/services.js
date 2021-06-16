import request from '@/utils/requestLavarel';

export function get(data = {}) {
  return request('/v1/division-shifts', {
    method: 'GET',
    params: {
      ...data,
      limit: data.limit,
      page: data.page,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
    },
  });
}

export function remove(id) {
  return request(`/v1/division-shifts/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
