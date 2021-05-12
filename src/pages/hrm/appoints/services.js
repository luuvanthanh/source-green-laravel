import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function get(data = {}) {
  return request('/v1/appoints', {
    method: 'GET',
    params: {
      limit: data.limit,
      page: data.page,
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
      include: Helper.convertIncludes(['employee', 'addSubTimeDetail.user']),
      search: Helper.convertParamSearchConvert({
        'employee.FullName': data.fullName,
      }),
    },
  });
}

export function remove(id) {
  return request(`/v1/appoints/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
