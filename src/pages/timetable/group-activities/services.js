import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/timetable-activities', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function remove(id) {
  return request(`/timetable-activities/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export default get;
