import request from '@/utils/request';
import { omit } from 'lodash';
import requestLaravel from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function getRoles(params = {}) {
  return request('/roles', {
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
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
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
      include: Helper.convertIncludes(['positionLevelNow']),
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
      ...data,
      limit: data.limit,
      page: data.page,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
    },
  });
}

export function getAbsentTypes(data = {}) {
  return requestLaravel('/v1/absent-types', {
    method: 'GET',
    params: {
      ...data,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
    },
  });
}

export function getBusInformations(params = {}) {
  return request('/bus-informations', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export function getCurriculumTemplates() {
  return request('/curriculum-templates', {
    method: 'GET',
    params: {
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export function getClassTypes() {
  return requestLaravel('/v1/class-types', {
    method: 'GET',
    params: {},
  });
}

export function getFoodCommons(params) {
  return request('/food-commons', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export function getMeals(params) {
  return request('/meals', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export function getParamaterFormulas(params = {}) {
  return requestLaravel('/v1/paramater-formulas', {
    method: 'GET',
    params,
  });
}

export function getSensitivePeriods(params = {}) {
  return request('/sensitive-periods', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export function getCountLaboursContract(params = {}) {
  return requestLaravel('/v1/labours-contracts?status=GAN_HET_HAN', {
    method: 'GET',
    params,
  });
}

export function getCountProbationaryContract(params = {}) {
  return requestLaravel('/v1/probationary-contracts?status=GAN_HET_HAN', {
    method: 'GET',
    params,
  });
}

export function getEmployee(params = {}) {
  return requestLaravel('/v1/employees', {
    method: 'GET',
    params: {
      ...params,
      limit: 1000,
      include: Helper.convertIncludes(['positionLevel']),
    },
  });
}
