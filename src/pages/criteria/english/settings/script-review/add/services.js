import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function add(data = {}) {
  return request('/v1/script-reviews', {
    method: 'POST',
    data,
    cancelNotification: true,
  });
}

export function update(data = {}) {
  return request(`/v1/script-reviews/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
    },
    parse: true,
    cancelNotification: true,
  });
}

export function getData(params = {}) {
  return request(`/v1/script-reviews/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes([
        'scriptReviewComment.scriptReviewCommentDetail,scriptReviewComment.sampleComment',
        'scriptReviewComment.scriptReviewCommentDetail,scriptReviewComment.scriptReviewCommentDetail.sampleCommentDetail',
        'scriptReviewComment.scriptReviewCommentDetail,scriptReviewComment.subject,branch,classes,scriptReviewSubject.scriptReviewSubjectDetail.subjectSection,scriptReviewSubject.subject,scriptReviewSubject.scriptReviewSubjectDetail.scriptReviewSubjectDetailChildren.subjectSectionDetail',
      ]),
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/script-reviews/${id}`, {
    method: 'DELETE',
    parse: true,
    cancelNotification: true,
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

export function getSubject(params = {}) {
  return request('/v1/subjects', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes(['subjectSection.subjectSectionDetail']),
    },
  });
}

export function getComment(params = {}) {
  return request('/v1/sample-comments', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes(['sampleCommentDetail']),
    },
  });
}
