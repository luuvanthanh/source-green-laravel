import request from '@/utils/requestCrm';
import { Helper } from '@/utils';

export function get(data = {}) {
  return request('/v1/data-marketings', {
    method: 'GET',
    params: {
      ...data,
      limit: data.limit,
      page: data.page,
      orderBy: 'created_at;full_name',
      sortedBy: 'desc',
      include: Helper.convertIncludes([
        'city',
        'district',
        'search',
        'searchSource',
        'marketingProgram',
        'tag',
      ]),
      employeeId: data.employeeId && data.employeeId.join(','),
    },
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
      data_marketing_id: data,
    },
    parse: true,
  });
}

export function getSearch() {
  return request(`/v1/search-sources`, {
    method: 'GET',
    params: {
      orderBy: 'name',
    },
  });
}

export function getProgram() {
  return request(`/v1/marketing-programs`, {
    method: 'GET',
    params: {
      orderBy: 'name',
    },
  });
}

export function addTags(data = {}) {
  return request('/v1/data-marketing-tags', {
    method: 'POST',
    data,
  });
}

export function importExcel(data = {}) {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });
  return request('/v1/import-excel-data-marketings', {
    method: 'POST',
    data: formData,
  });
}

export function remove(id = {}) {
  return request(`/v1/data-marketings/${id}`, {
    method: 'DELETE',
    params: {
      id,
    },
    parse: true,
  });
}

export function removeAll(data = {}) {
  return request(`/v1/multiple-delete-data-marketing`, {
    method: 'POST',
    data: {
      data,
    },
    parse: true,
  });
}
