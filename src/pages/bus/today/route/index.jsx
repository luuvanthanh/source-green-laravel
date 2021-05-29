import React, { PureComponent } from 'react';
import { connect, withRouter } from 'umi';
import { Modal, Timeline } from 'antd';
import PropTypes from 'prop-types';
import { Map, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { head, isEmpty, last, size } from 'lodash';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Heading from '@/components/CommonComponent/Heading';
import Text from '@/components/CommonComponent/Text';
import styles from '@/assets/styles/Common/information.module.scss';
import common from '@/assets/styles/Common/common.scss';
import { Scrollbars } from 'react-custom-scrollbars';
import { Helper, variables } from '@/utils';
import moment from 'moment';
import variablesModules from '../../utils/variables';
import RoutingDefault from './components/route-default';
import Routing from './components/route';

const { Item: TimelineItem } = Timeline;

const iconStudent = new L.Icon({
  iconUrl: '/images/marker-student.svg',
  iconAnchor: [17, 46],
});
// const iconSchool = new L.Icon({
//   iconUrl: '/images/marker-location.svg',
//   iconAnchor: [17, 46],
// });
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
      position: Helper.centerLatLng(props.routes),
      trackings: [],
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.loadTracking();
    this.loadTimeLine();
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

  loadTracking = () => {
    const { routes } = this.props;
    this.props.dispatch({
      type: 'busToday/GET_TRACKINGS',
      payload: {
        id: head(routes)?.busRoute?.busId,
        startDate: moment().startOf('days'),
        endDate: moment().endOf('days'),
      },
      callback: (response) => {
        if (response) {
          this.setStateData({
            trackings: response,
          });
        }
      },
    });
  };

  loadTimeLine = () => {
    const { search, dispatch } = this.props;
    if (search.id && search.date) {
      dispatch({
        type: 'busToday/GET_TIME_LINE',
        payload: {
          ...search,
        },
      });
    }
  };

  loadRouting = () => {
    fetch(
      `https://router.project-osrm.org/route/v1/driving/108.169863,16.067899;108.154157,16.053197?overview=false&alternatives=true&steps=true&hints=;`,
    )
      .then((response) => response.json())
      .then(() => {});
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
  };

  covertGetLocation = (items) => {
    if (size(items) < 20) {
      return items;
    }
    if (size(items) < 50) {
      return items.filter((item, index) => index % 5 === 0 || index === 1);
    }
    if (size(items) < 200) {
      return items.filter((item, index) => index % 10 === 0 || index === 1);
    }
    if (size(items) < 500) {
      return items.filter((item, index) => index % 20 === 0 || index === 1);
    }
    return items.filter((item, index) => index % 50 === 0 || index === 1);
  };

  render() {
    const { visible, routes, search, summary, timelines } = this.props;
    const { position, trackings } = this.state;
    return (
      <Modal
        centered
        bodyStyle={{ padding: 0 }}
        className={common['modal-container']}
        footer={false}
        onCancel={this.props.onCancel}
        title={<Heading type="form-block-title">Lộ trình xe bus</Heading>}
        visible={visible}
      >
        <div className="row">
          <div className="col-lg-5">
            <div className="p20 border-bottom">
              <Heading type="form-title">
                Đón trẻ {Helper.getDate(search.date, variables.DATE_FORMAT.DATE)}
              </Heading>
              <Text size="normal">
                Số trẻ đã lên xe bus:{' '}
                <b>
                  {' '}
                  {search.status === variablesModules.STATUS_TABS.SCHOOLWARD
                    ? summary.schoolGetInStatusTotal
                    : summary.homeGetInStatusTotal}
                  /{summary.studentTotal}
                </b>
              </Text>
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
                      {head(routes)?.busRoute?.branch?.name || 'Lake view'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p20 border-bottom">
              <label className={styles.infoLabel}>Nhân viên</label>
              <Scrollbars autoHeight autoHeightMax={200}>
                {head(routes)?.busRoute?.busRouteNannies?.map((itemBus) => (
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

            <div className="p20">
              <label className={styles.infoLabel}>Chi tiết</label>

              <Scrollbars autoHeight autoHeightMax={220}>
                <div className="pt20">
                  <Timeline>
                    {timelines.map((item, index) => (
                      <div key={index}>
                        {!isEmpty(item.busPlaceTimeLineLogs) &&
                          item.busPlaceTimeLineLogs.map((itemBus) => (
                            <TimelineItem key={itemBus.id}>
                              <Text size="normal">
                                <b>
                                  {Helper.getDate(
                                    itemBus.trackingTime,
                                    variables.DATE_FORMAT.TIME_FULL,
                                  )}
                                </b>
                              </Text>
                              <Text
                                size="normal"
                                color={itemBus.trackingTime ? 'success' : 'dark-opacity'}
                              >
                                Điểm đón số {index + 1}: {item.address}
                              </Text>
                            </TimelineItem>
                          ))}
                        {isEmpty(item.busPlaceTimeLineLogs) && (
                          <TimelineItem>
                            <Text size="normal" color="dark-opacity">
                              Điểm đón số {index + 1}: {item.address}
                            </Text>
                          </TimelineItem>
                        )}
                      </div>
                    ))}
                  </Timeline>
                </div>
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
                {!isEmpty(routes) && <RoutingDefault map={this.map} routes={routes} />}
                {!isEmpty(this.covertGetLocation(trackings)) && (
                  <Routing map={this.map} routes={this.covertGetLocation(trackings)} />
                )}
                {routes.map((item) => (
                  <Marker key={item.id} position={[item.lat, item.long]} icon={iconStudent} />
                ))}
                {/* <Marker position={[16.06471, 108.15115]} icon={iconSchool}></Marker> */}
                {!isEmpty(trackings) && (
                  <Marker position={[last(trackings)?.lat, last(trackings)?.long]} icon={iconCar} />
                )}
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
  status: PropTypes.string,
  onCancel: PropTypes.func,
  date: PropTypes.string,
  dispatch: PropTypes.func,
  search: PropTypes.objectOf(PropTypes.any),
  summary: PropTypes.objectOf(PropTypes.any),
  timelines: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  visible: false,
  handleCancel: () => {},
  onCancel: () => {},
  dispatch: () => {},
  routes: [],
  status: '',
  date: null,
  search: {},
  summary: {},
  timelines: [],
};

export default withRouter(Index);
