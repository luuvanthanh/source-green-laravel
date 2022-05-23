import request from '@/utils/requestLavarel';
import requestNet from '@/utils/request';
import { Helper } from '@/utils';
import { omit } from 'lodash';

export function add(data = {}) {
  return request('/v1/charge-old-students', {
    method: 'POST',
    data,
  });
}

export function details(data = {}) {
  return request(`/v1/charge-old-students/${data?.id}`, {
    method: 'GET',
    params: {
      ...data,
      include: Helper.convertIncludes([
        'tuition',
        'schoolYear',
        'student.classStudent.class'
      ]),
    },
  });
}

export function update(data = {}) {
  return request(`/v1/charge-old-students/${data?.id}`, {
    method: 'PUT',
    data,
  });
}

export function getAllMoneyFeePolicies(params = {}) {
  return request('/v1/money-fee-policies', {
    method: 'GET',
    params
  });
}

export function moneyFeePolicies(params = {}) {
  return request('/v1/money-fee-policies', {
    method: 'GET',
    params,
  });
}

export function getStudent(params = {}) {
  return requestNet('/students', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
      classStatus: params.class ? 'HAS_CLASS' : 'ALL',
    },
  });
}

export function get(params = {}) {
  return request('/v1/fees', {
    method: 'GET',
    params: {
      ...params
    },
  });
}
