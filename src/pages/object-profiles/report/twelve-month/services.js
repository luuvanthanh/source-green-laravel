import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/students/group-by-branch', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
      LimitStudiedMonths : 6,
      IsMore: 'false',
      StudiedMonths: 12,
    },
  });
}