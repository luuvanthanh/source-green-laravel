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
    { id: 'PENDING', name: 'Chưa nhận' },
    { id: 'RECEIVED', name: 'Đã nhận' },
    { id: 'PROCESSED', name: 'Hoàn thành' },
  ],
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
  TITLE_BUS: {
    TOTAL: {
      status: '',
      title: 'Trẻ đăng ký xe bus',
      title_quantity: 'Số trẻ đăng ký xe bus',
      title_popup: 'Danh sách trẻ đăng ký xe bus'
    },
    ABSENT: {
      status: 'ABSENCE',
      title: 'Số trẻ đăng ký nhưng vắng',
      title_quantity: 'Số trẻ đăng ký nhưng vắng',
      title_popup: 'Danh sách trẻ đăng ký nhưng vắng'
    },
    SCHOOL: {
      title: 'Đi đến trường',
      status: 'SCHOOLWARD',
      SCHOOLGETIN: {
        status_school: 'SCHOOLGETIN',
        title: 'Trẻ lên xe',
        title_quantity: 'Số trẻ lên xe',
        title_popup: 'Danh sách trẻ lên xe - Đi đến trường'
      },
      SCHOOLGETOFF: {
        status_school: 'SCHOOLGETOFF',
        title: 'Trẻ xuống xe',
        title_quantity: 'Số trẻ xuống xe',
        title_popup: 'Danh sách trẻ xuống xe - Đi đến trường'
      }
    },
    HOME: {
      title: 'Đi về nhà',
      status: 'HOMEWARD',
      HOMEGETIN: {
        status_home: 'HOMEGETIN',
        title: 'Trẻ lên xe',
        title_quantity: 'Số trẻ lên xe',
        title_popup: 'Danh sách trẻ lên xe - Đi về nhà'
      },
      HOMEGETOFF: {
        status_home: 'HOMEGETOFF',
        title: 'Trẻ xuống xe',
        title_quantity: 'Số trẻ xuống xe',
        title_popup: 'Danh sách trẻ xuống xe - Đi về nhà'
      }
    },
  }
};

export default variables;
