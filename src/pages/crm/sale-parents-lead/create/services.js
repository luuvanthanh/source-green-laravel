import request from '@/utils/requestCrm';

import { Helper, variables } from '@/utils';

export function add(data = {}) {
  return request('/v1/customer-leads', {
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
  return request('/v1/student-infos', {
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
  return request(`/v1/customer-leads/${data.id}`, {
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

export function getStudent(params) {
  return request('/v1/student-infos', {
    method: 'GET',
    params,
  });
}

export function details(params = {}) {
  return request(`/v1/customer-leads/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes([
        'studentInfo',
        'city',
        'district',
        'searchSource',
        'statusCare.statusParentLead',
        'employee',
        'marketingProgram',
        'customerTag.tag',
        'ssoAccount',
      ]),
    },
  });
}

export function updateStatus(data = {}) {
  return request(`/v1/customer-leads/${data.id}/update-status?status=${data.status}`, {
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

export function getConfigShippingFees(params = {}) {
  return request(`/v1/config-shipping-fees`, {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'id',
      sortedBy: 'desc',
      include: Helper.convertIncludes([
        'cityProvince',
        'configShippingFeeDetail.district',
        'configShippingFeeDetail.townWard',
      ]),
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
  return request(`/v1/districts?${params.city_id}`, {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'name',
    },
  });
}

export function getStatusLead(params = {}) {
  return request('/v1/status-cares', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'created_at',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes(['statusParentLead']),
    },
  });
}

export function getTags(params) {
  return request(`/v1/tags`, {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'name',
    },
  });
}

export function getParentLead() {
  return request(`/v1/status-parent-leads`, {
    method: 'GET',
  });
}

export function addStatusLead(data = {}) {
  return request('/v1/status-cares', {
    method: 'POST',
    data,
  });
}

export function addTags(data = {}) {
  return request('/v1/customer-tags', {
    method: 'POST',
    data,
  });
}

export function getCustomerTags(data = {}) {
  return request('/v1/customer-tags', {
    method: 'GET',
    params: {
      ...data,
      include: Helper.convertIncludes(['tags']),
    },
  });
}
export function addEvents(data = {}) {
  return request('/v1/event-infos', {
    method: 'POST',
    data: {
      ...data,
      date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.date,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      time: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.time,
        }),
        format: variables.DATE_FORMAT.HOUR,
        isUTC: false,
      }),
    },
  });
}

export function updateEvents(data = {}) {
  return request(`/v1/event-infos/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
      date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.date,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      time: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.time,
        }),
        format: variables.DATE_FORMAT.HOUR,
        isUTC: false,
      }),
    },
  });
}

export function removeEvents(id = {}) {
  return request(`/v1/event-infos/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export function getEvents(params = {}) {
  return request(`/v1/event-infos/${params}`, {
    method: 'GET',
  });
}
export function Events(params = {}) {
  return request(`/v1/event-infos`, {
    method: 'GET',
    params: {
      ...params,
      time: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.time,
        }),
        format: variables.DATE_FORMAT.HOUR,
        isUTC: false,
      }),
    },
  });
}

export function addReferences(data = {}) {
  return request('/v1/references', {
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

export function getReferences(params = {}) {
  return request(`/v1/references`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getData(params = {}) {
  return request('/v1/event-infos', {
    method: 'GET',
    params: {
      ...params,
      date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.date,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      time: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.time,
        }),
        format: variables.DATE_FORMAT.HOUR,
        isUTC: false,
      }),
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

export function getBranches(params) {
  return request(`/v1/branches`, {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'name',
    },
  });
}

export function getParentPotential() {
  return request(`/v1/status-parent-potentials`, {
    method: 'GET',
  });
}

export function addPotential(data = {}) {
  return request(`/v1/move-customer-potentials`, {
    method: 'POST',
    data,
    parse: true,
  });
}

export function getProgramInterest(params) {
  return request(`/v1/marketing-programs`, {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'name',
    },
  });
}

export function getTownWards(params) {
  return request(`/v1/town-wards?${params.district_id}`, {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'name',
    },
  });
}

export function addInterest(data = {}) {
  return request('/v1/customer-lead-marketing-programs', {
    method: 'POST',
    data,
  });
}

export function getRelationships() {
  return request(`/v1/category-relationships`, {
    method: 'GET',
  });
}

export function getCategoryEvents() {
  return request(`/v1/category-events`, {
    method: 'GET',
  });
}

export function addAccount(data = {}) {
  return request('/v1/customer-lead-accounts', {
    method: 'POST',
    data,
  });
}