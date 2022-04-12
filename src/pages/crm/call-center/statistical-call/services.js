import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/report-calls', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getChartEmployee(params = {}) {
  return request('/v1/report-calls', {
    method: 'GET',
    params: {
      ...params,
    },
    // parse: true,
  });
}

export function getSaler(params = {}) {
  return request('/v1/employees', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
