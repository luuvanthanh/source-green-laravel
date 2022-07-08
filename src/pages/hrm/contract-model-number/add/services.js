import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function add(data = {}) {
  return request('/v1/number-form-contracts', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/number-form-contracts`, {
    method: 'PUT',
    params: {
      id: data.id,
    },
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/v1/number-form-contracts/${data.id}`, {
    method: 'GET',
    params: {
      ...data,
      orderBy: 'created_at',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes(['Symptoms', 'symptoms']),
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/number-form-contracts/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
