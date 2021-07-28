import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Switch } from 'antd';
import classnames from 'classnames';
import { debounce, isEmpty } from 'lodash';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import ability from '@/utils/ability';

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
const mapStateToProps = ({ tutorial, loading }) => ({
  loading,
  data: tutorial.data,
  pagination: tutorial.pagination,
  employees: tutorial.employees,
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
        nannyId: query?.nannyId,
        isActive: query?.isActive,
        driverId: query?.driverId,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
      },
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.onLoad();
    this.onLoadCategories();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { query },
    } = this.props;
    if (query !== prevProps?.location?.query && isEmpty(query)) {
      this.initSearch();
    }
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

  initSearch = () => {
    const {
      location: { query },
    } = this.props;
    this.setStateData(
      {
        search: {
          keyWord: query?.keyWord,
          nannyId: query?.nannyId,
          isActive: query?.isActive,
          driverId: query?.driverId,
          page: query?.page || variables.PAGINATION.PAGE,
          limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        },
      },
      () => {
        this.onLoad();
      },
    );
  };

  onLoadCategories = () => {
    this.props.dispatch({
      type: 'tutorial/GET_EMPLOYEES',
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
      type: 'tutorial/GET_DATA',
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
  onChangeSwitch = (record, checked) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tutorial/UPDATE',
      payload: {
        ...record?.busRoute,
        isActive: !!checked,
      },
      callback: (response) => {
        if (response) {
          this.onLoad();
        }
      },
    });
  };

  /**
   * Function remove items
   * @param {uid} id id of items
   */
   onRemove = (id) => {
    const { dispatch } = this.props;
    const self = this;
    return Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'tutorial/REMOVE',
          payload: {
            id,
          },
          callback: (response) => {
            if (response) {
              self.onLoad();
            }
          },
        });
      },
    });
  };

  /**
   * Function header table
   */
  header = () => {
    const {
      location: { pathname },
    } = this.props;
    const columns = [
      {
        title: 'STT',
        key: 'index',
        className: 'min-width-60',
        width: 60,
        align: 'center',
        render: (text, record, index) =>
          Helper.serialOrder(this.state.search?.page, index, this.state.search?.limit),
      },
      {
        title: 'TÊN LỘ TRÌNH',
        key: 'name',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.busRoute?.name}</Text>,
      },
      {
        title: 'SỐ ĐIỂM ĐÓN',
        key: 'count',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.stationTotal}</Text>,
      },
      {
        title: 'SỐ LƯỢNG TRẺ ĐÓN',
        key: 'children',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.studentTotal}</Text>,
      },
      {
        title: 'TRẠNG THÁI',
        key: 'lock',
        className: 'min-width-120',
        width: 120,
        align: 'center',
        render: (record) => (
          <div className={styles['table-switch']}>
            <Switch
              checked={record?.busRoute?.isActive}
              onChange={(event) => this.onChangeSwitch(record, event)}
            />
          </div>
        ),
      },
      {
        key: 'actions',
        className: 'min-width-80',
        width: 80,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="primary"
              icon="edit"
              onClick={() => history.push(`${pathname}/${record?.busRoute?.id}/chi-tiet`)}
              permission="BUS"
            />
            <Button color="danger" icon="remove" onClick={() => this.onRemove(record?.busRoute?.id)} />
          </div>
        ),
      },
    ];
    return !ability.can('BUS', 'BUS') ? columns.filter((item) => item.key !== 'actions') : columns;
  };

  render() {
    const {
      match: { params },
      data,
      pagination,
      loading: { effects },
      location: { pathname },
      employees,
    } = this.props;
    const { search } = this.state;
    const loading = effects['tutorial/GET_DATA'];
    return (
      <>
        <Helmet title="Danh sách lộ trình" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">DANH SÁCH LỘ TRÌNH</Text>
            <Button
              color="success"
              icon="plus"
              onClick={() => history.push(`${pathname}/tao-moi`)}
              permission="BUS"
            >
              Thêm mới
            </Button>
          </div>
          <div className={styles['block-table']}>
            <Form
              initialValues={{
                ...search,
                nannyId: search.nannyId || null,
                driverId: search.driverId || null,
                isActive: search.isActive || null,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    label="TÌM KIẾM"
                    name="keyword"
                    placeholder="Nhập từ khóa"
                    onChange={(event) => this.onChange(event, 'keyword')}
                    type={variables.INPUT}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[
                      { id: null, name: 'Chọn tất cả' },
                      { id: 'ON', name: 'Hoạt động' },
                      { id: 'OFF', name: 'Ngừng hoạt động' },
                    ]}
                    label="TRẠNG THÁI"
                    name="isActive"
                    allowClear={false}
                    onChange={(event) => this.onChangeSelect(event, 'isActive')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[
                      { id: null, name: 'Chọn tất cả' },
                      ...Helper.convertSelectUsers(employees),
                    ]}
                    label="TÀI XẾ"
                    name="driverId"
                    allowClear={false}
                    onChange={(event) => this.onChangeSelect(event, 'driverId')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[
                      { id: null, name: 'Chọn tất cả' },
                      ...Helper.convertSelectUsers(employees),
                    ]}
                    label="BẢO MẪU"
                    name="nannyId"
                    allowClear={false}
                    onChange={(event) => this.onChangeSelect(event, 'nannyId')}
                    type={variables.SELECT}
                  />
                </div>
              </div>
            </Form>
            <Table
              bordered
              columns={this.header(params)}
              dataSource={data}
              loading={loading}
              pagination={this.pagination(pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
              rowKey={(record) => record.id || record?.busRoute?.id}
              scroll={{ x: '100%' }}
            />
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
  employees: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  employees: [],
};

export default Index;
