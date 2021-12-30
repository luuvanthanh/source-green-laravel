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

export default get;
