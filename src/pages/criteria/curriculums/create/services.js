import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request(`/curriculums/${params.id}`, {
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
  return request('/curriculums', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/curriculums/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/curriculums/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
