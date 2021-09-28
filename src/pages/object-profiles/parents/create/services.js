import request from '@/utils/request';
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

export function updateAccount(data = {}) {
  return request(`/parents/${data.id}/account`, {
    method: 'PUT',
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
    parse: true,
  });
}

export function faceRegistration(data = {}) {
  return request(`/parents/${data.id}/face-registration`, {
    method: 'POST',
    data,
  });
}

export function changePassword(data = {}) {
  return request(`/user/${data.id}/change-password`, {
    method: 'PATCH',
    params: {
      ...data,
    },
  });
}

export function getNotificationModule(params) {
  return request(`/user-notification-module/by-user/${params.id}`, {
    method: 'GET',
    params: {
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export function getTypes(params = {}) {
  return request('/notification-type', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function updateNotificationModule(data) {
  return request(`/user-notification-module/by-user`, {
    method: 'PUT',
    data,
  });
}
