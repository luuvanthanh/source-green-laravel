import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import classnames from 'classnames';
import { Form } from 'antd';
import { debounce, isEmpty, isEqual } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import FormItem from '@/components/CommonComponent/FormItem';
import Select from '@/components/CommonComponent/Select';

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
const mapStateToProps = ({ notificationModule, loading }) => ({
  loading,
  data: notificationModule.data,
  error: notificationModule.error,
  pagination: notificationModule.pagination,
  types: notificationModule.types,
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
        keyWord: query?.keyWord,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
      },
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.onLoad();
    this.loadCategories();
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
    this.props.dispatch({
      type: 'notificationModule/GET_TYPES',
      payload: {},
    });
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
      type: 'notificationModule/GET_DATA',
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
          type: 'notificationModule/REMOVE',
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

  onChangeTypes = (e, record) => {
    const { dispatch } = this.props;
    const payload = {
      notificationModuleId: record?.moduleId,
      notificationTypeIds: e,
    };
    dispatch({
      type: 'notificationModule/UPDATE',
      payload: [payload],
      callback: (response) => {
        if (response) {
          this.onLoad();
        }
      },
    });
  };

  /**
   * Function header table
   */
  header = () => {
    const { types } = this.props;
    return [
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
        title: 'Tên module',
        key: 'name',
        className: 'min-width-130',
        render: (record) => record.name,
      },
      {
        title: 'Hình thức nhận',
        key: 'type',
        className: 'min-width-200',
        render: (record) => (
          <Select
            value={record?.moduleTypeGroupByNames?.map((item) => item?.notificationType?.id)}
            className="w-100"
            mode="multiple"
            dataSet={types}
            onChange={(e) => this.onChangeTypes(e, record)}
          />
        ),
      },
    ];
  };

  render() {
    const {
      error,
      data,
      pagination,
      match: { params },
      loading: { effects },
    } = this.props;
    const { search } = this.state;
    const loading = effects['notificationModule/GET_DATA'];
    return (
      <>
        <Helmet title="Module gửi thông báo tới phụ huynh" />
        <div>
          <div className="offset-lg-1 col-lg-10">
            <div
              className={classnames(
                styles['content-form'],
                styles['content-form-notificationModule'],
              )}
            >
              {/* FORM SEARCH */}
              <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                <Text color="dark">Module gửi thông báo tới phụ huynh</Text>
              </div>
              <div className={classnames(styles['block-table'])}>
                <Form
                  initialValues={{
                    ...search,
                  }}
                  layout="vertical"
                  ref={this.formRef}
                >
                  <div className="row">
                    <div className="col-lg-12">
                      <FormItem
                        name="keyWord"
                        onChange={(event) => this.onChange(event, 'keyWord')}
                        placeholder="Nhập từ khóa tìm kiếm"
                        type={variables.INPUT_SEARCH}
                      />
                    </div>
                  </div>
                </Form>
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
                  rowKey={(record) => record.name || record.id}
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
  types: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  error: {},
  types: [],
};

export default Index;
