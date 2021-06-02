import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function get(data = {}) {
  return request('/v1/sabbatical-leaves', {
    method: 'GET',
    params: {
      limit: data.limit,
      page: data.page,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      timeJoin: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.timeJoin,
          targetValue: '00:00:00',
        }),
        isUTC: false,
      }),
      timeStart: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.timeStart,
          targetValue: '23:59:59',
        }),
        isUTC: false,
      }),
      include: Helper.convertIncludes(['employee']),
      fullName: data.fullName,
    },
  });
}

export function remove(id) {
  return request(`/v1/sabbatical-leaves/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
