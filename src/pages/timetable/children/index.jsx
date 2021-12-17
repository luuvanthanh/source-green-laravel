import FormItem from '@/components/CommonComponent/FormItem';
import Button from '@/components/CommonComponent/Button';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import classnames from 'classnames';
import FullCalendar from '@fullcalendar/react';
import allLocales from '@fullcalendar/core/locales-all';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick
import listPlugin from '@fullcalendar/list';
import rrulePlugin from '@fullcalendar/rrule';
import moment from 'moment';
import { debounce, get, isEmpty } from 'lodash';
import { useRef, useState, memo, useEffect } from 'react';
import styles from '@/assets/styles/Common/common.scss';

import { Modal, Form } from 'antd';
import { Helmet } from 'react-helmet';
import { useLocation, history } from 'umi';
import { useDispatch, useSelector } from 'dva';
import variablesModules from '../utils/variables';

const Index = memo(() => {
  const formRef = useRef();
  const calendarComponentRef = useRef();
  const { pathname } = useLocation();
  const [
    { data, branches, classes },
    { defaultBranch },
  ] = useSelector(({ timeTablesChildren, user }) => [timeTablesChildren, user]);
  const dispatch = useDispatch();

  const [state, setState] = useState({
    defaultBranchs: defaultBranch?.id ? [defaultBranch] : [],
    details: {},
    visible: false,
  });
  const [search, setSearch] = useState({
    fromDate: moment().startOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
    toDate: moment().endOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
    type: 'dayGridMonth',
    branchId: defaultBranch?.id,
    classId: null,
  });

  const onLoad = () => {
    dispatch({
      type: 'timeTablesChildren/GET_DATA',
      payload: {
        ...search,
      },
    });
  };

  const loadCategories = () => {
    if (search.branchId) {
      dispatch({
        type: 'timeTablesChildren/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    if (!defaultBranch?.id) {
      dispatch({
        type: 'timeTablesChildren/GET_BRANCHES',
        payload: {},
      });
    }
  };

  useEffect(() => {
    const { current } = calendarComponentRef;
    if (current) {
      const calendarApi = current.getApi();
      calendarApi.gotoDate(moment(search.toDate).format(variables.DATE_FORMAT.DATE_AFTER));
    }
    onLoad();
    loadCategories();
  }, [search]);

  const onChangeSelectBranch = (e) => {
    dispatch({
      type: 'timeTablesChildren/GET_CLASSES',
      payload: {
        branch: e,
      },
    });
  };

  const convertData = (items) => {
    if (!isEmpty(items)) {
      let array = [];
      items.forEach((item) => {
        item.timetableDetails.forEach((itemTime) => {
          const durations = moment(itemTime.toTime)
            .add(1, 'seconds')
            .diff(moment(itemTime.fromTime), 'seconds');
          array = [
            ...array,
            {
              ...itemTime,
              parentId: item.id,
              title: itemTime.content,
              rrule: {
                freq: 'weekly',
                interval: 1,
                byweekday: item.timetableWeeks.map(
                  (itemTimeTableWeek) => variablesModules.DAY_OF_WEEK[itemTimeTableWeek.dayOfWeek],
                ),
                dtstart: Helper.joinDateTime(item.fromDate, itemTime.fromTime),
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

  const handleEventClick = (values) => {
    const details = {
      ...get(values, 'event._def.extendedProps'),
      ...get(values, 'event._def'),
      startDate: values?.event?.startStr || '',
      endDate: values?.event?.endStr || '',
    };
    setState(prev => ({
      ...prev,
      visible: true,
      details
    }));
  };

  const cancelModal = () => {
    setState(prev => ({
      ...prev,
      visible: false,
      details: {}
    }));
  };

  const redirectDetails = (pathname, key) => {
    const { details } = state;
    if (!details?.parentId) {
      return;
    }
    history.push(`${pathname}/${details?.parentId}/${key}`);
  };

  const remove = () => {
    const { details } = state;
    if (!details?.parentId) {
      return;
    }
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'timeTablesChildren/REMOVE',
          payload: {
            id: details?.parentId,
          },
          callback: (response) => {
            if (response) {
              onLoad();
              setState(prev => ({
                ...prev,
                details: {},
                visible: false
              }));
            }
          },
        });
      },
    });
  };

  const debouncedSearchDate = debounce((fromDate = moment(), toDate = moment(), type) => {
    setSearch((prev) => ({
      ...prev,
      type,
      fromDate: moment(fromDate).format(variables.DATE_FORMAT.DATE_AFTER),
      toDate: moment(toDate).format(variables.DATE_FORMAT.DATE_AFTER),
    }));
  }, 500);

  const onFinish = (values) => {
    const { branchId, classId } = values;
    setSearch((prev) => ({
      ...prev,
      branchId,
      classId,
    }));
  };

  return (
    <>
      <Helmet title="Thời khóa biểu trẻ" />
      <Modal
        title={state.details?.title}
        visible={state.visible}
        width={500}
        centered
        onCancel={cancelModal}
        footer={[
          <div className="d-flex justify-content-end" key="action">
            <Button
              key="remove"
              color="danger"
              icon="remove"
              ghost
              className="mr10"
              onClick={remove}
            >
              Xóa
            </Button>
            <Button
              key="edit"
              color="success"
              icon="edit"
              ghost
              onClick={() => redirectDetails(pathname, 'chi-tiet')}
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
            <p className="mb0 font-weight-bold">{state.details?.content || ''}</p>
          </div>
          <div className="col-lg-6 mb15">
            <div className="ant-col ant-form-item-label">
              <span>Thời gian diễn ra</span>
            </div>
            <p className="mb0 font-weight-bold">
              {Helper.getDate(state.details.startDate, variables.DATE_FORMAT.DATE_TIME)} -{' '}
              {Helper.getDate(state.details.endDate, variables.DATE_FORMAT.HOUR)}
            </p>
          </div>
        </div>
      </Modal>
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
          <Text color="dark">Thời khóa biểu trẻ</Text>
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
              branchId: search.branchId || null,
              classId: search.classId || null,
            }}
            layout="vertical"
            onFinish={onFinish}
            ref={formRef}
          >
            <div className="row">
              {!defaultBranch?.id && (
                <div className="col-lg-4">
                  <FormItem
                    className="ant-form-item-row"
                    data={[{ id: null, name: 'Chọn tất cả cơ sở' }, ...branches]}
                    label="CƠ SỞ"
                    name="branchId"
                    onChange={(event) => onChangeSelectBranch(event)}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
              )}
              {defaultBranch?.id && (
                <div className="col-lg-4">
                  <FormItem
                    className="ant-form-item-row"
                    data={state.defaultBranchs}
                    label="CƠ SỞ"
                    name="branchId"
                    onChange={(event) => onChangeSelectBranch(event)}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
              )}

              <div className="col-lg-4">
                <FormItem
                  className="ant-form-item-row"
                  data={[{ id: null, name: 'Chọn tất cả các lớp' }, ...classes]}
                  label="LỚP"
                  name="classId"
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-4">
                <Button color="success" icon="search" htmlType="submit">
                  Tìm kiếm
                </Button>
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
                  const { current } = calendarComponentRef;
                  if (current) {
                    const calendarApi = current.getApi();
                    if (search.type === 'dayGridMonth') {
                      debouncedSearchDate(
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
                      debouncedSearchDate(
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
                      debouncedSearchDate(
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
                  const { current } = calendarComponentRef;
                  if (current) {
                    const calendarApi = current.getApi();
                    if (search.type === 'dayGridMonth') {
                      debouncedSearchDate(
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
                      debouncedSearchDate(
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
                      debouncedSearchDate(
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
                  if (calendarComponentRef.current) {
                    const calendarApi = calendarComponentRef.current.getApi();
                    calendarApi.changeView('dayGridMonth');
                    debouncedSearchDate(
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
                  if (calendarComponentRef.current) {
                    const calendarApi = calendarComponentRef.current.getApi();
                    calendarApi.changeView('timeGridWeek');
                    debouncedSearchDate(
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
                  if (calendarComponentRef.current) {
                    const calendarApi = calendarComponentRef.current.getApi();
                    calendarApi.changeView('timeGridDay');
                    debouncedSearchDate(
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
                  if (calendarComponentRef.current) {
                    const calendarApi = calendarComponentRef.current.getApi();
                    calendarApi.changeView('listDay');
                    debouncedSearchDate(
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
            eventClick={handleEventClick}
            events={convertData(data)}
            ref={calendarComponentRef}
          />
        </div>
      </div>
    </>
  );
});

export default Index;
