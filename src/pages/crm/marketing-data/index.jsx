import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Select, Tag, Modal, Upload , message} from 'antd';
import classnames from 'classnames';
import { isEmpty, debounce, head, size, get, last } from 'lodash';
import { Helmet } from 'react-helmet';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import Pane from '@/components/CommonComponent/Pane';
import styles from '@/assets/styles/Common/common.scss';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import HelperModules from './utils/Helper';
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
const mapStateToProps = ({ crmMarketingData, loading, crmSaleParentsLead }) => ({
  data: crmMarketingData.data,
  error: crmMarketingData.error,
  pagination: crmMarketingData.pagination,
  branches: crmMarketingData.branches,
  city: crmMarketingData.city,
  searchs: crmMarketingData.searchs,
  district: crmMarketingData.district,
  program: crmMarketingData.program,
  tags: crmSaleParentsLead.tags,
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
    this.setStateData((prevState) => ({
      dataSource: prevState.dataSource.map((item) => ({
        ...item,
        isActive: !!e.includes(item.id),
      })),
    }));
  };

  save = () => {
    const { dispatch } = this.props;
    const payload = {
      id: this.state.dataSource.filter((item) => item.isActive).map((item) => item.id),
    };
    dispatch({
      type: 'crmMarketingData/ADD',
      payload,
      callback: (response, error) => {
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              this.formRef.current.setFields([
                {
                  name: head(item.members),
                  errors: [item.message],
                },
              ]);
            });
          }
        }
      },
    });
  };

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
      type: 'crmMarketingData/GET_DATA',
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
    this.props.dispatch({
      type: 'crmMarketingData/GET_SEARCH',
      payload: {
        ...search,
      },
    });
    this.props.dispatch({
      type: 'crmMarketingData/GET_PROGRAM',
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

  loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'crmMarketingData/GET_CITIES',
      payload: {},
    });
    dispatch({
      type: 'crmMarketingData/GET_DISTRICTS',
      payload: {},
    });
    dispatch({
      type: 'crmSaleParentsLead/GET_TAGS',
      payload: {},
    });
  };


  onSelectColor = (e, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'crmMarketingData/ADD_TAGS',
      payload: {
        tag_id: e.map((i) => (i)),
        data_marketing_id: record.id,
      },
      callback: () => {
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
        fixed: 'left',
        render: (text, record, index) =>
          Helper.serialOrder(this.state.search?.page, index, this.state.search?.limit),
      },
      {
        title: 'Tên phụ huynh',
        key: 'name',
        width: 250,
        render: (record) => record?.full_name,
      },
      {
        title: 'Email',
        key: 'email',
        width: 200,
        render: (record) => record?.email,
      },
      {
        title: 'Số điện thoại',
        key: 'phone',
        width: 150,
        render: (record) => record?.phone,
      },
      {
        title: 'Trạng thái',
        key: 'status',
        className: 'min-width-150',
        width: 150,
        render: (record) => HelperModules.tagStatus(record.status),
      },
      {
        title: 'Tag',
        key: 'tags',
        width: 300,
        render: (record,) => (
          <>
            <Select
              showArrow
              defaultValue={record?.tag?.map((item) => item?.id)}
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
        title: 'Chương trình',
        key: 'basis',
        width: 200,
        render: (record) => (
          <Text size="normal">{record?.marketingProgram?.map((item) => item.name).join(', ')}</Text>
        ),
      },
      {
        title: 'Nguồn',
        key: 'search',
        width: 200,
        render: (record) => <Text size="normal">{get(record, 'searchSource.name')}</Text>,
      },
      {
        key: 'action',
        width: 100,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
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

  onSelectChange = (e) => {
    this.setState((prevState) => ({
      dataSource: prevState.dataSource.map((item) => ({
        ...item,
        isActive: !!e.includes(item.id),
      })),
    }));
  };

  save = () => {
    const { dispatch } = this.props;
    const payload = {
      id: this.state.dataSource.filter((item) => item.isActive).map((item) => item.id),
    };
    dispatch({
      type: 'crmMarketingData/ADD',
      payload,
      callback: (response, error) => {
        if (response) {
          this.onLoad();
        }
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              this.formRef.current.setFields([
                {
                  name: head(item.members),
                  errors: [item.message],
                },
              ]);
            });
          }
        }
      },
    });
  };

  callbackFunction = () => {
    this.setState(() => ({
      isModal: false,
    }));
  };

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

  importExcel = (file) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'crmMarketingData/IMPORT_EXCEL',
      payload: {file},  
      callback: (response) => {
        if (response) {
          this.onLoad();
        }
      },
    });
  };

  render() {
    const {
      match: { params },
      pagination,
      searchs,
      data,
      program,
      loading: { effects },
      location: { pathname },
      location,
    } = this.props;
    const self = this;
    const { search, dataSource, isModalVisible, dataCheck, isModal } = this.state;
    const rowSelection = {
      onChange: this.onSelectChange,
      getCheckboxProps: (record) => ({
        disabled: record.status === 'MOVE',
        name: record.status,
      }),
    };
    const props =  {
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

    const loading = effects['crmMarketingData/GET_DATA'];
    return (
      <>
        {
          isModal ?
            <Check dataCheck={dataCheck} parentCallback={this.callbackFunction} location={location} />
            :
            <>
              <Helmet title="Data Marketing" />
              <div className={classnames(styles['content-form'], styles['content-form-children'])}>
                <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
                  <Text color="dark">Data Marketing</Text>
                  <div className="d-flex ">
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
                    <Upload {...props}>
                      <Button color="primary" icon="export" className="ml-2"  loading={effects['crmMarketingData/IMPORT_EXCEL']}> 
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
                    <Button
                      color="success"
                      icon="next"
                      className="ml-2"
                      onClick={this.save}
                      disabled={!size(dataSource.filter((item) => item.isActive))}
                    >
                      Chuyển lead
                    </Button>
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
                          data={[{ name: 'Chọn tất cả Chương trình', id: null }, ...program,]}
                          name="name"
                          onChange={(event) => this.onChangeSelect(event, 'marketing_program_id')}
                          type={variables.SELECT}
                          allowClear={false}
                          placeholder="Chọn chương trình"
                        />
                      </div>
                      <div className="col-lg-3">
                        <FormItem
                          data={[{ name: 'Chọn tất cả Nguồn', id: null }, ...searchs,]}
                          name="source"
                          onChange={(event) => this.onChangeSelect(event, 'search_source_id')}
                          type={variables.SELECT}
                          allowClear={false}
                          placeholder="Chọn nguồn"
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
                    scroll={{ x: '100%', y: '60vh' }}
                  />
                </div>
              </div>
            </>}
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
  searchs: PropTypes.arrayOf(PropTypes.any),
  program: PropTypes.arrayOf(PropTypes.any),
  tags: PropTypes.arrayOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  searchs: [],
  program: [],
  tags: [],
  data: [],
};

export default Index;
