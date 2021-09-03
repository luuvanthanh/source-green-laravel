import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper, variables } from '@/utils';

export function getConfigs(_params = {}) {
  return request('/configs/group-by-type', {
    method: 'GET',
    params: {
      type: 'MEDICAL',
    },
  });
}

export function get(params = {}) {
  return request('/medicals/group-by-class-time', {
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
