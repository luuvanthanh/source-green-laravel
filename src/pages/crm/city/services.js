import request from '@/utils/requestCrm';

export function get(data = {}) {
  return request('/v1/citys', {
    method: 'GET',
    params: {
      ...data,
      limit: data.limit,
      page: data.page,
      orderBy: 'created_at',
      sortedBy: 'desc',
      searchJoin: 'and',
    },
  });
}