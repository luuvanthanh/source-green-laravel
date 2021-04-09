import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function get(data = {}) {
  return request('/v1/late-early', {
    method: 'GET',
    params: {
      limit: data.limit,
      page: data.page,
      orderBy: 'id',
      sortedBy: 'desc',
      searchJoin: 'and',
      start_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.start_date,
          targetValue: '00:00:00',
        }),
        isUTC: false,
      }),
      end_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.end_date,
          targetValue: '23:59:59',
        }),
        isUTC: false,
      }),
      include: Helper.convertIncludes(['timekeeping', 'lateEarlyConfig', 'user']),
      search: Helper.convertParamSearchConvert({
        'user.full_name': data.full_name,
      }),
    },
  });
}
