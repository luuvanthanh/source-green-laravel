import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/student-timetable-reviews/by-group-date', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function getStudents(params = {}) {
  return request('/students', {
    method: 'GET',
    params : {
      ...params,
      MaxResultCount : 1000
    },
  });
}

export function getSubject(params = {}) {
  return request('/timetable-activities/details', {
    method: 'GET',
    params : {
      ...params,
      MaxResultCount : 1000
    },
  });
}