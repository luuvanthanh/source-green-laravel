// eslint-disable-next-line import/extensions
import { permissions } from '../../config/permissions';
import animationImage from './animation.json';

export const feature = {
  FEATURES: [
    {
      title: 'Thông báo',
      src: '/images/home/news.svg',
      animation: animationImage.notification,
      url: '/thong-bao/danh-sach',
      permission: [permissions.THONGBAO],
    },
    {
      title: 'Hồ sơ đối tượng',
      src: '/images/home/contact.svg',
      animation: animationImage.profile,
      url: '/ho-so-doi-tuong',
      permission: [permissions.HSDT],
    },
    {
      title: 'Phân bổ',
      src: '/images/home/pin.svg',
      animation: animationImage.allotment,
      url: '/phan-bo',
      permission: [permissions.PB],
    },
    {
      title: 'Trao đổi',
      src: '/images/home/speech.svg',
      animation: animationImage.communication,
      url: '/trao-doi',
      permission: [permissions.TD],
    },
    {
      title: 'Ghi nhận',
      src: '/images/home/movies.svg',
      animation: animationImage.record,
      url: '/ghi-nhan/danh-sach',
      permission: [permissions.HA],
    },
    {
      title: 'Ghi chú',
      src: '/images/home/pages.svg',
      animation: animationImage.note,
      url: '/ghi-chu',
      permission: [permissions.GHICHU],
    },
    {
      title: 'Điểm danh trẻ',
      src: '/images/home/note.svg',
      animation: animationImage.attendance,
      url: '/diem-danh',
      permission: [permissions.DD],
    },
    {
      title: 'Chương trình học',
      src: '/images/home/spreadsheet.svg',
      animation: animationImage.programStudy,
      url: '/chuong-trinh-hoc/danh-gia-hoc-tap',
      permission: [permissions.CTH],
    },
    {
      title: 'Bus',
      src: '/images/home/road.svg',
      animation: animationImage.bus,
      url: '/quan-ly-phuong-tien',
      permission: [permissions.BUS],
    },
    {
      title: 'Y tế',
      src: '/images/home/balloons.svg',
      animation: animationImage.medical,
      url: '/y-te',
      permission: [permissions.YTE],
    },
    {
      title: 'Thời khóa biểu',
      src: '/images/home/calendar.svg',
      animation: animationImage.calendar,
      url: '/thoi-khoa-bieu',
      permission: [permissions.TKB],
    },
    {
      title: 'Bếp',
      src: '/images/home/cooking.svg',
      animation: animationImage.kitchen,
      url: '/thuc-don',
      permission: [permissions.BEP],
    },
    {
      title: 'Biếu phí',
      src: '/images/home/currency.svg',
      animation: animationImage.tariffs,
      url: '/',
      permission: [permissions.BIEUPHI],
    },
    {
      title: 'Bảng lương',
      src: '/images/home/drive.svg',
      animation: animationImage.salary,
      url: '/bang-luong',
      permission: [permissions.BANGLUONG],
    },
    {
      title: 'Sức khỏe',
      src: '/images/home/tumblr.svg',
      animation: animationImage.health,
      url: '/suc-khoe',
      permission: [permissions.SUCKHOE],
    },
    {
      title: 'Quản trị nhân sự',
      src: '/images/home/hrm.svg',
      animation: animationImage.administration,
      url: '/quan-ly-nhan-su',
      permission: [permissions.HRM],
    },
    {
      title: 'Chính sách phí',
      src: '/images/home/diploma.svg',
      animation: animationImage.feePolicy,
      url: '/chinh-sach-phi',
      permission: [permissions.CHINHSACHPHI],
    },
    {
      title: 'Cấu hình',
      src: '/images/home/gear.svg',
      animation: animationImage.setting,
      url: '/cau-hinh',
      permission: [permissions.CAUHINH],
    },
    {
      title: 'Camera AI',
      src: '/images/home/chip.svg',
      animation: animationImage.cameraAI,
      url: URL_AI,
      target: true,
      permission: [permissions.CAMERAAI],
    },
  ],
};

export default feature;
