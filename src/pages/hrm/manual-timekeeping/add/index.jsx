import styles from '@/assets/styles/Common/common.scss';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import { Helper, variables } from '@/utils';
import { Form, Tooltip, Select } from 'antd';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'dva';
import { debounce, get, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { history, useLocation, useParams } from 'umi';

const { Option } = Select;

const timekeepingType = [
  { id: 'X', name: 'X' },
  { id: 'K', name: 'K' },
  { id: 'F', name: 'F' },
];

const Index = () => {
  const [
    { error, holidays, branches },
    loading,
    { pagination, data, employees },
    { menuLeftHRM },
  ] = useSelector(({ works, loading: { effects }, manualTimekeepingAdd, menu }) => [
    works,
    effects,
    manualTimekeepingAdd,
    menu,
  ]);
  const [formRef] = Form.useForm();
  const { query, pathname } = useLocation();
  const { params } = useParams();
  const dispatch = useDispatch();

  const [search, setSearch] = useState({
    fullName: query?.fullName,
    branchId: query?.branchId,
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    endDate: query?.endDate ? moment(query?.endDate) : moment().startOf('month').add(24, 'days'),
    startDate: query?.startDate
      ? moment(query?.startDate)
      : moment().startOf('month').subtract(1, 'months').add(25, 'days'),
  });

  const loadCategories = () => {
    dispatch({
      type: 'works/GET_BRANCHES',
      payload: {},
    });
    dispatch({
      type: 'works/GET_DIVISIONS',
      payload: {},
    });
    dispatch({
      type: 'works/GET_EMPLOYEES',
      payload: {},
    });
    dispatch({
      type: 'manualTimekeepingAdd/GET_EMPLOYEES',
      payload: {
        unexpiredContract: true,
      },
    });
  };

  const loadHolidays = () => {
    dispatch({
      type: 'works/GET_HOLIDAYS',
      payload: {
        name: Helper.getDate(search.endDate, variables.DATE_FORMAT.YEAR),
      },
    });
  };

  const onLoad = () => {
    dispatch({
      type: 'manualTimekeepingAdd/GET_DATA',
      payload: {
        ...search,
        endDate: Helper.getDate(search.endDate, variables.DATE_FORMAT.DATE_AFTER),
        startDate: Helper.getDate(search.startDate, variables.DATE_FORMAT.DATE_AFTER),
        unexpiredContract: true,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
          endDate: Helper.getDate(search.endDate, variables.DATE_FORMAT.DATE_AFTER),
          startDate: Helper.getDate(search.startDate, variables.DATE_FORMAT.DATE_AFTER),
        },
        variables.QUERY_STRING,
      )}`,
    );
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    onLoad();
    loadHolidays();
  }, [search]);

  const debouncedSearch = debounce((value, type) => {
    setSearch((prev) => ({
      ...prev,
      [`${type}`]: value,
      forManualCalculation: true,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    }));
  }, 500);

  const debouncedSearchMonth = debounce((value) => {
    setSearch((prev) => ({
      ...prev,
      startDate: moment(value).startOf('month').subtract(1, 'months').add(25, 'days'),
      endDate: moment(value).startOf('month').add(24, 'days'),
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    }));
  }, 500);

  const debouncedSearchMultiple = debounce((value, type) => {
    setSearch((prev) => ({
      ...prev,
      [`${type}`]: value.map((i) => i).join(','),
      forManualCalculation: true,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    }));
  }, 500);

  const onChangeSelect = (e, type) => {
    debouncedSearch(e, type);
  };

  const onChangeMonth = (e) => {
    debouncedSearchMonth(e);
  };

  const onChangeSelectMultiple = (e, type) => {
    debouncedSearchMultiple(e, type);
  };

  const changePagination = ({ page, limit }) => {
    setSearch((prev) => ({
      ...prev,
      page,
      limit,
    }));
  };

  const paginationFunction = (pagination) =>
    Helper.paginationLavarel({
      pagination,
      callback: (response) => {
        changePagination(response);
      },
    });

  const renderTitleHeader = (index, item) => {
    if (index !== null && item) {
      return <div>{moment(item).format('DD')}</div>;
    }
    return null;
  };

  const updateManualTimekeeping = (time, record, e) => {
    const payload = {
      employeeId: record.id,
      date: moment(time).format('YYYY-MM-DD'),
      type: !isEmpty(e) ? e : 'N',
    };
    dispatch({
      type: 'manualTimekeepingAdd/ADD',
      payload,
      callback: (error) => {
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              formRef.setFields([
                {
                  name: get(item, 'source.pointer'),
                  errors: [get(item, 'detail')],
                },
              ]);
            });
          }
        }
      },
    });
  };

  const renderWorkShift = (
    dayOfWeek = Helper.getDate(moment(), variables.DATE_FORMAT.DATE_AFTER),
    user = {},
  ) => {
    const holiday = holidays.find(
      (item) =>
        Helper.getDate(item.date, variables.DATE_FORMAT.DATE_AFTER) ===
        Helper.getDate(dayOfWeek, variables.DATE_FORMAT.DATE_AFTER),
    );
    const manualUser = user.manualCalculation?.find(
      (i) =>
        moment(i.date).format(variables.DATE_FORMAT.DATE_AFTER) ===
        moment(dayOfWeek).format(variables.DATE_FORMAT.DATE_AFTER),
    );
    if (moment(dayOfWeek).isoWeekday() >= 6) {
      return (
        <div className={classnames(styles['item-schedules'], [styles[`cell-heading-weekend`]])}>
          -
        </div>
      );
    }
    if (user.dateOff && moment(user.dateOff).isBefore(moment(dayOfWeek))) {
      return (
        <div
          className={classnames(styles['item-schedules'], {
            [styles[`cell-heading-weekend`]]: moment(dayOfWeek).isoWeekday() >= 6,
            [styles[`cell-heading-holidays`]]: !!holiday,
            [styles[`cell-heading-dateoff`]]: true,
          })}
        >
          -
        </div>
      );
    }
    if (holiday) {
      return (
        <Tooltip
          title={
            <div className={styles['tooltip-container']}>
              <strong>Nghỉ lễ: </strong>
              <br />
              {holiday.name}
            </div>
          }
          color="#00B24D"
        >
          <>L</>
        </Tooltip>
      );
    }
    if (manualUser) {
      return (
        <Select
          defaultValue={manualUser.type}
          onChange={(e) => updateManualTimekeeping(dayOfWeek, user, e)}
          disabled={moment() < moment(dayOfWeek)}
          allowClear
        >
          {timekeepingType.map((item) => (
            <Option value={item.id} key={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      );
    }
    return (
      <Select
        onChange={(e) => updateManualTimekeeping(dayOfWeek, user, e)}
        disabled={moment() < moment(dayOfWeek)}
        allowClear
      >
        {timekeepingType.map((item) => (
          <Option value={item.id} key={item.id}>
            {item.name}
          </Option>
        ))}
      </Select>
    );
  };

  const header = () => {
    const arrayHeader = [
      {
        title: 'Nhân viên',
        key: 'fullName',
        className: 'min-width-200 col-fixed-200',
        width: 200,
        fixed: 'left',
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record.fileImage)}
            fullName={record.fullName}
          />
        ),
      },
      {
        title: 'Bộ phận',
        key: 'division',
        width: 120,
        fixed: 'left',
        className: classnames('max-width-120', 'min-width-120', 'col-fixed-120'),
        render: (record) => record?.positionLevelNow?.branch?.name,
      },
    ];

    const arrayMonth = Helper.treeDate(
      Helper.convertArrayDays(search.startDate, search.endDate),
    ).map((itemMonth) => ({
      title: Helper.getDate(itemMonth.month, variables.DATE_FORMAT.MONTH_NAME),
      key: itemMonth.month,
      width: 500,
      children: itemMonth.data.map((item, index) => ({
        title: renderTitleHeader(index, item),
        key: Helper.convertArrayDays(search.startDate, search.endDate)[index],
        className: classnames(
          'min-width-80',
          'max-width-80',
          'width-80',
          'pt-0',
          'pb-0',
          'pl-0',
          'pr-0',
        ),
        width: 80,
        align: 'center',
        render: (record) => renderWorkShift(item, record),
      })),
    }));
    return arrayHeader.concat(arrayMonth);
  };

  return (
    <>
      <Helmet title="Chấm công thủ công" />
      <div className={classnames(styles['content-form'], styles['content-form-works'])}>
        {/* FORM SEARCH */}
        <Breadcrumbs last="Chấm công" menu={menuLeftHRM} />
        <div className={classnames(styles['block-table'])}>
          <Form
            initialValues={{
              ...search,
              date: search.endDate && moment(search.endDate),
              divisionId: search.divisionId || null,
              branchId: search.branchId || null,
            }}
            layout="vertical"
            form={formRef}
          >
            <Text color="dark" size="large-medium">
              THÔNG TIN CHUNG
            </Text>
            <div className="row mt20">
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tất cả cơ sở' }, ...branches]}
                  name="branchId"
                  onChange={(event) => onChangeSelect(event, 'branchId')}
                  type={variables.SELECT}
                />
              </div>

              <div className="col-lg-3">
                <FormItem
                  name="date"
                  onChange={(event) => onChangeMonth(event, 'date')}
                  type={variables.MONTH_PICKER}
                  allowClear={false}
                />
              </div>

              <div className="col-lg-3">
                <FormItem
                  data={employees}
                  name="employeeId"
                  onChange={(event) => onChangeSelectMultiple(event, 'employeeId')}
                  type={variables.SELECT_MUTILPLE}
                />
              </div>
            </div>
          </Form>
          <Table
            bordered
            columns={header(params)}
            dataSource={data}
            loading={loading['manualTimekeepingAdd/GET_DATA']}
            error={error}
            isError={error.isError}
            className="table-work"
            pagination={paginationFunction(pagination)}
            params={{
              header: header(),
              type: 'table',
            }}
            rowKey={(record) => record.id}
            scroll={{ x: '100%', y: '60vh' }}
          />
        </div>
      </div>
    </>
  );
};

export default Index;
