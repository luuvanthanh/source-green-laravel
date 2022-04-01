import { Helper } from '@/utils';
import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/history-calls', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'created_at',
      sortedBy: 'desc',
      include: Helper.convertIncludes([
        'employee',
        'employee.extension',
        'customerLead',
        'managerCall',
      ]),
    },
  });
}
