import React, { PureComponent } from 'react';
import { connect, withRouter } from 'umi';
import { Modal, Timeline } from 'antd';
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
import { Scrollbars } from 'react-custom-scrollbars';

const details = {};

const { Item: TimelineItem } = Timeline;

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

const mockData = [
  { time: '07:12', location: 'Điểm đón số 1: Số 45 Hoàng Hoa Thám' },
  { time: '07:13', location: 'Điểm đón số 2: Số 245 Hoàng Hoa Thám' },
  { location: 'Điểm đón số 3: Số 400 Hoàng Hoa Thám' },
  { location: 'Điểm đón số 4' },
];

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
      position: [16.050051, 108.155123],
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
      details,
      loading: { effects },
      visible,
    } = this.props;
    const { position } = this.state;
    const loadingSubmit = effects['BOContract/ADD'] || effects['BOContract/UPDATE'];
    return (
      <Modal
        centered
        bodyStyle={{ padding: 0 }}
        className={common['modal-container']}
        footer={[
          <div className={classnames('d-flex', 'justify-content-center')} key="action">
            <Button
              color="white"
              icon="cross"
              loading={loadingSubmit}
              onClick={this.props.onCancel}
              size="medium"
            >
              ĐÓNG
            </Button>
            <Button
              color="green"
              icon="save"
              loading={loadingSubmit}
              onClick={this.onSubmit}
              size="medium"
            >
              XÁC NHẬN VỊ TRÍ
            </Button>
          </div>,
        ]}
        onCancel={this.props.onCancel}
        title="Maps"
        visible={visible}
      >
        <div className="row">
          <div className="col-lg-5">
            <div className="p20 border-bottom">
              <Heading type="form-title">Đón trẻ 10/1/2021</Heading>
              <Text size="normal">
                Số trẻ đã lên xe bus: <b>8/12</b>
              </Text>
            </div>

            <div className="p20 border-bottom">
              <div className="row">
                <div className="col-lg-6">
                  <label className={styles.infoLabel}>Cơ sở</label>
                  <div className="d-flex align-items-center">
                    <span className={styles.circleIcon}>
                      <span className={'icon-school'} />
                    </span>
                    <span className={styles.infoText}>
                      {details?.position?.name || 'Lake view'}
                    </span>
                  </div>
                </div>

                <div className="col-lg-6">
                  <label className={styles.infoLabel}>Lớp</label>
                  <div className="d-flex align-items-center">
                    <span className={styles.circleIcon}>
                      <span className={'icon-open-book'} />
                    </span>
                    <span className={styles.infoText}>{details?.class?.name || 'Preschool'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p20 border-bottom">
              <label className={styles.infoLabel}>Nhân viên</label>
              <div className={styles.userInformation}>
                <AvatarTable />
                <div>
                  <h3>{'Lê Thị Vân'}</h3>
                  <p>{'Bảo mẫu - Cơ sở 1 '}</p>
                </div>
              </div>
            </div>

            <div className="p20">
              <label className={styles.infoLabel}>Chi tiết</label>

              <Scrollbars autoHeight autoHeightMax={220}>
                <div className="pt20">
                  <Timeline>
                    {mockData.map(({ time, location }, index) => (
                      <TimelineItem key={index}>
                        <Text size="normal">
                          <b>{time}</b>
                        </Text>
                        <Text size="normal" color={!!time ? 'success' : 'dark-opacity'}>
                          {location}
                        </Text>
                      </TimelineItem>
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
                  // maxNativeZoom="23"
                  // minZoom="0"
                  // maxZoom="23"
                />
                <Routing map={this.map} />
                <Marker position={[16.050051, 108.155123]} icon={iconStudent}></Marker>
                <Marker position={[16.06471, 108.15115]} icon={iconSchool}></Marker>
                <Marker position={[16.062512, 108.157325]} icon={iconCar}></Marker>
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
