import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function get(data = {}) {
  return request('/v1/shifts', {
    method: 'GET',
    params: {
      limit: data.limit,
      page: data.page,
      orderBy: 'id',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes(['store', 'shiftDetail']),
      search: Helper.convertParamSearchConvert({
        store_id: data.store_id,
        shift_code: data.shift_code,
      }),
    },
  });
}

export function remove(id) {
  return request(`/v1/shifts/${id}`, {
    method: 'DELETE',
    data: {
      shift_id: id,
    },
    parse: true,
  });
}

export function activeStatus(data) {
  return request(`/v1/active-status-shift/${data.id}`, {
    method: 'PUT',
    data: {
      shift_code: data.shift_code,
      store_id: data.store_id,
      status: data.status,
    },
  });
}
