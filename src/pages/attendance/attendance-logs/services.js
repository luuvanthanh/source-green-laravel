import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function get(data = {}) {
  return request('/v1/attendance-logs', {
    method: 'GET',
    params: {
      ...data,
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
      limit: data.limit,
      page: data.page,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes([
        'employee.positionLevelNow',
        'employee.classTeacher.class',
        'attendance',
      ]),
      search: Helper.convertParamSearchConvert({}),
    },
  });
}

export function getPositions(_params = {}) {
  return request('/v1/positions', {
    method: 'GET',
    params: {
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}
