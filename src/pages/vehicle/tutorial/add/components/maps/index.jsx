import React, { PureComponent } from 'react';
import { connect, withRouter } from 'umi';
import { head, last } from 'lodash';
import { Modal } from 'antd';
import classnames from 'classnames';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import PropTypes from 'prop-types';
import { Map, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

const iconStudent = new L.Icon({
  iconUrl: '/images/maker-student.svg',
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
      listId: props.listId,
      targetKeys: props.targetKeys || [],
      position: [16.050051, 108.155123],
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
      position: e.latlng,
    });
  };

  onViewportChanged = (e) => {
    this.setStateData({
      zoom: e.zoom,
    });
  };

  onSubmit = () => {
    const { position } = this.state;
    const self = this;
    fetch(
      `${API_MAP_BOX}/${last(position)},${head(
        position,
      )}.json?access_token=${ACCESS_TOKEN_MAPBOX}&language=vi`,
    )
      .then((response) => response.json())
      .then((data) => {
        const address = head(data.features)?.place_name_vi;
        self.props.onSubmit({ position, address });
      });
  };

  saveMap = (map) => {
    this.map = map;
    this.setState({
      isMapInit: true,
    });
  };

  render() {
    const {
      loading: { effects },
      visible,
    } = this.props;
    const { targetKeys, position, zoom } = this.state;
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
            <Marker position={position} icon={iconStudent}></Marker>
          </Map>
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
