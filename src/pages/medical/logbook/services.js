import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request('/medicals/record-books', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(params.page, params.limit),
      appliedDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.appliedDate,
          targetValue: '23:59:59',
        }),
        isUTC: true,
      }),
    },
  });
}

export function update(data = {}) {
  return request('/medicals/update-medicine-time-status', {
    method: 'PUT',
    data,
  });
}
