import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';
import requestNet from '@/utils/request';

export function add(data = {}) {
  return request('/v1/monthly-comments', {
    method: 'POST',
    data,
    cancelNotification: true,
  });
}

export function updateComfirm(data = {}) {
  return request(`/v1/monthly-comments/${data?.id}`, {
    method: 'PUT',
    data,
    cancelNotification: true,
  });
}

export function update(data = {}) {
  return request(`/v1/monthly-comments/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
    },
    parse: true,
    cancelNotification: true,
  });
}

export function getData(params = {}) {
  return request(`/v1/monthly-comments/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['monthlyComment', 'branch', 'classes']),
    },
  });
}

export function getDataStudent(params = {}) {
  return requestNet(`/students/${params}`, {
    method: 'GET',
  });
}

export function getDataScriptReview(params = {}) {
  return request(`/v1/script-reviews`, {
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
  return request(`/v1/monthly-comments/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes([
        'monthlyComment',
        'schoolYear',
        'student.branch',
        'student.classes',
      ]),
    },
  });
}
