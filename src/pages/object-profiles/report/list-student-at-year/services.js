import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/students/group-by-branch', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
      ReportWithHealthCriterias : 'false',
    },
  });
}

export function getYears(params = {}) {
  return request('/timetable-settings', {
    method: 'GET',
    params,
  });
}