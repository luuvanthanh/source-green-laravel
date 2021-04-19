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

export function update(data = {}) {
  return requestLavarel(`/v1/employees/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(data = {}) {
  return requestLavarel(`/v1/employees/${data.id}`, {
    method: 'GET',
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
// dismisseds

// transfers
export function addTransfers(data = {}) {
  return requestLavarel('/v1/transfers', {
    method: 'POST',
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
