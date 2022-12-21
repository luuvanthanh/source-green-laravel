import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';
import requestNet from '@/utils/request';

export function add(data = {}) {
  return request('/v1/quarter-reports', {
    method: 'POST',
    data,
    cancelNotification: true,
  });
}

export function update(data = {}) {
  return request(`/v1/quarter-reports/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
    },
    parse: true,
    cancelNotification: true,
  });
}

export function getData(params = {}) {
  return request(`/v1/quarter-reports/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes([
        'childEvaluateDetail.childEvaluateDetailChildren',
        'childEvaluateDetailChildrent',
      ]),
    },
  });
}

export function getDataStudent(params = {}) {
  return requestNet(`/students/${params}`, {
    method: 'GET',
  });
}

export function getDataScriptReview(params = {}) {
  return request(`/v1/script-reviews/${params?.id}`, {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes([
        'nameAssessmentPeriod',
        'scriptReviewComment.scriptReviewCommentDetail,scriptReviewComment.sampleComment',
        'scriptReviewComment.scriptReviewCommentDetail,scriptReviewComment.scriptReviewCommentDetail.sampleCommentDetail',
        'scriptReviewComment.scriptReviewCommentDetail,scriptReviewComment.subject,branch,classes,scriptReviewSubject.scriptReviewSubjectDetail.subjectSection,scriptReviewSubject.subject,scriptReviewSubject.scriptReviewSubjectDetail.scriptReviewSubjectDetailChildren.subjectSectionDetail',
      ]),
    },
  });
}

export function getDataEvaluetionCriteria(params = {}) {
  return request('/v1/evaluation-criterias', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
    },
  });
}

export function getDatDetail(params = {}) {
  return request(`/v1/quarter-reports/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['quarterReport', 'student.branch', 'student.classes']),
    },
  });
}
