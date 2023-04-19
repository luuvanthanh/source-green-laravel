import request from '@/utils/requestLavarel';
import {  Helper } from '@/utils';

export function get(params = {}) {
  return request('/v1/interview-lists', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      include: Helper.convertIncludes(['division,interviewListEmployee,interviewConfiguration.interviewConfigurationEvaluationCriteria,pointEvaluation']),
    },
  });
}

export function getDataDetails(params = {}) {
  return request(`/v1/interview-lists/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['division,interviewListEmployee,interviewConfiguration.interviewConfigurationEvaluationCriteria,pointEvaluation']),
    },
  });
}

export function BrowsingCandidate(data = {}) {
  return request(`/v1/salary-approval/${data.id}`, {
    method: 'PUT',
    data: {
     status: data?.status,
     flag: data?.flag,
     messages: data?.messages,
    },
  });
}