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
    { branches, classes, data },
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

  const [showColumn, setShowColumn] = useState(true);

  const onLoad = () => {
    dispatch({
      type: 'timeTablesChildren/GET_FAKE_DATA',
      payload: {},
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
              setState((prev) => ({
                ...prev,
                details: {},
                visible: false,
              }));
            }
          },
        });
      },
    });
  };

  const Collapse = () => {
    setShowColumn(!showColumn);
  };

  const renderCalendar = (type, data) => {
    const dayName = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    switch (type) {
      case 'dayGridMonth': {
        const calendar = [];
        const startDay = moment(search.fromDate).startOf('week');
        const endDay = moment(search.toDate).endOf('week');

        const day = startDay.subtract(1, 'day');
        while (day.isBefore(endDay, 'day')) {
          let i = 0;
          const objectTime = Object.create({});
          while (i < 7) {
            if (i <= 4) {
              objectTime[dayName[i]] = {
                date: day.add(1, 'day').clone(),
                month: search.fromDate,
                data,
              };
              objectTime.id = `${Math.floor(Math.random() * 100000 * i)}`;
            } else {
              objectTime[dayName[i]] = {
                date: day.add(1, 'day').clone(),
                month: search.fromDate,
                data: [],
              };
              objectTime.id = `${Math.floor(Math.random() * 100000 * i)}`;
            }

            i += 1;
          }
          calendar.push(objectTime);
        }
        return calendar || [];
      }
      case 'timeGridWeek': {
        const calendar = [];
        const startDate = moment(search.fromDate).startOf('month').startOf('week');
        const startTime = moment(startDate).add(7, 'hours').add(30, 'minutes');
        const totalTime = reduce(data, (total, item) => total + item.timeLearn, 0);
        const endTime = moment(startTime).add(totalTime, 'minutes');
        const generateData = reduce(
          data,
          (arr, item) => {
            if (item.timeLearn <= 30) {
              arr.push(item);
            } else {
              const numberLoops = item.timeLearn / 30;
              let idx = 0;
              while (idx < Math.ceil(numberLoops)) {
                if (idx === 0) {
                  arr.push({
                    ...item,
                    timeLearn:
                      Math.ceil(numberLoops) !== Math.floor(numberLoops)
                        ? item.timeLearn - Math.floor(numberLoops) * 30
                        : 30,
                  });
                } else {
                  arr.push({ ...item, timeLearn: 30 });
                }
                idx += 1;
              }
            }
            return arr;
          },
          [],
        );

        let j = 1;
        while (startTime.isBefore(endTime, 'minutes')) {
          const obj = Object.create({});
          let i = 0;
          if (j === 1) {
            while (i < 8) {
              if (i < 1) {
                obj.time = '';
              } else {
                obj[dayName[i - 1]] = '';
              }
              i += 1;
            }
          } else {
            while (i < 8) {
              if (i === 0) {
                obj.timeStart = startTime
                  .add(generateData[j - 3] ? generateData[j - 3].timeLearn : 0, 'minutes')
                  .clone();
              } else if (i > 0 && i < 6) {
                obj[dayName[i - 1]] = generateData[j - 2];
              } else {
                obj[dayName[i - 1]] = '';
              }
              i += 1;
            }
          }
          obj.id = `${Math.floor(Math.random() * 100000 * i)}`;
          calendar.push(obj);
          j += 1;
        }
        return calendar;
      }
      case 'timeGridDay': {
        const timeStart = moment(search.fromDate).add(7, 'hours').add(30, 'minutes');
        const arrTimeTable = reduce(
          data,
          (arr, item) => {
            const obj = Object.create({});
            obj.times = {
              timeStart: timeStart.add(0, 'minutes').clone(),
              timeEnd: timeStart.add(item.timeLearn, 'minutes').clone(),
            };
            obj.content = { ...item };
            obj.id = `${Math.floor(Math.random() * 100000)}`;
            arr.push(obj);
            return arr;
          },
          [],
        );
        return arrTimeTable;
      }
      case 'listDay': {
        const timeStart = moment(search.fromDate).add(7, 'hours').add(30, 'minutes');
        const arrTimeTable = reduce(
          data,
          (arr, item) => {
            arr.push({
              timeStart: timeStart.add(0, 'minutes').clone(),
              timeEnd: timeStart.add(item.timeLearn, 'minutes').clone(),
              id: `${Math.floor(Math.random() * 100000)}`,
              ...item,
            });
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
            key: 'monday',
            dataIndex: 'monday',
            className: 'min-width-100',
            render: (value) => (
              <CardMonth
                date={value.date}
                month={value.month}
                data={value.data}
                onClick={() => {}}
              />
            ),
          },
          {
            title: 'Thứ ba',
            key: 'tuesday',
            dataIndex: 'tuesday',
            className: 'min-width-100',
            render: (value) => (
              <CardMonth
                date={value.date}
                month={value.month}
                data={value.data}
                onClick={() => {}}
              />
            ),
          },
          {
            title: 'Thứ tư',
            key: 'wednesday',
            dataIndex: 'wednesday',
            className: 'min-width-100',
            render: (value) => (
              <CardMonth
                date={value.date}
                month={value.month}
                data={value.data}
                onClick={() => {}}
              />
            ),
          },
          {
            title: 'Thứ năm',
            key: 'thursday',
            dataIndex: 'thursday',
            className: 'min-width-100',
            render: (value) => (
              <CardMonth
                date={value.date}
                month={value.month}
                data={value.data}
                onClick={() => {}}
              />
            ),
          },
          {
            title: 'Thứ sáu',
            key: 'friday',
            dataIndex: 'friday',
            className: 'min-width-100',
            render: (value) => (
              <CardMonth
                date={value.date}
                month={value.month}
                data={value.data}
                onClick={() => {}}
              />
            ),
          },
          {
            title: 'Thứ bảy',
            key: 'saturday',
            dataIndex: 'saturday',
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
            key: 'sunday',
            dataIndex: 'sunday',
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
              render: (value) => (value ? <CardTime value={value} /> : ''),
            },
            {
              title: (
                <CardWeek
                  titleDate="Thứ hai"
                  date={moment(arrDate[0]).format(variables.DATE_FORMAT.DATE_MONTH)}
                />
              ),
              key: 'monday',
              dataIndex: 'monday',
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
              key: 'tuesday',
              dataIndex: 'tuesday',
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
              key: 'wednesday',
              dataIndex: 'wednesday',
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
              key: 'thursday',
              dataIndex: 'thursday',
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
              key: 'friday',
              dataIndex: 'friday',
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
              key: 'saturday',
              dataIndex: 'saturday',
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
              key: 'sunday',
              dataIndex: 'sunday',
              width: 100,
              className: classnames('min-width-100', styles.calendar),
              render: () => {},
            },
            {
              title: (
                <Button
                  icon={
                    showColumn ? (
                      <DoubleRightOutlined />
                    ) : (
                      <DoubleLeftOutlined />
                    )
                  }
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
            render: (value) => <CardDate content={value} onClick={() => {}} />,
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
    !isEmpty(data) && (
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
                onClick={remove}
              >
                Xóa
              </ButtonCustom>
              <ButtonCustom
                key="edit"
                color="success"
                icon="edit"
                ghost
                onClick={() => redirectDetails(pathname, 'chi-tiet')}
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
                {Helper.getDate(state.details.startDate, variables.DATE_FORMAT.DATE_TIME)} -{' '}
                {Helper.getDate(state.details.endDate, variables.DATE_FORMAT.HOUR)}
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
              <div className={classnames("d-flex align-items-end", styles['title-time-table'])}>
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
            <>{search.type === 'timeGridWeek' && tableWeek()}</>
            <>
              {search.type === 'dayGridMonth' && (
                <Table
                  bordered
                  columns={header(search.type)}
                  dataSource={renderCalendar(search.type, data)}
                  pagination={false}
                  params={{
                    header: header(search.type),
                    type: 'table',
                  }}
                  rowKey={(record) => record.id}
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
                  pagination={false}
                  params={{
                    header: header(search.type),
                    type: 'table',
                  }}
                  rowKey={(record) => record.id}
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
    )
  );
});

export default Index;
