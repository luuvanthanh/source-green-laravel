import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/v1/subjects', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes([
        'childEvaluateDetail.childEvaluateDetailChildren',
        'categorySkill',
      ]),
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/subjects/${id}`, {
    method: 'DELETE',
    parse: true,
    cancelNotification: true,
  });
}
