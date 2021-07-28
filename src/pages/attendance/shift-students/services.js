import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function get(data = {}) {
  return request('/v1/shift-students', {
    method: 'GET',
    params: {
      limit: data.limit,
      page: data.page,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes(['shiftDetail', 'branch']),
      search: Helper.convertParamSearchConvert({
        StoreId: data.storeId,
      }),
    },
  });
}

export function remove(id) {
  return request(`/v1/shift-students/${id}`, {
    method: 'DELETE',
    data: {
      shiftId: id,
    },
    parse: true,
  });
}

export function activeStatus(data) {
  return request(`/v1/active-status-shift/${data.id}`, {
    method: 'PUT',
    data,
  });
}
