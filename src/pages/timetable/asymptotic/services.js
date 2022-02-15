import { Helper } from '@/utils';
import request from '@/utils/request';
import { omit } from 'lodash';

export function get(params = {}) {
  return request('/student-timetable-asymptotics', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function getYears(params = {}) {
  return request('/timetable-settings', {
    method: 'GET',
    params
  });
}

export function remove(data = {}) {
  return request(`/student-timetable-asymptotics/delete-multiple`, {
    method: 'DELETE',
    params: data,
    parse: true
  });
}

export function create(data = {}) {
  return request(`/student-timetable-asymptotics/create-multiple`, {
    method: 'POST',
    data
  });
}