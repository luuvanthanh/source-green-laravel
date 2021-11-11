import request from '@/utils/requestCrm';
import { Helper, variables } from '@/utils';

export function add(data = {}) {
  return request('/v1/admission-registers', {
    method: 'POST',
    data: {
      ...data,
      date_register: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.date_register,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
  });
}

export function getCustomerLead() {
  return request(`/v1/customer-leads`, {
    method: 'GET',
    params: {
      orderBy: 'full_name',
    },
  });
}

export function getStudentsLead(params) {
  return request(`/v1/student-infos`, {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'full_name',
    },
  });
}

export function details(params = {}) {
  return request(`/v1/admission-registers/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['studentInfo', 'parentInfo']),
    },
  });
}

export function getParents(params) {
  return request('/v1/parent-infos', {
    method: 'GET',
    params,
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

export function addParents(data = {}) {
  return request('/v1/parent-infos', {
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

export function addWrittenConsent(data = {}) {
  return request('/v1/confirm-transporters', {
    method: 'POST',
    data: {
      ...data,
      date_register: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.date_register,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
  });
}

export function getWrittenConsent(params) {
  return request('/v1/confirm-transporters', {
    method: 'GET',
    params,
  });
}

export function updateStudents(data = {}) {
  return request(`/v1/admission-registers/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
      date_register: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.date_register,
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
