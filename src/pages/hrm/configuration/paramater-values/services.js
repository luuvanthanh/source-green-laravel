import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function get(data = {}) {
  return request('/v1/paramater-values', {
    method: 'GET',
    params: {
      limit: data.limit,
      page: data.page,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      search: Helper.convertParamSearchConvert({
        Name: data.name,
        Type: data.type,
      }),
    },
  });
}

export function remove(id) {
  return request(`/v1/paramater-values/${id}`, {
    method: 'DELETE',
    data: {
      id,
    },
    parse: true,
  });
}
