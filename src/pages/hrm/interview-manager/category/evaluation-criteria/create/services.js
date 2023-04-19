import request from '@/utils/requestLavarel';

export function add(data = {}) {
  return request('/v1/evaluation-criterias-interview', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/evaluation-criterias-interview/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
    },
  });
}

export function getData(params = {}) {
  return request(`/v1/evaluation-criterias-interview/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
