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
  },
  STATUS_NAME: {
    IN_PROGRESS: 'Đang trao đổi',
    CLOSED: 'Đã xác nhận',
    VALIDATING: 'Đang xác nhận',
    NEW: 'Mới',
    EXPIRE: 'Hết hạn',
    CONFIRMING: 'Chờ xác nhận', 
    CONFIRMED: 'Đã nhận',
  },
  STATUS_TABS: [
    {
      id: 'CONFIRMING',
      name: 'Chờ xác nhận',
    },
    {
      id: 'CONFIRMED',
      name: 'Đã nhận',
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
