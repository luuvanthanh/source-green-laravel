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
    SYSTEM_ERROR: 'SYSTEM_ERROR',
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
    SYSTEM_ERROR: 'Lỗi hệ thống',
  },
  STATUS_SHIFT: {
    ON: 'ON',
    OFF: 'OFF',
    ALL: 'ALL',
    TOTAL: 'TOTAL',
  },
  TYPES_PARAMATER_VALUES: [
    {
      id: 'CONTRACT',
      name: 'Tham số theo hợp đồng',
    },
    {
      id: 'COMMON',
      name: 'Tham số dùng chung',
    },
    {
      id: 'DECLARE',
      name: 'Tham số khai báo hàng tháng',
    },
  ],
  PARAMATER_VALUES: {
    CONTRACT: 'CONTRACT',
    COMMON: 'COMMON',
    DECLARE: 'DECLARE',
  },
  PARAMATER_VALUES_NAME: {
    CONTRACT: 'Tham số theo hợp đồng',
    COMMON: 'Tham số dùng chung',
    DECLARE: 'Tham số khai báo hàng tháng',
  },
  PARENT: 'PARENT',
  EMPLOYEES: 'EMPLOYEES',
  DATE_OF_WEEK: {
    0: 'su',
    1: 'mo',
    2: 'tu',
    3: 'we',
    4: 'th',
    5: 'fr',
    6: 'sa',
  },
  TYPE_EARLY_LATE: {
    LATE: 'LATE',
    EARLY: 'EARLY',
  },
  TYPE_CONSTRACT: {
    THU_VIEC: 'Thử việc',
    HOP_DONG: 'Hợp đồng',
    THOI_VU: 'Thời vụ',
  },
  TYPE_ABSENTS_NAME: {
    ABSENT: 'Nghỉ phép  ',
    BUSINESS_TRAVEL: 'Công tác',
    ADD_TIME: 'Làm thêm',
    GO_OUT: 'Đi ra ngoài',
    MATERNITY_LEAVE: 'Nghỉ thai sản',
    WORK_HOME: 'Làm tại nhà',
  },
  TYPE_ABSENTS: {
    ABSENT: 'ABSENT',
    BUSINESS_TRAVEL: 'BUSINESS_TRAVEL',
    ADD_TIME: 'ADD_TIME',
    GO_OUT: 'GO_OUT',
    MATERNITY_LEAVE: 'MATERNITY_LEAVE',
    WORK_HOME: 'WORK_HOME',
  },
  TYPES_ABSENTS: [
    {
      id: 'ABSENT',
      name: 'Nghỉ phép',
    },
  ],
  TYPES_DIFFIRENT_ABSENTS: [
    {
      id: 'BUSINESS_TRAVEL',
      name: 'Công tác',
    },
    {
      id: 'ADD_TIME',
      name: 'Làm thêm',
    },
    {
      id: 'GO_OUT',
      name: 'Đi ra ngoài',
    },
    {
      id: 'MATERNITY_LEAVE',
      name: 'Nghỉ thai sản',
    },
    {
      id: 'WORK_HOME',
      name: 'Làm tại nhà',
    },
  ],
  TYPES_DIFFIRENT_OUT: [
    {
      id: 'BUSINESS_TRAVEL',
      name: 'Công tác',
    },
    {
      id: 'GO_OUT',
      name: 'Đi ra ngoài',
    },
    {
      id: 'WORK_HOME',
      name: 'Làm tại nhà',
    },
  ],
  SHIFT_CODES: [
    {
      id: 'Ca sáng',
      name: 'Ca sáng',
    },
    {
      id: 'Ca chiều',
      name: 'Ca chiều',
    },
  ],
  TYPE_EARLY_LATES: [
    {
      id: 'LATE',
      name: 'Đi trễ',
    },
    {
      id: 'EARLY',
      name: 'Về sớm',
    },
  ],
};

export default variables;
