import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';
import requestNet from '@/utils/request';

export function add(data = {}) {
  return requestNet('/physical-criteria-students', {
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
  return requestNet(`/physical-criteria-students/get-template-for-creating`, {
    method: 'GET',
    params: {
      ...params,
    },
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
  return requestNet(`/physical-criteria-students/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getDataConfiguration() {
  return requestNet(`/physical-evaluate-template/list-of-pagging`, {
    method: 'GET',
    params: {
      type: 'PERIODIC_MEASUREMENT',
    },
  });
}

export function sendItem(data = {}) {
  return requestNet(`/physical-criteria-students/send`, {
    method: 'PUT',
    data,
  });
}