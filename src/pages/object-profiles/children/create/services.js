import request from '@/utils/request';
import { omit, pickBy } from 'lodash';
import { Helper, variables } from '@/utils';

const removeParams = (params) =>
  omit(pickBy(params, (value) => value !== null && value !== undefined));

export function add(data = {}) {
  return request('/students', {
    method: 'POST',
    data: removeParams(data),
  });
}

export function update(data = {}) {
  return request(`/students/${data.id}`, {
    method: 'PUT',
    data: {
      ...omit(removeParams(data), 'id'),
    },
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

export function addTransporter(data = {}) {
  return request(`/student-transporter?id=${data.id}`, {
    method: 'POST',
    data: data.studentTransporter,
  });
}

export function updateStatus(data = {}) {
  return request(`/students/${data.id}/update-status?status=${data.status}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function storeStudent(data = {}) {
  return request(`/students/store-student/${data.id}`, {
    method: 'PATCH',
    data,
  });
}

export function updateStatusRestore(data = {}) {
  return request(`/students/restore-student/${data.id}?restoredDate=${data?.restoredDate}`, {
    method: 'PUT',
    data,
  });
}

export function getAge(params = {}) {
  return request(`/students/get-age/${params?.dayOfBirth}`, {
    method: 'GET',
    params: {
      dayOfBirth: params?.dayOfBirth,
    },
  });
}

export function getHistory(params = {}) {
  return request(`/class-students/history-by-studentId/${params?.id}`, {
    method: 'GET',
    params,
  });
}