export const variables = {
  STATUS: {
    NO_VERIFYE: 'NO_VERIFYE',
    VERIFIED: 'VERIFIED',
    PENDING: 'PENDING',
    VALID: 'VALID',
    EXPIRE: 'EXPIRE',
  },
  STATUS_NAME: {
    NO_VERIFYE: 'Chưa xác nhận',
    VERIFIED: 'Đang hoạt động',
    PENDING: 'Làm thủ tục',
    VALID: 'Lỗi',
    EXPIRE: 'Nghỉ học',
  },
  STATUS_SHIFT: {
    ON: 'ON',
    OFF: 'OFF',
    ALL: 'ALL',
    TOTAL: 'TOTAL',
  },
  ACTION_TYPE_STATUS: [
    {
      id: 'ARRAGECLASS',
      name: 'Xếp lớp',
    },
    {
      id: 'TRANSFERCLASS',
      name: 'Điều chuyển lớp',
    },
    {
      id: 'ARRAGEDEPARTMENT',
      name: 'Xếp phòng ban',
    },
    {
      id: 'TRANSFERDEPARTMENT',
      name: 'Điều chuyển phòng ban',
    },
  ],
  ACTION_TYPE: {
    ARRAGECLASS: 'Xếp lớp',
    TRANSFERCLASS: 'Điều chuyển lớp',
    ARRAGEDEPARTMENT: 'Xếp phòng ban',
    TRANSFERDEPARTMENT: 'Điều chuyển phòng ban',
  },
};

export default variables;
