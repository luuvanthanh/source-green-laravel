import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function get(data = {}) {
  return request('/v1/labours-contracts', {
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
      include: Helper.convertIncludes(['employee', 'typeOfContract', 'position', 'branch']),
      search: Helper.convertParamSearchConvert({
        'employee.FullName': data.fullName,
        type: data.type,
      }),
    },
  });
}

export function remove(id) {
  return request(`/v1/labours-contracts/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
