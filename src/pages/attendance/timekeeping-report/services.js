import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function get(data = {}) {
  return request('/v1/attendances', {
    method: 'GET',
    params: {
      limit: data.limit,
      page: data.page,
      orderBy: 'Id',
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
      include: Helper.convertIncludes(['timekeeping', 'class', 'attendance']),
      search: Helper.convertParamSearchConvert({
        FullName: data.fullName,
      }),
    },
  });
}

export function add(data) {
  return request('/v1/attendances', {
    method: 'POST',
    data: data,
    params: {
      include: Helper.convertIncludes(['timekeeping', 'class', 'attendance']),
    },
  });
}
