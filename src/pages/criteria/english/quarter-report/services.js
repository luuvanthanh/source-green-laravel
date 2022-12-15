import request from '@/utils/requestLavarel';
import requestNet from '@/utils/request';
import { omit } from 'lodash';

import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/v1/quarter-reports', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes(['quarterReport']),
    },
  });
}

export function add(data = {}) {
  return request('/notes', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/notes/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/notes/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export function getAssessmentPeriod(params = {}) {
  return request('/v1/assessment-periods', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes(['classes', 'branch', 'nameAssessmentPeriod', 'schoolYear']),
    },
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
      params,
      include: Helper.convertIncludes([
        'scriptReviewSubject,scriptReviewComment,branch,classes',
        'scriptReviewSubject.scriptReviewSubjectDetail.scriptReviewSubjectDetailChildren',
        'scriptReviewComment.scriptReviewCommentDetail',
        'nameAssessmentPeriod',
      ]),
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
  return request('/v1/notification-quarter-reports', {
    method: 'POST',
    data,
  });
}
