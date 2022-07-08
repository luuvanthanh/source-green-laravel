import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Modal, Radio } from 'antd';
import classnames from 'classnames';
import { debounce, get } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Pane from '@/components/CommonComponent/Pane';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import variablesModules from './utils/variables';
import stylesModule from './style.module.scss';


const { Item: FormItemAntd } = Form;
const { Group: RadioGroup } = Radio;
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
const mapStateToProps = ({ laboursContracts, loading }) => ({
  data: laboursContracts.data,
  pagination: laboursContracts.pagination,
  employees: laboursContracts.employees,
  categories: laboursContracts.categories,
  loading,
});
const statuses = variables.STATUS_CONTRACT;
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
        type: query?.type,
        fullName: query?.fullName,
        branchId: query?.branchId,
        positionId: query?.positionId,
        status: query?.status,
        employeeId: query?.employeeId ? query?.employeeId.split(',') : undefined,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
      },
      isModalVisible: false,
      isModalRadio: variablesModules.TYPE.WORD,
      idTable: undefined,
      type: (variablesModules.TYPE.WORD),
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
    const { dispatch } = this.props;
    dispatch({
      type: 'laboursContracts/GET_EMPLOYEES',
      payload: {},
    });
    dispatch({
      type: 'laboursContracts/GET_CATEGORIES',
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
      type: 'laboursContracts/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
        },
        variables.QUERY_STRING,
      )}`,
    );
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
  pagination = (pagination) =>
    Helper.paginationLavarel({
      pagination,
      callback: (response) => {
        this.changePagination(response);
      },
    });

  /**
   * Function remove items
   * @param {uid} id id of items
   */
  onRemove = (id) => {
    const { dispatch } = this.props;
    const self = this;
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'laboursContracts/REMOVE',
          payload: {
            id,
          },
          callback: (response) => {
            if (response) self.onLoad();
          },
        });
      },
    });
  };

  export = () => {
    const { idTable, isModalRadio } = this.state;
    Helper.exportExcel(`/v1/${isModalRadio}/${idTable}`, {}, `HopDongLaoDong.docx`);
    this.setState({ isModalVisible: false });
  };

  showModal = (id) => {
    this.setState({ isModalVisible: true });
    this.setState({ idTable: id });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  onChangeType = (e) => {
    this.setState({ isModalRadio: e.target.value });
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
        title: 'Nhân viên',
        key: 'name',
        className: 'min-width-220',
        width: 220,
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(get(record, 'employee.fileImage'))}
            fullName={get(record, 'employee.fullName')}
          />
        ),
      },
      {
        title: 'Số hợp đồng',
        key: 'contract_number',
        dataIndex: 'contractNumber',
        className: 'min-width-120',
        width: 120,
      },
      {
        title: 'Ngày hợp đồng',
        key: 'date',
        dataIndex: 'contractDate',
        className: 'min-width-150',
        width: 150,
        render: (value) => Helper.getDate(value, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Loại hợp đồng',
        key: 'contract_category',
        dataIndex: 'typeOfContract',
        className: 'min-width-120',
        width: 120,
        render: (value) => value?.name,
      },
      {
        title: 'Thời hạn HĐ từ',
        key: 'date',
        dataIndex: 'contractFrom',
        className: 'min-width-150',
        width: 150,
        render: (value) => Helper.getDate(value, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Thời hạn HĐ đến',
        key: 'deadline',
        dataIndex: 'contractTo',
        className: 'min-width-150',
        width: 150,
        render: (value) => Helper.getDate(value, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Nơi làm việc',
        key: 'branch',
        dataIndex: 'branch',
        className: 'min-width-150',
        width: 150,
        render: (value) => value?.name,
      },
      {
        title: 'Chức vụ',
        key: 'position',
        dataIndex: 'position',
        className: 'min-width-150',
        width: 150,
        render: (value) => value?.name,
      },
      {
        title: 'Số năm/tháng hợp đồng',
        key: 'contract_category',
        className: 'min-width-150',
        width: 150,
        render: (record) => `${record.month} tháng`,
      },
      {
        title: 'Lương cơ bản',
        key: 'salary',
        className: 'min-width-150',
        width: 150,
        render: (record) => Helper.getPrice(record.basicSalary),
      },
      {
        title: 'Tổng phụ cấp',
        key: 'payment',
        className: 'min-width-150',
        width: 150,
        render: (record) => Helper.getPrice(record.totalAllowance),
      },
      {
        title: 'Thời gian tạo',
        key: 'creationTime',
        dataIndex: 'creationTime',
        className: 'min-width-160',
        width: 160,
        render: (value) => Helper.getDate(value, variables.DATE_FORMAT.DATE_TIME),
      },
      {
        title: 'Trạng thái',
        key: 'status',
        width: 150,
        className: 'min-width-150',
        render: (record) =>
          Helper.getStatusContracts(moment(record?.contractFrom), moment(record?.contractTo), record),
      },
      {
        title: 'Thao tác',
        key: 'actions',
        width: 180,
        className: 'min-width-180',
        fixed: 'right',
        align: 'center',
        render: (record) => (
          <ul className="list-unstyled list-inline">
            <li className="list-inline-item">
              <Button
                color="primary"
                icon="edit"
                onClick={() => history.push(`${pathname}/${record.id}/chi-tiet`)}
              />
            </li>
            <li className="list-inline-item">
              <Button
                color="danger"
                icon="remove"
                className="ml-2"
                onClick={() => this.onRemove(record.id)}
              />
            </li>
            <li className="list-inline-item">
              <Button
                color="success"
                icon="export"
                className="ml-2"
                onClick={() => this.showModal(record.id)}
              // onClick={() => this.export(record.id)}
              />
            </li>
          </ul>
        ),
      },
    ];
  };

  render() {
    const {
      data,
      employees,
      pagination,
      match: { params },
      loading: { effects },
      location: { pathname },
      categories,
    } = this.props;
    console.log("dataa", data)
    const { search, isModalVisible, type } = this.state;
    const loading = effects['laboursContracts/GET_DATA'];
    return (
      <>
        <Helmet title="Danh sách hợp đồng lao động" />
        <div
          className={classnames(styles['content-form'], styles['content-form-laboursContracts'])}
        >
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Danh sách hợp đồng lao động</Text>
            <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
              Tạo mới
            </Button>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                typeOfContractId: search.typeOfContractId || null,
                branchId: search.branchId || null,
                positionId: search.positionId || null,
                status: search.status || null,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Tất cả hợp đồng' }, ...categories.typeOfContracts]}
                    name="typeOfContractId"
                    onChange={(event) => this.onChangeSelect(event, 'typeOfContractId')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Tất cả nơi làm việc' }, ...categories.branches]}
                    name="branchId"
                    onChange={(event) => this.onChangeSelect(event, 'branchId')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Tất cả chức vụ' }, ...categories.positions]}
                    name="positionId"
                    onChange={(event) => this.onChangeSelect(event, 'positionId')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
                {/* {console.log(categories.status)} */}
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Tất cả trạng thái' }, ...statuses]}
                    name="status"
                    onChange={(event) => this.onChangeSelect(event, 'status')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={Helper.convertSelectUsers(employees)}
                    name="employeeId"
                    onChange={(event) => this.onChangeSelect(event, 'employeeId')}
                    type={variables.SELECT_MUTILPLE}
                    placeholder="Chọn tất cả"
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
              rowKey={(record) => record.id}
              scroll={{ x: '100%', y: '60vh' }}
            />
          </div>
        </div>
        <Modal
          title="Thông tin kết xuất"
          centered
          className={stylesModule['wrapper-modal-check']}
          visible={isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={400}
          footer={[
            <div key="back" className={stylesModule['wrapper-modal-footer']}>
              <p
                key="back"
                role="presentation"
                onClick={this.handleCancel}
                className={stylesModule['button-cancel']}
              >
                Hủy
              </p>
              <Button htmlType="submit" color="success" type="primary" onClick={this.export}>
                Kết xuất
              </Button>
            </div>
          ]}
        >
          <Pane className={stylesModule['wrapper-modal-content']}>
            <Pane className="row">
              <Pane className="col-lg-12">
                Chọn loại kết xuất
              </Pane>
              <Pane className="col-lg-12">
                <FormItemAntd >
                  <RadioGroup
                    defaultValue={type}
                    options={variablesModules.TYPES}
                    onChange={(e) => this.onChangeType(e)}
                  />
                </FormItemAntd>
              </Pane>
            </Pane>
          </Pane>
        </Modal>
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
  categories: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  employees: [],
  categories: {},
};

export default Index;
