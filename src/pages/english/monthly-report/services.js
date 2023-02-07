import request from '@/utils/requestLavarel';
import requestNet from '@/utils/request';
import { omit } from 'lodash';

import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/v1/monthly-comments', {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['monthlyComment', 'branch', 'classes']),
    },
  });
}

export function add(data = {}) {
  return request('/notes', {
    method: 'POST',
    data,
    cancelNotification: true,
  });
}

export function update(data = {}) {
  return request(`/notes/${data.id}`, {
    method: 'PUT',
    data,
    cancelNotification: true,
  });
}

export function remove(id) {
  return request(`/notes/${id}`, {
    method: 'DELETE',
    parse: true,
    cancelNotification: true,
  });
}

export function addOneItem(params = {}) {
  return request(`/v1/approved-test`, {
    method: 'GET',
    params: {
      approvalStatus: 'APPROVED',
      id: [params?.id],
    },
  });
}

export function addReview(params = {}) {
  return request('/v1/approved-test', {
    method: 'GET',
    params: {
      ...params,
      approvalStatus: 'APPROVED',
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

export function getAssess(params = {}) {
  return request(`/v1/script-reviews`, {
    method: 'GET',
    params: {
      ...params,
      // orderBy: 'CreationTime',
      // sortedBy: 'desc',
      // searchJoin: 'and',
      include: Helper.convertIncludes(['nameAssessmentPeriod']),
    },
  });
}

export function getStudent(params = {}) {
  return requestNet(`/students`, {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
      classStatus: params.class ? 'HAS_CLASS' : 'ALL',
    },
  });
}

export function addSent(data = {}) {
  return request('/v1/notification-monthly-comments', {
    method: 'POST',
    data,
    cancelNotification: true,
  });
}

export function addSentAll(data = {}) {
  return request('/v1/notification-all-status-monthly-comments', {
    method: 'POST',
    data,
    cancelNotification: true,
  });
}

export function addConfirmedAll(data = {}) {
  return request('/v1/update-all-status-monthly-comments', {
    method: 'POST',
    data,
    cancelNotification: true,
  });
}

export function updateSent(data = {}) {
  return request('/v1/notification-monthly-comments', {
    method: 'PUT',
    data,
    cancelNotification: true,
  });
}

export function addConfirm(data = {}) {
  return request('/v1/update-status-monthly-comments', {
    method: 'POST',
    data,
    cancelNotification: true,
  });
}

export function removeConfirm(id) {
  return request(`/v1/delete-monthly-comments/${id}`, {
    method: 'DELETE',
    parse: true,
    cancelNotification: true,
  });
}
