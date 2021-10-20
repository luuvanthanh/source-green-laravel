import React, { memo, useRef, useState, useEffect } from 'react';
import { useLocation, history, useParams } from 'umi';
import { Modal } from 'antd';
import classnames from 'classnames';

import { isEmpty, debounce, get } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import styles from '@/assets/styles/Common/common.scss';
import allLocales from '@fullcalendar/core/locales-all';
import moment from 'moment';
import { variables, Helper } from '@/utils';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import rrulePlugin from '@fullcalendar/rrule';

import stylesModule from '../../styles.module.scss';

const Index = memo(() => {
  const [search] = useState({type: 'dayGridMonth'});
  const [data, setData] = useState({ details: [] });
  const params = useParams();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [modal, setModal] = useState(false);
  const mounted = useRef(false);
  const { calendar } = useSelector(({ loading, crmSaleLeadAdd }) => ({
    loading,
    details: crmSaleLeadAdd.details,
    calendar: crmSaleLeadAdd.calendar,
    error: crmSaleLeadAdd.error,
  }));

  const calendarComponentRef = React.createRef();

  useEffect(() => {
    dispatch({
      type: 'crmSaleLeadAdd/GET_DATA',
      payload: { customer_lead_id: params.id },
    });
  }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const convertData = (items) => {
    if (!isEmpty(items)) {
      let array = [];
      items.forEach((item) => {
        const durations = moment(item.time);
        array = [
          ...array,
          {
            ...item,
            title: item.name,
            rrule: {
              freq: 'weekly',
              interval: 1,
              dtstart: Helper.joinDateTime(item.date),
              until: Helper.joinDateTime(item.date),
            },
            duration: moment.utc(durations * 1000).format(variables.DATE_FORMAT.TIME_FULL),
          },
        ];
      });
      return array;
    }
    return [];
  };

  const debouncedSearchDate = debounce(() => {
    dispatch({
      type: 'crmSaleLeadAdd/GET_DATA',
      payload: { customer_lead_id: params.id },
    });
  }, 500);

  const cancelModal = () => {
    setModal(false);
  };
  const handleEventClick = (values) => {
    const details = {
      ...get(values, 'event._def.extendedProps'),
      ...get(values, 'event._def'),
      date: values?.event?.startStr || '',
    };
    setModal({ visible: true, details });
    setData({ details });
  };

  const redirectDetails = (key) => {
    if (!data?.details?.publicId) {
      return;
    }
    history.push(`${pathname}/${data?.details?.publicId}/${key}`);
  };

  return (
    <>
      <Modal
        title={data.details?.name}
        visible={modal}
        width={500}
        centered
        onCancel={cancelModal}
        className={stylesModule['wrapper-model-calendar']}
        footer={[
          <p
          role="presentation"
          color="green"
          size="medium"
          className={stylesModule['model-calendar-details']}
          onClick={() => redirectDetails('chi-tiet-su-kien')}
          ghost
        >
          CHI TIẾT
        </p>,
        ]}
      >
        <>
          <div className="row">
            <div className="col-lg-6 mb15">
              <div className="ant-col ant-form-item-label">
                <span>Thời gian</span>
              </div>
              <p className="mb0 font-weight-bold">
                {Helper.getDate(data?.details?.date, variables.DATE_FORMAT.DATE_AFTER)},{' '}
                {data?.details?.time}
              </p>
            </div>
            <div className="col-lg-6 mb15">
              <div className="ant-col ant-form-item-label">
                <span>Địa điểm</span>
              </div>
              <p className="mb0 font-weight-bold">{data?.details?.location || ''}</p>
            </div>
          </div>
        </>
      </Modal>
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
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
                        moment(search.date).add(1, 'months'),
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
                        moment(search.date).add(1, 'weeks'),
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
                        moment(search.date).add(1, 'days'),
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
                        moment(search.date).subtract(1, 'months'),
                        moment(search.toDate).subtract(1, 'months'),
                        'dayGridMonth',
                      );
                      calendarApi.gotoDate(
                        moment(search.date)
                          .subtract(1, 'months')
                          .format(variables.DATE_FORMAT.DATE_AFTER),
                      );
                    }
                    if (search.type === 'timeGridWeek') {
                      debouncedSearchDate(
                        moment(search.date).subtract(1, 'weeks'),
                        moment(search.toDate).subtract(1, 'weeks'),
                        'timeGridWeek',
                      );
                      calendarApi.gotoDate(
                        moment(search.date)
                          .subtract(1, 'weeks')
                          .format(variables.DATE_FORMAT.DATE_AFTER),
                      );
                    }
                    if (search.type === 'timeGridDay' || search.type === 'listDay') {
                      debouncedSearchDate(
                        moment(search.date).subtract(1, 'days'),
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
            events={convertData(calendar)}
            ref={calendarComponentRef}
          />
        </div>
      </div>
    </>
  );
});

export default Index;
