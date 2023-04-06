import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function add(data = {}) {
  return request('/time-tables/events', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/time-tables/events/${data?.id}`, {
    method: 'PUT',
    data,
  });
}

export function getStudents(params = {}) {
  return request('/students/get-with-parent-account', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
      studentStatus: 'OFFICAL',
    },
  });
}
