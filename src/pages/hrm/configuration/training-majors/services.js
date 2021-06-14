import request from '@/utils/requestLavarel';

export function get(data = {}) {
  return request('/v1/training-majors', {
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
  return request(`/v1/training-majors/${id}`, {
    method: 'DELETE',
    data: {
      id,
    },
    parse: true,
  });
}
