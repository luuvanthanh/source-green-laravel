import React from 'react';
import { Layout } from 'antd';
import { connect, withRouter } from 'umi';
import classnames from 'classnames';
import Menu from '@/components/LayoutComponents/Menu';
import Settings from '@/components/LayoutComponents/Settings';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import TopBar from '@/components/LayoutComponents/TopBar';
import CallCenter from '@/pages/crm/call-center/pop-up/test';
import { stopSession } from '@/pages/crm/call-center/pop-up/handleCallCenter';
import LoginFacebook from '@/components/LayoutComponents/TopBarCrm';

const mapStateToProps = ({ settings, menu }) => ({
  isBorderless: settings.isBorderless,
  isSquaredBorders: settings.isSquaredBorders,
  isFixedWidth: settings.isFixedWidth,
  isMenuShadow: settings.isMenuShadow,
  isMenuTop: settings.isMenuTop,
  isMenuCollapsed: settings.isMenuCollapsed,
  menu,
});

const OBJECTS = {
  MEDIA: {
    icon: '/images/home/movies.svg',
    title: 'Hình ảnh',
    menu: 'menuLeftMedia',
  },
  HRM: {
    icon: '/images/home/hrm.svg',
    title: 'Quản trị nhân sự',
    menu: 'menuLeftHRM',
  },
  HEALTH: {
    icon: '/images/home/tumblr.svg',
    title: 'Sức khỏe',
    menu: 'menuLeftHealth',
  },
  FEE_POLICY: {
    icon: '/images/home/diploma.svg',
    title: 'Chính sách phí',
    menu: 'menuLeftFeePolicy',
  },
  COMMUNICATIONS: {
    icon: '/images/home/speech.svg',
    title: 'Trao đổi',
    menu: 'menuLeftCommunications',
  },
  OBJECT_PROFILES: {
    icon: '/images/home/contact.svg',
    title: 'Hồ sơ đối tượng',
    menu: 'menuLeftObjectProfiles',
  },
  PHYSICAL: {
    icon: '/images/home/physical.svg',
    title: 'Phát triển thể chất',
    menu: 'menuLeftPhysical',
  },
  SALARY: {
    icon: '/images/home/drive.svg',
    title: 'Bảng lương',
    menu: 'menuLeftSalary',
  },
  NOTIFICATION: {
    icon: '/images/home/news.svg',
    title: 'Thông báo',
    menu: 'menuLeftNotification',
  },
  NOTES: {
    icon: '/images/home/pages.svg',
    title: 'Ghi chú',
    menu: 'menuLeftNotes',
  },
  TIME_TABLE: {
    icon: '/images/home/note.svg',
    title: 'Thời khóa biểu',
    menu: 'menuLeftTimeTable',
  },
  MEDICAL: {
    icon: '/images/home/balloons.svg',
    title: 'Y tế',
    menu: 'menuLeftMedical',
  },
  ALLOCATION: {
    icon: '/images/home/pin.svg',
    title: 'Phân bổ',
    menu: 'menuLeftAllocation',
  },
  ATTENDANCE: {
    icon: '/images/home/note.svg',
    title: 'Điểm danh',
    menu: 'menuLeftSchedules',
  },
  MENU: {
    icon: '/images/home/cooking.svg',
    title: 'Bếp',
    menu: 'menuLeftChildren',
  },
  CRITERIA: {
    icon: '/images/home/spreadsheet.svg',
    title: 'Chương trình học',
    menu: 'menuLeftCriteria',
  },
  VEHICEL: {
    icon: '/images/home/road.svg',
    title: 'Bus',
    menu: 'menuLeftVehicel',
  },
  CONFIG: {
    icon: '/images/home/gear.svg',
    title: 'Cấu hình',
    menu: 'menuConfiguration',
  },
  CRM: {
    icon: '/images/home/crm.svg',
    title: 'CRM',
    menu: 'menuLeftCRM',
  },
  CHILD_DEVELOP: {
    icon: '/images/home/spreadsheet.svg',
    title: 'Sự phát triển của trẻ',
    menu: 'menuLeftChildDevelop',
  },
  CURRENCY: {
    icon: '/images/home/spreadsheet.svg',
    title: 'Biểu phí',
    menu: 'menuLeftCurrency',
  },
};

@withRouter
@connect(mapStateToProps)
class MainLayout extends React.PureComponent {
  getKeyMenu = (pathname) => {
    let key = '';
    if (/^\/quan-ly-nhan-su(?=\/|$)/i.test(pathname)) {
      key = 'HRM';
    }
    if (/^\/hinh-anh(?=\/|$)/i.test(pathname)) {
      key = 'MEDIA';
    }
    if (/^\/suc-khoe(?=\/|$)/i.test(pathname)) {
      key = 'HEALTH';
    }
    if (/^\/chinh-sach-phi(?=\/|$)/i.test(pathname)) {
      key = 'FEE_POLICY';
    }
    if (/^\/trao-doi(?=\/|$)/i.test(pathname)) {
      key = 'COMMUNICATIONS';
    }
    if (/^\/ho-so-doi-tuong(?=\/|$)/i.test(pathname)) {
      key = 'OBJECT_PROFILES';
    }
    if (/^\/phat-trien-the-chat(?=\/|$)/i.test(pathname)) {
      key = 'PHYSICAL';
    }
    if (/^\/bang-luong(?=\/|$)/i.test(pathname)) {
      key = 'SALARY';
    }
    if (/^\/thong-bao(?=\/|$)/i.test(pathname)) {
      key = 'NOTIFICATION';
    }
    if (/^\/ghi-chu(?=\/|$)/i.test(pathname)) {
      key = 'NOTES';
    }
    if (/^\/thoi-khoa-bieu(?=\/|$)/i.test(pathname)) {
      key = 'TIME_TABLE';
    }
    if (/^\/y-te(?=\/|$)/i.test(pathname)) {
      key = 'MEDICAL';
    }
    if (/^\/phan-bo(?=\/|$)/i.test(pathname)) {
      key = 'ALLOCATION';
    }
    if (/^\/diem-danh(?=\/|$)/i.test(pathname)) {
      key = 'ATTENDANCE';
    }
    if (/^\/thuc-don(?=\/|$)/i.test(pathname)) {
      key = 'MENU';
    }
    if (/^\/chuong-trinh-hoc(?=\/|$)/i.test(pathname)) {
      key = 'CRITERIA';
    }
    if (/^\/quan-ly-phuong-tien(?=\/|$)/i.test(pathname)) {
      key = 'VEHICEL';
    }
    if (/^\/cau-hinh(?=\/|$)/i.test(pathname)) {
      key = 'CONFIG';
    }
    if (/^\/crm(?=\/|$)/i.test(pathname)) {
      key = 'CRM';
    }
    if (/^\/su-phat-trien-cua-tre(?=\/|$)/i.test(pathname)) {
      key = 'CHILD_DEVELOP';
    }
    if (/^\/bieu-phi(?=\/|$)/i.test(pathname)) {
      key = 'CURRENCY';
    }
    return key;
  };

  componentDidUpdate = (nextProps) => {
    const { location } = this.props;
    if (!nextProps.location.pathname.includes('crm') || !location.pathname.includes('crm')) {
      stopSession();
    }
  };

  render() {
    const {
      children,
      isBorderless,
      isSquaredBorders,
      isFixedWidth,
      isMenuShadow,
      isMenuTop,
      menu,
      location,
    } = this.props;
    const key = this.getKeyMenu(location.pathname);
    return (
      <Layout
        className={classnames({
          settings__borderLess: isBorderless,
          settings__squaredBorders: isSquaredBorders,
          settings__fixedWidth: isFixedWidth,
          settings__menuShadow: isMenuShadow,
          settings__menuTop: isMenuTop,
        })}
      >
        {OBJECTS[key]?.menu && (
          <Menu
            menu={get(menu, [OBJECTS[key]?.menu]) || menu.menuLeftMedia}
            info={{
              icon: OBJECTS[key]?.icon || '/images/home/movies.svg',
              title: OBJECTS[key]?.title || 'Ghi nhận',
            }}
          />
        )}
        <Settings />
        <Layout>
          {key === 'CRM' ? (
            <Layout.Header>
              <LoginFacebook />
            </Layout.Header>
          ) : (
            <Layout.Header>
              <TopBar />
            </Layout.Header>
          )}
          {children}
          {key === 'CRM' && <CallCenter />}
        </Layout>
      </Layout>
    );
  }
}

MainLayout.propTypes = {
  children: PropTypes.any,
  isBorderless: PropTypes.bool,
  isSquaredBorders: PropTypes.bool,
  isFixedWidth: PropTypes.bool,
  isMenuShadow: PropTypes.bool,
  isMenuTop: PropTypes.bool,
  menu: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

MainLayout.defaultProps = {
  children: '',
  isBorderless: false,
  isSquaredBorders: false,
  isFixedWidth: false,
  isMenuShadow: false,
  isMenuTop: false,
  menu: {},
  location: {},
};

export default MainLayout;
