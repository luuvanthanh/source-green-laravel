import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function getUsers(params = {}) {
  return request('/v1/users', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function add(data = {}) {
  return request('/v1/add-sub-times', {
    method: 'POST',
    data: {
      ...data,
    },
  });
}

export function update(data = {}) {
  return request(`/v1/add-sub-times/${data.id}`, {
    method: 'PUT',
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

export function remove(id) {
  return request(`/v1/add-sub-times/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
