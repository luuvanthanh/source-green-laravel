export const variables = {
  STATUS: {
    NOT_INTERVIEWED_YET: 'NOT_INTERVIEWED_YET',
    INTERVIEWED: 'INTERVIEWED',
    NO_SALARY_APPROVAL: 'NO_SALARY_APPROVAL',
    DO_NOT_APPROVECANDIDATES: 'DO_NOT_APPROVECANDIDATES',
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
  },
  STATUS_APPROVED: {
    NO_SALARY_APPROVAL: 'NO_SALARY_APPROVAL',
    DO_NOT_APPROVECANDIDATES: 'DO_NOT_APPROVECANDIDATES',
    APPROVED: 'APPROVED',
  },
  STATUS_NAME: {
    NOT_INTERVIEWED_YET: 'Chưa phỏng vấn',
    INTERVIEWED: 'Đã phỏng vấn',
    NO_SALARY_APPROVAL: 'Không duyệt lương',
    PENDING: 'Chờ duyệt',
    DO_NOT_APPROVECANDIDATES: 'Không duyệt ứng viên',
    APPROVED: 'Đã duyệt',
  },
  STATUS_APPROVED_NAME: {
    NO_SALARY_APPROVAL: 'Không duyệt lương',
    DO_NOT_APPROVECANDIDATES: 'Không duyệt ứng viên',
    APPROVED: 'duyệt',
  },
  STATUS_DATA: [
   { id: 'NOT_INTERVIEWED_YET', name: 'Chưa phỏng vấn'},
   { id: 'INTERVIEWED', name: 'Đã phỏng vấn'},
   { id: 'NO_SALARY_APPROVAL', name: 'Không duyệt lương'},
   { id: 'PENDING', name: 'Chờ duyệt'},
   { id: 'DO_NOT_APPROVECANDIDATES', name: 'Không duyệt ứng viên'},
   { id: 'APPROVED', name: 'Đã duyệt'},
  ],
};

export default variables;
