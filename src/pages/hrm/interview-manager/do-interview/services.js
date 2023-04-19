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
