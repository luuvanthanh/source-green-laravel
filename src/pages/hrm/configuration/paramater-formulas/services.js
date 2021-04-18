import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function get(data = {}) {
  return request('/v1/paramater-formulas', {
    method: 'GET',
    params: {
      limit: data.limit,
      page: data.page,
      orderBy: 'Id',
      sortedBy: 'desc',
      searchJoin: 'and',
      search: Helper.convertParamSearchConvert({
        Name: data.name,
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
