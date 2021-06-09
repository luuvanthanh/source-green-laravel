import React, { PureComponent } from 'react';
import { connect, withRouter } from 'umi';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { head, isEmpty } from 'lodash';
import { Map, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Heading from '@/components/CommonComponent/Heading';
import Text from '@/components/CommonComponent/Text';
import styles from '@/assets/styles/Common/information.module.scss';
import common from '@/assets/styles/Common/common.scss';
import { Helper, variables } from '@/utils';
import { Scrollbars } from 'react-custom-scrollbars';
import variablesModules from '../../utils/variables';
import Routing from './components/route';

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
      current: [],
      isMapInit: false,
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.loadCurrentBus();
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

  loadCurrentBus = () => {
    const { route } = this.props;
    if (head(route?.busPlace?.busRoute?.busTransportations)?.busId) {
      this.props.dispatch({
        type: 'busHistory/GET_TRACKING_CURRENT',
        payload: {
          id: head(route?.busPlace?.busRoute?.busTransportations)?.busId,
        },
        callback: (response) => {
          if (response) {
            this.setStateData({
              current: [response.lat, response.long],
            });
          }
        },
      });
    }
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

  handleClick = () => {};

  saveMap = (map) => {
    this.map = map;
    this.setState({
      isMapInit: true,
    });
  };

  render() {
    const { visible, route, date, status } = this.props;
    const { position, isMapInit, current } = this.state;
    return (
      <Modal
        centered
        bodyStyle={{ padding: 0 }}
        className={common['modal-container']}
        onCancel={this.props.onCancel}
        title={
          <Heading type="form-block-title" className="mb10">
            Lộ trình xe bus
          </Heading>
        }
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
                      <span className="icon-school" />
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
                      <span className="icon-clock" />
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
                      <span className="icon-open-book" />
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
              <label className={styles.infoLabel}>Nhân viên</label>
              <Scrollbars autoHeight autoHeightMax={340}>
                {route?.busPlace?.busRoute?.busRouteNannies?.map((itemBus) => (
                  <div key={itemBus?.nanny?.id} className="mt10 mb10 ">
                    <AvatarTable
                      fullName={itemBus?.nanny?.fullName}
                      fileImage={Helper.getPathAvatarJson(itemBus?.nanny?.fileImage)}
                      description="Bảo mẫu"
                    />
                  </div>
                ))}
              </Scrollbars>
            </div>
          </div>
          <div className="col-lg-7">
            <div className={common.leafletContainer}>
              <Map center={position} zoom={15} maxZoom={22} ref={this.saveMap}>
                <TileLayer
                  url="http://mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                  attribution='&copy; <a href="//osm.org/copyright">OpenStreetMap</a>'
                />
                {isMapInit && <Routing map={this.map} route={route} />}
                {route?.busPlace?.lat && route?.busPlace?.long && (
                  <Marker
                    position={[route?.busPlace?.lat, route?.busPlace?.long]}
                    icon={Helper.ICON_STUDENT}
                  />
                )}
                {/* MARKER HOME */}
                {route?.busPlace?.busRoute?.startedPlaceLat &&
                  route?.busPlace?.busRoute?.startedPlaceLong && (
                    <Marker
                      position={[
                        route?.busPlace?.busRoute?.startedPlaceLat,
                        route?.busPlace?.busRoute?.startedPlaceLong,
                      ]}
                      icon={Helper.ICON_SCHOOL}
                    />
                  )}
                {/* MARKER HOME */}

                {/* MARKER HOME */}
                {route?.busPlace?.busRoute?.endedPlaceLat &&
                  route?.busPlace?.busRoute?.endedPlaceLong && (
                    <Marker
                      position={[
                        route?.busPlace?.busRoute?.endedPlaceLat,
                        route?.busPlace?.busRoute?.endedPlaceLong,
                      ]}
                      icon={Helper.ICON_SCHOOL}
                    />
                  )}
                {/* MARKER HOME */}
                {/* MARKER CAR */}
                {!isEmpty(current) && <Marker position={current} icon={Helper.ICON_BUS} />}
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
  routes: PropTypes.arrayOf(PropTypes.any),
  route: PropTypes.objectOf(PropTypes.any),
  status: PropTypes.string,
  onCancel: PropTypes.func,
  date: PropTypes.any,
  dispatch: PropTypes.func,
};

Index.defaultProps = {
  visible: false,
  handleCancel: () => {},
  onCancel: () => {},
  routes: [],
  route: {},
  status: '',
  date: null,
  dispatch: () => {},
};

export default withRouter(Index);
