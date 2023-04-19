import request from '@/utils/requestLavarel';
import {  Helper } from '@/utils';

export function add(data = {}) {
  return request('/v1/interview-configurations', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/interview-configurations/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
    },
  });
}

export function getData(params = {}) {
  return request(`/v1/interview-configurations/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['interviewConfigurationEvaluationCriteria,division']),
    },
  });
}
