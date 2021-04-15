import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function add(data = {}) {
  return request('/classes', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function update(data = {}) {
  return request(`/classes/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/classes/${data.id}`, {
    method: 'GET',
  });
}

export function getBranches(params = {}) {
  return request('/branches', {
    method: 'GET',
    params: {
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}
