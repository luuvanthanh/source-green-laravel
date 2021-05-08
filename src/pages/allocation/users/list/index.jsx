import React, { PureComponent } from 'react';
import { connect, history, NavLink } from 'umi';
import { Modal, Form } from 'antd';
import classnames from 'classnames';
import { isEmpty, head, debounce } from 'lodash';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import HelperModules from '../../utils/Helper';
import variablesModules from '../../utils/variables';
import PropTypes from 'prop-types';
import stylesAllocation from '@/assets/styles/Modules/Allocation/styles.module.scss';

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
const { confirm } = Modal;
const mapStateToProps = ({ allocationUsersList, loading }) => ({
  data: allocationUsersList.data,
  pagination: allocationUsersList.pagination,
  loading,
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
      visible: false,
      search: {
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
      },
      objects: {},
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
    const { search, status } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'allocationUsersList/GET_DATA',
      payload: {
        ...search,
        status,
      },
    });
    history.push(`${pathname}?${Helper.convertParamSearchConvert(search, variables.QUERY_STRING)}`);
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
  changePagination = (page, limit) => {
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
    return {
      size: 'default',
      total: pagination.total,
      pageSize: query?.limit || variables.PAGINATION.PAGE_SIZE,
      defaultCurrent: Number(this.state.search.page),
      current: Number(this.state.search.page),
      hideOnSinglePage: pagination.total <= 10,
      showSizeChanger: variables.PAGINATION.SHOW_SIZE_CHANGER,
      pageSizeOptions: variables.PAGINATION.PAGE_SIZE_OPTIONS,
      locale: { items_per_page: variables.PAGINATION.PER_PAGE_TEXT },
      onChange: (page, size) => {
        this.changePagination(page, size);
      },
      onShowSizeChange: (current, size) => {
        this.changePagination(current, size);
      },
      showTotal: (total, [start, end]) => `Hiển thị ${start}-${end} trong ${total}`,
    };
  };

  /**
   * Function reset form
   */
  onResetForm = () => {
    if (this.formRef) {
      this.formRef.current.resetFields();
      this.setStateData({
        objects: {},
      });
    }
  };

  /**
   * Function close modal
   */
  handleCancel = () => {
    this.setStateData({ visible: false });
    this.onResetForm();
  };

  /**
   * Function remove items
   * @param {uid} id id of items
   */
  onRemove = (id) => {
    const { dispatch, pagination } = this.props;
    confirm({
      title: 'Khi xóa thì dữ liệu trước thời điểm xóa vẫn giữ nguyên?',
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: 'Có',
      cancelText: 'Không',
      content: 'Dữ liệu này đang được sử dụng, nếu xóa dữ liệu này sẽ ảnh hưởng tới dữ liệu khác?',
      onOk() {
        dispatch({
          type: 'allocationUsersList/REMOVE',
          payload: {
            id,
            pagination: {
              limit: 10,
              page:
                pagination.total % pagination.per_page === 1
                  ? pagination.current_page - 1
                  : pagination.current_page,
            },
          },
        });
      },
      onCancel() {},
    });
  };

  /**
   * Function header table
   */
  header = () => {
    const {
      location: { pathname },
    } = this.props;
    return [
      {
        title: 'Mã ID',
        key: 'code',
        width: 80,
        className: 'min-width-80',
        render: (record) => 'NV01',
      },
      {
        title: 'Tên nhân viên',
        key: 'name',
        className: 'min-width-130',
        render: (record) => 'Nguyễn Văn Tuấn',
      },
      {
        title: 'Cơ sở',
        key: 'location',
        className: 'min-width-130',
        render: (record) => 'Cơ sở 1',
      },
      {
        title: 'Bộ phận',
        key: 'division',
        className: 'min-width-120',
        render: (record) => 'Hành chính nhân sự',
      },
      {
        title: 'Chức danh',
        key: 'positon',
        className: 'min-width-120',
        render: (record) => 'Ghi danh',
      },
      {
        title: 'Số điện thoại',
        key: 'phone',
        className: 'min-width-120',
        render: (record) => '0905145754',
      },
      {
        title: 'Hình thức làm việc',
        key: 'workForm',
        className: 'min-width-120',
        render: (record) => 'Chính thức',
      },
      {
        key: 'action',
        className: 'min-width-80',
        width: 80,
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="primary"
              icon="edit"
              onClick={() => history.push(`${pathname}/${record.id}/chi-tiet`)}
            />
          </div>
        ),
      },
    ];
  };

  render() {
    const {
      data,
      pagination,
      match: { params },
      loading: { effects },
    } = this.props;
    const { search } = this.state;
    const loading = effects['allocationUsersList/GET_DATA'];
    return (
      <>
        <Helmet title="Nhân viên phân bổ" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Nhân viên</Text>
          </div>
          {/* TABS LINK */}
          <div className="d-flex align-items-center mt-3 mb-3">
            <div className={stylesAllocation['tabs-link']}>
              <NavLink
                to="/phan-bo/nhan-vien/danh-sach"
                activeClassName={stylesAllocation['active']}
                className={classnames(stylesAllocation['link'])}
              >
                Danh sách
              </NavLink>
              <NavLink
                to="/phan-bo/nhan-vien/dieu-chuyen"
                activeClassName={stylesAllocation['active']}
                className={classnames(stylesAllocation['link'])}
              >
                Điều chuyển
              </NavLink>
              <NavLink
                to="/phan-bo/nhan-vien/chua-xep-lop"
                activeClassName={stylesAllocation['active']}
                className={classnames(stylesAllocation['link'])}
              >
                Nhân viên chưa sắp xếp
              </NavLink>
            </div>
          </div>
          {/* TABS LINK */}
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                productType: search.productType || null,
                startDate: search.startDate && moment(search.startDate),
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-4">
                  <FormItem
                    name="user_id"
                    data={[]}
                    onChange={(event) => this.onChangeSelect(event, 'user_id')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    name="role_id"
                    data={[]}
                    onChange={(event) => this.onChangeSelect(event, 'role_id')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    name="startDate"
                    data={[]}
                    onChange={(event) => this.onChangeSelect(event, 'startDate')}
                    type={variables.DATE_PICKER}
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
              bordered={false}
              rowKey={(record) => record.id}
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
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
};

export default Index;
