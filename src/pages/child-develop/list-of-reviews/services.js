import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/v1/test-semesters', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes([
        'student.classes.branch,assessmentPeriod.schoolYear,student,testSemesterDetail,testSemesterDetail.testSemesterDetailChildren,childEvaluateDetail.childEvaluateDetailChildren,assessmentPeriod.nameAssessmentPeriod',
      ]),
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
  return request(`/v1/approved-test-semesters`, {
    method: 'POST',
    data: {
      approvalStatus: 'APPROVED',
      id: [params?.id],
    },
    cancelNotification: true,
  });
}

export function addReview(params = {}) {
  return request('/v1/approved-test-semesters', {
    method: 'POST',
    data: {
      id: params.id,
      approvalStatus: 'APPROVED',
    },
    cancelNotification: true,
  });
}
