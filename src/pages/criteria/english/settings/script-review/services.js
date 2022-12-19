import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/v1/script-reviews', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes([
        'scriptReviewSubject,scriptReviewComment,branch,classes',
        'scriptReviewSubject.scriptReviewSubjectDetail.scriptReviewSubjectDetailChildren',
        'scriptReviewComment.scriptReviewCommentDetail',
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

export function getSkill() {
  return request(`/v1/category-skills`, {
    method: 'GET',
    params: {
      orderBy: 'Name',
    },
  });
}

export function updateUse(data = {}) {
  return request(`/v1/update-is-use/${data.id}`, {
    method: 'PUT',
    data: {
      use: data.use,
    },
    parse: true,
    cancelNotification: true,
  });
}
