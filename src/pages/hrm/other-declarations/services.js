import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function get(data = {}) {
  return request('/v1/other-declarations', {
    method: 'GET',
    params: {
      limit: data.limit,
      page: data.page,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      startDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.startDate,
          targetValue: '00:00:00',
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      endDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.endDate,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      include: Helper.convertIncludes(['employee', 'otherDeclarationDetail.employee']),
      fullName: data.fullName,
      search: Helper.convertParamSearchConvert({
        type: data.type,
      }),
    },
  });
}

export function getParamaterValues() {
  return request(`/v1/paramater-values`, {
    method: 'GET',
    params: {
      type: 'DECLARE',
      search: Helper.convertParamSearchConvert({
        Type: 'DECLARE',
      }),
    },
  });
}

export function remove(id) {
  return request(`/v1/other-declarations/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
