import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request('/menus', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
      fromDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.fromDate,
          targetValue: '00:00:00',
        }),
        isUTC: true,
      }),
      toDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.toDate,
          targetValue: '23:59:59',
        }),
        isUTC: true,
      }),
    },
  });
}

export default get;
