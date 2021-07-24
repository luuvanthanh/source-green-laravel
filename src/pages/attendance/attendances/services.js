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
      date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.date,
          targetValue: '00:00:00',
        }),
        isUTC: false,
      }),
      include: Helper.convertIncludes([
        'timekeeping',
        'class',
        'attendance',
        'absent',
        'classStudent.class',
      ]),
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
