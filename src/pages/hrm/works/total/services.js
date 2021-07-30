import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function get(data = {}) {
  return request('/v1/timekeeping-report', {
    method: 'GET',
    params: {
      ...data,
      limit: data.limit,
      page: data.page,
      searchJoin: 'and',
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      startDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.startDate,
          targetValue: '00:00:00',
        }),
        isUTC: false,
      }),
      endDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.endDate,
          targetValue: '23:59:59',
        }),
        isUTC: false,
      }),
      employeeId: data.employeeId && data.employeeId.join(','),
      include: Helper.convertIncludes(['positionLevel']),
    },
  });
}
