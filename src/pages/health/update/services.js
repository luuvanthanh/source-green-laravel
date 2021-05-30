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

export function getCriteriaGroupProperties() {
  return request('/criteria-group-properties', {
    method: 'GET',
    params: {
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
      type: 'HEALTH',
    },
  });
}

export function update(data = {}) {
  return request('/student-criterias', {
    method: 'PUT',
    data,
  });
}

export function waterBottles(data) {
  return request('/water-bottles', {
    method: 'PUT',
    params: {
      reportDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.reportDate,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
    data: data.data,
  });
}

export function getWaterBottles(params = {}) {
  return request(`/water-bottles/${params.studentId}/by-student`, {
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
