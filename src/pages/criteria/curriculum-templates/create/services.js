import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request(`/curriculum-templates/${params.id}`, {
    method: 'GET',
  });
}

export function getToolGroups(params = {}) {
  return request('/tool-groups', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export function add(data = {}) {
  return request('/curriculum-templates', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/curriculum-templates/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/curriculum-templates/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
