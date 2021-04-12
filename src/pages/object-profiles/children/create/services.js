import request from '@/utils/request';
import { omit, pickBy } from 'lodash';
import { Helper, variables } from '@/utils';

const removeParams = (params) => {
  return omit(pickBy(params, (value) => value !== null && value !== undefined));
};

export function add(data = {}) {
  return request('/students', {
    method: 'POST',
    data: removeParams(data),
  });
}

export function update(data = {}) {
  return request(`/students/${data.id}`, {
    method: 'PUT',
    data: removeParams(data),
  });
}

export function details(data = {}) {
  return request(`/students/${data.id}`, {
    method: 'GET',
  });
}

export function getParents() {
  return request(`/parents`, {
    method: 'GET',
    params: {
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
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

export function addTransporter(data = {}) {
  return request(`/student-transporter?id=${data.id}`, {
    method: 'POST',
    data: data.studentTransporter,
  });
}
