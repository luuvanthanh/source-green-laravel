import request from '@/utils/requestCrm';

import { Helper, variables } from '@/utils';

export function add(data = {}) {
  return request('/v1/data-marketings', {
    method: 'POST',
    data: {
      ...data,
      birth_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.birth_date,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
  });
}

export function addStudents(data = {}) {
  return request('/v1/data-marketing-student-infos', {
    method: 'POST',
    data: {
      ...data,
      birth_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.birth_date,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      dateOfIssueIdCard: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.dateOfIssueIdCard,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
    parse: true,
  });
}

export function update(data = {}) {
  return request(`/v1/data-marketings/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
      birth_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.birth_date,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      dateOfIssueIdCard: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.dateOfIssueIdCard,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
  });
}

export function getStudent(data) {
  return request('/v1/data-marketing-student-infos', {
    method: 'GET',
    params: {
      ...data,
      orderBy: 'created_at',
      sortedBy: 'asc',
      searchJoin: 'and',
    },
  });
}

export function details(params = {}) {
  return request(`/v1/data-marketings/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes([
        'studentInfo',
        'city',
        'district',
        'searchSource',
        'marketingProgram',
      ]),
    },
  });
}

export function updateStatus(data = {}) {
  return request(`/v1/data-marketings/${data.id}/update-status?status=${data.status}`, {
    method: 'PUT',
    data: {
      ...data,
      birth_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.birth_date,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      dateOfIssueIdCard: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.dateOfIssueIdCard,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
    parse: true,
  });
}

export function getCities() {
  return request(`/v1/citys`, {
    method: 'GET',
    params: {
      orderBy: 'numerical_city',
    },
  });
}

export function getDistricts(params) {
  return request(`/v1/districts?${params.city_id}`, {
    method: 'GET',
    params: {
      city_id : params.city_id,
      orderBy: 'name',
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

export function addProgram(data = {}) {
  return request('/v1/program-data-marketings', {
    method: 'POST',
    data,
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

export function getDataProgram(params = {}) {
  return request(`/v1/data-marketings/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['marketingProgram']),
    },
  });
}

export function deleteProgram(data = {}) {
  return request('/v1/delete-program-data-marketings', {
    method: 'POST',
    data,
  });
}

export function getRelationships() {
  return request(`/v1/category-relationships`, {
    method: 'GET',
  });
}

export function getBranches(params) {
  return request('/v1/branches', {
    method: 'GET',
    params,
  });
}

export function getTownWards(params) {
  return request(`/v1/town-wards?${params.district_id}`, {
    method: 'GET',
    params: {
      district_id: params.district_id,
      orderBy: 'name',
    },
  });
}