import request from '@/utils/requestLavarel';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/v1/employees', {
    method: 'GET',
    params: {
      limit: params.limit,
      page: params.page,
      orderBy: 'Id',
      sortedBy: 'desc',
      searchJoin: 'and',
    },
  });
}

export function add(data = {}) {
  return request('/v1/employees', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/employees/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/v1/employees/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export default get;
