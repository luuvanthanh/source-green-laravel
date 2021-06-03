import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Modal, Form } from 'antd';
import classnames from 'classnames';
import { debounce, get } from 'lodash';
import { Helmet } from 'react-helmet';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import HelperModules from '../utils/Helper';

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
const mapStateToProps = ({ appoints, loading }) => ({
  data: appoints.data,
  pagination: appoints.pagination,
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
        fullName: query?.fullName,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        endDate: HelperModules.getEndDate(query?.endDate, query?.choose),
        startDate: HelperModules.getStartDate(query?.startDate, query?.choose),
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
    const { search, status } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'appoints/GET_DATA',
      payload: {
        ...search,
        status,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
          endDate: Helper.getDate(search.endDate, variables.DATE_FORMAT.DATE_AFTER),
          startDate: Helper.getDate(search.startDate, variables.DATE_FORMAT.DATE_AFTER),
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
  pagination = (pagination) => ({
    size: 'default',
    total: pagination?.total,
    pageSize: pagination?.per_page,
    defaultCurrent: pagination?.current_page,
    hideOnSinglePage: pagination?.total_pages <= 1 && pagination?.per_page <= 10,
    showSizeChanger: variables.PAGINATION.SHOW_SIZE_CHANGER,
    pageSizeOptions: variables.PAGINATION.PAGE_SIZE_OPTIONS,
    locale: { items_per_page: variables.PAGINATION.PER_PAGE_TEXT },
    onChange: (page, size) => {
      this.changePagination(page, size);
    },
    onShowSizeChange: (current, size) => {
      this.changePagination(current, size);
    },
  });

  /**
   * Function remove items
   * @param {uid} id id of items
   */
  onRemove = (id) => {
    const { dispatch } = this.props;
    const self = this;
    confirm({
      title: 'Khi xóa thì dữ liệu trước thời điểm xóa vẫn giữ nguyên?',
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: 'Có',
      cancelText: 'Không',
      content: 'Dữ liệu này đang được sử dụng, nếu xóa dữ liệu này sẽ ảnh hưởng tới dữ liệu khác?',
      onOk() {
        dispatch({
          type: 'appoints/REMOVE',
          payload: {
            id,
          },
          callback: (response) => {
            if (response) self.onLoad();
          },
        });
      },
      onCancel() {},
    });
  };

  export = (id) => {
    Helper.exportExcel(`/v1/appoints-export-word/${id}`, {}, 'QDBoNhiem.docx');
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
        title: 'STT',
        key: 'text',
        width: 50,
        align: 'center',
        render: (text, record, index) =>
          Helper.sttList(
            this.props.pagination?.current_page,
            index,
            this.props.pagination?.per_page,
          ),
      },

      {
        title: 'Số QĐ',
        key: 'insurrance_number',
        className: 'min-width-100',
        width: 100,
        render: (record) => get(record, 'decisionNumber'),
      },
      {
        title: 'Ngày QĐ',
        key: 'decisionDate',
        className: 'min-width-120',
        width: 120,
        render: (record) => Helper.getDate(get(record, 'decisionDate'), variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Ngày áp dụng',
        key: 'timeApply',
        className: 'min-width-120',
        width: 120,
        render: (record) => Helper.getDate(get(record, 'timeApply'), variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Nhân viên',
        key: 'name',
        className: 'min-width-200',
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(
              get(record, 'appointDetails[0].employee.fileImage'),
            )}
            fullName={get(record, 'appointDetails[0].employee.fullName')}
          />
        ),
      },
      {
        title: 'CS Công tác mới',
        key: 'branch',
        className: 'min-width-150',
        width: 150,
        render: (record) => get(record, 'appointDetails[0].branch.name'),
      },
      {
        title: 'Bộ phận mới',
        key: 'division',
        className: 'min-width-150',
        width: 150,
        render: (record) => get(record, 'appointDetails[0].division.name'),
      },
      {
        title: 'Chức vụ mới',
        key: 'position',
        className: 'min-width-150',
        width: 150,
        render: (record) => get(record, 'appointDetails[0].position.name'),
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
                onClick={() => this.export(record.id)}
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
      pagination,
      match: { params },
      loading: { effects },
      location: { pathname },
    } = this.props;
    const { search } = this.state;
    const loading = effects['appoints/GET_DATA'];
    return (
      <>
        <Helmet title="Danh sách bổ nhiệm" />
        <div className={classnames(styles['content-form'], styles['content-form-appoints'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Danh sách bổ nhiệm</Text>
            <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
              Tạo mới
            </Button>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                startDate: search.startDate ? moment(search.startDate) : null,
                endDate: search.endDate ? moment(search.endDate) : null,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-4">
                  <FormItem
                    name="fullName"
                    onChange={(event) => this.onChange(event, 'fullName')}
                    placeholder="Nhập từ khóa tìm kiếm"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    name="startDate"
                    onChange={(event) => this.onChangeDate(event, 'startDate')}
                    type={variables.DATE_PICKER}
                    disabledDate={(current) => Helper.disabledDateFrom(current, this.formRef)}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    name="endDate"
                    onChange={(event) => this.onChangeDate(event, 'endDate')}
                    type={variables.DATE_PICKER}
                    disabledDate={(current) => Helper.disabledDateTo(current, this.formRef)}
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
