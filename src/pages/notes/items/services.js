import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request('/notes', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
      from: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.from,
          targetValue: '00:00:00',
        }),
        isUTC: true,
      }),
      to: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.to,
          targetValue: '23:59:59',
        }),
        isUTC: true,
      }),
    },
  });
}

export function add(data = {}) {
  return request('/notes', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/notes/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/notes/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
