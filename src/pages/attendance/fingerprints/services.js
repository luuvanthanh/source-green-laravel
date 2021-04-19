import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function get(data = {}) {
  return request('/v1/fingerprints', {
    method: 'GET',
    params: {
      limit: data.limit,
      page: data.page,
      orderBy: 'id',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes(['store', 'shiftDetail']),
      search: Helper.convertParamSearchConvert({
        'user.full_name': data.full_name,
      }),
    },
  });
}

export function remove(data) {
  return request(`/v1/fingerprints/${data.id}`, {
    method: 'DELETE',
    parse: true,
  });
}
