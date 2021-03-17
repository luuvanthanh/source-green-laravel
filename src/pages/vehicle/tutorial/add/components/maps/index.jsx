import React, { PureComponent } from 'react';
import { connect, withRouter } from 'umi';
import { Modal } from 'antd';
import classnames from 'classnames';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [17, 46],
});
L.Marker.prototype.options.icon = DefaultIcon;

const mockData = [];
for (let i = 0; i < 20; i++) {
  mockData.push({
    key: i.toString(),
    title: `content${i + 1}`,
    address: `address of content${i + 1}`,
  });
}

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
      listId: props.listId,
      targetKeys: props.targetKeys || [],
      position: [16.07176, 108.223961],
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

  onChange = (nextTargetKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  onSubmit = () => {
    const { targetKeys, listId } = this.state;
    const users = mockData.filter(function (item) {
      return targetKeys.includes(item.key);
    });
    this.props.onSave(
      users.map((item) => ({ ...item, parentId: listId })),
      listId,
    );
  };

  handleClick = (e) => {};

  render() {
    const {
      loading: { effects },
      visible,
    } = this.props;
    const { targetKeys, position } = this.state;
    const loadingSubmit = effects['BOContract/ADD'] || effects['BOContract/UPDATE'];
    return (
      <Modal
        centered
        className={styles['modal-container']}
        footer={[
          <div className={classnames('d-flex', 'justify-content-center')} key="action">
            <Button
              color="white"
              icon="cross"
              loading={loadingSubmit}
              onClick={this.handleCancel}
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
        onCancel={this.handleCancel}
        title="Maps"
        visible={visible}
      >
        <div className={styles.leafletContainer}>
          <MapContainer
            style={{ height: '100vh' }}
            center={position}
            zoom={15}
            maxZoom={22}
            scrollWheelZoom={true}
            whenReady={(map) => {
              const self = this;
              map.target.on('click', function (e) {
                self.onClickMap(e);
              });
            }}
          >
            <TileLayer
              url="http://mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              attribution='&copy; <a href="//osm.org/copyright">OpenStreetMap</a>'
              maxNativeZoom="23"
              minZoom="0"
              maxZoom="23"
            />
            <Marker
              position={position}
              draggable={true}
              eventHandlers={{
                click: (e) => {
                  console.log('marker clicked', e);
                },
              }}
            >
              <Popup>Đà Nẵng</Popup>
            </Marker>
          </MapContainer>
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
