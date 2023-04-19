import request from '@/utils/requestLavarel';
import {  Helper } from '@/utils';

export function update(data = {}) {
  return request(`/v1/complete-interview/${data.interviewListId}`, {
    method: 'PUT',
    data: {
      ...data,
    },
  });
}

export function getData(params = {}) {
  return request(`/v1/interview-lists/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['division,interviewListEmployee,interviewConfiguration.interviewConfigurationEvaluationCriteria,pointEvaluation']),
    },
  });
}

export function getDataEvaluationCriteria(params = {}) {
  return request('/v1/evaluation-criterias-interview', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
    },
  });
}