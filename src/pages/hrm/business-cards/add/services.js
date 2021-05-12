import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function getAbsentTypes(params = {}) {
  return request('/v1/absent-types', {
    method: 'GET',
    params: {
      ...params,
      Type: 'ABSENT',
    },
  });
}

export function getAbsentReasons(params = {}) {
  return request('/v1/absent-reasons', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getShiftUsers(params = {}) {
  return request(`/v1/shift-users/${params.employeeId}`, {
    method: 'GET',
    params: {
      ...params,
      startDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.startDate,
          targetValue: '00:00:00',
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      endDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.endDate,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
  });
}

export function add(data = {}) {
  return request('/v1/business-cards', {
    method: 'POST',
    data: {
      ...data,
      startDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.startDate,
          targetValue: '00:00:00',
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      endDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.endDate,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
  });
}

export function update(data = {}) {
  return request(`/v1/business-cards/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/v1/business-cards/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
