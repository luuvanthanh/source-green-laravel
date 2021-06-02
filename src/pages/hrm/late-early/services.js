import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function get(data = {}) {
  return request('/v1/late-early', {
    method: 'GET',
    params: {
      limit: data.limit,
      page: data.page,
      type: data.type,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
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
      include: Helper.convertIncludes(['timekeeping', 'lateEarlyConfig', 'employee']),
      fullName: data.fullName,
    },
  });
}
