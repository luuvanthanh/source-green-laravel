export const variables = {
  STATUS: {
    NEW: 'NEW',
    CLOSED: 'CLOSED',
    EXPIRE: 'EXPIRE',
    VALIDATING: 'VALIDATING',
    IN_PROGRESS: 'IN_PROGRESS',
    SENT: 'SENT',
  },
  STATUS_NAME: {
    IN_PROGRESS: 'Đang trao đổi',
    CLOSED: 'Đã xác nhận',
    VALIDATING: 'Đang xác nhận',
    NEW: 'Mới',
    EXPIRE: 'Hết hạn',
  },
  STATUS_TABS: [
    {
      id: 'NEW',
      name: 'Mới',
    },
    {
      id: 'IN_PROGRESS',
      name: 'Đang trao đổi',
    },
    {
      id: 'VALIDATING',
      name: 'Đang xác nhận',
    },
    {
      id: 'CLOSED',
      name: 'Đã xác nhận',
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
