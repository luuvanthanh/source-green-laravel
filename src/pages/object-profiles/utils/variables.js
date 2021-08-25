export const variables = {
  STATUS: {
    REGIST: 'NO_VERIFYE',
    JOIN_CLASS: 'VERIFIED',
    LEAVE_SCHOOL: 'PENDING',
    NO_REGIST: 'NO_REGIST',
    REGISTED: 'REGISTED',
    STORE: 'STORE',
    NO_IMAGE: 'NO_IMAGE',
    HANDLING_IMAGE_FAILED: 'HANDLING_IMAGE_FAILED',
    HANDLING_IMAGE: 'HANDLING_IMAGE',
    HANDLING_IMAGE_SUCCESSFUL: 'HANDLING_IMAGE_SUCCESSFUL',
    DELETED: 'DELETED',
    SYSTEM_ERROR: 'SYSTEM_ERROR'
  },
  STATUS_NAME: {
    REGIST: 'Đăng ký',
    JOIN_CLASS: 'Đã xếp lớp',
    LEAVE_SCHOOL: 'Nghỉ học',
    STORE: 'Lưu trữ',
    NO_IMAGE: 'Chưa có hình',
    HANDLING_IMAGE_FAILED: 'Hình đăng ký không hợp lệ',
    HANDLING_IMAGE: 'Đang xử lý',
    HANDLING_IMAGE_SUCCESSFUL: 'Đã đăng ký',
    DELETED: 'Đã hủy đăng ký',
    SYSTEM_ERROR: 'Lỗi hệ thống'
  },
  TYPE_USER: {
    RANK: 'rank',
    BANK: 'bank',
    INFO: 'info',
    LEVEL: 'level',
    CONFIG: 'config',
    HEALTH: 'health',
    SALARY: 'salary',
    REWARD: 'reward',
    HISTORY: 'history',
    CONTACT: 'contact',
    DAYS_OFF: 'daysOff',
    CONTRACT: 'contract',
    CHILDREN: 'children',
    TIME_WORK: 'timeWork',
    INSURRANCE: 'insurrance',
    CERTIFICAIE: 'certificate',
    MAGNETIC_CARDS: 'magnetic-cards',
    INSURRANCEHEALTH: 'InsurranceHealth',
    MINUTEST_OF_AGREEMENT: 'minutes-of-agreement',
  },
  LIST_PAYMENTS: [
    {
      value: 'CASH',
      name: 'Tiền mặt',
    },
    {
      value: 'TRANSFER',
      name: 'Chuyển khoản',
    },
  ],
  LIST_STATUS_PAYMENTS: [
    {
      value: 'APPLYING',
      name: 'Đang áp dụng',
    },
    {
      value: 'EXPIRED',
      name: 'Hết hiệu lực',
    },
  ],
};

export default variables;
