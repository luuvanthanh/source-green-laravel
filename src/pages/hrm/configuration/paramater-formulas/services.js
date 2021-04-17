import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function get(data = {}) {
  return request('/v1/paramater-formulas', {
    method: 'GET',
    params: {
      limit: data.limit,
      page: data.page,
      orderBy: 'id',
      sortedBy: 'desc',
      searchJoin: 'and',
      search: Helper.convertParamSearchConvert({
        name: data.name,
        type: data.type,
      }),
    },
  });
}

export function remove(id) {
  return request(`/v1/paramater-formulas/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
