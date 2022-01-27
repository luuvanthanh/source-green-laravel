import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/students/group-by-branch', {
    method: 'GET',
    params: {
      ReportWithHealthCriterias: true,
      ...omit(params, 'page', 'limit', 'date'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function remove(id = {}) {
  return request(`/student-medical-problems/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
