import request from '@/utils/requestCrm';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/v1/fee-policies', {
    method: 'GET',
    params: {
      page: params.page,
      limit: params.limit,
      from: params.from,
      to: params.to,
      include: Helper.convertIncludes(['schoolYear', 'branch']),
    },
  });
}
