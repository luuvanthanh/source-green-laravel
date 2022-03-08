import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/v1/assessment-periods', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes([
        'classes',
        'branch',
        'nameAssessmentPeriod',
        'schoolYear'
      ]),
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/assessment-periods/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}