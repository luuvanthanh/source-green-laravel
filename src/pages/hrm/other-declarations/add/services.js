import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function getUsers(params = {}) {
  return request('/v1/employees', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getAbsentTypes() {
  return request(`/v1/absent-types`, {
    method: 'GET',
  });
}

export function getParamaterValues() {
  return request(`/v1/paramater-values`, {
    method: 'GET',
    params: {
      type: 'DECLARE',
      search: Helper.convertParamSearchConvert({
        Type: 'DECLARE',
      }),
    },
  });
}
export function getParamaterValuesTypeContract() {
  return request(`/v1/paramater-values`, {
    method: 'GET',
    params: {
      type: 'CONTRACT',
      search: Helper.convertParamSearchConvert({
        Type: 'CONTRACT',
      }),
    },
  });
}

export function add(data = {}) {
  return request('/v1/other-declarations', {
    method: 'POST',
    data: {
      ...data,
      time: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.time,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
  });
}

export function update(data = {}) {
  return request(`/v1/other-declarations/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
      time: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.time,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
  });
}

export function details(data) {
  return request(`/v1/other-declarations/${data.id}`, {
    method: 'GET',
    params: {
      include: Helper.convertIncludes([
        'otherDeclarationDetail.employee',
        'changeContractParameter.employee',
      ]),
    },
    parse: true,
  });
}
