import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request('/distribution-logs', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
      from: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.from,
          targetValue: '00:00:00',
        }),
        isUTC: true,
      }),
      to: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.to,
          targetValue: '23:59:59',
        }),
        isUTC: true,
      }),
    },
  });
}
