import request from '@/utils/request';
import { omit } from 'lodash';
import requestLogin from '@/utils/requestLogin';
import requestLaravel from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function getRoles(params = {}) {
  return requestLogin('/api/identity/roles', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export function getStudents(params = {}) {
  return request('/students', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export function getBranches(params = {}) {
  return requestLaravel('/v1/branches', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getClasses(params = {}) {
  return request('/classes', {
    method: 'GET',
    params,
  });
}

export function getTeachers(params = {}) {
  return requestLaravel('/v1/employees', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getDivisions(params = {}) {
  return requestLaravel('/v1/divisions', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getPositions(params = {}) {
  return requestLaravel('/v1/positions', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getParamaterValues(params = {}) {
  return requestLaravel('/v1/paramater-values', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getTypeOfContracts(params = {}) {
  return requestLaravel('/v1/type-of-contracts', {
    method: 'GET',
    params: {
      ...params,
      search: Helper.convertParamSearchConvert({
        Name: params.name,
        Type: params.type,
      }),
      include: Helper.convertIncludes(['parameterValues', 'parameterFormulas']),
    },
  });
}

export function getUsers(params = {}) {
  return requestLaravel('/v1/employees', {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['positionLevel']),
    },
  });
}

export function getEmployees(params = {}) {
  return requestLaravel('/v1/employees', {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['positionLevel']),
    },
  });
}

export function getParents(params = {}) {
  return request('/parents', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function getShifts(params = {}) {
  return requestLaravel('/v1/shifts', {
    method: 'GET',
    params: {
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes(['shiftDetail']),
      search: Helper.convertParamSearchConvert({
        StoreId: params.storeId,
        ShiftCode: params.shiftCode,
      }),
    },
  });
}

export function getHolidays(params = {}) {
  return requestLaravel('/v1/holidays', {
    method: 'GET',
    params: {
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes(['holidayDetails']),
      search: Helper.convertParamSearchConvert({
        Name: params.name,
      }),
    },
  });
}

export function getAttendancesReasons(data = {}) {
  return requestLaravel('/v1/attendances-reasons', {
    method: 'GET',
    params: {
      limit: data.limit,
      page: data.page,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      search: Helper.convertParamSearchConvert({
        Name: data.name,
      }),
    },
  });
}

export function getAbsentTypes(data = {}) {
  return requestLaravel('/v1/absent-types', {
    method: 'GET',
    params: {
      ...data,
      limit: data.limit,
      page: data.page,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      search: Helper.convertParamSearchConvert({
        name: data.name,
      }),
    },
  });
}
