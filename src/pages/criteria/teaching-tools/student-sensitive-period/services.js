import request from '@/utils/request';
import { omit } from 'lodash';

import { Helper } from '@/utils';

export function getNoSending(params = {}) {
  return request('/student-has-sensitive-periods/items-with-no-sending', {
    method: 'GET',
    params: {
      ...params,
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
      approvalStatus: undefined,
    },
  });
}

export function getSending(params = {}) {
  return request('/student-has-sensitive-periods/items-with-sending', {
    method: 'GET',
    params: {
      ...params,
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
      approvalStatus: undefined,
    },
  });
}

export function add(data = {}) {
  return request('/student-has-sensitive-periods/send-items', {
    method: 'PUT',
    data,
  });
}

export function addAll(data = {}) {
  return request('/notes', {
    method: 'POST',
    data,
  });
}

export function getAssessmentPeriod(params = {}) {
  return request('/sensitive-periods', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function getDetail(params = {}) {
  return request(`/student-has-sensitive-periods/${params?.id}`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
