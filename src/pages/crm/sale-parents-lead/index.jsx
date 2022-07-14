import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Tag, Modal, Select, Upload, message } from 'antd';
import classnames from 'classnames';
import { get, debounce, head, last } from 'lodash';
import { Helmet } from 'react-helmet';
import Pane from '@/components/CommonComponent/Pane';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import moment from 'moment';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import styles from '@/assets/styles/Common/common.scss';
import AssignmentComponent from './components/assignment';
import Check from './components/list-coincide';
import stylesModule from './styles.module.scss';


const { Option } = Select;
const dataSearchCheck = [
  { id: 'full_name:true', name: 'Tên' },
  { id: 'address:true', name: 'Địa chỉ' },
  { id: 'email:true', name: 'Email' },
  { id: 'phone:true', name: 'Số điện thoại' },
  { id: 'children_full_name:true', name: 'Tên con' },
  { id: 'children_birth_date:true', name: 'Ngày sinh con' },
];
const leadStatus = [
  { id: 'LEAD_NEW', name: 'Lead mới' },
  { id: 'POTENTIAL', name: 'Có tiềm năng' },
  { id: 'NOT_POTENTIAL', name: 'Không tiềm năng' },
];
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
  city: crmSaleParentsLead.city,
  district: crmSaleParentsLead.district,
  tags: crmSaleParentsLead.tags,
  lead: crmSaleParentsLead.lead,
  employees: crmSaleParentsLead.employees,
  searchSource: crmSaleParentsLead.searchSource,
  branch: crmSaleParentsLead.branch,
  types: crmSaleParentsLead.types,
  loading,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  formCheck = React.createRef();

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
      isModalVisible: false,
      isModal: false,
      dataCheck: {},
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

  onSelectChange = (e) => {
    const { data } = this.props;
    this.setStateData(() => ({
      dataSource: data.map((item) => ({
        ...item,
        isActive: !!e.includes(item.id),
      })),
    }));
  };

  // save = () => {
  //   const { dispatch } = this.props;
  //   const payload = {
  //     id: this.state.dataSource.filter((item) => item.isActive).map((item) => item.id),
  //   };
  //   dispatch({
  //     type: 'crmSaleParentsLead/ADD',
  //     payload,
  //     callback: (response, error) => {
  //       if (error) {
  //         if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
  //           error?.validationErrors.forEach((item) => {
  //             this.formRef.current.setFields([
  //               {
  //                 name: head(item.members),
  //                 errors: [item.message],
  //               },
  //             ]);
  //           });
  //         }
  //       }
  //     },
  //   });
  // };

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
* Function change input
* @param {object} e event of input
* @param {string} type key of object search
*/
  onChangeDate = (e) => {
    this.setState(
      (prevState) => ({
        search: {
          ...prevState.search,
          start_date: moment(e[0]).format(variables.DATE_FORMAT.DATE_AFTER),
          end_date: moment(e[1]).format(variables.DATE_FORMAT.DATE_AFTER),
        },
      }),
    );
    this.debouncedSearch();
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
      type: 'crmSaleParentsLead/GET_CITIES',
      payload: {},
    });
    dispatch({
      type: 'crmSaleParentsLead/GET_DISTRICTS',
      payload: {},
    });
    dispatch({
      type: 'crmSaleParentsLead/GET_TAGS',
      payload: {},
    });
    dispatch({
      type: 'crmSaleParentsLead/GET_STATUS_LEAD',
      payload: {},
    });
    dispatch({
      type: 'crmSaleParentsLead/GET_SEARCH',
      payload: {},
    });
    dispatch({
      type: 'crmSaleParentsLead/GET_BRANCH',
      payload: {},
    });
    dispatch({
      type: 'crmSaleParentsLead/GET_DIVISIONS',
      payload: {},
      callback: (res) => {
        if (res) {
          const item = res.parsePayload?.filter(i => i?.code === 'GD' || i?.code === 'MKT');
          dispatch({
            type: 'crmSaleParentsLead/GET_EMPLOYEES',
            payload: item,
          });
        }
      }
    });
  };


  onSelectColor = (e, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'crmSaleLeadAdd/ADD_TAGS',
      payload: {
        customer_tag: e.map((i) => ({ tag_id: i })),
        customer_lead_id: record.id,
      },
      callback: () => {
      },
    });
  };

  handleChange = (event, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'crmSaleLeadAdd/ADD_TAGS',
      payload: {
        customer_tag: {
          tag_id: record?.customerTag.map((i) => (i.id === event.value ? event.value : i.id)),
        },
        customer_lead_id: record.id,
      },
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
    const {
      location: { pathname },
      tags,
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
            fullName={record?.full_name}
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
        width: 100,
        render: (record) => <Text size="normal">{get(record, 'district.name')}</Text>,
      },
      {
        title: 'Cơ sở quan tâm',
        key: 'district',
        width: 150,
        render: (record) => <Text size="normal">{get(record, 'branch.name')}</Text>,
      },
      {
        title: 'Tháng tuổi',
        key: 'age',
        width: 100,
        render: (value, record) => (
          <div className='d-flex' >
            {record.studentInfo.map((item, index) =>
              <div size="normal" key={index} className='d-flex'>
                {item.age_month}{index + 1 === record.studentInfo.length ? "" : ",  "}
              </div>
            )}
          </div>
        ),
      },
      {
        title: 'Tình trạng Lead',
        key: 'status',
        width: 150,
        render: (record) => (
          <>
            {' '}
            {record?.statusLead
              ?.map((item, index) => (
                <Text size="normal" key={index}>
                  {item?.status === 'LEAD_NEW' ? 'Lead mới' : ""}
                  {item?.status === 'POTENTIAL' ? 'Tiềm năng' : ""}
                  {item?.status === 'NOT_POTENTIAL' ? 'Không tiềm năng' : ""}
                </Text>
              ))
              .pop()}{' '}
          </>
        ),
      },
      {
        title: 'Phân loại PH',
        key: 'status',
        width: 150,
        render: (record) => (
          <>
            {' '}
            {record?.statusCare
              ?.map((item, index) => (
                <Text size="normal" key={index}>
                  {get(item, 'statusParentLead.name')}
                </Text>
              ))
              .pop()}{' '}
          </>
        ),
      },
      {
        title: 'Nhân viên chăm sóc',
        key: 'staff',
        width: 200,
        render: (record) => <Text size="normal">{get(record, 'employee.full_name')}</Text>,
      },
      {
        title: 'Tag',
        key: 'tags',
        width: 300,
        render: (record,) => (
          <>
            <Select
              showArrow
              defaultValue={record?.customerTag?.map((item) => item?.tag?.id)}
              mode="multiple"
              className={stylesModule['wrapper-tags']}
              onChange={(e) => this.onSelectColor(e, record)}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
              }
              tagRender={({ label, value, color_code, closable, onClose }) => {
                const itemTag = tags.find(item => item?.id === value);
                return (
                  <Tag
                    color={itemTag?.color_code || color_code}
                    closable={closable}
                    onClose={onClose}
                    className={stylesModule['tags-content']}
                  >
                    {label}
                  </Tag>
                );
              }}
            >
              {tags.map((item, index) => (
                <Option
                  value={item?.id}
                  key={index}
                  style={{ backgroundColor: `${item?.color_code}` }}
                >
                  {item?.name}
                </Option>
              ))}
            </Select>
          </>
        ),
      },
      {
        title: 'Nguồn tìm kiếm',
        key: 'search',
        width: 150,
        render: (record) => <Text size="normal">{get(record, 'searchSource.name')}</Text>,
      },
      {
        title: 'Ngày nhận data',
        key: 'search',
        width: 150,
        render: (record) => Helper.getDate(record?.created_at, variables.DATE_FORMAT.DATE_VI)
      },
      {
        key: 'action',
        width: 100,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="success"
              onClick={() => history.push(`${pathname}/${record?.id}/chi-tiet`)}
            >
              Chi tiết
            </Button>
          </div>
        ),
      },
    ];
    return columns;
  };

  //

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleOk = () => {
    this.formCheck.current.validateFields().then((values) => {
      const search = values?.name?.reduce(
        (a, v) => ({ ...a, [head(v.split(':'))]: last(v.split(':')) }),
        {},
      );
      this.setState(() => ({
        dataCheck: search,
        isModalVisible: false,
        isModal: true,
      }));
    });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  callbackFunction = () => {
    this.setState(() => ({
      isModal: false,
    }));
  };

  importExcel = (file) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'crmSaleParentsLead/IMPORT_EXCEL',
      payload: { file },
      callback: (response) => {
        if (response) {
          this.onLoad();
        }
      },
    });
  };

  onChangeExcel = () => {
    Helper.exportExcelCRM(
      `/v1/template-excel-customer-leads`, " ", `template-customer-lead.xlsx`,
    );
  };

  render() {
    const {
      district,
      tags,
      branch,
      lead,
      data,
      employees,
      searchSource,
      match: { params },
      pagination,
      loading: { effects },
      location: { pathname },
      location,
    } = this.props;
    const { search, dataSource, isModalVisible, dataCheck, isModal } = this.state;
    const self = this;
    const rowSelection = {
      onChange: this.onSelectChange,
      getCheckboxProps: (record) => ({
        disabled: record.employee_id !== null,
        name: record.employee_id,
      }),
    };
    const props = {
      beforeUpload() {
        return null;
      },
      customRequest({ file }) {
        const { name, size } = file;
        const allowTypes = ['xlsx', 'xls'];
        const maxSize = 5 * 2 ** 20;
        if (!allowTypes.includes(last(name.split('.'))) || size > maxSize) {
          setTimeout(() => {
            message.error(
              'Định dạng hỗ trợ: xlsx', 'xls Tổng dung lượng không vượt quá 20MB',
            );
          }, 300);
          return;
        }
        self.importExcel(file);
      },
      showUploadList: false,
      fileList: [],
    };

    const loading = effects['crmSaleParentsLead/GET_DATA'];
    return (
      <>
        {isModal ? (
          <Check dataCheck={dataCheck} parentCallback={this.callbackFunction} location={location} />
        ) : (
          <>
            <Helmet title="Phụ huynh lead" />
            <div className={classnames(styles['content-form'], styles['content-form-children'])}>
              <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
                <Text color="dark">Phụ huynh lead</Text>
                <div className="d-flex ">
                  <div>
                    <Button color="danger" icon="shrink" className="ml-2" onClick={this.showModal}>
                      Check trùng
                    </Button>
                    <Modal
                      title="Tìm kiếm phụ huynh trùng"
                      className={stylesModule['wrapper-modal-check']}
                      centered
                      visible={isModalVisible}
                      onOk={this.handleOk}
                      onCancel={this.handleCancel}
                      width={900}
                      footer={[
                        <p
                          key="back"
                          role="presentation"
                          onClick={this.handleCancel}
                          className={stylesModule['button-cancel']}
                        >
                          Hủy
                        </p>,
                        <Button
                          htmlType="submit"
                          color="success"
                          type="primary"
                          onClick={this.handleOk}
                        >
                          Tìm trùng
                        </Button>,
                      ]}
                    >
                      <div>
                        <Form layout="vertical" ref={this.formCheck}>
                          <Pane className="row">
                            <Pane className="col-lg-12">
                              <FormItem
                                label="Các điều kiện tìm kiếm trùng"
                                className="mt-2"
                                name="name"
                                data={dataSearchCheck}
                                mode="tags"
                                type={variables.SELECT_MUTILPLE}
                                rules={[variables.RULES.EMPTY]}
                              />
                            </Pane>
                          </Pane>
                        </Form>
                      </div>
                    </Modal>
                  </div>
                  <Button color="primary" icon="export" className="ml-2" onClick={this.onChangeExcel}>
                    Mẫu Excel
                  </Button>
                  <Upload {...props}>
                    <Button color="primary" icon="upload1" className="ml-2" loading={effects['crmSaleParentsLead/IMPORT_EXCEL']}>
                      Import
                    </Button>
                  </Upload>
                  <Button
                    color="success"
                    icon="plus"
                    onClick={() => history.push(`${pathname}/tao-moi`)}
                    className="ml-2"
                  >
                    Tạo mới
                  </Button>
                  <AssignmentComponent dataSource={dataSource} employees={employees} />
                  {/* <Button
                    color="success"
                    icon="next"
                    className="ml-2"
                    onClick={this.save}
                    disabled={!size(dataSource.filter((item) => item.isActive))}
                  >
                    Chuyển tiềm năng
                  </Button> */}
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
                        data={[{ name: 'Chọn tất cả Quận huyện', id: null }, ...district,]}
                        name="district"
                        onChange={(event) => this.onChangeSelect(event, 'district_id')}
                        type={variables.SELECT}
                        allowClear={false}
                        placeholder="Chọn Quận huyện"
                      />
                    </div>
                    <div className="col-lg-3">
                      <FormItem
                        data={[{ name: 'Chọn tất cả Cơ sở', id: null }, ...branch,]}
                        name="branch"
                        onChange={(event) => this.onChangeSelect(event, 'branch_id')}
                        type={variables.SELECT}
                        allowClear={false}
                        placeholder="Chọn cơ sở"
                      />
                    </div>
                    <div className="col-lg-3">
                      <FormItem
                        data={[{ name: 'Chọn tất cả Nguồn', id: null }, ...searchSource,]}
                        name="search"
                        onChange={(event) => this.onChangeSelect(event, 'search_source_id')}
                        type={variables.SELECT}
                        allowClear={false}
                        placeholder="Chọn nguồn"
                      />
                    </div>
                    <div className="col-lg-3">
                      <FormItem
                        data={[{ name: 'Chọn tất cả tình trạng Lead', id: null }, ...leadStatus,]}
                        name="status_lead"
                        onChange={(event) => this.onChangeSelect(event, 'status_lead')}
                        type={variables.SELECT}
                        allowClear={false}
                        placeholder="Chọn tình trạng Lead"
                      />
                    </div>
                    <div className="col-lg-3">
                      <FormItem
                        data={[{ name: 'Chọn tất cả phân loại PH', id: null }, ...lead,]}
                        name="status_type_lead"
                        onChange={(event) => this.onChangeSelect(event, 'status_type_lead')}
                        type={variables.SELECT}
                        allowClear={false}
                        placeholder="Chọn phân loại PH"
                      />
                    </div>
                    <div className="col-lg-3">
                      <FormItem
                        name="full_name"
                        data={[
                          { fullName: 'Chọn tất cả nhân viên', employeeIdCrm: null },
                          { employeeIdCrm: 'null', fullName: 'Chưa có nhân viên chăm sóc' },
                          ...employees,
                        ]}
                        onChange={(event) => this.onChangeSelect(event, 'employee_id')}
                        type={variables.SELECT}
                        options={['employeeIdCrm', 'fullName']}
                        allowClear={false}
                        placeholder="Chọn nhân viên chăm sóc"
                      />
                    </div>
                    <div className="col-lg-3">
                      <FormItem
                        data={[{ name: 'Chọn tất cả tags', id: null }, ...tags,]}
                        name="tags"
                        type={variables.SELECT}
                        onChange={(event) => this.onChangeSelect(event, 'tag_id')}
                        allowClear={false}
                        placeholder="Chọn tags"
                      />
                    </div>
                    <div className="col-lg-3">
                      <FormItem
                        name="date"
                        onChange={(event) => this.onChangeDate(event, 'date')}
                        type={variables.RANGE_PICKER}
                        allowClear={false}
                      />
                    </div>
                  </div>
                </Form>
                <Table
                  bordered={false}
                  columns={this.header(params)}
                  dataSource={data}
                  loading={loading}
                  disabled
                  rowSelection={{ ...rowSelection }}
                  pagination={this.pagination(pagination)}
                  params={{
                    header: this.header(),
                    type: 'table',
                  }}
                  rowKey={(record) => record.id}
                  scroll={{ x: '100%', y: '60vh' }}
                />
              </div>
            </div>
          </>
        )}
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
  district: PropTypes.arrayOf(PropTypes.any),
  tags: PropTypes.arrayOf(PropTypes.any),
  lead: PropTypes.arrayOf(PropTypes.any),
  employees: PropTypes.arrayOf(PropTypes.any),
  searchSource: PropTypes.arrayOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
  branch: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  district: [],
  tags: [],
  lead: [],
  employees: [],
  searchSource: [],
  data: [],
  branch: [],
};

export default Index;
