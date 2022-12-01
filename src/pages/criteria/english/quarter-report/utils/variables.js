export const variables = {
  STATUS: {
    NEW: 'NEW',
    CLOSED: 'CLOSED',
    EXPIRE: 'EXPIRE',
    VALIDATING: 'VALIDATING',
    IN_PROGRESS: 'IN_PROGRESS',
    SENT: 'SENT',
    CONFIRMING: 'CONFIRMING',
    CONFIRMED: 'CONFIRMED',
    NOT_YET_REVIEW: 'NOT_YET_REVIEW',
    DONE_REVIEW: 'DONE_REVIEW',
    NOT_YET_CONFIRM: 'NOT_YET_CONFIRM',
    DONE_CONFIRM: 'DONE_CONFIRM',
    NOT_YET_SEND: 'NOT_YET_SEND',
    DONE_SEND: 'DONE_SEND',
  },
  STATUS_NAME: {
    IN_PROGRESS: 'Đang trao đổi',
    CLOSED: 'Đã xác nhận',
    VALIDATING: 'Đang xác nhận',
    NEW: 'Mới',
    EXPIRE: 'Hết hạn',
    CONFIRMING: 'Chờ xác nhận',
    CONFIRMED: 'Đã nhận',
    NOT_YET_REVIEW: 'NOT YET REVIEW',
    DONE_REVIEW: 'DONE REVIEW',
    NOT_YET_CONFIRM: 'NOT YET CONFIRM',
    DONE_CONFIRM: 'DONE CONFIRM',
    NOT_YET_SEND: 'NOT YET SEND',
    DONE_SEND: 'DONE SEND',
  },
  STATUS_TABS: [
    {
      id: 'NOT_YET_REVIEW',
      name: 'NOT YET REVIEW',
    },
    {
      id: 'DONE_REVIEW',
      name: 'DONE REVIEW',
    },
    {
      id: 'NOT_YET_CONFIRM',
      name: 'NOT YET CONFIRM',
    },
    {
      id: 'DONE_CONFIRM',
      name: 'DONE CONFIRM',
    },
    {
      id: 'NOT_YET_SEND',
      name: 'NOT YET SEND',
    },
    {
      id: 'DONE_SEND',
      name: 'DONE SEND',
    },
  ],
  PARENT: 'PARENT',
  TEACHER: 'TEACHER',
  NAME_ROLES: {
    TEACHER: 'Giáo viên',
    PARENT: 'Phụ huynh',
  },
};

export default variables;
