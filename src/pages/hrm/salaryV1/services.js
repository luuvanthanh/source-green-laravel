import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function get(data = {}) {
  return request('/v1/payrolls', {
    method: 'GET',
    params: {
      ...data,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      month: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.month,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
  });
}

export function getData(data = {}) {
  return request('/v1/payroll-group-by-branches', {
    method: 'GET',
    params: {
      ...data,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      month: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.month,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      employeeId: data.employeeId && data.employeeId.join(','),
      // include: Helper.convertIncludes(['payrollDetail.employee']),
    },
  });
}
