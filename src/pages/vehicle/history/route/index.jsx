import React, { PureComponent } from 'react';
import { connect, withRouter } from 'umi';
import { Modal } from 'antd';
import classnames from 'classnames';
import Button from '@/components/CommonComponent/Button';
import PropTypes from 'prop-types';
import { Map, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Routing from './components/route';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Heading from '@/components/CommonComponent/Heading';
import Text from '@/components/CommonComponent/Text';
import styles from '@/assets/styles/Common/information.module.scss';
import common from '@/assets/styles/Common/common.scss';
import { Helper, variables } from '@/utils';
import variablesModules from '../../utils/variables';

const iconStudent = new L.Icon({
  iconUrl: '/images/marker-student.svg',
  iconAnchor: [17, 46],
});
const iconSchool = new L.Icon({
  iconUrl: '/images/marker-location.svg',
  iconAnchor: [17, 46],
});
const iconCar = new L.Icon({
  iconUrl: '/images/marker-car.svg',
  iconAnchor: [17, 46],
});

let isMounted = true;
/**
 * Set isMounted
 * @param {boolean} value
 * @returns {boolean} value of isMounted
 */
const setIsMounted = (value = true) => {
  isMounted = value;
  return isMounted;
};
/**
 * Get isMounted
 * @returns {boolean} value of isMounted
 */
const getIsMounted = () => isMounted;
const mapStateToProps = ({ loading }) => ({
  loading,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      position: Helper.centerLatLng(
        props.routes.map((item) => ({
          lat: item?.busPlace?.lat,
          long: item?.busPlace?.long,
        })),
      ),
      zoom: 7,
    };
    setIsMounted(true);
  }

  componentWillUnmount() {
    setIsMounted(false);
  }

  /**
   * Set state properties
   * @param {object} data the data input
   * @param {function} callback the function which will be called after setState
   * @returns {void} call this.setState to update state
   * @memberof setStateData
   */
  setStateData = (state, callback) => {
    if (!getIsMounted()) {
      return;
    }
    this.setState(state, callback);
  };

  handleCancel = () => {
    this.props.handleCancel();
  };

  onClickMap = (e) => {
    this.setStateData({
      position: [e.latlng.lat, e.latlng.lng],
    });
  };

  onSubmit = () => {};

  handleClick = (e) => {};

  saveMap = (map) => {
    this.map = map;
    this.setState({
      isMapInit: true,
    });
  };

  render() {
    const {
      visible,
      route,
      routes,
      date,
      loading: { effects },
      status,
    } = this.props;
    const { position } = this.state;
    const loadingSubmit = effects['BOContract/ADD'] || effects['BOContract/UPDATE'];
    return (
      <Modal
        centered
        bodyStyle={{ padding: 0 }}
        className={common['modal-container']}
        onCancel={this.props.onCancel}
        title="LỘ TRÌNH XE BUS"
        visible={visible}
        footer={false}
      >
        <div className="row">
          <div className="col-lg-5">
            <div className="p20 border-bottom">
              <Heading type="form-title">
                Đón trẻ {Helper.getDate(date, variables.DATE_FORMAT.DATE)}
              </Heading>
              <Text size="normal">Địa điểm đón: {route?.busPlace?.address}</Text>
            </div>

            <div className="p20 border-bottom">
              <div className={styles.userInformation}>
                <AvatarTable fileImage={Helper.getPathAvatarJson(route?.student?.fileImage)} />
                <div>
                  <h3>{route?.student?.fullName || 'Su beo'}</h3>
                </div>
              </div>
            </div>

            <div className="p20 border-bottom">
              <div className="row">
                <div className="col-lg-12">
                  <label className={styles.infoLabel}>Cơ sở</label>
                  <div className="d-flex align-items-center">
                    <span className={styles.circleIcon}>
                      <span className={'icon-school'} />
                    </span>
                    <span className={styles.infoText}>
                      {route?.busPlace?.busRoute?.branch?.name || 'Lake view'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p20 border-bottom">
              <div className="row">
                <div className="col-lg-6">
                  <label className={styles.infoLabel}>Lên xe</label>
                  <div className="d-flex align-items-center">
                    <span className={styles.circleIcon}>
                      <span className={'icon-clock'} />
                    </span>
                    <span className={styles.infoText}>
                      {status === variablesModules.STATUS_TABS.HOMEAWARD &&
                        Helper.getDate(
                          route?.busPlaceLog?.homewardGetIn,
                          variables.DATE_FORMAT.TIME_FULL,
                        )}
                      {status === variablesModules.STATUS_TABS.SCHOOLWARD &&
                        Helper.getDate(
                          route?.busPlaceLog?.schoolwardGetIn,
                          variables.DATE_FORMAT.TIME_FULL,
                        )}
                    </span>
                  </div>
                </div>

                <div className="col-lg-6">
                  <label className={styles.infoLabel}>Xuống xe</label>
                  <div className="d-flex align-items-center">
                    <span className={styles.circleIcon}>
                      <span className={'icon-open-book'} />
                    </span>
                    <span className={styles.infoText}>
                      {status === variablesModules.STATUS_TABS.HOMEAWARD &&
                        Helper.getDate(
                          route?.busPlaceLog?.homewardGetOff,
                          variables.DATE_FORMAT.TIME_FULL,
                        )}
                      {status === variablesModules.STATUS_TABS.SCHOOLWARD &&
                        Helper.getDate(
                          route?.busPlaceLog?.schoolwardGetOff,
                          variables.DATE_FORMAT.TIME_FULL,
                        )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p20">
              <div className={styles.userInformation}>
                <AvatarTable />
                <div>
                  <h3>{'Lê Thị Vân'}</h3>
                  <p>{'Bảo mẫu - Cơ sở 1 '}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className={common.leafletContainer}>
              <Map center={position} zoom={15} maxZoom={22} ref={this.saveMap}>
                <TileLayer
                  url="http://mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                  attribution='&copy; <a href="//osm.org/copyright">OpenStreetMap</a>'
                />
                <Routing map={this.map} routes={routes} />
                {route?.busPlace?.lat && route?.busPlace?.long && (
                  <Marker
                    position={[route?.busPlace?.lat, route?.busPlace?.long]}
                    icon={iconStudent}
                  ></Marker>
                )}
                {/* MARKER HOME */}
                {/* <Marker position={[16.06471, 108.15115]} icon={iconSchool}></Marker> */}
                {/* MARKER HOME */}
                {/* MARKER CAR */}
                {/* <Marker position={[16.062512, 108.157325]} icon={iconCar}></Marker> */}
                {/* MARKER CAR */}
              </Map>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

Index.propTypes = {
  visible: PropTypes.bool,
  handleCancel: PropTypes.func,
  categories: PropTypes.objectOf(PropTypes.any),
  match: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  objects: PropTypes.objectOf(PropTypes.any),
  list: PropTypes.arrayOf(PropTypes.any),
  board: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  visible: false,
  handleCancel: () => {},
  categories: {},
  match: {},
  dispatch: {},
  loading: {},
  objects: {},
  list: [],
  board: {},
};

export default withRouter(Index);
