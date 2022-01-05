import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request('/student-medical-problems', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit', 'date'),
      ...Helper.getPagination(params.page, params.limit),
      FromDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.date,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: true,
      }),
      ToDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.date,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: true,
      }),
    },
  });
}

export function remove(id = {}) {
  return request(`/student-medical-problems/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
