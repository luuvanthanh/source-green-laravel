import request from '@/utils/requestCrm';
import { Helper} from '@/utils';

export function get(data = {}) {
  return request('/v1/admission-registers', {
    method: 'GET',
    params: {
      ...data,
      limit: data.limit,
      page: data.page,
      orderBy: 'created_at',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes([
        'studentInfo',
        'parentInfo',
      ]),
    },
  });
}

export function getParents() {
  return request(`/v1/customer-leads`, {
    method: 'GET',
    params: {
      limit: 10000,
      page: 1,
    },
  });
}

export function getDistricts(params) {
  return request(`/v1/districts`, {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'name',
    },
  });
}

export function add(data = {}) {
  return request(`/v1/move-customer-potentials`, {
    method: 'POST',
    data,
    parse: true,
  });
}
