import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Modal } from 'antd';
import classnames from 'classnames';
import _, { isEmpty, debounce } from 'lodash';
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
import { sliceEvents } from '@fullcalendar/core';
import listPlugin from '@fullcalendar/list';
import rrulePlugin from '@fullcalendar/rrule';
import variablesModules from './variables';

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
const mapStateToProps = ({ timeTablesSchedule, loading }) => ({
  data: timeTablesSchedule.data,
  pagination: timeTablesSchedule.pagination,
  loading,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  calendarComponentRef = React.createRef();

  constructor(props) {
    super(props);
    const {
      location: { query },
    } = props;
    this.state = {
      search: {
        fromDate: query?.fromDate
          ? moment(query?.fromDate).format(variables.DATE_FORMAT.DATE_AFTER)
          : moment().startOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
        toDate: query?.toDate
          ? moment(query?.toDate).format(variables.DATE_FORMAT.DATE_AFTER)
          : moment().endOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
        type: query.type || 'dayGridMonth',
        eventType: query.eventType || '',
      },
      isOpen: false,
      details: {},
    };
    setIsMounted(true);
  }

  componentDidMount() {
    const { current } = this.calendarComponentRef;
    const { search } = this.state;
    if (current) {
      const calendarApi = current.getApi();
      calendarApi.gotoDate(moment(search.toDate).format(variables.DATE_FORMAT.DATE_AFTER));
    }
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
      type: 'timeTablesSchedule/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
        fromDate: moment(search.fromDate).format(variables.DATE_FORMAT.DATE_AFTER),
        toDate: moment(search.toDate).format(variables.DATE_FORMAT.DATE_AFTER),
      }),
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
  }, 500);

  /**
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
  debouncedSearchDate = debounce((fromDate = moment(), toDate = moment(), type) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          type,
          fromDate: moment(fromDate).format(variables.DATE_FORMAT.DATE_AFTER),
          toDate: moment(toDate).format(variables.DATE_FORMAT.DATE_AFTER),
        },
      }),
      () => this.onLoad(),
    );
  }, 500);

  /**
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSelect = (e, type) => {
    this.debouncedSearch(e, type);
  };

  convertData = (items) => {
    if (!isEmpty(items)) {
      let array = [];
      items.forEach((item) => {
        item.eventTimetables.forEach((itemTime) => {
          const durations = moment(itemTime.endTime).diff(moment(itemTime.startTime), 'seconds');
          array = [
            ...array,
            {
              ...itemTime,
              title: itemTime.title,
              rrule: {
                freq: 'weekly',
                interval: 1,
                dtstart: Helper.joinDateTime(itemTime.startTime, itemTime.startTime),
                until: Helper.joinDateTime(itemTime.endTime, itemTime.endTime),
              },
              duration: moment.utc(durations * 1000).format(variables.DATE_FORMAT.TIME_FULL),
            },
          ];
        });
      });
      return array;
    }
    return [];
  };

  handleEventClick = (values) => {
    const valuesDetail = {
      ..._.get(values, 'event._def.extendedProps'),
      ..._.get(values, 'event._def'),
      startDate: values?.event?.startStr || '',
      endDate: values?.event?.endStr || '',
    };
    this.setStateData({ isOpen: true, details: valuesDetail });
  };

  cancelModal = () => {
    this.setStateData({ isOpen: false, details: {} });
  };

  redirectDetails = (pathname, key) => {
    const { details } = this.state;
    if (!details?.publicId) {
      return;
    }
    history.push(`${pathname}/${details?.publicId}/${key}`);
  };

  remove = () => {
    const { details } = this.state;
    if (!details?.publicId) {
      return;
    }
    Helper.confirmAction({
      callback: () => {
        this.props.dispatch({
          type: 'timeTablesSchedule/REMOVE',
          payload: {
            id: details?.publicId,
          },
          callback: (response) => {
            if (response) {
              this.setStateData({ isOpen: false });
              this.onLoad();
              this.setStateData({ details: {} });
            }
          },
        });
      },
    });
  };

  render() {
    const {
      data,
      location: { pathname },
    } = this.props;
    const { search, isOpen, details } = this.state;
    const CustomViewConfig = {
      classnames: ['custom-view'],
      content(props) {
        const segs = sliceEvents(props, true); // allDay=true
        const html =
          `<div class="view-title">${props.dateProfile.currentRange.start.toUTCString()}</div>` +
          `<div class="view-title">${props.dateProfile.currentRange.start.toUTCString()}</div>` +
          `<div class="view-events">${segs.length} events` +
          `</div>`;

        return { html };
      },
    };

    return (
      <>
        <Helmet title="Thời khóa biểu làm việc / sự kiện" />
        <Modal
          title={
            details?.eventType
              ? variablesModules.TYPE_CALENDAR.find((item) => item.id === details?.eventType)?.name
              : ''
          }
          visible={isOpen}
          width={500}
          centered
          onCancel={this.cancelModal}
          footer={[
            <div className="d-flex justify-content-between" key="action">
              <Button key="remove" color="danger" icon="remove" ghost onClick={this.remove}>
                Xóa
              </Button>
              <Button
                key="details"
                color="success"
                ghost
                onClick={() => this.redirectDetails(pathname, 'chi-tiet')}
              >
                Chi tiết
              </Button>
              <Button
                key="edit"
                color="success"
                icon="edit"
                ghost
                onClick={() => this.redirectDetails(pathname, 'chinh-sua')}
              >
                Chỉnh sửa
              </Button>
            </div>,
          ]}
        >
          <div className="row">
            <div className="col-lg-6 mb15">
              <div className="ant-col ant-form-item-label">
                <span>Tiêu đề</span>
              </div>
              <p className="mb0 font-weight-bold">{details?.title || ''}</p>
            </div>
            <div className="col-lg-6 mb15">
              <div className="ant-col ant-form-item-label">
                <span>Thời gian diễn ra</span>
              </div>
              <p className="mb0 font-weight-bold">
                {`${Helper.getDate(
                  details.startDate,
                  variables.DATE_FORMAT.DATE_TIME,
                )} - ${Helper.getDate(details.ẹndDate, variables.DATE_FORMAT.HOUR)}`}
              </p>
            </div>
            <div className="col-lg-12">
              <div className="ant-col ant-form-item-label">
                <span>Địa điểm</span>
              </div>
              <p className="mb0 font-weight-bold">{details?.location || ''}</p>
            </div>
          </div>
        </Modal>
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Thời khóa biểu làm việc / sự kiện</Text>
            <Button
              color="success"
              icon="plus"
              onClick={() => history.push(`${pathname}/tao-moi`)}
              permission="TKB"
            >
              Thêm mới
            </Button>
          </div>
          {/* FORM SEARCH */}
          <div className={classnames(styles.search, 'pt20')}>
            <Form
              initialValues={{
                ...search,
                eventType: search.eventType || null,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-4">
                  <FormItem
                    className="ant-form-item-row"
                    data={[
                      { id: null, name: 'Tất cả loại lịch' },
                      ...variablesModules.TYPE_CALENDAR,
                    ]}
                    label="LOẠI LỊCH"
                    name="eventType"
                    onChange={(event) => this.onChangeSelect(event, 'eventType')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
              </div>
            </Form>
          </div>
          {/* FORM SEARCH */}
          <div className={classnames(styles['block-table'], 'schedules-custom', 'mt20')}>
            <FullCalendar
              schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
              plugins={[
                resourceTimeGridPlugin,
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
                rrulePlugin,
              ]}
              initialView={search.type}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listDay',
              }}
              customButtons={{
                next: {
                  click: () => {
                    const { search } = this.state;
                    const { current } = this.calendarComponentRef;
                    if (current) {
                      const calendarApi = current.getApi();
                      if (search.type === 'dayGridMonth') {
                        this.debouncedSearchDate(
                          moment(search.fromDate).add(1, 'months'),
                          moment(search.toDate).add(1, 'months'),
                          'dayGridMonth',
                        );
                        calendarApi.gotoDate(
                          moment(search.toDate)
                            .add(1, 'months')
                            .format(variables.DATE_FORMAT.DATE_AFTER),
                        );
                      }
                      if (search.type === 'timeGridWeek') {
                        this.debouncedSearchDate(
                          moment(search.fromDate).add(1, 'weeks'),
                          moment(search.toDate).add(1, 'weeks'),
                          'timeGridWeek',
                        );
                        calendarApi.gotoDate(
                          moment(search.toDate)
                            .add(1, 'weeks')
                            .format(variables.DATE_FORMAT.DATE_AFTER),
                        );
                      }
                      if (search.type === 'timeGridDay' || search.type === 'listDay') {
                        this.debouncedSearchDate(
                          moment(search.fromDate).add(1, 'days'),
                          moment(search.toDate).add(1, 'days'),
                          'timeGridDay',
                        );
                        calendarApi.gotoDate(
                          moment(search.toDate)
                            .add(1, 'days')
                            .format(variables.DATE_FORMAT.DATE_AFTER),
                        );
                      }
                    }
                  },
                },
                prev: {
                  click: () => {
                    const { search } = this.state;
                    const { current } = this.calendarComponentRef;
                    if (current) {
                      const calendarApi = current.getApi();
                      if (search.type === 'dayGridMonth') {
                        this.debouncedSearchDate(
                          moment(search.fromDate).subtract(1, 'months'),
                          moment(search.toDate).subtract(1, 'months'),
                          'dayGridMonth',
                        );
                        calendarApi.gotoDate(
                          moment(search.fromDate)
                            .subtract(1, 'months')
                            .format(variables.DATE_FORMAT.DATE_AFTER),
                        );
                      }
                      if (search.type === 'timeGridWeek') {
                        this.debouncedSearchDate(
                          moment(search.fromDate).subtract(1, 'weeks'),
                          moment(search.toDate).subtract(1, 'weeks'),
                          'timeGridWeek',
                        );
                        calendarApi.gotoDate(
                          moment(search.fromDate)
                            .subtract(1, 'weeks')
                            .format(variables.DATE_FORMAT.DATE_AFTER),
                        );
                      }
                      if (search.type === 'timeGridDay' || search.type === 'listDay') {
                        this.debouncedSearchDate(
                          moment(search.fromDate).subtract(1, 'days'),
                          moment(search.toDate).subtract(1, 'days'),
                          'timeGridDay',
                        );
                        calendarApi.gotoDate(
                          moment(search.toDate)
                            .subtract(1, 'days')
                            .format(variables.DATE_FORMAT.DATE_AFTER),
                        );
                      }
                    }
                  },
                },
                dayGridMonth: {
                  text: 'Tháng',
                  click: () => {
                    if (this.calendarComponentRef.current) {
                      const calendarApi = this.calendarComponentRef.current.getApi();
                      calendarApi.changeView('dayGridMonth');
                      this.debouncedSearchDate(
                        moment().startOf('month'),
                        moment().endOf('month'),
                        'dayGridMonth',
                      );
                    }
                  },
                },
                timeGridWeek: {
                  text: 'Tuần',
                  click: () => {
                    if (this.calendarComponentRef.current) {
                      const calendarApi = this.calendarComponentRef.current.getApi();
                      calendarApi.changeView('timeGridWeek');
                      this.debouncedSearchDate(
                        moment().startOf('weeks'),
                        moment().endOf('weeks'),
                        'timeGridWeek',
                      );
                      calendarApi.gotoDate(
                        moment().endOf('weeks').format(variables.DATE_FORMAT.DATE_AFTER),
                      );
                    }
                  },
                },
                timeGridDay: {
                  text: 'Ngày',
                  click: () => {
                    if (this.calendarComponentRef.current) {
                      const calendarApi = this.calendarComponentRef.current.getApi();
                      calendarApi.changeView('timeGridDay');
                      this.debouncedSearchDate(
                        moment().startOf('days'),
                        moment().endOf('days'),
                        'timeGridDay',
                      );
                      calendarApi.gotoDate(
                        moment().startOf('days').format(variables.DATE_FORMAT.DATE_AFTER),
                      );
                    }
                  },
                },
                listDay: {
                  text: 'Lịch biểu',
                  click: () => {
                    if (this.calendarComponentRef.current) {
                      const calendarApi = this.calendarComponentRef.current.getApi();
                      calendarApi.changeView('listDay');
                      this.debouncedSearchDate(
                        moment().startOf('days'),
                        moment().endOf('days'),
                        'timeGridDay',
                      );
                      calendarApi.gotoDate(
                        moment().startOf('days').format(variables.DATE_FORMAT.DATE_AFTER),
                      );
                    }
                  },
                },
              }}
              views={{
                custom: CustomViewConfig,
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
              slotMinTime="04:00"
              slotMaxTime="20:00"
              editable
              fixedWeekCount={false}
              showNonCurrentDates
              locales={allLocales}
              allDaySlot={false}
              height={650}
              events={this.convertData(data)}
              ref={this.calendarComponentRef}
              eventClick={this.handleEventClick}
            />
          </div>
        </div>
      </>
    );
  }
}

Index.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  data: [],
  dispatch: {},
  location: {},
};

export default Index;
