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
      date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.date,
          targetValue: '00:00:00',
        }),
        isUTC: false,
      }),
      include: Helper.convertIncludes(['timekeeping', 'class', 'attendance', 'absent']),
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
