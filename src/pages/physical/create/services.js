import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/student-criterias/physical', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function getStudents(params = {}) {
  return request('/students/get-for-physical', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function getPhysical(params = {}) {
  return request('/criteria-group-properties', {
    method: 'GET',
    params: {
      ...params,
      type: 'PHYSICAL',
    },
  });
}

export function add(data = {}) {
  return request('/student-criterias/physical', {
    method: 'PUT',
    data,
  });
}

export default get;
