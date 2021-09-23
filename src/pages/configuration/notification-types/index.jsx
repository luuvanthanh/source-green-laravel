import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import classnames from 'classnames';
import { debounce, isEmpty, isEqual } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';

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
const mapStateToProps = ({ notificationTypes, loading }) => ({
  loading,
  data: notificationTypes.data,
  error: notificationTypes.error,
  pagination: notificationTypes.pagination,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const {
      location: { query },
    } = props;
    this.state = {
      search: {
        filter: query?.filter,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
      },
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.onLoad();
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

  /**
   * Function load data
   */
  onLoad = () => {
    const { search } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'notificationTypes/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch(search),
    });
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
          page: variables.PAGINATION.PAGE,
          limit: variables.PAGINATION.PAGE_SIZE,
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
    this.debouncedSearch(e.target.value, type);
  };

  /**
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSelect = (e, type) => {
    this.debouncedSearch(e, type);
  };

  /**
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChangeDate = (e, type) => {
    this.debouncedSearch(moment(e).format(variables.DATE_FORMAT.DATE_AFTER), type);
  };

  /**
   * Function set pagination
   * @param {integer} page page of pagination
   * @param {integer} size size of pagination
   */
  changePagination = ({ page, limit }) => {
    this.setState(
      (prevState) => ({
        search: {
          ...prevState.search,
          page,
          limit,
        },
      }),
      () => {
        this.onLoad();
      },
    );
  };

  /**
   * Function pagination of table
   * @param {object} pagination value of pagination items
   */
  pagination = (pagination) => {
    const {
      location: { query },
    } = this.props;
    return Helper.paginationNet({
      pagination,
      query,
      callback: (response) => {
        this.changePagination(response);
      },
    });
  };

  /**
   * Function remove items
   * @param {uid} id id of items
   */
  onRemove = (id) => {
    const { dispatch } = this.props;
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'notificationTypes/REMOVE',
          payload: {
            id,
          },
          callback: (response) => {
            if (response) {
              this.onLoad();
            }
          },
        });
      },
    });
  };

  getTextWeek = (items) => {
    if (isEmpty(items)) {
      return '';
    }
    if (isEqual(items, variables.DAY_OF_WEEKS)) {
      return 'từ thứ 2 đến thứ 6';
    }
    return items.map((item) => variables.DAY_OF_WEEKS_TEXT[item]).join(',');
  };

  /**
   * Function header table
   */
  header = () => [
    {
      title: 'STT',
      key: 'index',
      align: 'center',
      className: 'min-width-60',
      width: 60,
      render: (text, record, index) =>
        Helper.serialOrder(this.state.search?.page, index, this.state.search?.limit),
    },
    {
      title: 'Tên hình thức',
      key: 'name',
      className: 'min-width-130',
      render: (record) => record.name,
    },
    {
      title: 'Thời gian',
      key: 'name',
      className: 'min-width-130',
      render: (record) => {
        const date = moment()
          .startOf('days')
          .add(record?.sentTime?.hours, 'hours')
          .add(record?.sentTime?.minutes, 'minutes')
          .add(record?.sentTime?.seconds, 'seconds');
        if (!isEmpty(record?.expectedDayOfWeek)) {
          return `${Helper.getDate(date, variables.DATE_FORMAT.TIME_FULL)} (${this.getTextWeek(
            record?.expectedDayOfWeek,
          )})`;
        }
        return Helper.getDate(date, variables.DATE_FORMAT.TIME_FULL);
      },
    },
  ];

  render() {
    const {
      error,
      data,
      pagination,
      match: { params },
      loading: { effects },
    } = this.props;
    const loading = effects['notificationTypes/GET_DATA'];
    return (
      <>
        <Helmet title="Hình thức nhận thông báo" />
        <div>
          <div className="offset-lg-2 col-lg-8">
            <div
              className={classnames(
                styles['content-form'],
                styles['content-form-notificationTypes'],
              )}
            >
              {/* FORM SEARCH */}
              <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                <Text color="dark">Hình thức nhận thông báo</Text>
              </div>
              <div className={classnames(styles['block-table'])}>
                <Table
                  columns={this.header(params)}
                  dataSource={data}
                  loading={loading}
                  error={error}
                  isError={error.isError}
                  pagination={this.pagination(pagination)}
                  params={{
                    header: this.header(),
                    type: 'table',
                  }}
                  bordered={false}
                  rowKey={(record) => record.id}
                  scroll={{ x: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
  pagination: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  error: {},
};

export default Index;
