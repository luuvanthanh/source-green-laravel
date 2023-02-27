import request from '@/utils/requestLavarel';
import requestNet from '@/utils/request';
import { omit } from 'lodash';

import { Helper } from '@/utils';

export function get(params = {}) {
  return requestNet('/physical-criteria-students/items-has-no-criteria', {
    method: 'GET',
    params: {
      ...params,
      ...omit(params, 'page', 'limit'),
      page: undefined,
      limit: undefined,
      ...Helper.getPagination(params.page, params.limit),
      status: undefined,
    },
    cancelNotification: true,
  });
}

export function getApproved(params = {}) {
  return requestNet('/physical-criteria-students/list-of-pagging', {
    method: 'GET',
    params: {
      ...params,
      ...omit(params, 'page', 'limit'),
      page: undefined,
      limit: undefined,
      ...Helper.getPagination(params.page, params.limit),
    },
    cancelNotification: true,
  });
}

export function getPeriod(params = {}) {
  return request('/v1/assessment-periods', {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['nameAssessmentPeriod']),
    },
  });
}

export function approve(data = {}) {
  return requestNet(`/physical-criteria-students/approve`, {
    method: 'PUT',
    data,
  });
}

export function send(data = {}) {
  return requestNet(`/physical-criteria-students/send`, {
    method: 'PUT',
    data,
  });
}
