import request from '@/utils/requestLavarel';
import requestNet from '@/utils/request';
import { Helper } from '@/utils';

export function add(data = {}) {
  return requestNet('/physical-evaluate-template', {
    method: 'POST',
    data
  });
}

export function update(data = {}) {
  return requestNet(`/physical-evaluate-template/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
      id: undefined
    },
    parse: true
  });
}

export function getData(params = {}) {
  return requestNet(`/physical-evaluate-template/${params.id}`, {
    method: 'GET',
    params: {
      ...params
    },
  });
}

export function remove(id = {}) {
  return requestNet(`/physical-evaluate-template/${id}`, {
    method: 'DELETE'
  });
}

// export function getDataType(params = {}) {
//   return request(`/v1/name-assessment-periods`, {
//     method: 'GET',
//     params: {
//       ...params,
//     },
//   });
// }

export function getSampleComments(params = {}) {
  return requestNet('/physical-criteria-template/feedback/list-of-pagging', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

export function getSubjectComments(params = {}) {
  return requestNet('/physical-criteria-template/criteria/list-of-pagging', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

export function getClasses(params) {
  return requestNet('/classes/by-branches', {
    method: 'GET',
    params,
  });
}

export function getDataType(params = {}) {
  return request('/v1/assessment-periods', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes([
        'classes',
        'branch',
        'nameAssessmentPeriod',
        'schoolYear'
      ]),
    },
  });
}

export function getDetailDataType(data = {}) {
  return request(`/v1/assessment-periods/${data.id}`, {
    method: 'GET',
    params: {
      include: Helper.convertIncludes(['classes', 'branch', 'schoolYear']),
    },
  });
}

