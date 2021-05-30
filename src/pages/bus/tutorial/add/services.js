import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function getBusInformations(params = {}) {
  return request('/bus-informations', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export function get(params = {}) {
  return request(`/bus-routes/${params.id}`, {
    method: 'GET',
  });
}

export function add(data = {}) {
  return request('/bus-routes', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/bus-routes/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/bus-routes/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
