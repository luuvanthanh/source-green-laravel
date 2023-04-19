import request from '@/utils/requestLavarel';
import {  Helper } from '@/utils';

export function get(params = {}) {
  return request('/v1/interviewers', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      include: Helper.convertIncludes(['division,interviewerEmployee']),
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/interviewers/${id}`, {
    method: 'DELETE',
    parse: true,
    data: {
      id,
    },
  });
}
