import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request('/water-bottles', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function getWaterBottles(params = {}) {
  return request(`/water-bottles/${params.studentId}/by-student`, {
    method: 'GET',
    params: {
      ...params,
    },
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
