import request from '@/utils/requestCrm';
import { Helper } from '@/utils';

export function get(data = {}) {
  return request(`/v1/customer-leads?`, {
    method: 'GET',
    params: {
      ...data,
      limit: data.limit,
      page: data.page,
      orderBy: 'created_at',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes([
        'search',
        'studentInfo'
      ]),
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
  return request(`/v1/move-customer-potentials`, {
    method: 'POST',
    data,
    parse: true,
  });
}

export function addCoincide(data = {}) {
  return request(`/v1/merge-customer-leads`, {
    method: 'POST',
    data,
    parse: true,
  });
}

export function getCoincide(params = {}) {
  return request(`/v1/customer-leads`, {
    method: 'GET',
    params: {
      ...params,
      limit: params.limit,
      page: params.page,
      orderBy: 'created_at',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes([
        'search',
        'studentInfo',
        'city',
        'district',
      ]),
      employeeId: params.employeeId && params.employeeId.join(','),
    },
  });
}