import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function get(data = {}) {
  return request('/v1/absent-types', {
    method: 'GET',
    params: {
      limit: data.limit,
      page: data.page,
      orderBy: 'id',
      sortedBy: 'desc',
      searchJoin: 'and',
      search: Helper.convertParamSearchConvert({
        name: data.name,
      }),
    },
  });
}

export function remove(id) {
  return request(`/v1/absent-types/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
