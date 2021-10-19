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
      include: Helper.convertIncludes(['studentInfo', 'city', 'district']),
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
