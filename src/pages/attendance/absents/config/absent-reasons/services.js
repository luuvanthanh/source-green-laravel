import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function get(data = {}) {
  return request('/v1/absent-reasons', {
    method: 'GET',
    params: {
      limit: data.limit,
      page: data.page,
      orderBy: 'id',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes(['absentType']),
      search: Helper.convertParamSearchConvert({}),
    },
  });
}

export function remove(id) {
  return request(`/v1/absent-reasons/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
