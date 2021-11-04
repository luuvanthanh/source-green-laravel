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
