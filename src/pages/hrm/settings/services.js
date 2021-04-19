import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function get(data = {}) {
  return request('/v1/shifts', {
    method: 'GET',
    params: {
      limit: data.limit,
      page: data.page,
      orderBy: 'Id',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes(['shiftDetail']),
      search: Helper.convertParamSearchConvert({
        StoreId: data.storeId,
        ShiftCode: data.shiftCode,
      }),
    },
  });
}

export function remove(id) {
  return request(`/v1/shifts/${id}`, {
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
