import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce, isEmpty, size, last } from 'lodash';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { Map, TileLayer, Marker } from 'react-leaflet';
import moment from 'moment';
import Routing from './route';

const iconStudent = new L.Icon({
  iconUrl: '/images/marker-student.svg',
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
const mapStateToProps = ({ busParent, loading, user }) => ({
  data: busParent.data,
  pagination: busParent.pagination,
  students: busParent.students,
  loading,
  user: user.user,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const {
      location: { query },
    } = props;
    const { user } = props;
    this.state = {
      search: {
        keyWord: query?.keyWord,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        date: moment(),
        id: null,
      },
      position: [18.3452, 105.886093],
      routes: [],
      parent: user?.objectInfo?.id,
      isAuto: false,
    };
    setIsMounted(true);
  }

  componentDidMount() {
    const self = this;
    this.loadCategories();
    setInterval(() => {
      if (this.state.isAuto) {
        self.onLoadTracking();
      }
    }, 20000);
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

  loadCategories = () => {
    const { dispatch } = this.props;
    const { parent } = this.state;
    dispatch({
      type: 'busParent/GET_STUDENTS',
      payload: {
        parent,
      },
    });
  };

  onLoadTracking = () => {
    const { dispatch, data } = this.props;
    const { search } = this.state;
    if (search.id) {
      dispatch({
        type: 'busParent/GET_TRACKING_CURRENT',
        payload: {
          id: data?.busPlace?.busRoute?.busId,
          formDate: moment(),
          toDate: moment(),
        },
        callback: (res) => {
          if (res) {
            const result = Array.from(new Set(res.map((item) => item.long))).map((id) => ({
              ...res.find((item) => item.long === id),
            }));
            this.setStateData({
              routes: result,
              position: Helper.centerLatLng(result),
            });
          }
        },
      });
    }
  };

  /**
   * Function load data
   */
  onLoad = () => {
    const { search } = this.state;
    const { dispatch } = this.props;
    if (search.id) {
      dispatch({
        type: 'busParent/GET_DATA',
        payload: {
          ...search,
        },
        callback: (response) => {
          if (!isEmpty(response)) {
            this.onLoadTracking();
          }
        },
      });
    }
  };

  /**
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
  debouncedSearch = debounce((value, type) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          [`${type}`]: value,
        },
      }),
      () => this.onLoad(),
    );
  }, 300);

  /**
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChange = (e, type) => {
    this.debouncedSearch(e, type);
  };

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

  auto = () => {
    this.setStateData({
      isAuto: true,
    });
  };

  render() {
    const { data, students } = this.props;
    const { search, position, routes } = this.state;
    return (
      <>
        <Helmet title="Lộ trình xe bus hôm nay" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Lộ trình xe bus hôm nay</Text>
            <Button color="success" icon="plus" onClick={this.auto}>
              Tự động
            </Button>
          </div>
          <div className={styles['block-table']}>
            <Form
              initialValues={{
                ...search,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    data={Helper.convertSelectUsers(students)}
                    label="Học sinh"
                    onChange={(event) => this.onChange(event, 'id')}
                    type={variables.SELECT}
                  />
                </div>
              </div>
            </Form>
            <div className={styles['leaflet-wrapper']}>
              <Map center={position} zoom={15} maxZoom={22} ref={this.saveMap}>
                <TileLayer
                  url="http://mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                  attribution='&copy; <a href="//osm.org/copyright">OpenStreetMap</a>'
                />
                {!isEmpty(this.covertGetLocation(routes)) && this.map && (
                  <Routing map={this.map} routes={this.covertGetLocation(routes)} />
                )}
                {!isEmpty(this.covertGetLocation(routes)) && (
                  <Marker
                    position={[
                      last(this.covertGetLocation(routes))?.lat,
                      last(this.covertGetLocation(routes))?.long,
                    ]}
                    icon={iconCar}
                  />
                )}
                {!isEmpty(data) && (
                  <Marker
                    position={[data?.busPlace?.lat, data?.busPlace?.long]}
                    icon={iconStudent}
                  />
                )}
              </Map>
            </div>
          </div>
        </div>
      </>
    );
  }
}

Index.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
  students: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  data: [],
  dispatch: {},
  location: {},
  user: {},
  students: [],
};

export default Index;
