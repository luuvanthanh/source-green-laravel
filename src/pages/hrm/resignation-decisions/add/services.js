import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function getUsers(params = {}) {
  return request('/v1/employees', {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['positionLevel']),
    },
  });
}

export function add(data = {}) {
  return request('/v1/resignation-decisions', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/resignation-decisions/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(data) {
  return request(`/v1/resignation-decisions/${data.id}`, {
    method: 'GET',
  });
}
