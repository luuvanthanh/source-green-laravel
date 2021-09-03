export const variables = {
  TABS: [
    { id: 'overview', name: 'Tổng quan' },
    { id: 'warning', name: 'Cảnh báo' },
    { id: 'activity', name: 'Hoạt động' },
    { id: 'student', name: 'Học sinh' },
    { id: 'application', name: 'Ứng dụng' },
  ],
  NOTE: [
    { id: 'CONFIRMING', name: 'Chưa nhận' },
    { id: 'CONFIRMED', name: 'Đã nhận' },
  ],
  STATUS_NOTE: [
    {
      id: '',
      name: 'Tất cả trạng thái',
    },
    {
      id: 'CONFIRMING',
      name: 'Chờ xác nhận',
    },
    {
      id: 'CONFIRMED',
      name: 'Đã nhận',
    },
  ],
  MEDICAL: [
    { id: 'RECEIVED', name: 'Nhận thuốc' },
    { id: 'DRINK', name: 'Cho uống' },
  ],
  STATUS: {
    RECEIVED: 'RECEIVED',
    DRINK: 'DRINK',
  },
  DATA_ATTENDANCE: [
    {
      id: 'student',
      name: 'Sỉ số trẻ',
      number: '0',
      image: '/images/icon/contacts.svg',
      title: 'Danh sách sỉ số trẻ',
    },
    {
      id: 'haveIn',
      name: 'Điểm danh vào lớp',
      number: '0',
      image: '/images/icon/books.svg',
      title: 'Danh sách điểm danh vào lớp',
      status: 'HAVE_IN,HAVE_OUT',
      isAttendance: true,
    },
    {
      id: 'unpaidLeave',
      name: 'Vắng không phép',
      number: '0',
      image: '/images/icon/sad.svg',
      title: 'Danh sách trẻ vắng không phép',
      status: 'UNPAID_LEAVE',
      isAttendance: true,
    },
    {
      id: 'annualLeave',
      name: 'Vắng có phép',
      number: '0',
      image: '/images/icon/happy.svg',
      title: 'Danh sách trẻ vắng có phép',
      status: 'ANNUAL_LEAVE',
      isAttendance: true,
    },
  ],
  MENU: [
    {
      id: 'bus',
      name: 'Bus',
      image: '/images/home/road.svg',
    },
    {
      id: 'childrenInClass',
      name: 'Trẻ vào lớp',
      image: '/images/home/note.svg',
    },
    {
      id: 'health',
      name: 'Sức khỏe',
      image: '/images/home/tumblr.svg',
    },
    {
      id: 'note',
      name: 'Ghi chú',
      image: '/images/home/pages.svg',
    },
    {
      id: 'medical',
      name: 'Y tế',
      image: '/images/home/balloons.svg',
    },
    {
      id: 'programStudy',
      name: 'Chương trình học',
      image: '/images/home/spreadsheet.svg',
    },
  ],
  TABS_BUS: [
    { id: 'SCHOOLWARD', name: 'Đón trẻ' },
    { id: 'HOMEAWARD', name: 'Trả trẻ' },
  ],
  TABS_HEALTH: [
    { id: 'everyDay', name: 'Thường nhật' },
    { id: 'chart', name: 'Biểu đồ thống kê' },
    { id: 'history', name: 'Lịch sử nhập' },
  ],
  STATUS_TIME_CODE: [
    {
      id: '',
      name: 'Tất cả thời gian',
    },
    {
      id: 'BEFORE_BREAKFAST',
      name: 'Trước ăn sáng',
    },
    {
      id: 'AFTER_BREAKFAST',
      name: 'Sau ăn sáng',
    },
    {
      id: 'BEFORE_SECOND_BREAKFAST',
      name: 'Trước xế sáng',
    },
    {
      id: 'AFTER_SECOND_BREAKFAST',
      name: 'Sau xế sáng',
    },
    {
      id: 'BEFORE_LUNCH',
      name: 'Trước ăn trưa',
    },
    {
      id: 'AFTER_LUNCH',
      name: 'Sau ăn trưa',
    },
    {
      id: 'BEFORE_SECOND_LUNCH',
      name: 'Trước xế trưa',
    },
    {
      id: 'AFTER_SECOND_LUNCH',
      name: 'Sau xế trưa',
    },
    {
      id: 'BEFORE_TEA_TIME',
      name: 'Trước xế chiều',
    },
    {
      id: 'AFTER_TEA_TIME',
      name: 'Sau xế chiều',
    },
  ],
  STATUS_TIME_CODE_NAME: {
    BEFORE_BREAKFAST: 'Trước ăn sáng',
    AFTER_BREAKFAST: 'Sau ăn sáng',
    BEFORE_LUNCH: 'Trước ăn trưa',
    AFTER_LUNCH: 'Sau ăn trưa',
    BEFORE_SECOND_BREAKFAST: 'Trước xế sáng',
    AFTER_SECOND_BREAKFAST: 'Sau xế sáng',
    BEFORE_SECOND_LUNCH: 'Trước xế trưa',
    AFTER_SECOND_LUNCH: 'Sau xế trưa',
    BEFORE_TEA_TIME: 'Trước xế chiều',
    AFTER_TEA_TIME: 'Sau xế chiều',
  },
  STATUS_TIME: {
    BEFORE_BREAKFAST: 'BEFORE_BREAKFAST',
    AFTER_BREAKFAST: 'AFTER_BREAKFAST',
    BEFORE_LUNCH: 'BEFORE_LUNCH',
    AFTER_LUNCH: 'AFTER_LUNCH',
    BEFORE_SECOND_BREAKFAST: 'BEFORE_SECOND_BREAKFAST',
    AFTER_SECOND_BREAKFAST: 'AFTER_SECOND_BREAKFAST',
    BEFORE_SECOND_LUNCH: 'BEFORE_SECOND_LUNCH',
    AFTER_SECOND_LUNCH: 'AFTER_SECOND_LUNCH',
    BEFORE_TEA_TIME: 'BEFORE_TEA_TIME',
    AFTER_TEA_TIME: 'AFTER_TEA_TIME',
  },
  TITLE_BUS: {
    TOTAL: {
      status: '',
      title: 'Trẻ đăng ký xe bus',
      title_quantity: 'Số trẻ đăng ký xe bus',
      title_popup: 'Danh sách trẻ đăng ký xe bus',
      field: 'studentTotal',
    },
    ABSENT: {
      status: 'ABSENCE',
      title: 'Số trẻ đăng ký nhưng vắng',
      title_quantity: 'Số trẻ đăng ký nhưng vắng',
      title_popup: 'Danh sách trẻ đăng ký nhưng vắng',
      field: 'absentStudentTotal',
    },
    SCHOOL: {
      status: 'SCHOOLWARD',
      title: 'Đi đến trường',
      title_popup: 'Danh sách trẻ đi đến trường',
      field: '',
      get_in: {
        status_school: 'SCHOOLGETIN',
        title: 'Trẻ lên xe',
        title_quantity: 'Số trẻ lên xe',
        field: 'schoolGetInStatusTotal',
      },
      get_off: {
        status_school: 'SCHOOLGETOFF',
        title: 'Trẻ xuống xe',
        title_quantity: 'Số trẻ xuống xe',
        field: 'schoolGetOffStatusTotal',
      },
    },
    HOME: {
      status: 'HOMEWARD',
      title: 'Đi về nhà',
      title_popup: 'Danh sách trẻ đi về nhà',
      field: '',
      get_in: {
        status_home: 'HOMEGETIN',
        title: 'Trẻ lên xe',
        title_quantity: 'Số trẻ lên xe',
        field: 'homeGetInStatusTotal',
      },
      get_off: {
        status_home: 'HOMEGETOFF',
        title: 'Trẻ xuống xe',
        title_quantity: 'Số trẻ xuống xe',
        field: 'homeGetOffStatusTotal',
      },
    },
  },
  NO_GET_IN_BUS: 'Không đăng ký xe Bus',
  NO_BUS_ROUTE: 'Chưa có lộ trình',
  ABSENT_WITHOUT_PERMISSION: 'Vắng không phép',
  ABSENT_WITH_PERMISSION: 'Vắng không phép',
};

export default variables;
