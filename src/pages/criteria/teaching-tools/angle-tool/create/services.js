import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function getToolDetails(params = {}) {
  return request('/tool-details', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export function get(params = {}) {
  return request(`/tool-groups/${params.id}`, {
    method: 'GET',
  });
}

export function add(data = {}) {
  return request('/tool-groups', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/tool-groups/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/tool-groups/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
