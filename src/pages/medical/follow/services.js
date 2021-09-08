import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper, variables } from '@/utils';

export function getConfigs(_params = {}) {
  return request('/configs/group-by-type', {
    method: 'GET',
    params: {
      type: 'MEDICAL',
      invisible: 'false',
    },
  });
}

export function get(params = {}) {
  return request('/medicals/group-by-class-time', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit', 'date'),
      ...Helper.getPagination(params.page, params.limit),
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
  return request(`/medicals/${params.id}/medicine-time-type/${params.medicineTimeTypeId}`, {
    method: 'PUT',
    params: {
      ...params,
      date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.date,
          targetValue: '23:59:59',
        }),
        isUTC: true,
      }),
    },
    parse: true,
  });
}
