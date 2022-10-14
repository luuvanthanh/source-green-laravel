import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function getUsers(params = {}) {
  return request('/v1/employees', {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['positionLevel']),
    },
  });
}

export function getParamaterValues(params = {}) {
  return request(`/v1/paramater-values`, {
    method: 'GET',
    params,
  });
}

export function add(data = {}) {
  return request('/v1/salary-increases', {
    method: 'POST',
    data: {
      ...data,
      timeApply: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.timeApply,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      decisionDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.decisionDate,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
  });
}

export function update(data = {}) {
  return request(`/v1/salary-increases/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
      timeApply: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.timeApply,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      decisionDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.decisionDate,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
  });
}

export function details(data) {
  return request(`/v1/salary-increases/${data.id}`, {
    method: 'GET',
    parse: true,
  });
}
