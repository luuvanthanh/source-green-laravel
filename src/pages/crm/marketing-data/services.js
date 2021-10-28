import request from '@/utils/requestCrm';
import { Helper } from '@/utils';

export function get(data = {}) {
  return request('/v1/data-marketings', {
    method: 'GET',
    params: {
      ...data,
      limit: data.limit,
      page: data.page,
      orderBy: 'created_at',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes([
        'city',
        'district',
        'search',
        'searchSource',
        'marketingProgram', 
      ]),
      employeeId: data.employeeId && data.employeeId.join(','),
    },
  });
}

export function getCities() {
  return request(`/v1/citys`, {
    method: 'GET',
    params: {
      orderBy: 'name',
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
  return request(`/v1/move-leads`, {
    method: 'POST',
    data: {
        data_marketing_id: {...data}
    },
    parse: true,
  });
}

export function getSearch(params) {
  return request(`/v1/search-sources`, {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'name',
    },
  });
}

export function getProgram(params) {
  return request(`/v1/marketing-programs`, {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'name',
    },
  });
}