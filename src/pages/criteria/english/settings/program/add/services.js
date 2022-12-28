import request from '@/utils/request';

export function add(data = {}) {
  return request('/program', {
    method: 'POST',
    data,
    cancelNotification: true,
  });
}

export function update(data = {}) {
  return request(`/program/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
    },
    parse: true,
    cancelNotification: true,
  });
}

export function getData(params = {}) {
  return request(`/program/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function remove(id = {}) {
  return request(`/program/${id}`, {
    method: 'DELETE',
    parse: true,
    cancelNotification: true,
  });
}
