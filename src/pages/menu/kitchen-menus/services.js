import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request('/kitchen-menus', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
      // date: Helper.getDateTime({
      //   value: Helper.setDate({
      //     ...variables.setDateData,
      //     originValue: params.date,
      //     targetValue: '23:59:59',
      //   }),
      //   isUTC: false,
      // }),
    },
  });
}

export function remove(id) {
  return request(`/kitchen-menus/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
