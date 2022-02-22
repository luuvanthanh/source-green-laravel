import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/students/by-condition', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
      StudentStatus: 'WITHDRAW_APPLICATION ',
    },
  });
}
