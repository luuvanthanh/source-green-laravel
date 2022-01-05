import FormItem from '@/components/CommonComponent/FormItem';
import ButtonCustom from '@/components/CommonComponent/Button';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import classnames from 'classnames';
import moment from 'moment';
import { debounce, head, isEmpty, reduce } from 'lodash';
import React, { useState, memo, useEffect, useMemo } from 'react';
import styles from '@/assets/styles/Common/common.scss';
import Table from '@/components/CommonComponent/Table';
import CardTime from '@/components/CommonComponent/CardCalendar/CardTime';
import CardWeek from '@/components/CommonComponent/CardCalendar/CardWeek';
import CardDate from '@/components/CommonComponent/CardCalendar/CardDate';
import CardLesson from '@/components/CommonComponent/CardCalendar/CardLesson';
import CardMonth from '@/components/CommonComponent/CardCalendar/CardMonth';
import ListDay from '@/components/CommonComponent/CardCalendar/ListDay';
import { Form, Button } from 'antd';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'dva';
import { useLocation, useHistory } from 'umi';
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';

const Index = memo(() => {
  const [formRef] = Form.useForm();
  const [
    { branches, classes, objectData, years },
    { defaultBranch },
    { effects },
  ] = useSelector(({ timeTablesChildren, user, loading }) => [timeTablesChildren, user, loading]);
  const dispatch = useDispatch();
  const { pathname, query } = useLocation();
  const yearsConvert = years.map((item) => ({
    id: item.id,
    name: `${item.fromYear} - ${item.toYear}`,
  }));
  const history = useHistory();
  const { data } = objectData;
  const [search, setSearch] = useState({
    fromDate: moment().startOf('month').format(variables.DATE_FORMAT.DATE_AFTER),
    toDate: moment().endOf('month').format(variables.DATE_FORMAT.DATE_AFTER),
    type: 'timeGridWeek',
    branchId: defaultBranch?.id,
    classId: query?.classId,
    timetableSettingId: null,
  });

  const [showColumn, setShowColumn] = useState(false);

  const getYears = () => {
    dispatch({
      type: 'timeTablesChildren/GET_YEARS',
      payload: {},
      callback: (response) => {
        if (response && !search.timetableSettingId) {
          const time = moment(search.fromDate);
          response.forEach((item) => {
            if (
              time.isBefore(moment(item.toDate)) && time.isAfter(moment(item.fromDate))
            ) {
              setSearch((prevState) => ({
                ...prevState,
                timetableSettingId: item.id,
              }));
              formRef.setFieldsValue({
                timetableSettingId: item.id,
              });
            }
          });
        }
      },
    });
  };

  const onLoad = () => {
    dispatch({
      type: 'timeTablesChildren/GET_DATA',
      payload: {
        classId: search.classId || null,
        branchId: search.branchId || null,
        isGroupByDayOfWeek: true,
        timetableSettingId: search.timetableSettingId,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        timetableSettingId: search?.timetableSettingId,
        branchId: search?.branchId,
        classId: search?.classId,
      }),
    });
  };

  const getClass = (idBranch) => {
    dispatch({
      type: 'timeTablesChildren/GET_CLASSES',
      payload: {
        branch: idBranch,
      },
    });
  };

  const getBranch = () => {
    dispatch({
      type: 'timeTablesChildren/GET_BRANCHES',
      payload: {},
      callback: (response) => {
        if (response) {
          setSearch((prev) => ({
            ...prev,
            branchId: query?.branchId || response[0]?.id,
          }));
          formRef.setFieldsValue({
            branchId: head(response)?.id,
          });
          getClass(response[0]?.id);
        }
      },
    });
  };

  useEffect(() => {
    onLoad();
  }, [search]);

  useEffect(() => {
    getYears();
    getBranch();
  }, []);

  const onChangeSelectBranch = (e) => {
    dispatch({
      type: 'timeTablesChildren/GET_CLASSES',
      payload: {
        branch: e,
      },
    });
    setSearch((prevState) => ({
      ...prevState,
      branchId: e,
    }));
  };

  const Collapse = () => {
    setShowColumn(!showColumn);
  };

  const renderCalendar = (type, data) => {
    const sortDataCalendar = Helper.onSortDates(
      data.map((item) => ({
        ...item,
        dateSort: moment(item.startTime, variables.DATE_FORMAT.HOUR),
      })),
      'dateSort',
      'asc',
    );
    const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    switch (type) {
      case 'dayGridMonth': {
        const calendar = [];
        const objectDataDay = {
          Monday: {
            data: [],
          },
          Tuesday: {
            data: [],
          },
          Wednesday: {
            data: [],
          },
          Thursday: {
            data: [],
          },
          Friday: {
            data: [],
          },
          Saturday: {
            data: [],
          },
          Sunday: {
            data: [],
          },
        };
        sortDataCalendar?.forEach((item) => {
          let groupClass;
          if (!search.branchId) {
            groupClass = { ...item.timetableDetailGroupByClasses[0] };
          } else if (search.branchId && !search.classId) {
            groupClass = { ...item.timetableDetailGroupByClasses[0] };
          } else {
            groupClass = reduce(
              item.timetableDetailGroupByClasses,
              (obj, itemDetail) => {
                if (itemDetail.class.id === search.classId) {
                  return { ...obj, ...itemDetail };
                }
                return {};
              },
              {},
            );
          }
          if (!isEmpty(groupClass)) {
            if (groupClass.timetableDetailActivities) {
              groupClass.timetableDetailActivities[0].dayOfWeeks.forEach((itemDay) => {
                objectDataDay[itemDay].data = objectDataDay[itemDay].data.concat({
                  startTime: item.startTime,
                  endTime: item.endTime,
                  class: groupClass.timetableDetailActivities,
                });
              });
            }
            if (groupClass.timetableDetailActivityGroupByDayOfWeeks) {
              groupClass.timetableDetailActivityGroupByDayOfWeeks.forEach((itemDay) => {
                objectDataDay[itemDay.dayOfWeek].data = objectDataDay[
                  itemDay.dayOfWeek
                ].data.concat({
                  startTime: item.startTime,
                  endTime: item.endTime,
                  class: itemDay.timetableActivityDetail,
                });
              });
            }
          }
        });
        const startDay = moment(search.fromDate).startOf('week');
        const endDay = moment(search.toDate).endOf('week');
        const date = startDay.subtract(1, 'day');
        while (date.isBefore(endDay, 'day')) {
          const objTime = Object.create({});
          let i = 0;
          while (i < 7) {
            objTime[dayName[i]] = {
              date: date.add(1, 'day').clone(),
              month: search.fromDate,
              data: objectDataDay[dayName[i]].data,
            };
            i += 1;
          }
          calendar.push(objTime);
        }

        return calendar || [];
      }
      case 'timeGridWeek': {
        const dataWeek = [];
        if (!isEmpty(sortDataCalendar)) {
          sortDataCalendar.forEach((item, idx) => {
            let groupClass;
            if (!search.branchId) {
              groupClass = { ...item.timetableDetailGroupByClasses[0] };
            } else if (search.branchId && !search.classId) {
              groupClass = { ...item.timetableDetailGroupByClasses[0] };
            } else {
              groupClass = reduce(
                item.timetableDetailGroupByClasses,
                (obj, itemDetail) => {
                  if (itemDetail.class.id === search.classId) {
                    return { ...obj, ...itemDetail };
                  }
                  return {};
                },
                {},
              );
            }

            if (!isEmpty(groupClass) && !isEmpty(groupClass.timetableDetailActivityGroupByDayOfWeeks)) {
              if (idx === 0) {
                const objectEmpty = {};
                objectEmpty.time = '';
                dayName.forEach((item) => {
                  objectEmpty[item] = '';
                });
                dataWeek.push(objectEmpty);
              }
              const objectData = Object.create({});
              objectData.time = {
                startTime: item.startTime,
                endTime: item.endTime,
                class: groupClass
              };
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
        const objectEmpty = {};
        objectEmpty.time = '';
        dayName.forEach((item) => {
          objectEmpty[item] = '';
        });
        return Array(objectEmpty);
      }
      case 'timeGridDay': {
        const dataGridDay = sortDataCalendar?.map((item) => {
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
            groupClass = reduce(
              item.timetableDetailGroupByClasses,
              (obj, itemDetail) => {
                if (itemDetail.class.id === search.classId) {
                  return { ...obj, ...itemDetail };
                }
                return {};
              },
              {},
            );
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
          sortDataCalendar,
          (arr, item) => {
            let groupClass;
            if (!search.branchId) {
              groupClass = { ...item.timetableDetailGroupByClasses[0] };
            } else if (search.branchId && !search.classId) {
              groupClass = { ...item.timetableDetailGroupByClasses[0] };
            } else {
              groupClass = reduce(
                item.timetableDetailGroupByClasses,
                (obj, itemDetail) => {
                  if (itemDetail.class.id === search.classId) {
                    return { ...obj, ...itemDetail };
                  }
                  return {};
                },
                {},
              );
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
              <CardMonth date={value.date} month={value.month} data={value.data} day={value.day} />
            ),
          },
          {
            title: 'Thứ ba',
            key: 'Tuesday',
            dataIndex: 'Tuesday',
            className: 'min-width-100',
            render: (value) => (
              <CardMonth date={value.date} day={value.day} month={value.month} data={value.data} />
            ),
          },
          {
            title: 'Thứ tư',
            key: 'Wednesday',
            dataIndex: 'Wednesday',
            className: 'min-width-100',
            render: (value) => (
              <CardMonth date={value.date} day={value.day} month={value.month} data={value.data} />
            ),
          },
          {
            title: 'Thứ năm',
            key: 'Thursday',
            dataIndex: 'Thursday',
            className: 'min-width-100',
            render: (value) => (
              <CardMonth date={value.date} day={value.day} month={value.month} data={value.data} />
            ),
          },
          {
            title: 'Thứ sáu',
            key: 'Friday',
            dataIndex: 'Friday',
            className: 'min-width-100',
            render: (value) => (
              <CardMonth date={value.date} day={value.day} month={value.month} data={value.data} />
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
              key: 'time',
              dataIndex: 'time',
              width: 100,
              className: classnames(styles['td-time'], 'min-width-100'),
              render: (value) => (value ? <CardTime value={value} /> : ''),
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
              render: (value) => <CardLesson value={value} />,
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
              render: (value) => <CardLesson value={value} />,
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
              render: (value) => <CardLesson value={value} />,
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
              render: (value) => <CardLesson value={value} />,
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
              render: (value) => <CardLesson value={value} />,
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
            render: (value) => <CardDate content={value} />,
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

  const disabledToday = (type) => {
    switch (type) {
      case 'dayGridMonth':
        return (
          Helper.getDate(moment(), variables.DATE_FORMAT.MONTH) ===
          Helper.getDate(search.fromDate, variables.DATE_FORMAT.MONTH)
        );
      case 'timeGridWeek':
        return (
          Helper.getDate(search.fromDate, variables.DATE_FORMAT.WEEK) ===
          Helper.getDate(moment(), variables.DATE_FORMAT.WEEK)
        );
      case 'timeGridDay':
        return (
          Helper.getDate(search.fromDate, variables.DATE_FORMAT.DATE_VI) ===
          Helper.getDate(moment(), variables.DATE_FORMAT.DATE_VI)
        );
      case 'listDay':
        return (
          Helper.getDate(search.fromDate, variables.DATE_FORMAT.DATE_VI) ===
          Helper.getDate(moment(), variables.DATE_FORMAT.DATE_VI)
        );
      default:
        break;
    }
    return false;
  };

  const arrDate = useMemo(() => {
    const startWeek = moment(search.fromDate).startOf('week').subtract(1, 'day');
    const arr = [];
    while (startWeek.isBefore(search.toDate)) {
      arr.push(startWeek.add(1, 'day').clone());
    }
    return arr;
  }, [search.fromDate, search.toDate]);

  const tableWeek = () => {
    if (search.type === 'timeGridWeek') {
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
    <>
      <Helmet title="Thời khóa biểu trẻ" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Thời khóa biểu trẻ</Text>
          </div>
          {/* FORM SEARCH */}
          <div className={classnames(styles.search, 'pt20')}>
            <Form
              initialValues={{
                ...search,
                classId: query?.classId || null,
              }}
              layout="vertical"
              form={formRef}
            >
              <div className="row">
                <div className="col-lg-4">
                  <FormItem
                    className="ant-form-item-row"
                    data={yearsConvert}
                    label="Năm học"
                    name="timetableSettingId"
                    onChange={(event) =>
                      setSearch((prevState) => ({ ...prevState, timetableSettingId: event }))
                    }
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    className="ant-form-item-row"
                    data={branches}
                    label="CƠ SỞ"
                    name="branchId"
                    onChange={(event) => onChangeSelectBranch(event)}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    className="ant-form-item-row"
                    data={[{ id: null, name: 'Chọn tất cả các lớp' }, ...classes]}
                    label="LỚP"
                    name="classId"
                    onChange={(event) => {
                      setSearch((prevState) => ({ ...prevState, classId: event }));
                    }}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
              </div>
            </Form>
          </div>
          {/* FORM SEARCH */}
          <div className={classnames(styles['block-table'], 'mt20')}>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center justify-content-between">
                <div className={classnames('d-flex flex-row', styles['btnControl-timetable'])}>
                  <Button
                    icon={<LeftOutlined className={styles.colorIcon} />}
                    onClick={() => {
                      if (search.type === 'dayGridMonth') {
                        debouncedSearchDate(
                          moment(search.fromDate).subtract(1, 'months'),
                          moment(search.toDate).subtract(1, 'months'),
                          'dayGridMonth',
                        );

                        const time = moment(search.fromDate).subtract(1, 'month').clone();
                        let id = '';
                        years.forEach(item => {
                          if(time.isBefore(moment(item.toDate)) && time.isAfter(moment(item.fromDate))) {
                            id = item.id;                          
                          }
                        });
                        if( id !== search.timetableSettingId){
                          setSearch(prev => ({...prev, timetableSettingId: id}));
                          formRef.setFieldsValue({
                            timetableSettingId: id,
                          });
                        }
                      }
                      if (search.type === 'timeGridWeek') {
                        debouncedSearchDate(
                          moment(search.fromDate).subtract(1, 'weeks'),
                          moment(search.toDate).subtract(1, 'weeks'),
                          'timeGridWeek',
                        );
                        const time = moment(search.fromDate).subtract(1, 'weeks').clone();
                        let id = '';
                        years.forEach(item => {
                          if(time.isBefore(moment(item.toDate)) && time.isAfter(moment(item.fromDate))) {
                            id = item.id;   
                            formRef.setFieldsValue({
                              timetableSettingId: id,
                            });                       
                          }
                        });
                        if( id !== search.timetableSettingId){
                          setSearch(prev => ({...prev, timetableSettingId: id}));
                          formRef.setFieldsValue({
                            timetableSettingId: id,
                          });
                        }
                      }
                      if (search.type === 'timeGridDay' || search.type === 'listDay') {
                        debouncedSearchDate(
                          moment(search.fromDate).subtract(1, 'days'),
                          moment(search.toDate).subtract(1, 'days'),
                          'timeGridDay',
                        );
                        const time = moment(search.fromDate).subtract(1, 'days').clone();
                        let id = '';
                        years.forEach(item => {
                          if(time.isBefore(moment(item.toDate)) && time.isAfter(moment(item.fromDate))) {
                            id = item.id;
                            formRef.setFieldsValue({
                              timetableSettingId: id,
                            });                       
                          }
                        });
                        if( id !== search.timetableSettingId){
                          setSearch(prev => ({...prev, timetableSettingId: id}));
                          formRef.setFieldsValue({
                            timetableSettingId: id,
                          });
                        }
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
                        const time = moment(search.fromDate).subtract(1, 'month').clone();
                        let id = '';
                        years.forEach(item => {
                          if(time.isBefore(moment(item.toDate)) && time.isAfter(moment(item.fromDate))) {
                            id = item.id;                          
                          }
                        });
                        if( id !== search.timetableSettingId){
                          setSearch(prev => ({...prev, timetableSettingId: id}));
                          formRef.setFieldsValue({
                            timetableSettingId: id,
                          });
                        }
                      }
                      if (search.type === 'timeGridWeek') {
                        debouncedSearchDate(
                          moment(search.fromDate).add(1, 'weeks'),
                          moment(search.toDate).add(1, 'weeks'),
                          'timeGridWeek',
                        );
                        const time = moment(search.fromDate).subtract(1, 'weeks').clone();
                        let id = '';
                        years.forEach(item => {
                          if(time.isBefore(moment(item.toDate)) && time.isAfter(moment(item.fromDate))) {
                            id = item.id;                          
                          }
                        });
                        if( id !== search.timetableSettingId){
                          setSearch(prev => ({...prev, timetableSettingId: id}));
                          formRef.setFieldsValue({
                            timetableSettingId: id,
                          });
                        }
                      }
                      if (search.type === 'timeGridDay' || search.type === 'listDay') {
                        debouncedSearchDate(
                          moment(search.fromDate).add(1, 'days'),
                          moment(search.toDate).add(1, 'days'),
                          'timeGridDay',
                        );
                        const time = moment(search.fromDate).subtract(1, 'days').clone();
                        let id = '';
                        years.forEach(item => {
                          if(time.isBefore(moment(item.toDate)) && time.isAfter(moment(item.fromDate))) {
                            id = item.id;                          
                          }
                        });
                        if( id !== search.timetableSettingId){
                          setSearch(prev => ({...prev, timetableSettingId: id}));
                          formRef.setFieldsValue({
                            timetableSettingId: id,
                          });
                        }
                      }
                    }}
                    className={styles.btnStyle}
                  />
                </div>
                <ButtonCustom
                  permission="TKB"
                  color="white"
                  className="ml-2"
                  onClick={() => {
                    const time = moment().clone();
                    let id = '';
                    years.forEach(item => {
                      if(time.isBefore(moment(item.toDate)) && time.isAfter(moment(item.fromDate))) {
                        id = item.id;                          
                      }
                    });
                    if( id !== search.timetableSettingId){
                      setSearch(prev => ({...prev, timetableSettingId: id}));
                      formRef.setFieldsValue({
                        timetableSettingId: id,
                      });
                    }
                    if (search.type === 'dayGridMonth') {
                      debouncedSearchDate(
                        moment().startOf('month'),
                        moment().endOf('month'),
                        'dayGridMonth',
                      );
                    }
                    if (search.type === 'timeGridWeek') {
                      debouncedSearchDate(moment(), moment(), 'timeGridWeek');
                    }
                    if (search.type === 'timeGridDay' || search.type === 'listDay') {
                      debouncedSearchDate(moment(), moment(), 'timeGridDay');
                    }
                  }}
                  disabled={disabledToday(search.type)}
                >
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
                  color={search.type === 'listDay' ? 'green' : 'white'}
                  onClick={() => {
                    debouncedSearchDate(
                      moment().startOf('days'),
                      moment().endOf('days'),
                      'listDay',
                    );
                  }}
                >
                  Lịch biểu
                </ButtonCustom>
              </div>
            </div>
            {search.type === 'timeGridWeek' && tableWeek()}
            {(search.type === 'dayGridMonth' || search.type === 'timeGridDay') && (
              <Table
                showHeader
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
          </div>
        </div>
    </>
  );
});

export default Index;
