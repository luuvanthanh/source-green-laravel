import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function add(data = {}) {
  return request('/v1/seasonal-contracts', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/seasonal-contracts/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(data) {
  return request(`/v1/seasonal-contracts/${data.id}`, {
    method: 'GET',
  });
}

export function get(data = {}) {
  return request('/v1/probationary-contracts', {
    method: 'GET',
    params: {
      limit: data.limit,
      page: data.page,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes(['employee', 'typeOfContract', 'position', 'branch']),
      fullName: data.fullName,
      employeeId: data.employeeId,
      search: Helper.convertParamSearchConvert({
        type: data.type,
      }),
    },
  });
}

export function getUsers(data = {}) {
  return request('/v1/employees?getLimitUser=true', {
    method: 'GET',
    data,
  });
}

export function getStaff() {
  return request(`/v1/employees`, {
    method: 'GET',
    params: {
      include: Helper.convertIncludes([
        'positionLevel,positionLevelNow',
      ]),
    },
  });
}