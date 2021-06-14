import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { isEmpty, debounce } from 'lodash';
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
const mapStateToProps = ({ timeTables, loading }) => ({
  data: timeTables.data,
  branches: timeTables.branches,
  classes: timeTables.classes,
  pagination: timeTables.pagination,
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
        branchId: query.branchId,
        classId: query.classId,
      },
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
      type: 'timeTables/GET_DATA',
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

  loadCategories = () => {
    const { search } = this.state;
    if (search.branchId) {
      this.props.dispatch({
        type: 'timeTables/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    this.props.dispatch({
      type: 'timeTables/GET_BRANCHES',
      payload: {},
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
        },
      }),
      () => this.onLoad(),
    );
  }, 300);

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
  }, 300);

  /**
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
  debouncedSearchDateRank = debounce((fromDate, toDate) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          fromDate,
          toDate,
        },
      }),
      () => this.onLoad(),
    );
  }, 200);

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
  onChangeDateRank = (e) => {
    this.debouncedSearchDateRank(
      moment(e[0]).format(variables.DATE_FORMAT.DATE_AFTER),
      moment(e[1]).format(variables.DATE_FORMAT.DATE_AFTER),
    );
  };

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
  onChangeSelectBranch = (e, type) => {
    this.debouncedSearch(e, type);
    this.props.dispatch({
      type: 'timeTables/GET_CLASSES',
      payload: {
        branch: e,
      },
    });
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

  convertData = (items) => {
    if (!isEmpty(items)) {
      let array = [];
      items.forEach((item) => {
        item.timetableDetails.forEach((itemTime) => {
          const durations = moment(itemTime.toTime).diff(moment(itemTime.fromTime), 'seconds');
          array = [
            ...array,
            {
              title: itemTime.content,
              rrule: {
                freq: 'weekly',
                interval: 1,
                byweekday: item.timetableWeeks.map(
                  (itemTimeTableWeek) => variablesModules.DAY_OF_WEEK[itemTimeTableWeek.dayOfWeek],
                ),
                dtstart: Helper.joinDateTime(item.fromDate, itemTime.toTime),
                until: Helper.joinDateTime(item.toDate, itemTime.toTime),
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

  render() {
    const {
      branches,
      classes,
      data,
      location: { pathname },
    } = this.props;
    const { search } = this.state;
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
        <Helmet title="Thời khóa biểu" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className={styles.search}>
            <Form
              initialValues={{
                ...search,
                date: search.fromDate &&
                  search.toDate && [moment(search.fromDate), moment(search.toDate)],
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-4">
                  <FormItem
                    data={branches}
                    label="CƠ SỞ"
                    name="branchId"
                    onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    data={classes}
                    label="LỚP"
                    name="classId"
                    onChange={(event) => this.onChangeSelect(event, 'classId')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    label="THỜI GIAN"
                    name="date"
                    onChange={(event) => this.onChangeDateRank(event, 'date')}
                    type={variables.RANGE_PICKER}
                  />
                </div>
              </div>
            </Form>
          </div>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Thời khóa biểu</Text>
            <Button
              color="success"
              icon="plus"
              onClick={() => history.push(`${pathname}/tao-moi`)}
              permission="TKB"
            >
              Thêm mới
            </Button>
          </div>
          <div className={classnames(styles['block-table'], 'schedules-custom')}>
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
                          'timeGridWeek',
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
                          'timeGridWeek',
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
                        moment().startOf('weeks').add(1, 'days'),
                        moment().endOf('weeks').add(1, 'days'),
                        'timeGridWeek',
                      );
                      calendarApi.gotoDate(
                        moment()
                          .endOf('weeks')
                          .add(1, 'days')
                          .format(variables.DATE_FORMAT.DATE_AFTER),
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
              eventClick={() => {}}
              events={this.convertData(data)}
              ref={this.calendarComponentRef}
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
  branches: PropTypes.arrayOf(PropTypes.any),
  classes: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  data: [],
  dispatch: {},
  location: {},
  branches: [],
  classes: [],
};

export default Index;
