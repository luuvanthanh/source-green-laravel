import request from '@/utils/request';
import requestLavarel from '@/utils/requestLavarel';
import { omit } from 'lodash';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request('/news', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
      fromDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.fromDate,
          targetValue: '00:00:00',
        }),
        isUTC: false,
      }),
      toDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.toDate,
          targetValue: '23:59:59',
        }),
        isUTC: false,
      }),
    },
  });
}

export function getBranches(params = {}) {
  return requestLavarel('/v1/branches', {
    method: 'GET',
    params,
  });
}

export function getClasses(params = {}) {
  return request('/classes', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export function remove(params = {}) {
  return request(`/news/${params.id}`, {
    method: 'DELETE',
    parse: true,
    editNotification: true,
    cancelNotification: true,
  });
}
