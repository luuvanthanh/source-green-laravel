import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form,Tag } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';

import AssignmentComponent from './components/assignment';
import CheckCoincide from './components/check-coincide';

const rowSelection = {};
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
const mapStateToProps = ({ crmSaleParentsLead, loading }) => ({
  data: crmSaleParentsLead.data,
  error: crmSaleParentsLead.error,
  pagination: crmSaleParentsLead.pagination,
  branches: crmSaleParentsLead.branches,
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
      search: {
        key: query?.key,
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
      type: 'crmSaleParentsLead/GET_DATA',
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
   * Function header table
   */
  header = () => {
    const {
      location: { pathname },
    } = this.props;
    const columns = [
      {
        title: 'STT ',
        key: 'index',
        width: 80,
        render: (record) => record?.index,
        fixed: 'left',
      },
      {
        title: 'Tên',
        key: 'name',
        width: 250,
        render: (record) => record?.name,
      },
      {
        title: 'Số điện thoại',
        key: 'phone',
        width: 150,
        render: (record) => record?.phone,
      },
      {
        title: 'Địa chỉ',
        key: 'address',
        width: 200,
        render: (record) => record?.address,
      },
      {
        title: 'Tỉnh thành',
        key: 'city',
        width: 150,
        render: (record) => record?.city,
      },
      {
        title: 'Quận',
        key: 'district',
        width: 150,
        render: (record) => record?.district,
      },
      {
        title: 'Cơ sở quan tâm',
        key: 'basis',
        width: 200,
        render: (record) => record?.basis,
      },
      {
        title: 'Tháng tuổi',
        key: 'age',
        width: 100,
        render: (record) => record?.age,
      },
      {
        title: 'Tình trạng Lead',
        key: 'status',
        width: 150,
        render: (record) => record?.status,
      },
      {
        title: 'Tag',
        key: 'tags',
        width: 250,
        render: (record) => (
          <Tag color="#27a600">{record?.tags}</Tag>
        )
      },
      {
        title: 'Nhân viên chăm sóc',
        key: 'staff',
        width: 250,
        render: (record) => record?.staff,
      },
      {
        title: 'Nguồn tìm kiếm',
        key: 'search',
        width: 150,
        render: (record) => record?.search,
      },
      {
        key: 'action',
        width: 100,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button color="success" onClick={() => history.push(`${pathname}/${record.id}/chi-tiet`)}>Chi tiết</Button>
          </div>
        ),
      },
    ];
    return columns;
  };

  render() {
    const {
      match: { params },
      pagination,
      loading: { effects },
      location: { pathname },
      data,
      branches,
    } = this.props;
    const { search } = this.state;
    const loading = effects['crmSaleParentsLead/GET_DATA'];
    return (
      <>
        <Helmet title="Phụ huynh lead" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Phụ huynh lead</Text>
            <div className="d-flex ">
            <CheckCoincide/>
            <Button color="primary" icon="export" className='ml-2'>
            Import
            </Button>
            <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)} className='ml-2'>
            Tạo mới
            </Button>
            <AssignmentComponent />
            </div>
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
                    name="key"
                    onChange={(event) => this.onChange(event, 'key')}
                    placeholder="Nhập từ khóa"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={branches}
                    name="a"
                    onChange={(event) => this.onChangeSelect(event, 'branchId')}
                    type={variables.SELECT}
                    allowClear={false}
                    placeholder="Chọn Tỉnh thành"
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={branches}
                    name="b"
                    onChange={(event) => this.onChangeSelect(event, 'branchId')}
                    type={variables.SELECT}
                    allowClear={false}
                    placeholder="Chọn Quận huyện"
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={branches}
                    name="c"
                    onChange={(event) => this.onChangeSelect(event, 'branchId')}
                    type={variables.SELECT}
                    allowClear={false}
                    placeholder="Chọn cơ sở"
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={branches}
                    name="d"
                    onChange={(event) => this.onChangeSelect(event, 'branchId')}
                    type={variables.SELECT}
                    allowClear={false}
                    placeholder="Chọn nguồn"
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={branches}
                    name="e"
                    onChange={(event) => this.onChangeSelect(event, 'branchId')}
                    type={variables.SELECT}
                    allowClear={false}
                    placeholder="Chọn tình trạng lead"
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={branches}
                    name="f"
                    onChange={(event) => this.onChangeSelect(event, 'branchId')}
                    type={variables.SELECT}
                    allowClear={false}
                    placeholder="Chọn nhân viên"
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={branches}
                    name="f"
                    onChange={(event) => this.onChangeSelect(event, 'branchId')}
                    type={variables.SELECT}
                    allowClear={false}
                    placeholder="Chọn tags"
                  />
                </div>
              </div>
            </Form>
            <Table
              bordered={false}
              columns={this.header(params)}
              dataSource={data}
              loading={loading}
              rowSelection={{ ...rowSelection }}
              pagination={this.pagination(pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
              rowKey={(record) => record.id}
              scroll={{ x: '100%', y: 'calc(100vh - 150px)' }}
            />
          </div>
        </div>
      </>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  pagination: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  data: [],
  branches: [],
};

export default Index;
