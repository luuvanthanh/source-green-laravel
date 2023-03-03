import request from '@/utils/request';

import { Helper } from '@/utils';

export function getNoSending(params = {}) {
  return request('/student-has-sensitive-periods/items-with-no-sending', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getSending(params = {}) {
  return request('/student-has-sensitive-periods/items-with-sending', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function add(data = {}) {
  return request('/notes', {
    method: 'POST',
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
