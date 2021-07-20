import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request('/medicals', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
      creationTimeFrom: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.creationTimeFrom,
          targetValue: '00:00:00',
        }),
        isUTC: true,
      }),
      creationTimeTo: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.creationTimeTo,
          targetValue: '23:59:59',
        }),
        isUTC: true,
      }),
    },
  });
}
