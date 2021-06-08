import React, { PureComponent } from 'react';
import { connect, withRouter } from 'umi';
import { head, last, isEmpty } from 'lodash';
import { Modal } from 'antd';
import classnames from 'classnames';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import PropTypes from 'prop-types';
import { Map, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

const iconStudent = new L.Icon({
  iconUrl: '/images/marker-current.svg',
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
      position: props.position || [],
      zoom: 15,
      loading: false,
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

  onViewportChanged = (e) => {
    this.setStateData({
      zoom: e.zoom,
    });
  };

  onSubmit = async () => {
    const { position } = this.state;
    const self = this;
    this.setStateData({
      loading: true,
    });
    await fetch(
      `${API_MAP_BOX}/${last(position)},${head(
        position,
      )}.json?access_token=${ACCESS_TOKEN_MAPBOX}&language=vi`,
    )
      .then((response) => response.json())
      .then((data) => {
        const address = head(data.features)?.place_name_vi;
        self.props.onSubmit({ address, position, lat: head(position), lng: last(position) });
      });
    this.setStateData({
      loading: false,
    });
  };

  saveMap = (map) => {
    this.map = map;
  };

  render() {
    const {
      loading: { effects },
      visible,
    } = this.props;
    const { position, zoom, loading } = this.state;
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
              loading={loadingSubmit || loading}
              onClick={this.handleCancel}
              size="medium"
            >
              ĐÓNG
            </Button>
            <Button
              color="green"
              icon="save"
              loading={loadingSubmit || loading}
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
          <Map
            center={position}
            zoom={zoom}
            maxZoom={22}
            ref={this.saveMap}
            onClick={this.onClickMap}
            onViewportChanged={this.onViewportChanged}
          >
            <TileLayer
              url="http://mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              attribution='&copy; <a href="//osm.org/copyright">OpenStreetMap</a>'
              // maxNativeZoom="23"
              // minZoom="0"
              // maxZoom="23"
            />
            <Marker position={position} icon={iconStudent} />
          </Map>
        </div>
      </Modal>
    );
  }
}

Index.propTypes = {
  visible: PropTypes.bool,
  handleCancel: PropTypes.func,
  loading: PropTypes.objectOf(PropTypes.any),
  position: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  visible: false,
  handleCancel: () => {},
  loading: {},
  position: [],
};

export default withRouter(Index);
