import request from '@/utils/requestCrm';

import { Helper, variables } from '@/utils';

export function add(data = {}) {
  return request('/v1/marketing-programs', {
    method: 'POST',
    data: {
      ...data,
      start_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.start_date,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      end_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.end_date,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
  });
}

export function addPosts(data = {}) {
  return request('/v1/articles', {
    method: 'POST',
    data: {
      ...data,
      start_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.start_date,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      end_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.end_date,
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
  return request(`/v1/marketing-programs/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
      start_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.start_date,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      end_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.end_date,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
  });
}

export function getDataPosts(data = {}) {
  return request('/v1/articles', {
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
        'reference.statusParentLead',
        'studentInfo',
      ]),
      employeeId: data.employeeId && data.employeeId.join(','),
    },
  });
}

export function updatePosts(data = {}) {
  return request(`/v1/articles/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
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
  return request(`/v1/marketing-programs/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function detailsPosts(params = {}) {
  return request(`/v1/articles/${params.detailId}`, {
    method: 'GET',
  });
}

export function updateStatus(data = {}) {
  return request(`/v1/marketing-programs/${data.id}/update-status?status=${data.status}`, {
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

export function getTags() {
  return request(`/v1/tags`, {
    method: 'GET',
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
  return request(`/v1/event-infos/${params.detailId}`, {
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

export function getPosts(params = {}) {
  return request('/v1/articles', {
    method: 'GET',
    params: {
      ...params,
      created_at: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.created_at,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      limit: params.limit,
      page: params.page,
      orderBy: 'created_at',
      sortedBy: 'desc',
      searchJoin: 'and',
    },
  });
}
