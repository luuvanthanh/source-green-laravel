import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function get(data = {}) {
  return request('/v1/holidays', {
    method: 'GET',
    params: {
      limit: data.limit,
      page: data.page,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes(['holidayDetails']),
      search: Helper.convertParamSearchConvert({
        Name: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: data.date,
            targetValue: '23:59:59',
          }),
          format: variables.DATE_FORMAT.YEAR,
          isUTC: false,
        }),
      }),
    },
  });
}

export function remove(data) {
  return request(`/v1/holidays`, {
    method: 'POST',
    data,
    parse: true,
  });
}

export function add(data = {}) {
  return request('/v1/holidays', {
    method: 'POST',
    data,
  });
}
