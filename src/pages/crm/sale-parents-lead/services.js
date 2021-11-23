import request from '@/utils/requestCrm';
import { Helper } from '@/utils';

export function get(data = {}) {
  return request('/v1/customer-leads', {
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
        'statusCare.statusParentLead',
        'studentInfo',
        'employee',
        'customerTag.tag',
        'searchSource',
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
  return request(`/v1/move-customer-potentials`, {
    method: 'POST',
    data,
    parse: true,
  });
}

export function getTags() {
  return request(`/v1/tags`, {
    method: 'GET',
    params: {
      orderBy: 'name',
    },
  });
}

export function getStatusLead() {
  return request(`/v1/status-parent-leads`, {
    method: 'GET',
    params: {
      orderBy: 'name',
    },
  });
}

export function getEmployees() {
  return request(`/v1/employees`, {
    method: 'GET',
    params: {
      orderBy: 'full_name',
    },
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

export function getBranch() {
  return request(`/v1/branches`, {
    method: 'GET',
    params: {
      orderBy: 'name',
    },
  });
}