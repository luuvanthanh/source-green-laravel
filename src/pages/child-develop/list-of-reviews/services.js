import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/v1/test-semesters', {
    method: 'GET',
    params: {
      ...params,
      // from: Helper.getDateTime({
      //   value: Helper.setDate({
      //     ...variables.setDateData,
      //     originValue: params.from,
      //     targetValue: '00:00:00',
      //   }),
      //   isUTC: true,
      // }),
      // to: Helper.getDateTime({
      //   value: Helper.setDate({
      //     ...variables.setDateData,
      //     originValue: params.to,
      //     targetValue: '23:59:59',
      //   }),
      //   isUTC: true,
      // }),
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes([
        'student.classStudent.class.branch',
        'assessmentPeriod.schoolYear',
        'student,testSemesterDetail,testSemesterDetail.testSemesterDetailChildren',
        'childEvaluateDetail.childEvaluateDetailChildren',
        'assessmentPeriod.nameAssessmentPeriod',
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
  return request(`/v1/approved-test-semesters/${params?.id}`, {
    method: 'GET',
    params: {
      approvalStatus: 'APPROVED',
    },
  });
}

export function addReview(params = {}) {
  return request('/v1/approved-test-semester-multiple', {
    method: 'GET',
    params: {
      ...params,
      approvalStatus: 'APPROVED',
    },
  });
}
