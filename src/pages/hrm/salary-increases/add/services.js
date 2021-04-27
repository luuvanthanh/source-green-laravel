import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function getUsers(params = {}) {
  return request('/v1/employees', {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['positionLevel']),
    },
  });
}

export function getParamaterValues() {
  return request(`/v1/paramater-values`, {
    method: 'GET',
  });
}

export function add(data = {}) {
  return request('/v1/salary-increases', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/salary-increases/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(data) {
  return request(`/v1/salary-increases/${data.id}`, {
    method: 'GET',
    parse: true,
  });
}
