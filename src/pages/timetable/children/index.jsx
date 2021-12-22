import FormItem from '@/components/CommonComponent/FormItem';
import ButtonCustom from '@/components/CommonComponent/Button';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import classnames from 'classnames';
import moment from 'moment';
import { debounce } from 'lodash';
import { useRef, useState, memo, useEffect } from 'react';
import styles from '@/assets/styles/Common/common.scss';
import Table from '@/components/CommonComponent/Table';
import CardTime from '@/components/CommonComponent/CardCalendar/CardTime';
import CardDate from '@/components/CommonComponent/CardCalendar/CardDate';
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
    { branches, classes },
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

  const [showColumn, setShowColumn] = useState({
    'col-td-1': true,
    'col-td-2': true,
    'col-td-3': true,
    'col-td-4': true,
    'col-td-5': true,
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

  const Collapse = (position) => {
    setShowColumn((prev) => ({ ...prev, [`col-td-${position}`]: !prev[`col-td-${position}`] }));
  };

  const renderCalendar = (type) => {
    switch (type) {
      case 'dayGridMonth': {
        const calendar = [];
        const startDay = moment(search.fromDate).startOf('week');
        const endDay = moment(search.toDate).endOf('week');

        const day = startDay.subtract(1, 'day');
        while (day.isBefore(endDay, 'day')) {
          let i = 0;
          const objectTime = {};
          while (i < 7) {
            switch (i) {
              case 0:
                objectTime.monday = day.add(1, 'day').clone();
                objectTime.id = Math.floor(Math.random() * 100000 * i);
                break;
              case 1:
                objectTime.tuesday = day.add(1, 'day').clone();
                objectTime.id = Math.floor(Math.random() * 100000 * i);
                break;
              case 2:
                objectTime.wednesday = day.add(1, 'day').clone();
                objectTime.id = Math.floor(Math.random() * 100000 * i);
                break;
              case 3:
                objectTime.thursday = day.add(1, 'day').clone();
                objectTime.id = Math.floor(Math.random() * 100000 * i);
                break;
              case 4:
                objectTime.friday = day.add(1, 'day').clone();
                objectTime.id = Math.floor(Math.random() * 100000 * i);
                break;
              case 5:
                objectTime.saturday = day.add(1, 'day').clone();
                objectTime.id = Math.floor(Math.random() * 100000 * i);
                break;
              case 6:
                objectTime.sunday = day.add(1, 'day').clone();
                objectTime.id = Math.floor(Math.random() * 100000 * i);
                break;

              default:
                break;
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
        // const endDate = moment(search.toDate).endOf('month').endOf('week').weekday();
        const startTime = moment(startDate).add(6, 'hours');
        const endTime = moment(startDate).add(17, 'hours').add(30, 'minutes');
        // console.log(moment.duration(endTime, 'HH:mm').subtract(moment.duration(startTime, 'HH:mm')).minutes());

        let j = 1;
        while (startTime.isBefore(endTime, 'minutes')) {
          const obj = {};
          let i = 0;
          if (j === 1) {
            while (i < 8) {
              switch (i) {
                case 0:
                  obj.time = '';
                  break;
                case 1:
                  obj.monday = ' ';
                  break;
                case 2:
                  obj.tuesday = ' ';
                  break;
                case 3:
                  obj.wednesday = ' ';
                  break;
                case 4:
                  obj.thursday = ' ';
                  break;
                case 5:
                  obj.friday = ' ';
                  break;
                case 6:
                  obj.saturday = ' ';
                  break;
                case 7:
                  obj.sunday = ' ';
                  break;

                default:
                  break;
              }
              i += 1;
            }
          } else {
            let i = 0;
            while (i < 8) {
              switch (i) {
                case 0:
                  obj.time = startTime.add(30, 'minutes').clone();
                  break;
                case 1:
                  obj.monday = {
                    title: `Hoạt động ${j - 1}`,
                    key: `HoatDong${j - 1}`,
                  };
                  break;
                case 2:
                  obj.tuesday = {
                    title: `Hoạt động ${j - 1}`,
                    key: `HoatDong${j - 1}`,
                  };
                  break;
                case 3:
                  obj.wednesday = {
                    title: `Hoạt động ${j - 1}`,
                    key: `HoatDong${j - 1}`,
                  };
                  break;
                case 4:
                  obj.thursday = {
                    title: `Hoạt động ${j - 1}`,
                    key: `HoatDong${j - 1}`,
                  };
                  break;
                case 5:
                  obj.friday = {
                    title: `Hoạt động ${j - 1}`,
                    key: `HoatDong${j - 1}`,
                  };
                  break;
                case 6:
                  obj.saturday = {
                    title: `Hoạt động ${j - 1}`,
                    key: `HoatDong${j - 1}`,
                  };
                  break;
                case 7:
                  obj.sunday = {
                    title: `Hoạt động ${j - 1}`,
                    key: `HoatDong${j - 1}`,
                  };
                  break;

                default:
                  break;
              }
              i += 1;
            }
          }
          calendar.push(obj);
          j += 1;
        }

        return calendar || [];
      }
      case 'timeGridDay': {
        // console.log(moment(search.fromDate).format('d'));
        return [];
      }
      case 'listDay': {
        // console.log(moment(search.fromDate).format('d'));
        return [];
      }

      default:
        return [];
    }
  };

  const header = (type, arrDate = [], position = 0) => {
    switch (type) {
      case 'dayGridMonth':
        return [
          {
            title: 'Thứ hai',
            key: 'monday',
            dataIndex: 'monday',
            className: 'min-width-100',
            render: (value) => Helper.getDate(value, variables.DATE_FORMAT.ONLY_DATE),
          },
          {
            title: 'Thứ ba',
            key: 'tuesday',
            dataIndex: 'tuesday',
            className: 'min-width-100',
            render: (value) => Helper.getDate(value, variables.DATE_FORMAT.ONLY_DATE),
          },
          {
            title: 'Thứ tư',
            key: 'wednesday',
            dataIndex: 'wednesday',
            className: 'min-width-100',
            render: (value) => Helper.getDate(value, variables.DATE_FORMAT.ONLY_DATE),
          },
          {
            title: 'Thứ năm',
            key: 'thursday',
            dataIndex: 'thursday',
            className: 'min-width-100',
            render: (value) => Helper.getDate(value, variables.DATE_FORMAT.ONLY_DATE),
          },
          {
            title: 'Thứ sáu',
            key: 'friday',
            dataIndex: 'friday',
            className: 'min-width-100',
            render: (value) => Helper.getDate(value, variables.DATE_FORMAT.ONLY_DATE),
          },
          {
            title: 'Thứ bảy',
            key: 'saturday',
            dataIndex: 'saturday',
            className: 'min-width-100',
            render: (value) => Helper.getDate(value, variables.DATE_FORMAT.ONLY_DATE),
          },
          {
            title: 'Chủ nhật',
            key: 'sunday',
            dataIndex: 'sunday',
            className: 'min-width-100',
            render: (value) => Helper.getDate(value, variables.DATE_FORMAT.ONLY_DATE),
          },
        ];
      case 'timeGridWeek':
        if (arrDate.length > 0) {
          const arrHeader = [
            {
              title: '',
              key: 'time',
              dataIndex: 'time',
              width: 50,
              className: classnames(styles['td-time'], 'min-width-50'),
              render: (value) => (value ? <CardTime title={moment(value).format('HH:mm')} /> : ''),
            },
            {
              title: <CardDate titleDate="Thứ hai" date={moment(arrDate[0]).format('DD-MM')} />,
              key: 'monday',
              dataIndex: 'monday',
              width: 100,
              className: classnames('min-width-100', styles.calendar),
              render: () => {},
            },
            {
              title: <CardDate titleDate="Thứ ba" date={moment(arrDate[1]).format('DD-MM')} />,
              key: 'tuesday',
              dataIndex: 'tuesday',
              width: 100,
              className: classnames('min-width-100', styles.calendar),
              render: () => {},
            },
            {
              title: <CardDate titleDate="Thứ tư" date={moment(arrDate[2]).format('DD-MM')} />,
              key: 'wednesday',
              dataIndex: 'wednesday',
              width: 100,
              className: classnames('min-width-100', styles.calendar),
              render: () => {},
            },
            {
              title: <CardDate titleDate="Thứ năm" date={moment(arrDate[3]).format('DD-MM')} />,
              key: 'thursday',
              dataIndex: 'thursday',
              width: 100,
              className: classnames('min-width-100', styles.calendar),
              render: () => {},
            },
            {
              title: <CardDate titleDate="Thứ sáu" date={moment(arrDate[4]).format('DD-MM')} />,
              key: 'friday',
              dataIndex: 'friday',
              width: 100,
              className: classnames('min-width-100', styles.calendar),
              render: () => {},
            },
            {
              title: <CardDate titleDate="Thứ bảy" date={moment(arrDate[5]).format('DD-MM')} />,
              key: 'saturday',
              dataIndex: 'saturday',
              width: 100,
              className: classnames('min-width-100', styles.calendar),
              render: () => {},
            },
            {
              title: <CardDate titleDate="Chủ nhật" date={moment(arrDate[6]).format('DD-MM')} />,
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
                    showColumn[`col-td-${position}`] ? (
                      <DoubleRightOutlined />
                    ) : (
                      <DoubleLeftOutlined />
                    )
                  }
                  onClick={() => Collapse(position)}
                />
              ),
              key: 'acction',
              dataIndex: 'acction',
              width: 40,
              className: 'max-width-40',
              render: () => {},
            },
          ];
          if (!showColumn[`col-td-${position}`]) {
            return arrHeader.filter((item, idx) => idx !== 6 && idx !== 7 && item);
          }
          return arrHeader;
        }
        return [];
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
      const arrTable = [];
      let i = 0;
      while (startWeek.isBefore(search.toDate)) {
        i += 1;
        const arrDate = Array(7)
          .fill(0)
          .map(() => startWeek.add(1, 'day').clone());

        arrTable.push(
          <div className="mb-5">
            <Table
              bordered
              columns={header(search.type, arrDate, showColumn[`col-td-${i}`], i)}
              dataSource={renderCalendar(search.type)}
              pagination={false}
              params={{
                header: header(search.type),
                type: 'table',
              }}
              rowKey="uid"
              scroll={{ x: '100%' }}
            />
          </div>,
        );
      }
      return arrTable;
    }
    return [];
  };

  const titleDateTable = (type) => {
    if (type === 'dayGridMonth' || type === 'timeGridWeek') {
      return moment(search.fromDate).format('[Tháng] MM [năm] YYYY');
    }
    return moment(search.fromDate).format('[Ngày] DD [tháng] MM [năm] YYYY');
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
                  icon={<LeftOutlined />}
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
                />
                <Button
                  icon={<RightOutlined />}
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
                />
              </div>
              <ButtonCustom permission="TKB" color="white" className="ml-2">
                Hôm nay
              </ButtonCustom>
            </div>
            <div className="d-flex align-items-center">
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
                    moment().startOf('month'),
                    moment().endOf('month'),
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
          {search.type === 'timeGridWeek' ? (
            tableWeek().map((item) => item)
          ) : (
            <Table
              bordered
              columns={header(search.type)}
              dataSource={renderCalendar(search.type)}
              pagination={false}
              params={{
                header: header(search.type),
                type: 'table',
              }}
              rowKey={(record) => record.id}
              scroll={{ x: '100%' }}
            />
          )}
        </div>
      </div>
    </>
  );
});

export default Index;
