import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function getUsers() {
  return request('/v1/employees', {
    method: 'GET',
  });
}

export function getAbsentTypes() {
  return request(`/v1/absent-types`, {
    method: 'GET',
  });
}

export function add(data) {
  return request('/v1/bus-registrations', {
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
    parse: true,
  });
}

export function update(data) {
  return request(`/v1/bus-registrations/${data.id}`, {
    method: 'PUT',
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
    parse: true,
  });
}

export function details(id) {
  return request(`/v1/bus-registrations/${id}`, {
    method: 'GET',
    params: {
      include: 'shiftDetail',
    },
  });
}
