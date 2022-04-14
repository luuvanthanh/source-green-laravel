import request from '@/utils/request';
import requestCRM from '@/utils/requestCrm';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/student-criterias/statistic-by-properties', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getStudents(params = {}) {
  return request('/students', {
    method: 'GET',
    params : {
      ...params,
      MaxResultCount : 1000
    },
  });
}

export function getGroupProperty(params = {}) {
  return request('/criteria-group-properties', {
    method: 'GET',
    params,
  });
}

export function getDetailStudents(data = {}) {
  return request(`/students/${data}`, {
    method: 'GET',
    data,
  });
}


export function getWater(params = {}) {
  return request(`/water-bottles/${params.StudentId}/report-by-student`, {
    method: 'GET',
    params : {
      ...params
    },
  });
}

export function getHeight(params = {}) {
  return request(`/student-criterias/statistic-by-physical/${params.StudentId}`, {
    method: 'GET',
    params,
  });
}

export function getMedical(data = {}) {
  return requestCRM(`/v1/admission-registers`, {
    method: 'GET',
    params: {
      ...data,
      limit: data.limit,
      page: data.page,
      orderBy: 'created_at',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes([
        "studentInfo,medicalInfo,childEvaluateInfo"
      ]),
    },
  });
}

export function getEvaluate(params = {}) {
  return requestCRM(`/v1/admission-registers`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes([
        'studentInfo,childEvaluateInfo.childDescription.childIssue',]),
    },
  });
}

export default get;
