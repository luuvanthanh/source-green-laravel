import { Helper } from '@/utils';
import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/history-calls', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'created_at',
      sortedBy: 'desc',
      include: Helper.convertIncludes([
        'employee',
        'employee.extension',
        'customerLead',
        'managerCall',
      ]),
    },
  });
}

export function getSaler(params = {}) {
  return request('/v1/employees', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getExtensions(params = {}) {
  return request('/v1/extensions', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getSwitchboard(params = {}) {
  return request('/v1/switchboard', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
