import FormItem from '@/components/CommonComponent/FormItem';
import ButtonCustom from '@/components/CommonComponent/Button';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import classnames from 'classnames';
import moment from 'moment';
import { debounce, isEmpty, reduce } from 'lodash';
import React, { useRef, useState, memo, useEffect } from 'react';
import styles from '@/assets/styles/Common/common.scss';
import Table from '@/components/CommonComponent/Table';
import CardTime from '@/components/CommonComponent/CardCalendar/CardTime';
import CardWeek from '@/components/CommonComponent/CardCalendar/CardWeek';
import CardDate from '@/components/CommonComponent/CardCalendar/CardDate';
import CardLesson from '@/components/CommonComponent/CardCalendar/CardLesson';
import CardMonth from '@/components/CommonComponent/CardCalendar/CardMonth';
import ListDay from '@/components/CommonComponent/CardCalendar/ListDay';
import { Modal, Form, Button } from 'antd';
import { Helmet } from 'react-helmet';
import { useLocation, history } from 'umi';
import { useDispatch, useSelector } from 'dva';
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';

const Index = memo(() => {
  const formRef = useRef();
  const calendarComponentRef = useRef();
  const { pathname } = useLocation();
  const [
    { branches, classes, objectData },
    { defaultBranch },
    { effects },
  ] = useSelector(({ timeTablesChildren, user, loading }) => [timeTablesChildren, user, loading]);
  const dispatch = useDispatch();
  const { data } = objectData;
  const [state, setState] = useState({
    defaultBranchs: defaultBranch?.id ? [defaultBranch] : [],
    details: {},
    visible: false,
  });
  const [search, setSearch] = useState({
    fromDate: moment().startOf('month').format(variables.DATE_FORMAT.DATE_AFTER),
    toDate: moment().endOf('month').format(variables.DATE_FORMAT.DATE_AFTER),
    type: 'dayGridMonth',
    branchId: defaultBranch?.id,
    classId: null,
  });

  const [showColumn, setShowColumn] = useState(false);

  const onLoad = () => {
    dispatch({
      type: 'timeTablesChildren/GET_DATA',
      payload: {
        classId: search.classId || null,
        branchId: search.branchId || null,
        isGroupByDayOfWeek: true,
        searchDate: moment().format('YYYY-MM-DD'),
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

  const cancelModal = () => {
    setState((prev) => ({
      ...prev,
      visible: false,
      details: {},
    }));
  };

  const Collapse = () => {
    setShowColumn(!showColumn);
  };

  const handleClick = (value, type) => {
    switch (type) {
      case 'dayGridMonth':
        setState((prev) => ({
          ...prev,
          visible: true,
          details: {
            content: value?.class?.name,
            start: value?.startTime,
            end: value?.endTime,
          },
        }));
        break;
      case 'timeGridWeek':
        setState((prev) => ({
          ...prev,
          visible: true,
          details: {
            content: value?.class?.name,
            start: value?.start,
            end: value?.end,
          },
        }));
        break;
      case 'timeGridDay':
        setState((prev) => ({
          ...prev,
          visible: true,
          details: {
            content: value?.timetableActivityDetail?.name,
            start: value?.start,
            end: value?.end,
          },
        }));
        break;
      default:
        break;
    }
  };

  const renderCalendar = (type, data) => {
    const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    switch (type) {
      case 'dayGridMonth': {
        const calendar = [];
        const objectDay = {
          Monday: {
            date: null,
            month: '',
            data: [],
          },
          Tuesday: {
            date: null,
            month: '',
            data: [],
          },
          Wednesday: {
            date: null,
            month: '',
            data: [],
          },
          Thursday: {
            date: null,
            month: '',
            data: [],
          },
          Friday: {
            date: null,
            month: '',
            data: [],
          },
          Saturday: {
            date: null,
            month: '',
            data: [],
          },
          Sunday: {
            date: null,
            month: '',
            data: [],
          },
        };
        data?.forEach((item, idx) => {
          let groupClass;
          if (!search.branchId) {
            groupClass = { ...item.timetableDetailGroupByClasses[0] };
          } else if (search.branchId && !search.classId) {
            groupClass = { ...item.timetableDetailGroupByClasses[0] };
          } else {
            groupClass = reduce(item.timetableDetailGroupByClasses, (obj, itemDetail) => {
              if(itemDetail.class.id === search.classId) {
                return {...obj, ...itemDetail};
              }
              return {};
            }, {});
          }
          if (!isEmpty(groupClass)) {
            if (groupClass.timetableDetailActivities) {
              groupClass.timetableDetailActivities[0].dayOfWeeks.forEach((itemDay) => {
                objectDay[itemDay].data = objectDay[itemDay].data.concat({
                  startTime: item.startTime,
                  endTime: item.endTime,
                  class: groupClass.timetableDetailActivities,
                });
              });
            }
            if (groupClass.timetableDetailActivityGroupByDayOfWeeks) {
              groupClass.timetableDetailActivityGroupByDayOfWeeks.forEach((itemDay) => {
                objectDay[itemDay.dayOfWeek].data = objectDay[itemDay.dayOfWeek].data.concat({
                  startTime: item.startTime,
                  endTime: item.endTime,
                  class: itemDay.timetableActivityDetail,
                });
              });
            }
          }
          if (idx === data.length - 1) {
            const startDay = moment(search.fromDate).startOf('week');
            const endDay = moment(search.toDate).endOf('week');

            const day = moment(startDay).subtract(1, 'day');
            while (day.isBefore(endDay, 'day')) {
              let i = 0;
              while (i < 7) {
                const d = day.add(1, 'day').clone();
                objectDay[dayName[i]] = {
                  date: moment(d),
                  month: search.fromDate,
                  data: objectDay[dayName[i]].data,
                };
                i += 1;
              }
              calendar.push(objectDay);
            }
          }
        });

        return calendar || [];
      }
      case 'timeGridWeek': {
        const dataWeek = [];
        data?.forEach((item, idx) => {
          let groupClass;
          if (!search.branchId) {
            groupClass = { ...item.timetableDetailGroupByClasses[0] };
          } else if (search.branchId && !search.classId) {
            groupClass = { ...item.timetableDetailGroupByClasses[0] };
          } else {
            groupClass = reduce(item.timetableDetailGroupByClasses, (obj, itemDetail) => {
              if(itemDetail.class.id === search.classId) {
                return {...obj, ...itemDetail};
              }
              return {};
            }, {});
          }

          if (!isEmpty(groupClass)) {
            if (idx === 0) {
              const objectEmpty = {};
              objectEmpty.time = '';
              dayName.forEach((item) => {
                objectEmpty[item] = '';
              });
              dataWeek.push(objectEmpty);
            }
            const objectData = Object.create({});
            objectData.timeStart = item.startTime;
            if (groupClass.timetableDetailActivities) {
              groupClass.timetableDetailActivities[0].dayOfWeeks.forEach((itemDay) => {
                objectData[itemDay] = {
                  class: groupClass.timetableDetailActivities,
                  start: item.startTime,
                  end: item.endTime,
                };
              });
              dayName.forEach((itemDay) => {
                if (!objectData[itemDay]) {
                  objectData[itemDay] = {};
                }
              });

              dataWeek.push(objectData);
            }
            if (groupClass.timetableDetailActivityGroupByDayOfWeeks) {
              groupClass.timetableDetailActivityGroupByDayOfWeeks.forEach((itemDay) => {
                objectData[itemDay.dayOfWeek] = {
                  class: itemDay.timetableActivityDetail,
                  start: item.startTime,
                  end: item.endTime,
                };
              });
              dayName.forEach((itemDay) => {
                if (!objectData[itemDay]) {
                  objectData[itemDay] = {};
                }
              });
              dataWeek.push(objectData);
            }
          }
        });
        return dataWeek;
      }
      case 'timeGridDay': {
        const dataGridDay = data?.map((item) => {
          const objectDay = {};
          objectDay.times = {
            timeStart: item.startTime,
            timeEnd: item.endTime,
          };

          let groupClass;
          if (!search.branchId) {
            groupClass = { ...item.timetableDetailGroupByClasses[0] };
          } else if (search.branchId && !search.classId) {
            groupClass = { ...item.timetableDetailGroupByClasses[0] };
          } else {
            groupClass = reduce(item.timetableDetailGroupByClasses, (obj, itemDetail) => {
              if(itemDetail.class.id === search.classId) {
                return {...obj, ...itemDetail};
              }
              return {};
            }, {});
          }
          if (!isEmpty(groupClass)) {
            if (groupClass.timetableDetailActivities) {
              const { timetableDetailActivities } = groupClass;
              objectDay.content = {
                ...timetableDetailActivities[0],
                start: item.startTime,
                end: item.endTime,
              };
            }
            if (groupClass.timetableDetailActivityGroupByDayOfWeeks) {
              const { timetableDetailActivityGroupByDayOfWeeks } = groupClass;
              objectDay.content = {
                ...timetableDetailActivityGroupByDayOfWeeks[0],
                start: item.startTime,
                end: item.endTime,
              };
            }
          }
          return objectDay;
        });
        return dataGridDay;
      }
      case 'listDay': {
        const arrTimeTable = reduce(
          data,
          (arr, item) => {
            let groupClass;
            if (!search.branchId) {
              groupClass = { ...item.timetableDetailGroupByClasses[0] };
            } else if (search.branchId && !search.classId) {
              groupClass = { ...item.timetableDetailGroupByClasses[0] };
            } else {
              groupClass = reduce(item.timetableDetailGroupByClasses, (obj, itemDetail) => {
                if(itemDetail.class.id === search.classId) {
                  return {...obj, ...itemDetail};
                }
                return {};
              }, {});
            }
            if (!isEmpty(groupClass)) {
              if (groupClass.timetableDetailActivities) {
                const { timetableDetailActivities } = groupClass;
                arr.push({
                  timeStart: item.startTime,
                  timeEnd: item.endTime,
                  id: `${Math.floor(Math.random() * 100000)}`,
                  content: { ...timetableDetailActivities[0] },
                });
              }
              if (groupClass.timetableDetailActivityGroupByDayOfWeeks) {
                const { timetableDetailActivityGroupByDayOfWeeks } = groupClass;
                arr.push({
                  timeStart: item.startTime,
                  timeEnd: item.endTime,
                  id: `${Math.floor(Math.random() * 100000)}`,
                  content: { ...timetableDetailActivityGroupByDayOfWeeks[0] },
                });
              }
            }
            return arr;
          },
          [],
        );
        return arrTimeTable;
      }

      default:
        return [];
    }
  };

  const header = (type, arrDate = []) => {
    switch (type) {
      case 'dayGridMonth':
        return [
          {
            title: 'Thứ hai',
            key: 'Monday',
            dataIndex: 'Monday',
            className: 'min-width-100',
            render: (value) => (
              <CardMonth
                date={value.date}
                month={value.month}
                data={value.data}
                day={value.day}
                handleClick={handleClick}
              />
            ),
          },
          {
            title: 'Thứ ba',
            key: 'Tuesday',
            dataIndex: 'Tuesday',
            className: 'min-width-100',
            render: (value) => (
              <CardMonth
                date={value.date}
                day={value.day}
                month={value.month}
                data={value.data}
                handleClick={handleClick}
              />
            ),
          },
          {
            title: 'Thứ tư',
            key: 'Wednesday',
            dataIndex: 'Wednesday',
            className: 'min-width-100',
            render: (value) => (
              <CardMonth
                date={value.date}
                day={value.day}
                month={value.month}
                data={value.data}
                handleClick={handleClick}
              />
            ),
          },
          {
            title: 'Thứ năm',
            key: 'Thursday',
            dataIndex: 'Thursday',
            className: 'min-width-100',
            render: (value) => (
              <CardMonth
                date={value.date}
                day={value.day}
                month={value.month}
                data={value.data}
                handleClick={handleClick}
              />
            ),
          },
          {
            title: 'Thứ sáu',
            key: 'Friday',
            dataIndex: 'Friday',
            className: 'min-width-100',
            render: (value) => (
              <CardMonth
                date={value.date}
                day={value.day}
                month={value.month}
                data={value.data}
                handleClick={handleClick}
              />
            ),
          },
          {
            title: 'Thứ bảy',
            key: 'Saturday',
            dataIndex: 'Saturday',
            className: 'min-width-100',
            render: (value) => {
              if (
                Helper.getDate(value.date, variables.DATE_FORMAT.MONTH) ===
                Helper.getDate(value.month, variables.DATE_FORMAT.MONTH)
              ) {
                return <span>{Helper.getDate(value.date, variables.DATE_FORMAT.ONLY_DATE)}</span>;
              }
              return (
                <span style={{ color: '#bfbfbf' }}>
                  {Helper.getDate(value.date, variables.DATE_FORMAT.ONLY_DATE)}
                </span>
              );
            },
          },
          {
            title: 'Chủ nhật',
            key: 'Sunday',
            dataIndex: 'Sunday',
            className: 'min-width-100',
            render: (value) => {
              if (
                Helper.getDate(value.date, variables.DATE_FORMAT.MONTH) ===
                Helper.getDate(value.month, variables.DATE_FORMAT.MONTH)
              ) {
                return <span>{Helper.getDate(value.date, variables.DATE_FORMAT.ONLY_DATE)}</span>;
              }
              return (
                <span style={{ color: '#bfbfbf' }}>
                  {Helper.getDate(value.date, variables.DATE_FORMAT.ONLY_DATE)}
                </span>
              );
            },
          },
        ];
      case 'timeGridWeek':
        if (arrDate.length > 0) {
          const arrHeader = [
            {
              title: '',
              key: 'timeStart',
              dataIndex: 'timeStart',
              width: 50,
              className: classnames(styles['td-time'], 'min-width-50'),
              render: (value) =>
                value ? (
                  <CardTime value={value} onClick={() => handleClick(value, 'timeGridWeek')} />
                ) : (
                  ''
                ),
            },
            {
              title: (
                <CardWeek
                  titleDate="Thứ hai"
                  date={moment(arrDate[0]).format(variables.DATE_FORMAT.DATE_MONTH)}
                />
              ),
              key: 'Monday',
              dataIndex: 'Monday',
              width: 100,
              className: classnames('min-width-100', styles.calendar),
              render: (value) => (
                <CardLesson value={value} onClick={() => handleClick(value, 'timeGridWeek')} />
              ),
            },
            {
              title: (
                <CardWeek
                  titleDate="Thứ ba"
                  date={moment(arrDate[1]).format(variables.DATE_FORMAT.DATE_MONTH)}
                />
              ),
              key: 'Tuesday',
              dataIndex: 'Tuesday',
              width: 100,
              className: classnames('min-width-100', styles.calendar),
              render: (value) => (
                <CardLesson value={value} onClick={() => handleClick(value, 'timeGridWeek')} />
              ),
            },
            {
              title: (
                <CardWeek
                  titleDate="Thứ tư"
                  date={moment(arrDate[2]).format(variables.DATE_FORMAT.DATE_MONTH)}
                />
              ),
              key: 'Wednesday',
              dataIndex: 'Wednesday',
              width: 100,
              className: classnames('min-width-100', styles.calendar),
              render: (value) => (
                <CardLesson value={value} onClick={() => handleClick(value, 'timeGridWeek')} />
              ),
            },
            {
              title: (
                <CardWeek
                  titleDate="Thứ năm"
                  date={moment(arrDate[3]).format(variables.DATE_FORMAT.DATE_MONTH)}
                />
              ),
              key: 'Thursday',
              dataIndex: 'Thursday',
              width: 100,
              className: classnames('min-width-100', styles.calendar),
              render: (value) => (
                <CardLesson value={value} onClick={() => handleClick(value, 'timeGridWeek')} />
              ),
            },
            {
              title: (
                <CardWeek
                  titleDate="Thứ sáu"
                  date={moment(arrDate[4]).format(variables.DATE_FORMAT.DATE_MONTH)}
                />
              ),
              key: 'Friday',
              dataIndex: 'Friday',
              width: 100,
              className: classnames('min-width-100', styles.calendar),
              render: (value) => (
                <CardLesson value={value} onClick={() => handleClick(value, 'timeGridWeek')} />
              ),
            },
            {
              title: (
                <CardWeek
                  titleDate="Thứ bảy"
                  date={moment(arrDate[5]).format(variables.DATE_FORMAT.DATE_MONTH)}
                />
              ),
              key: 'Saturday',
              dataIndex: 'Saturday',
              width: 100,
              className: classnames('min-width-100', styles.calendar),
              render: () => {},
            },
            {
              title: (
                <CardWeek
                  titleDate="Chủ nhật"
                  date={moment(arrDate[6]).format(variables.DATE_FORMAT.DATE_MONTH)}
                />
              ),
              key: 'Sunday',
              dataIndex: 'Sunday',
              width: 100,
              className: classnames('min-width-100', styles.calendar),
              render: () => {},
            },
            {
              title: (
                <Button
                  icon={showColumn ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
                  onClick={() => Collapse()}
                />
              ),
              key: 'acction',
              dataIndex: 'acction',
              width: 40,
              className: 'max-width-40',
              render: () => {},
            },
          ];
          if (!showColumn) {
            return arrHeader.filter((item, idx) => idx !== 6 && idx !== 7 && item);
          }
          return arrHeader;
        }
        return [];
      case 'timeGridDay':
        return [
          {
            title: 'Thời gian',
            key: 'times',
            dataIndex: 'times',
            width: 100,
            className: 'min-width-100',
            render: (value) => <CardDate times={value} />,
          },
          {
            title: 'Nội dung',
            key: 'content',
            dataIndex: 'content',
            className: 'min-width-100',
            render: (value) => (
              <CardDate content={value} onClick={() => handleClick(value, 'timeGridDay')} />
            ),
          },
        ];
      default:
        return [];
    }
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

  const tableWeek = () => {
    if (search.type === 'timeGridWeek') {
      const startWeek = moment(search.fromDate).startOf('week').subtract(1, 'day');
      const arrDate = [];
      while (startWeek.isBefore(search.toDate)) {
        arrDate.push(startWeek.add(1, 'day').clone());
      }
      return (
        <div className="mb-5">
          <Table
            bordered
            columns={header(search.type, arrDate)}
            dataSource={renderCalendar(search.type, data)}
            loading={effects['timeTablesChildren/GET_DATA']}
            pagination={false}
            params={{
              header: header(search.type),
              type: 'table',
            }}
            rowKey={() => Math.floor(Math.random() * 1000000)}
            scroll={{ x: '100%' }}
          />
        </div>
      );
    }
    return <></>;
  };

  const titleDateTable = (type) => {
    if (type === 'dayGridMonth' || type === 'timeGridWeek') {
      return moment(search.fromDate).format(variables.DATE_FORMAT.MONTH_FULL);
    }
    return moment(search.fromDate).format('[Ngày] DD [tháng] MM [năm] YYYY');
  };

  return (
    // !isEmpty(fake_data) && (
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
            <ButtonCustom
              key="remove"
              color="danger"
              icon="remove"
              ghost
              className="mr10"
              // onClick={remove}
            >
              Xóa
            </ButtonCustom>
            <ButtonCustom
              key="edit"
              color="success"
              icon="edit"
              ghost
              // onClick={() => redirectDetails(pathname, 'chi-tiet')}
            >
              Chỉnh sửa
            </ButtonCustom>
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
              {state.details.start} - {state.details.end}
            </p>
          </div>
        </div>
      </Modal>
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
          <Text color="dark">Thời khóa biểu trẻ</Text>
          <ButtonCustom
            color="success"
            icon="plus"
            onClick={() => history.push(`${pathname}/tao-moi`)}
            permission="TKB"
          >
            Thêm mới
          </ButtonCustom>
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
                <ButtonCustom color="success" icon="search" htmlType="submit">
                  Tìm kiếm
                </ButtonCustom>
              </div>
            </div>
          </Form>
        </div>
        {/* FORM SEARCH */}
        <div className={classnames(styles['block-table'], 'schedules-custom', 'mt20')}>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex flex-row">
                <Button
                  icon={<LeftOutlined className={styles.colorIcon} />}
                  onClick={() => {
                    if (search.type === 'dayGridMonth') {
                      debouncedSearchDate(
                        moment(search.fromDate).subtract(1, 'months'),
                        moment(search.toDate).subtract(1, 'months'),
                        'dayGridMonth',
                      );
                    }
                    if (search.type === 'timeGridWeek') {
                      debouncedSearchDate(
                        moment(search.fromDate).subtract(1, 'months'),
                        moment(search.toDate).subtract(1, 'months'),
                        'timeGridWeek',
                      );
                    }
                    if (search.type === 'timeGridDay' || search.type === 'listDay') {
                      debouncedSearchDate(
                        moment(search.fromDate).subtract(1, 'days'),
                        moment(search.toDate).subtract(1, 'days'),
                        'timeGridDay',
                      );
                    }
                  }}
                  className={styles.btnStyle}
                />
                <Button
                  icon={<RightOutlined className={styles.colorIcon} />}
                  onClick={() => {
                    if (search.type === 'dayGridMonth') {
                      debouncedSearchDate(
                        moment(search.fromDate).add(1, 'months'),
                        moment(search.toDate).add(1, 'months'),
                        'dayGridMonth',
                      );
                    }
                    if (search.type === 'timeGridWeek') {
                      debouncedSearchDate(
                        moment(search.fromDate).add(1, 'months'),
                        moment(search.toDate).add(1, 'months'),
                        'timeGridWeek',
                      );
                    }
                    if (search.type === 'timeGridDay' || search.type === 'listDay') {
                      debouncedSearchDate(
                        moment(search.fromDate).add(1, 'days'),
                        moment(search.toDate).add(1, 'days'),
                        'timeGridDay',
                      );
                    }
                  }}
                  className={styles.btnStyle}
                />
              </div>
              <ButtonCustom permission="TKB" color="white" className="ml-2">
                Hôm nay
              </ButtonCustom>
            </div>
            <div className={classnames('d-flex align-items-end', styles['title-time-table'])}>
              <Text color="dark" size="large-medium">
                {titleDateTable(search.type)}
              </Text>
            </div>
            <div className="d-flex flex-row">
              <ButtonCustom
                permission="TKB"
                color={search.type === 'dayGridMonth' ? 'green' : 'white'}
                onClick={() => {
                  debouncedSearchDate(
                    moment().startOf('month'),
                    moment().endOf('month'),
                    'dayGridMonth',
                  );
                }}
              >
                Tháng
              </ButtonCustom>
              <ButtonCustom
                permission="TKB"
                color={search.type === 'timeGridWeek' ? 'green' : 'white'}
                onClick={() => {
                  debouncedSearchDate(
                    moment().startOf('weeks'),
                    moment().endOf('weeks'),
                    'timeGridWeek',
                  );
                }}
              >
                Tuần
              </ButtonCustom>
              <ButtonCustom
                permission="TKB"
                color={search.type === 'timeGridDay' ? 'green' : 'white'}
                onClick={() => {
                  debouncedSearchDate(
                    moment().startOf('days'),
                    moment().endOf('days'),
                    'timeGridDay',
                  );
                }}
              >
                Ngày
              </ButtonCustom>
              <ButtonCustom
                permission="TKB"
                color={search.type === 'listDay' ? 'green' : 'white'}
                onClick={() => {
                  debouncedSearchDate(moment().startOf('days'), moment().endOf('days'), 'listDay');
                }}
              >
                Lịch biểu
              </ButtonCustom>
            </div>
          </div>
          <>{search.type === 'timeGridWeek' && tableWeek()}</>
          <>
            {search.type === 'dayGridMonth' && (
              <Table
                bordered
                columns={header(search.type)}
                dataSource={renderCalendar(search.type, data)}
                loading={effects['timeTablesChildren/GET_DATA']}
                pagination={false}
                params={{
                  header: header(search.type),
                  type: 'table',
                }}
                rowKey={() => `${Math.random() * 100000}`}
                scroll={{ x: '100%' }}
              />
            )}
          </>
          <>
            {search.type === 'timeGridDay' && (
              <Table
                bordered
                columns={header(search.type)}
                dataSource={renderCalendar(search.type, data)}
                loading={effects['timeTablesChildren/GET_DATA']}
                pagination={false}
                params={{
                  header: header(search.type),
                  type: 'table',
                }}
                rowKey={() => `${Math.random() * 100000}`}
                scroll={{ x: '100%' }}
              />
            )}
          </>
          <>
            {search.type === 'listDay' && (
              <div className="w-100">
                {renderCalendar(search.type, data).map((item, idx) => (
                  <React.Fragment key={item.id}>
                    <ListDay
                      value={item}
                      lastPoint={idx === renderCalendar(search.type, data).length - 1 ? idx : 0}
                    />
                  </React.Fragment>
                ))}
              </div>
            )}
          </>
        </div>
      </div>
    </>
    // )
  );
});

export default Index;
