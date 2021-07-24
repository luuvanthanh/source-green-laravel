import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function get(data = {}) {
  return request('/v1/attendances', {
    method: 'GET',
    params: {
      ...data,
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
      include: Helper.convertIncludes(['class', 'attendance', 'classStudent.class']),
    },
  });
}

export function add(data) {
  return request('/v1/attendances', {
    method: 'POST',
    data,
    params: {
      include: Helper.convertIncludes(['timekeeping', 'class', 'attendance']),
    },
  });
}
