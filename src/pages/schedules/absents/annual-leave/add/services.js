import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function getAbsentTypes(params = {}) {
  return request('/v1/absent-types', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getAbsentReasons(params = {}) {
  return request('/v1/absent-reasons', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getUsers(params = {}) {
  return request('/v1/users', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function add(data = {}) {
  return request('/v1/absents', {
    method: 'POST',
    data: {
      ...data,
      start_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.start_date,
          targetValue: '00:00:00',
        }),
        isUTC: false,
      }),
      end_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.end_date,
          targetValue: '23:59:59',
        }),
        isUTC: false,
      }),
    },
  });
}

export function update(data = {}) {
  return request(`/v1/product-types/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/v1/product-types/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
