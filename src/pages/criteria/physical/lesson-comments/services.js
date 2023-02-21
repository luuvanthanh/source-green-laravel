import request from '@/utils/requestLavarel';
import requestNet from '@/utils/request';
import { Helper } from '@/utils';

export function get(params = {}) {
  return requestNet('/physical-feedback-students/list-of-pagging', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function getDataNoFeedback(params = {}) {
  return requestNet('/physical-feedback-students/items-has-no-feedback', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function getDataType(params = {}) {
  return request(`/v1/name-assessment-periods`, {
    method: 'GET',
    params: {
      id: params,
    },
  });
}

export function approveFeedback(data = {}) {
  return requestNet(`/physical-feedback-students/approve`, {
    method: 'PUT',
    params: {
      isAll: data?.isAll,
    },
    data: data?.listIdApprove,
    parse: true,
  });
}

