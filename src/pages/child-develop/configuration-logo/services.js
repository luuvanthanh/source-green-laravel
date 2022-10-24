import requestLavarel from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function add(data = {}) {
  return requestLavarel('/v1/logos', {
    method: 'POST',
    data: {
      ...data,
      dateOfBirth: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.dateOfBirth,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      dateOfIssueIdCard: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.dateOfIssueIdCard,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
  });
}

export function details() {
  return requestLavarel(`/v1/logos`, {
    method: 'GET',
    params: {},
  });
}
