import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Modal, Form } from 'antd';
import classnames from 'classnames';
import { isEmpty, head, debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import allLocales from '@fullcalendar/core/locales-all';
import FormItem from '@/components/CommonComponent/FormItem';
import moment from 'moment';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick

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
const mapStateToProps = ({ managerSchedules, loading }) => ({
  data: managerSchedules.data,
  pagination: managerSchedules.pagination,
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

  componentDidMount() {}

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
      type: 'managerSchedules/GET_DATA',
      payload: {
        ...search,
        status,
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
   * Function submit form modal
   * @param {object} values values of form
   */
  onFinish = () => {
    const { objects } = this.state;
    this.formRef.current.validateFields().then((values) => {
      this.props.dispatch({
        type: !isEmpty(objects) ? 'managerSchedules/UPDATE' : 'managerSchedules/ADD',
        payload: {
          ...values,
          id: objects.id,
        },
        callback: (response, error) => {
          if (response) {
            this.handleCancel();
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
    });
  };

  /**
   * Function remove items
   * @param {objects} record value of items
   */
  onEdit = (objects) => {
    this.setStateData(
      {
        objects,
        visible: true,
      },
      () => {
        this.formRef.current.setFieldsValue({
          ...objects,
        });
      },
    );
  };

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
          type: 'managerSchedules/REMOVE',
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

  /**
   * Function header table
   */
  header = () => {
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
        title: 'TÊN TIÊU CHÍ - ĐÁNH GIÁ',
        key: 'name',
        className: 'min-width-150',
        render: () => <Text size="normal">Học thuật</Text>,
      },
      {
        title: 'CẤU HÌNH LOẠI ÁP DỤNG',
        key: 'name',
        className: 'min-width-150',
        render: () => <Text size="normal">Mẫu giáo</Text>,
      },
      {
        title: 'THỜI HẠN NHẬP',
        key: 'name',
        className: 'min-width-150',
        width: 150,
        render: () => <Text size="normal">Hằng ngày</Text>,
      },
      {
        key: 'action',
        className: 'min-width-80',
        width: 80,
        render: (record) => (
          <div className={styles['list-button']}>
            <Button color="primary" icon="edit" onClick={() => this.onEdit(record)} />
            <Button color="danger" icon="remove" onClick={() => this.onRemove(record.id)} />
          </div>
        ),
      },
    ];
    return columns;
  };

  render() {
    const {
      loading: { effects },
      location: { pathname },
    } = this.props;
    const { visible, objects, search } = this.state;
    const loadingSubmit = effects['managerSchedules/ADD'] || effects['managerSchedules/UPDATE'];
    return (
      <>
        <Helmet title="Danh sách tiêu chí - đánh giá" />
        <Modal
          centered
          footer={[
            <div className={classnames('d-flex', 'justify-content-end')} key="action">
              <Button
                color="white"
                icon="cross"
                loading={loadingSubmit}
                onClick={this.handleCancel}
                size="medium"
              >
                HỦY
              </Button>
              <Button
                color="green"
                icon="save"
                loading={loadingSubmit}
                onClick={this.onFinish}
                size="medium"
              >
                LƯU
              </Button>
            </div>,
          ]}
          onCancel={this.handleCancel}
          title={
            !isEmpty(objects) ? 'CHỈNH SỬA TIÊU CHÍ - ĐÁNH GIÁ' : 'THÊM MỚI TIÊU CHÍ - ĐÁNH GIÁ'
          }
          visible={visible}
        >
          <Form layout="vertical" ref={this.formRef}>
            <div className="row">
              <div className="col-lg-12">
                <FormItem
                  label="TÊN"
                  name="name"
                  rules={[variables.RULES.EMPTY_INPUT]}
                  type={variables.INPUT}
                />
              </div>
            </div>
          </Form>
        </Modal>
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className={styles.search}>
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
                    data={[]}
                    label="CƠ SỞ"
                    name="department"
                    onChange={(event) => this.onChange(event, 'department')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    data={[]}
                    label="LỚP"
                    name="level"
                    onChange={(event) => this.onChange(event, 'level')}
                    type={variables.SELECT}
                  />
                </div>
              </div>
            </Form>
          </div>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">LỊCH LỚP HỌC ĐỊNH HƯỚNG</Text>
            <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
              Thêm mới
            </Button>
          </div>
          <div className={classnames(styles['block-table'], 'schedules-custom')}>
            <FullCalendar
              schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
              plugins={[resourceTimeGridPlugin, dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              views={{
                dayGrid: {
                  dayMaxEventRows: 3,
                },
                month: {
                  dayMaxEventRows: 3,
                },
                agendaFourDay: {
                  type: 'agenda',
                  duration: { days: 4 },
                  buttonText: '4 day',
                },
              }}
              locale="vi"
              editable
              fixedWeekCount={false}
              showNonCurrentDates
              locales={allLocales}
              allDaySlot={false}
              height={650}
              eventClick={() => {}}
              events={[
                { title: '7:00 - 7:30: Đón bé vào lớp', date: '2021-03-22 23:00:00' },
                { title: '7:00 - 7:30: Đón bé vào lớp', date: '2021-03-22 21:00:00' },
                { title: '7:00 - 7:30: Đón bé vào lớp', date: '2021-03-22 22:00:00' },
                { title: '7:00 - 7:30: Đón bé vào lớp', date: '2021-03-22 20:00:00' },
                { title: '7:00 - 7:30: Đón bé vào lớp', date: '2021-03-22 01:00:00' },
                { title: '7:00 - 7:30: Đón bé vào lớp', date: '2021-03-22 05:00:00' },
                { title: '7:00 - 7:30: Đón bé vào lớp', date: '2021-03-22 06:00:00' },
                { title: '7:00 - 7:30: Đón bé vào lớp', date: '2021-03-22 07:00:00' },
                { title: '7:00 - 7:30: Đón bé vào lớp', date: '2021-03-22 08:00:00' },
              ]}
            />
          </div>
        </div>
      </>
    );
  }
}

Index.propTypes = {
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  loading: {},
  dispatch: {},
  location: {},
};

export default Index;
