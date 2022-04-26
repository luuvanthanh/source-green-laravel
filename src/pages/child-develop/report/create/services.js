import request from '@/utils/requestLavarel';
import { Helper} from '@/utils';

export function details(data = {}) {
  return request('/v1/report-test-semesters', {
    method: 'GET',
    params: {
      ...data,
      limit: data.limit,
      page: data.page,
      include: Helper.convertIncludes([
       'testSemester.testSemesterDetail.testSemesterDetailChildren.childEvaluate,testSemester.testSemesterDetail.testSemesterDetailChildren.childEvaluateDetail',
       'testSemester.testSemesterDetail.testSemesterDetailChildren.childEvaluateDetailChildren',
       'classStudent.class',
       'testSemester.assessmentPeriod.schoolYear',
       'testSemester.assessmentPeriod.nameAssessmentPeriod',
       'testSemester.testSemesterDetail.categorySkill'
      ]),
    },
  });
}

export function getSkill(params) {
  return request(`/v1/category-skills`, {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'NumericalSkill',
    },
  });
}