import React, { Fragment } from 'react';
import { connect, Redirect } from 'umi';
import NProgress from 'nprogress';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import Loader from '@/components/LayoutComponents/Loader';
import PublicLayout from './Public';
import LoginLayout from './Login';
import MainLayout from './Main';
import ExchangeLayout from './Exchange';
import ObjectProfiles from './Object-Profiles';
import SchedulesLayout from './Schedules';
import ConfigurationLayout from './Configuration';
import VehicelLayout from './Vehicel';
import CriteriaLayout from './Criteria';
import MenuLayout from './Menu';
import AllocationLayout from './Allocation';
import MedicalLayout from './Medical';
import AttendanceLayout from './Attendance';
import TimetableLayout from './Timetable';

const Layouts = {
  public: PublicLayout,
  login: LoginLayout,
  main: MainLayout,
  exchange: ExchangeLayout,
  objectProfiles: ObjectProfiles,
  timetable: SchedulesLayout,
  configuration: ConfigurationLayout,
  vehicel: VehicelLayout,
  criteria: CriteriaLayout,
  menu: MenuLayout,
  allocation: AllocationLayout,
  medical: MedicalLayout,
  attendance: AttendanceLayout,
  timetable: TimetableLayout,
};

@connect(({ user, loading }) => ({ user, loading }))
class IndexLayout extends React.PureComponent {
  previousPath = '';

  render() {
    const {
      children,
      loading,
      location: { pathname, search, query },
      user,
    } = this.props;

    // Layout Rendering
    const getLayout = () => {
      if (/^\/login(?=\/|$)/i.test(pathname)) {
        return 'login';
      }
      if (/^\/trang-chu(?=\/|$)/i.test(pathname)) {
        return 'public';
      }
      if (/^\/trao-doi(?=\/|$)/i.test(pathname)) {
        return 'exchange';
      }
      if (/^\/ho-so-doi-tuong(?=\/|$)/i.test(pathname)) {
        return 'objectProfiles';
      }
      if (/^\/diem-danh(?=\/|$)/i.test(pathname)) {
        return 'attendance';
      }
      if (/^\/cau-hinh(?=\/|$)/i.test(pathname)) {
        return 'configuration';
      }
      if (/^\/quan-ly-phuong-tien(?=\/|$)/i.test(pathname)) {
        return 'vehicel';
      }
      if (/^\/tieu-chi-danh-gia(?=\/|$)/i.test(pathname)) {
        return 'criteria';
      }
      if (/^\/thuc-don-cho-tre(?=\/|$)/i.test(pathname)) {
        return 'menu';
      }
      if (/^\/phan-bo(?=\/|$)/i.test(pathname)) {
        return 'allocation';
      }
      if (/^\/y-te(?=\/|$)/i.test(pathname)) {
        return 'medical';
      }
      if (/^\/thoi-khoa-bieu(?=\/|$)/i.test(pathname)) {
        return 'timetable';
      }
      return 'public';
    };

    const Container = Layouts[getLayout()];
    const isUserAuthorized = user.authorized;
    const isUserLoading = loading.models.user;
    const isLoginLayout = getLayout() === 'login';

    const BootstrappedLayout = () => {
      // show loader when user in check authorization process, not authorized yet and not on login pages
      if (isUserLoading && !isUserAuthorized && !isLoginLayout) {
        return <Loader />;
      }
      // redirect to login page if current is not login page and user not authorized
      if (!isLoginLayout && !isUserAuthorized) {
        return <Redirect to={{ pathname: '/login', query: { redirect: pathname } }} />;
      }
      // redirect to main dashboard when user on login page and authorized
      if (isLoginLayout && isUserAuthorized) {
        if (query.redirect === '/') {
          return <Redirect to="/trang-chu" />;
        }
        if (query.redirect) {
          return <Redirect to={query.redirect} />;
        }
        return <Redirect to="/trang-chu" />;
      }
      // in other case render previously set layout
      return <Container>{children}</Container>;
    };

    return (
      <Fragment>
        <Helmet title="Clover" titleTemplate="Clover | %s" />
        {BootstrappedLayout()}
      </Fragment>
    );
  }
}

IndexLayout.propTypes = {
  location: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.any,
  loading: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
  prevLocation: PropTypes.objectOf(PropTypes.any),
};

IndexLayout.defaultProps = {
  location: {},
  children: {},
  loading: {},
  user: {},
  prevLocation: {},
};

export default IndexLayout;
