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
      name: 'Tất cả trạng thái'
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
  DATA_BUS: [
    {
      id: '1',
      name: 'Số trẻ đăng ký xe bus',
      number: '56',
      image: '/images/icon/letter.svg'
    },
    {
      id: '2',
      name: 'Đón trẻ lên xe',
      number: '56',
      image: '/images/icon/up-arrow.svg'
    },
    {
      id: '3',
      name: 'Đón trẻ xuống xe',
      number: '56',
      image: '/images/icon/down-arrow.svg'
    },
    {
      id: '4',
      name: 'Trả trẻ lên xe',
      number: '56',
      image: '/images/icon/up-arrow.svg'
    },
    {
      id: '5',
      name: 'Trả trẻ xuống xe',
      number: '56',
      image: '/images/icon/down-arrow.svg'
    }
  ],
  ATTENDANCE: [
    {
      id: 'QUANTITY',
      name: 'Sỉ số trẻ',
      number: '150',
      image: '/images/icon/contacts.svg'
    },
    {
      id: 'CHILDREN_IN_CLASS',
      name: 'Điểm danh vào lớp',
      number: '143',
      image: '/images/icon/books.svg'
    },
    {
      id: 'UNPAID_LEAVE',
      name: 'Vắng không phép',
      number: '15',
      image: '/images/icon/sad.svg'
    },
    {
      id: 'ANNUAL_LEAVE',
      name: 'Vắng có phép',
      number: '13',
      image: '/images/icon/happy.svg'
    }
  ],
  MENU: [
    {
      id: 'bus',
      name: 'Bus',
      image: '/images/home/road.svg'
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
      name: 'Tất cả thời gian'
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
      name: 'Trước xế sáng'
    },
    {
      id: 'AFTER_SECOND_BREAKFAST',
      name: 'Sau xế sáng'
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
    AFTER_TEA_TIME: 'Sau xế chiều'
  },
};

export default variables;
