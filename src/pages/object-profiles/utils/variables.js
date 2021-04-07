export const variables = {
  STATUS : {
    NO_VERIFYE: 'NO_VERIFYE',
    VERIFIED: 'VERIFIED',
    PENDING: 'PENDING',
    VALID: 'VALID',
    EXPIRE: 'EXPIRE',
  },
  STATUS_NAME: {
    NO_VERIFYE: 'Chưa xác nhận',
    VERIFIED: 'Đang học',
    PENDING: 'Làm thủ tục',
    VALID: 'Lỗi',
    EXPIRE: 'Nghỉ học',
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
