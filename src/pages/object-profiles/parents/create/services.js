import request from '@/utils/request';
import requestLogin from '@/utils/requestLogin';
import { omit } from 'lodash';
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
    data: { ...omit(data, 'id') },
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

export function updateStatus(data = {}) {
  return request(`/parents/${data.id}/update-status?status=${data.status}`, {
    method: 'PUT',
    data,
  });
}

export function faceRegistration(data = {}) {
  return request(`/parents/${data.id}/face-registration`, {
    method: 'POST',
    data,
  });
}

export function changePassword(data = {}) {
  return requestLogin(`/api/account/check-password`, {
    method: 'POST',
    data,
  });
}
