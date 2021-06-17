import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Button, Modal, message } from 'antd';
import classnames from 'classnames';
import { debounce, get } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import ButtonCustom from '@/components/CommonComponent/Button';
import variablesModules from '../utils/variables';

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
const mapStateToProps = ({ attendances, loading, user }) => ({
  loading,
  user: user.user,
  data: attendances.data,
  pagination: attendances.pagination,
  attendancesReasons: attendances.attendancesReasons,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  formRefModal = React.createRef();

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
        date: query?.date
          ? Helper.getDate(query.date, variables.DATE_FORMAT.DATE_AFTER)
          : Helper.getDate(moment(), variables.DATE_FORMAT.DATE_AFTER),
      },
      visible: false,
      object: {},
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
      type: 'attendances/GET_ATTENDANCES_REASONS',
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
      type: 'attendances/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
          date: Helper.getDate(search.date, variables.DATE_FORMAT.DATE_AFTER),
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

  add = (record, status) => {
    const { search } = this.state;
    const { user } = this.props;
    if (get(record, 'attendance[0].status') === variablesModules.STATUS_ABSENT.ANNUAL_LEAVE) {
      return;
    }
    if (!user?.objectInfo?.id) {
      message.error('Vui lòng đăng nhập tài khoản quản trị nhân sự');
      return;
    }
    this.setStateData({
      visible: true,
      object: {
        studentId: record.id,
        date: moment(search.date).format(variables.DATE_FORMAT.DATE_AFTER),
        status,
        employeeId: user?.objectInfo?.id,
        reason: null,
        reasonId: null,
      },
    });
  };

  onChangeReason = (value) => {
    this.setStateData((prevState) => ({
      object: {
        ...prevState.object,
        reasonId: value,
      },
    }));
  };

  cancelModal = () => {
    this.setStateData({
      visible: false,
      object: {},
    });
    this.formRefModal.current.resetFields();
  };

  onSave = () => {
    const { user } = this.props;
    const { object } = this.state;
    if (!user?.objectInfo?.id) {
      message.error('Vui lòng đăng nhập tài khoản quản trị nhân sự');
      return;
    }
    this.formRefModal.current.validateFields().then((values) => {
      const payload = {
        employeeId: user?.objectInfo?.id,
        ...object,
        reasonId: values.reasonId !== 'NOTE' ? values.reasonId : undefined,
        reason: values.reason,
      };
      this.props.dispatch({
        type: 'attendances/ADD',
        payload,
        callback: (response) => {
          if (response) {
            this.cancelModal();
          }
        },
      });
    });
  };

  /**
   * Function header table
   */
  header = () => [
    {
      title: 'Họ và Tên',
      key: 'fullName',
      className: 'min-width-200',
      width: 200,
      render: (record) => (
        <AvatarTable
          fileImage={Helper.getPathAvatarJson(record?.fileImage)}
          fullName={record?.fullName}
        />
      ),
    },
    {
      title: 'Cơ sở',
      key: 'branch',
      className: 'min-width-180',
      width: 180,
      render: (record) => record?.classStudent?.class?.branch?.name,
    },
    {
      title: 'Lớp',
      key: 'class',
      className: 'min-width-180',
      width: 180,
      render: (record) => record?.classStudent?.class?.name,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 500,
      className: 'min-width-500',
      fixed: 'right',
      align: 'center',
      render: (record) => (
        <ul className={classnames('list-unstyled list-inline', styles['group-button'])}>
          <li className="list-inline-item">
            <Button
              className={classnames(styles.button, styles.primary, {
                [`${styles.active}`]:
                  get(record, 'attendance[0].status') ===
                  variablesModules.STATUS_ABSENT.ANNUAL_LEAVE,
              })}
              onClick={() => this.add(record, variablesModules.STATUS_ABSENT.ANNUAL_LEAVE)}
            >
              Vắng có phép
            </Button>
          </li>
          <li className="list-inline-item">
            <Button
              className={classnames(styles.button, styles.dark, {
                [`${styles.active}`]:
                  get(record, 'attendance[0].status') ===
                  variablesModules.STATUS_ABSENT.UNPAID_LEAVE,
              })}
              onClick={() => this.add(record, variablesModules.STATUS_ABSENT.UNPAID_LEAVE)}
            >
              Vắng không phép
            </Button>
          </li>
          <li className="list-inline-item">
            <Button
              className={classnames(styles.button, styles.success, {
                [`${styles.active}`]:
                  get(record, 'attendance[0].status') === variablesModules.STATUS_ABSENT.HAVE_IN,
              })}
              onClick={() => this.add(record, variablesModules.STATUS_ABSENT.HAVE_IN)}
            >
              Đã vào lớp
            </Button>
          </li>
          <li className="list-inline-item">
            <Button
              className={classnames(styles.button, styles.yellow, {
                [`${styles.active}`]:
                  get(record, 'attendance[0].status') === variablesModules.STATUS_ABSENT.HAVE_OUT,
              })}
              onClick={() => this.add(record, variablesModules.STATUS_ABSENT.HAVE_OUT)}
            >
              Ra về
            </Button>
          </li>
        </ul>
      ),
    },
  ];

  render() {
    const {
      data,
      pagination,
      match: { params },
      attendancesReasons,
      loading: { effects },
    } = this.props;
    const { search, visible, object } = this.state;
    const loading = effects['attendances/GET_DATA'];
    return (
      <>
        <Helmet title="Nhập điểm danh" />
        <Modal
          visible={visible}
          title="Nhập điểm danh"
          centered
          width={700}
          onCancel={this.cancelModal}
          footer={
            <div className="d-flex justify-content-end align-items-center">
              <ButtonCustom key="cancel" color="white" icon="fe-x" onClick={this.cancelModal}>
                Hủy
              </ButtonCustom>
              <ButtonCustom key="choose" color="success" icon="fe-save" onClick={this.onSave}>
                Lưu
              </ButtonCustom>
            </div>
          }
        >
          <Form layout="vertical" ref={this.formRefModal} initialValues={{}}>
            <div className="row">
              <div className="col-lg-12">
                <FormItem
                  data={[
                    ...attendancesReasons.map((item) => ({ id: item.id, name: item.content })),
                    { id: 'NOTE', name: 'Lý do khác' },
                  ]}
                  label="Lý do điểm danh"
                  name="reasonId"
                  type={variables.SELECT}
                  onChange={this.onChangeReason}
                  rules={[variables.RULES.EMPTY]}
                />
              </div>
            </div>
            {object.reasonId === 'NOTE' && (
              <div className="row">
                <div className="col-lg-12">
                  <FormItem label="Lý do" name="reason" type={variables.INPUT} />
                </div>
              </div>
            )}
          </Form>
        </Modal>
        <div className={classnames(styles['content-form'], styles['content-form-attendances'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Nhập điểm danh</Text>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                date: search.date ? moment(search.date) : null,
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
                    name="date"
                    onChange={(event) => this.onChangeDate(event, 'date')}
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
              rowKey={(record) => record.id}
              scroll={{ x: '100%', y: '70vh' }}
            />
          </div>
        </div>
      </>
    );
  }
}

Index.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  match: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  pagination: PropTypes.objectOf(PropTypes.any),
  attendancesReasons: PropTypes.arrayOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  user: {},
  data: [],
  match: {},
  loading: {},
  dispatch: {},
  location: {},
  pagination: {},
  attendancesReasons: [],
};

export default Index;
