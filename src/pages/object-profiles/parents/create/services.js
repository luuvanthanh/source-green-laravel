import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function add(data = {}) {
  return request('/parents', {
    method: 'POST',
    data,
  });
}

export function addAccount(data = {}) {
  return request(`/parents/${data.id}/account`, {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/parents/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(data = {}) {
  return request(`/parents/${data.id}`, {
    method: 'GET',
  });
}

export function detailsAccount(data = {}) {
  return request(`/parents/${data.id}/account`, {
    method: 'GET',
  });
}

export function getEmployees() {
  return request(`/employees`, {
    method: 'GET',
    params: {
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}
