import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Tag } from 'antd';
import classnames from 'classnames';
import { get, debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import styles from '@/assets/styles/Common/common.scss';
import stylesModule from './styles.module.scss';


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
const mapStateToProps = ({ crmSaleParentsPotential, loading }) => ({
  data: crmSaleParentsPotential.data,
  error: crmSaleParentsPotential.error,
  pagination: crmSaleParentsPotential.pagination,
  branches: crmSaleParentsPotential.branches,
  district: crmSaleParentsPotential.district,
  tags: crmSaleParentsPotential.tags,
  lead: crmSaleParentsPotential.lead,
  employees: crmSaleParentsPotential.employees,
  searchSource: crmSaleParentsPotential.searchSource,
  branch: crmSaleParentsPotential.branch,
  potential : crmSaleParentsPotential.potential,
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
      dataSource: [],
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

  /**
   * Function load data
   */
  onLoad = () => {
    const { search } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'crmSaleParentsPotential/GET_DATA',
      payload: {
        ...search,
      },
      callback: (response) => {
        if (response) {
          this.setStateData({
            dataSource: response.parsePayload,
          });
        }
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

  loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'crmSaleParentsPotential/GET_CITIES',
      payload: {},
    });
    dispatch({
      type: 'crmSaleParentsPotential/GET_DISTRICTS',
      payload: {},
    });
    dispatch({
      type: 'crmSaleParentsPotential/GET_TAGS',
      payload: {},
    });
    dispatch({
      type: 'crmSaleParentsPotential/GET_STATUS_LEAD',
      payload: {},
    });
    dispatch({
      type: 'crmSaleParentsPotential/GET_EMPLOYEES',
      payload: {},
    });
    dispatch({
      type: 'crmSaleParentsPotential/GET_SEARCH',
      payload: {},
    });
    dispatch({
      type: 'crmSaleParentsPotential/GET_BRANCH',
      payload: {},
    });
    dispatch({
      type: 'crmSaleParentsPotential/GET_POTENTIAL',
      payload: {},
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
        render: (text, record, index) =>
          Helper.serialOrder(this.state.search?.page, index, this.state.search?.limit),
      },
      {
        title: 'Tên',
        key: 'name',
        width: 250,
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record.file_image)}
            fullName={record.full_name}
          />
        ),
      },
      {
        title: 'Số điện thoại',
        key: 'phone',
        width: 150,
        render: (record) => record?.phone,
      },
      {
        title: 'Quận',
        key: 'district',
        width: 150,
        render: (record) => <Text size="normal">{get(record, 'district.name')}</Text>,
      },
      {
        title: 'Tháng tuổi',
        key: 'age',
        width: 100,
        render: (value, record) => (
          <div className='d-flex' >
            {record.potentialStudentInfo.map((item, index) =>
              <div size="normal" key={index} className='d-flex'>
                {item.age_month}{index + 1 === record.potentialStudentInfo.length ? "" : ",  "}
              </div>
            )}
          </div>
        ),
      },
      {
        title: 'Tình trạng Tiềm năng',
        key: 'status',
        width: 170,
        render: (record) => (
          <>
            {' '}
            {record?.customerPotentialStatusCare
              ?.map((item, index) => (
                <Text size="normal" key={index} >
                  {get(item, 'statusParentPotential.name')}
                </Text>
              ))
              .pop()}{' '}
          </>
        ),
      },
      {
        title: 'Phân loại PH',
        key: 'statusParentLead',
        width: 150,
        render: (record) => (
          <>
            {' '}
            {record?.customerLead?.statusCare
              ?.map((item, index) => (
                <Text size="normal" key={index} >
                  {get(item, 'statusParentLead.name')}
                </Text>
              ))
              .pop()}{' '}
          </>
        ),
      },
      {
        title: 'Tag',
        key: 'tags',
        width: 200,
        render: (record) => (
          <>
            {record?.customerPotentialTag?.map((item, index) => (
              <div className={stylesModule['wrapper-tag']} key={index}>
                <Tag size="normal" color="#27a600" key={index} style={{ backgroundColor: `${item?.tag?.color_code}` }}>
                  {get(item, 'tag.name')}
                </Tag>
              </div>
            ))}
          </>
        ),
      },
      {
        title: 'Nhân viên chăm sóc',
        key: 'employee',
        width: 250,
        render: (record) => <Text size="normal">{get(record, 'employee.full_name')}</Text>,
      },
      {
        title: 'Nguồn tìm kiếm',
        key: 'search',
        width: 150,
        render: (record) => <Text size="normal">{get(record, 'searchSource.name')}</Text>,
      },
      {
        key: 'action',
        width: 100,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
            key='btn'
              color="success"
              onClick={() => history.push(`${pathname}/${record.id}/chi-tiet`)}
            >
              Chi tiết
            </Button>
          </div>
        ),
      },
    ];
    return columns;
  };

  render() {
    const {
      district,
      tags,
      lead,
      employees,
      searchSource,
      match: { params },
      pagination,
      branch,
      potential,
      loading: { effects },
    } = this.props;
    const { search, dataSource } = this.state;
    const loading = effects['crmSaleParentsPotential/GET_DATA'];
    return (
      <>
        <Helmet title="Phụ huynh tiềm năng" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Phụ huynh tiềm năng</Text>
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
                    data={[{ name: 'Chọn tất cả Quận huyện', id : null }, ...district,]}
                    name="district"
                    onChange={(event) => this.onChangeSelect(event, 'district_id')}
                    type={variables.SELECT}
                    allowClear={false}
                    placeholder="Chọn Quận huyện"
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ name: 'Chọn tất cả Cơ sở' , id : null}, ...branch,]}
                    name="branch"
                    onChange={(event) => this.onChangeSelect(event, 'branch_id')}
                    type={variables.SELECT}
                    allowClear={false}
                    placeholder="Chọn cơ sở"
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ name: 'Chọn tất cả Nguồn' , id: null}, ...searchSource,]}
                    name="search"
                    onChange={(event) => this.onChangeSelect(event, 'search_source_id')}
                    type={variables.SELECT}
                    allowClear={false}
                    placeholder="Chọn nguồn"
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ name: 'Chọn tất cả phân loại PH', id: null }, ...lead,]}
                    name="status_parent_lead_id"
                    onChange={(event) => this.onChangeSelect(event, 'status_parent_lead_id')}
                    type={variables.SELECT}
                    allowClear={false}
                    placeholder="Chọn phân loại PH"
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ name: 'Chọn tất cả tình trạng Lead', id: null }, ...potential,]}
                    name="status_parent_potential_id"
                    onChange={(event) => this.onChangeSelect(event, 'status_parent_potential_id')}
                    type={variables.SELECT}
                    allowClear={false}
                    placeholder="Chọn tình trạng Lead"
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    name="full_name"
                    data={[
                      { full_name: 'Chọn tất cả nhân viên' , id: null},
                          { id: 'null', full_name: 'Chưa có nhân viên chăm sóc' },
                      ...employees,
                    ]}
                    onChange={(event) => this.onChangeSelect(event, 'employee_id')}
                    type={variables.SELECT}
                    options={['id', 'full_name']}
                    allowClear={false}
                    placeholder="Chọn nhân viên chăm sóc"
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ name: 'Chọn tất cả tags' , id : null}, ...tags,]}
                    name="tags"
                    type={variables.SELECT}
                    onChange={(event) => this.onChangeSelect(event, 'tag_id')}
                    allowClear={false}
                    placeholder="Chọn tags"
                  />
                </div>
              </div>
            </Form>
            <Table
              bordered={false}
              columns={this.header(params)}
              dataSource={dataSource}
              loading={loading}
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
  branch: PropTypes.arrayOf(PropTypes.any),
  district: PropTypes.arrayOf(PropTypes.any),
  tags: PropTypes.arrayOf(PropTypes.any),
  lead: PropTypes.arrayOf(PropTypes.any),
  employees: PropTypes.arrayOf(PropTypes.any),
  searchSource: PropTypes.arrayOf(PropTypes.any),
  potential: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  branch: [],
  district: [],
  tags: [],
  lead: [],
  employees: [],
  searchSource: [],
  potential: [],
};

export default Index;
