import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request(`/student-criterias/${params.studentId}/by-student`, {
    method: 'GET',
    params: {
      ...params,
      reportDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.reportDate,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
  });
}

export function getCriteriaGroupProperties(params = {}) {
  return request('/criteria-group-properties', {
    method: 'GET',
    params: {
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
      groupName: 'Sức khỏe',
    },
  });
}

export function update(data = {}) {
  return request('/student-criterias', {
    method: 'PUT',
    data,
  });
}
