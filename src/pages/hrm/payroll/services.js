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

export function update(data) {
  return request(`/v1/payrolls/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function updateSalary(data) {
  return request(`/v1/payslip`, {
    method: 'POST',
    data,
  });
}

export function updateSalaryVn(data) {
  return request(`/v1/payroll-session-locals`, {
    method: 'POST',
    data,
  });
}

export function updateSalaryForeign(data) {
  return request(`/v1/payroll-session-foreigners`, {
    method: 'POST',
    data,
  });
}
