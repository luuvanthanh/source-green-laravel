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

export function addStudents(data = {}) {
  return request('/v1/student-infos', {
    method: 'POST',
    data,
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

export function getStudent(data = {}) {
  return request(`/v1/customer-leads/${data.id}?student-infos`, {
    method: 'GET',
  });
}

export function details(data = {}) {
  return request(`/v1/customer-leads/${data.id}`, {
    method: 'GET',
  });
}

export function updateStatus(data = {}) {
  return request(`/v1/customer-leads/${data.id}/update-status?status=${data.status}`, {
    method: 'PUT',
    data:{
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
