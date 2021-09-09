import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request('/medicals/group-by-class', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit', 'date'),
      ...Helper.getPagination(params.page, params.limit),
      isReceived: params.isReceived === false ? 'false' : params.isReceived,
      from: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.date,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: true,
      }),
      to: Helper.getDateTime({
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

export function received(params = {}) {
  return request(`/medicals/${params.id}/is-received`, {
    method: 'PUT',
    parse: true,
  });
}
