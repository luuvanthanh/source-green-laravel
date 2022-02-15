import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function add(data = {}) {
  return request('/v1/labours-contracts', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/labours-contracts/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(data) {
  return request(`/v1/labours-contracts/${data.id}`, {
    method: 'GET',
    params: {
      include: Helper.convertIncludes(['employee', 'typeOfContract', 'position', 'branch']),
    },
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
