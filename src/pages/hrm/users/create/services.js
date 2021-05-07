import requestLavarel from '@/utils/requestLavarel';
import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function getDegrees(params = {}) {
  return requestLavarel('/v1/degrees', {
    method: 'GET',
    params: {
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}

export function getTrainingMajors(params = {}) {
  return requestLavarel('/v1/training-majors', {
    method: 'GET',
    params: {
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}

export function getTrainingSchools(params = {}) {
  return requestLavarel('/v1/training-schools', {
    method: 'GET',
    params: {
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}

export function getBranches(params = {}) {
  return requestLavarel('/v1/branches', {
    method: 'GET',
    params: {
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}

export function getDivisions(params = {}) {
  return requestLavarel('/v1/divisions', {
    method: 'GET',
    params: {
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}

export function getPositions(params = {}) {
  return requestLavarel('/v1/positions', {
    method: 'GET',
    params: {
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}

export function add(data = {}) {
  return requestLavarel('/v1/employees', {
    method: 'POST',
    data,
  });
}

export function addPositionLevels(data = {}) {
  return requestLavarel('/v1/position-levels', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return requestLavarel(`/v1/employees/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(data = {}) {
  return requestLavarel(`/v1/employees/${data.id}`, {
    method: 'GET',
    params: {
      include: Helper.convertIncludes(['positionLevel']),
    }
  });
}

export function addAccount(data = {}) {
  return request(`/employee-accounts`, {
    method: 'POST',
    data,
  });
}

export function detailsAccount(data = {}) {
  return request(`/employees/${data.id}/account`, {
    method: 'GET',
  });
}

export function updateStatus(data = {}) {
  return request(`/employees/${data.id}/update-status?status=${data.status}`, {
    method: 'PUT',
    data,
  });
}

// dismisseds
export function getDismisseds(params = {}) {
  return requestLavarel('/v1/dismisseds', {
    method: 'GET',
    params: {
      employeeId: params.id,
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}

export function addDismisseds(data = {}) {
  return requestLavarel('/v1/dismisseds', {
    method: 'POST',
    data,
  });
}

export function updateDismisseds(data = {}) {
  return requestLavarel(`/v1/dismisseds/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function removeDismisseds(data = {}) {
  return requestLavarel(`/v1/dismisseds/${data.id}`, {
    method: 'DELETE',
    data,
  });
}
// dismisseds

// dismisseds
export function getAppoints(params = {}) {
  return requestLavarel('/v1/appoints', {
    method: 'GET',
    params: {
      employeeId: params.id,
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}

export function addAppoints(data = {}) {
  return requestLavarel('/v1/appoints', {
    method: 'POST',
    data,
  });
}

export function updateAppoints(data = {}) {
  return requestLavarel(`/v1/appoints/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function removeAppoints(data = {}) {
  return requestLavarel(`/v1/appoints/${data.id}`, {
    method: 'DELETE',
    data,
  });
}
// dismisseds

// transfers
export function addTransfers(data = {}) {
  return requestLavarel('/v1/transfers', {
    method: 'POST',
    data,
  });
}
export function updateTransfers(data = {}) {
  return requestLavarel(`/v1/transfers/${data.id}`, {
    method: 'PUT',
    data,
  });
}
export function removeTransfers(data = {}) {
  return requestLavarel(`/v1/transfers/${data.id}`, {
    method: 'DELETE',
    data,
  });
}
export function getTransfers(params = {}) {
  return requestLavarel('/v1/transfers', {
    method: 'GET',
    params: {
      employeeId: params.id,
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}
// transfers

// contract
export function getContractTypes(params = {}) {
  return requestLavarel('/v1/type-of-contracts', {
    method: 'GET',
    params: {
      ...params,
      include: 'parameterValues,parameterFormulas',
      search: Helper.convertParamSearchConvert({
        Name: params.name,
      }),
    },
  });
}
export function addContract(data) {
  return requestLavarel('/v1/labours-contracts', {
    method: 'POST',
    data,
  });
}
export function getContracts(params) {
  return requestLavarel('/v1/labours-contracts', {
    method: 'GET',
    params: {
      ...params,
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
      include: 'typeOfContract,position,branch',
    },
  });
}
// contract

// probationary contract
export function addProbationaryContract(data) {
  return requestLavarel('/v1/probationary-contracts', {
    method: 'POST',
    data,
  });
}
export function getProbationaryContracts(params) {
  return requestLavarel('/v1/probationary-contracts', {
    method: 'GET',
    params: {
      ...params,
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
      include: 'typeOfContract,position,branch',
    },
  });
}
// probationary contract

// decision-rewards
export function addDecisionRewards(data = {}) {
  return requestLavarel('/v1/decision-rewards', {
    method: 'POST',
    data,
  });
}
export function updateDecisionRewards(data = {}) {
  return requestLavarel(`/v1/decision-rewards/${data.id}`, {
    method: 'PUT',
    data,
  });
}
export function removeDecisionRewards(data = {}) {
  return requestLavarel(`/v1/decision-rewards/${data.id}`, {
    method: 'DELETE',
    data,
  });
}
export function getDecisionRewards(params = {}) {
  return requestLavarel('/v1/decision-rewards', {
    method: 'GET',
    params: {
      employeeId: params.id,
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}
// decision-rewards

// paramater-values
export function getParamaterValues(params = {}) {
  return requestLavarel('/v1/paramater-values', {
    method: 'GET',
    params: {
      orderBy: 'Id',
      sortedBy: 'desc',
      searchJoin: 'and',
    },
  });
}
// paramater-values

// paramater-formulas
export function getParamaterFormulas(params = {}) {
  return requestLavarel('/v1/paramater-formulas', {
    method: 'GET',
    params: {
      orderBy: 'Id',
      sortedBy: 'desc',
      searchJoin: 'and',
    },
  });
}
// paramater-formulas

export function faceRegistration(data = {}) {
  return request(`/employees/${data.id}/face-registration`, {
    method: 'POST',
    data,
  });
}
