import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function get(data = {}) {
  return request('/v1/fingerprints', {
    method: 'GET',
    params: {
      limit: data.limit,
      page: data.page,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes(['shiftDetail']),
      search: Helper.convertParamSearchConvert({
        'employee.FullName': data.fullName,
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
