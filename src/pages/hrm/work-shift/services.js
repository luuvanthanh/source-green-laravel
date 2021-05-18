import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function get(data = {}) {
  return request('/v1/division-shifts', {
    method: 'GET',
    params: {
      limit: data.limit,
      page: data.page,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      search: Helper.convertParamSearchConvert({
        Name: data.name,
      }),
    },
  });
}

export function remove(id) {
  return request(`/v1/division-shifts/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
