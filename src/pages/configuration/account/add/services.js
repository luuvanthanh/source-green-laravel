import requestLavarel from '@/utils/requestLavarel';
import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function add(data) {
  return requestLavarel('/v1/shifts', {
    method: 'POST',
    data: {
      description: data.description,
      store_id: data.store_id,
      time: data.time,
      shift_code: data.shift_code,
    },
    parse: true,
  });
}

export function update(data) {
  return requestLavarel(`/v1/shifts/${data.id}`, {
    method: 'PUT',
    data: {
      description: data.description,
      store_id: data.store_id,
      time: data.time,
      shift_code: data.shift_code,
      shift_id: data.id,
    },
    parse: true,
  });
}

export function details(id) {
  return requestLavarel(`/v1/shifts/${id}`, {
    method: 'GET',
    params: {
      include: 'shiftDetail',
    },
  });
}

export function addParentAccounts(data) {
  return request('/parent-accounts', {
    method: 'POST',
    data,
  });
}

export function addEmployeesAccounts(data) {
  return request('/employee-accounts', {
    method: 'POST',
    data,
  });
}

export function getParents(params) {
  return request(`/parents`, {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export function getEmployees(params) {
  return request(`/employees`, {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}
