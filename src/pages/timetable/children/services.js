import request from '@/utils/request';
import { omit } from 'lodash';

export function get(params = {}) {
  return request('/timetables/detail-by-conditions', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
    },
  });
}

export function remove(params = {}) {
  return request(`/time-tables/${params.id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export default get;
