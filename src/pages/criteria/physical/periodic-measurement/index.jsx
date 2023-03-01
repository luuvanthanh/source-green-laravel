import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'umi';
import { Form, Tabs } from 'antd';
import classnames from 'classnames';
import { debounce, head, size, isEmpty, get } from 'lodash';

import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import { useDispatch, useSelector } from 'dva';
import variablesModules from './utils/variables';
import stylesModule from './styles.module.scss';

const Index = () => {
  const [formRef] = Form.useForm();
  const { query, pathname } = useLocation();
  const dispatch = useDispatch();

  const { TabPane } = Tabs;

  const [
    { pagination, years, branches, classes, period },
    loading,
    { user, defaultBranch }
  ] = useSelector(({ physicalPeriodicMeasurement, loading: { effects }, user }) => [physicalPeriodicMeasurement, effects, user]);

  const history = useHistory();
  const [search, setSearch] = useState({
    keyWord: query?.keyWord,
    branchId: query?.branchId || defaultBranch?.id,
    classId: query?.classId || user?.roleCode === variables?.LIST_ROLE_CODE?.TEACHER && head(user?.objectInfo?.classTeachers)?.classId,
    schoolYearId: query?.schoolYearId || user?.schoolYear?.id,
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    status: query?.status || head(variablesModules.STATUS_TABS)?.id,
    assessmentPeriodId: query?.assessmentPeriodId
  });

  const [checkLoad, setCheckLoad] = useState(true);
  const [dataTotalHeader, setDataTotalHeader] = useState(undefined);
  const [data, setData] = useState([]);
  const [defaultBranchs] = useState(defaultBranch?.id ? [defaultBranch] : []);


  const loadingData = loading[`physicalPeriodicMeasurement/GET_DATA`] || loading[`physicalPeriodicMeasurement/GET_DATA_APPROVED`];

  const onLoad = () => {
    const status = search?.status;
    if (status === variablesModules.STATUS?.NOT_MEASURED) {
      dispatch({
        type: 'physicalPeriodicMeasurement/GET_DATA',
        payload: {
          ...search,
          hasApproved: 'false',
          hasSent: 'false',
        },
        callback: (response, err) => {
          if (response?.items) {
            dispatch({
              type: 'physicalPeriodicMeasurement/GET_TOTAL_DATA',
              payload: {
                ...search,
                hasApproved: 'false',
                hasSent: 'false',
              },
              callback: (response) => {
                if (response) {
                  setDataTotalHeader(response);
                }
              }
            });
            setData(response?.items?.map(item => ({
              ...item,
              nameAssessmentPeriod: period?.find(i => search?.assessmentPeriodId === i?.id)?.nameAssessmentPeriod?.name,
              assessmentPeriodId: period?.find(i => search?.assessmentPeriodId === i?.id)?.id,
            })
            ));
          } if (err) {
            setData([]);
            setDataTotalHeader({});
          }
        },
      });
    }
    else {
      dispatch({
        type: 'physicalPeriodicMeasurement/GET_DATA_APPROVED',
        payload: {
          ...search,
          status: variablesModules.STATUS_SEARCH?.[status],
          hasApproved: status === variablesModules.STATUS?.MEASURED ? 'true' : 'false',
          hasSent: status === variablesModules.STATUS?.APPROVED || status === variablesModules.STATUS?.MEASURED ? 'true' : 'false',
        },
        callback: (response, err) => {
          if (response.items) {
            dispatch({
              type: 'physicalPeriodicMeasurement/GET_TOTAL_DATA',
              payload: {
                ...search,
                status: variablesModules.STATUS_SEARCH?.[status],
                hasApproved: status === variablesModules.STATUS?.MEASURED ? 'true' : 'false',
                hasSent: status === variablesModules.STATUS?.APPROVED || status === variablesModules.STATUS?.MEASURED ? 'true' : 'false',
              },
              callback: (response) => {
                if (response) {
                  setDataTotalHeader(response);
                }
              }
            });
            setData(response?.items?.map(item => ({
              ...item,
              nameAssessmentPeriod: period?.find(i => search?.assessmentPeriodId === i?.id)?.nameAssessmentPeriod?.name,
            })
            ));
          } if (err) {
            setData([]);
            setDataTotalHeader({});
          }
        },
      });
    }
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
      }),
    });
  };

  const addItem = (type, id) => {
    dispatch({
      type: search?.status === variablesModules.STATUS.NOT_APPROVED ? 'physicalPeriodicMeasurement/APPROVE' : 'physicalPeriodicMeasurement/SEND',
      payload: type === 'one' ? [id] : data?.filter((item) => item.isActive)?.map(i => i?.id),
      callback: (response, error) => {
        if (response) {
          onLoad();
        }
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              formRef.current.setFields([
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
  const addAll = () => {
    dispatch({
      type: search?.status === variablesModules.STATUS.NOT_APPROVED ? 'physicalPeriodicMeasurement/APPROVE' : 'physicalPeriodicMeasurement/SEND',
      payload: { isAll: true },
      callback: (response, error) => {
        if (response) {
          onLoad();
        }
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              formRef.current.setFields([
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

  useEffect(() => {
    dispatch({
      type: 'physicalPeriodicMeasurement/GET_YEARS',
      payload: {},
    });
    if (query?.branchId && query?.classId && query?.schoolYearId) {
      dispatch({
        type: 'physicalPeriodicMeasurement/GET_PERIOD',
        payload: {
          branchId: query?.branchId,
          classId: query?.classId,
          schoolYearId: query?.schoolYearId,
        },
      });
    }
    if (query?.branchId && query?.classId && query?.schoolYearI && query?.assessmentPeriodId) {
      onLoad();
    }
    dispatch({
      type: 'physicalPeriodicMeasurement/GET_BRANCHES',
      payload: {},
      callback: (response) => {
        if (query?.classId && response) {
          dispatch({
            type: 'physicalPeriodicMeasurement/GET_CLASSES',
            payload: {
              branch: query?.branchId,
            },
          });
        }
      }
    });
    if (defaultBranch?.id) {
      dispatch({
        type: 'physicalPeriodicMeasurement/GET_CLASSES',
        payload: {
          branch: defaultBranch?.id,
        },
      });
    }
  }, []);
  useEffect(() => {
    if (search?.branchId && search?.classId && search?.assessmentPeriodId && checkLoad) {
      onLoad();
    }
  }, [search]);

  const debouncedSearch = debounce((value, type) => {
    setSearch({
      ...search,
      [`${type}`]: value,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    });
  }, 300);

  const debouncedSearchStatus = debounce((value, type) => {
    setSearch({
      ...search,
      [`${type}`]: value,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    });
  }, 300);

  const onChange = (e, type) => {
    debouncedSearch(e.target.value, type);
    setCheckLoad(false);
  };

  const onChangeSelectBranch = (e, type) => {
    setCheckLoad(false);
    dispatch({
      type: 'physicalPeriodicMeasurement/GET_CLASSES',
      payload: {
        branch: e,
      },
    });
    setSearch({
      ...search,
      [type]: e,
      classId: undefined,
    });
    formRef.setFieldsValue({ classId: undefined });
  };

  const onChangeSelect = (e, type) => {
    setCheckLoad(false);
    if (type === 'schoolYearId') {
      setSearch({
        ...search,
        from: moment(data?.startDate).format(variables.DATE_FORMAT.DATE_AFTER),
        to: moment(data?.endDate).format(variables.DATE_FORMAT.DATE_AFTER),
      });
      formRef.setFieldsValue({ date: [moment(data?.startDate), moment(data?.endDate)], isset_history_care: undefined });
    }
    if (type === "classId") {
      debouncedSearch(e, type);
      if (search?.branchId && search?.schoolYearId) {
        dispatch({
          type: 'physicalPeriodicMeasurement/GET_PERIOD',
          payload: {
            branchId: search?.branchId,
            classId: e,
            schoolYearId: search?.schoolYearId,
          },
        });
      }
      formRef.setFieldsValue({ assessmentPeriodId: undefined });
    }
    debouncedSearch(e, type);
  };

  const changePagination = ({ page, limit }) => {
    setSearch((prev) => ({
      ...prev,
      page,
      limit,
    }));
  };

  const onChangeSearch = () => {
    onLoad();
    setCheckLoad(true);
  };

  const onChangeSelectStatus = (e, type) => {
    if (search?.schoolYearId && search?.assessmentPeriodId && search?.branchId && search?.classId && !loadingData) {
      debouncedSearchStatus(e, type);
    }
  };


  const paginationFunction = (pagination) =>
    Helper.paginationNet({
      pagination,
      query,
      callback: (response) => {
        changePagination(response);
      },
    });;


  const onFormEdit = (record) => {
    if (search?.status === variablesModules.STATUS.NOT_MEASURED) {
      return (
        <Button
          icon="edit"
          className={stylesModule.edit}
          onClick={(e) => { e.stopPropagation(); history.push(`${pathname}/${record?.student?.id}/add?assessmentPeriodId=${search?.assessmentPeriodId}&classId=${record?.class?.id}&schoolYearId=${search?.schoolYearId}&type=add`); }}
        />
      );
    }
    if (search?.status === variablesModules.STATUS.NOT_APPROVED) {
      return (
        <Button
          icon="edit"
          className={stylesModule.edit}
          onClick={(e) => { e.stopPropagation(); history.push(`${pathname}/${record?.id}/confirmed?assessmentPeriodId=${search?.assessmentPeriodId}&classId=${record?.class?.id}&schoolYearId=${search?.schoolYearId}`); }}
        />
      );
    }
    if (search?.status === variablesModules.STATUS.NOT_SEND) {
      return (
        <Button
          icon="edit"
          className={stylesModule.edit}
          onClick={(e) => { e.stopPropagation(); history.push(`${pathname}/${record?.id}/detail?type=not-send`); }}
        />
      );
    }
    return "";
  };

  const onFormSent = (record) => {
    const dataActive = data?.filter((item) => item.isActive);
    if (loading['EnglishMonthlyReport/ADD_SENT'] && (dataActive?.find(i => record?.id === i.id))) {
      return <div className={stylesModule['lds-ring']}><div /><div /><div /><div /></div>;
    }
    if (
      search?.status === variablesModules.STATUS.NOT_APPROVED
      //  && ability.can('WEB_TIENGANH_DANHGIATHANG_CHUADUYET_APPROVE', 'WEB_TIENGANH_DANHGIATHANG_CHUADUYET_APPROVE')
    ) {
      return (
        <Button
          icon="checkmark"
          onClick={(e) => { e.stopPropagation(); addItem('one', record?.id); }}
          className={stylesModule.check}
        />
      );
    }
    if (
      search?.status === variablesModules.STATUS.NOT_SEND
      // && ability.can('WEB_TIENGANH_DANHGIATHANG_CHUAGUI_APPROVE', 'WEB_TIENGANH_DANHGIATHANG_CHUAGUI_APPROVE')
    ) {
      return (
        <Button
          icon="checkmark"
          onClick={(e) => { e.stopPropagation(); addItem('one', record?.id); }}
          className={stylesModule.check}
        />
      );
    }
    return "";

  };

  const titleTime = () => {
    if (search?.status === variablesModules.STATUS.MEASURED || search?.status === variablesModules.STATUS.NOT_APPROVED) {
      return "Thời gian đo lường";
    }
    if (search?.status === variablesModules.STATUS.SEND) {
      return "Thời gian gửi";
    }
    return "Thời gian duyệt";
  };

  const reportTime = (value) => {
    if (search?.status === variablesModules.STATUS.MEASURED || search?.status === variablesModules.STATUS.NOT_APPROVED) {
      return Helper.getDate(value?.creationTime, variables.DATE_FORMAT.DATE_TIME);
    }
    if (search?.status === variablesModules.STATUS.APPROVED || search?.status === variablesModules.STATUS.NOT_SEND) {
      return Helper.getDate(value?.approvedDate, variables.DATE_FORMAT.DATE_TIME);
    }
    if (search?.status === variablesModules.STATUS.SEND) {
      return Helper.getDate(value?.sentDate, variables.DATE_FORMAT.DATE_TIME);
    }
    return "";
  };


  const header = () => {
    const columns = [
      ...(search?.status === "NOT_MEASURED" ?
        [{
          title: 'STT',
          key: 'text',
          width: 60,
          align: 'center',
          render: (text, record, index) =>
            Helper.serialOrder(search?.page, index, search?.limit),
        },] : []),
      ...(search?.status !== "NOT_MEASURED" ?
        [{
          title: titleTime(),
          key: 'text',
          width: 150,
          render: (record) => reportTime(record),
        },] : []),
      {
        title: 'Cơ sở',
        key: 'email',
        width: 200,
        className: 'min-width-200',
        render: (record) => search?.status === "NOT_MEASURED" ? record?.branch?.name : record?.student?.branch?.name,
      },
      {
        title: 'Lớp',
        key: 'Class',
        width: 200,
        className: 'min-width-200',
        render: (record) => record?.class?.name,
      },
      {
        title: 'Học sinh',
        key: 'class',
        className: 'min-width-150',
        width: 200,
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record?.student.fileImage)}
            fullName={record?.student?.fullName}
          />
        ),
      },
      ...(search?.status !== "NOT_MEASURED" ?
        [{
          title: 'Kì đo lường',
          key: 'Assessment',
          className: 'min-width-200',
          width: 200,
          render: (record) => record?.nameAssessmentPeriod,
        },] : []),
      {
        key: 'action',
        className: 'min-width-100',
        width: 100,
        fixed: 'right',
        render: (record) => (
          <div className={stylesModule['wraper-container-monthlyComment']}>
            <div className={stylesModule['list-button']} >
              {onFormEdit(record)}
              {onFormSent(record)}
            </div>
          </div>
        ),
      },
    ];
    return columns;
  };

  const formBtnHeader = () => {
    if (
      (search?.status === variablesModules.STATUS.NOT_APPROVED) ||
      (search?.status === variablesModules.STATUS.NOT_SEND)) {

      return <div className='d-flex'>
        <Button
          disabled={!size(data?.filter((item) => item.isActive))}
          color="primary"
          icon="redo2"
          className="ml-2"
          onClick={() => addItem('much')}
          loading={loading['physicalPeriodicMeasurement/CONFIRMED_ITEM'] || loading['physicalPeriodicMeasurement/ADD_SENT_ALL'] || loading['physicalPeriodicMeasurement/ADD_CONFIRM']}
        // permission={"WEB_TIENGANH_DANHGIATHANG_CHUADUYET_APPROVE" || "WEB_TIENGANH_DANHGIATHANG_CHUAGUI_APPROVE"}
        >
          {search?.status === variablesModules.STATUS.NOT_APPROVED ? "Duyệt đo lường đã chọn" : "Gửi đo lường đã chọn"}
        </Button>
        <Button
          color="success"
          icon="redo2"
          className="ml-2"
          disabled={!data?.length > 0}
          loading={loading['physicalPeriodicMeasurement/ADD_CONFIRMED_ALL'] || loading['physicalPeriodicMeasurement/ADD_SENT_ALL'] || loading['EnglishMonthlyReport/ADD_CONFIRM']}
          onClick={() => addAll()}
        // permission={"WEB_TIENGANH_DANHGIATHANG_CHUADUYET_APPROVE" || "WEB_TIENGANH_DANHGIATHANG_CHUAGUI_APPROVE"}
        >
          {search?.status === variablesModules.STATUS.NOT_SEND ? "Gửi tất cả" : "Duyệt tất cả"}
        </Button>
      </div>;
    }
    return "";
  };

  const onSelectChange = (e) => {
    setData(data?.map((item) => ({
      ...item,
      isActive: !!e.includes(item.id),
    })));
  };

  const rowSelection = {
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled: record.status === 'MOVE',
      name: record.status,
    }),
  };

  return (
    <>
      <Helmet title="Đo lường định kỳ" />
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
          <Text color="dark" className={styles['title-header']}>
            Đo lường định kỳ
          </Text>
          {
            formBtnHeader()
          }
        </div>
        <div className={styles['block-table']}>
          <Form
            initialValues={{
              ...search,
              date: search.from && search.to && [moment(search.from), moment(search.to)],
              branchId: search.branchId || null,
              classId: search.classId || null,
              month: search.month && moment(search.month) || null,
            }}
            layout="vertical"
            form={formRef}
          >
            <div className="row">
              <div className="col-lg-3">
                <FormItem
                  data={[...years]}
                  name="schoolYearId"
                  onChange={(event) => onChangeSelect(event, 'schoolYearId')}
                  type={variables.SELECT}
                  placeholder="Chọn năm học"
                  allowClear={false}
                />
              </div>
              {!defaultBranch?.id && (
                <div className="col-lg-3">
                  <FormItem
                    data={[...branches]}
                    name="branchId"
                    placeholder="Chọn cơ sở"
                    onChange={(event) => onChangeSelectBranch(event, 'branchId')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
              )}
              {defaultBranch?.id && (
                <div className="col-lg-3">
                  <FormItem
                    data={defaultBranchs}
                    name="branchId"
                    placeholder="Chọn cơ sở"
                    onChange={(event) => onChangeSelectBranch(event, 'branchId')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
              )}
              <div className="col-lg-3">
                <FormItem
                  data={classes}
                  name="classId"
                  onChange={(event) => onChangeSelect(event, 'classId')}
                  type={variables.SELECT}
                  placeholder="Chọn lớp"
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={period}
                  name="assessmentPeriodId"
                  onChange={(event) => onChangeSelect(event, 'assessmentPeriodId')}
                  type={variables.SELECT}
                  placeholder="Chọn kỳ"
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  name="keyWord"
                  onChange={(event) => onChange(event, 'keyWord')}
                  type={variables.INPUT_SEARCH}
                  placeholder="Nhập Tên học sinh để tìm kiếm"
                />
              </div>
              <div className='col-lg-3'>
                {
                  search?.schoolYearId && search?.assessmentPeriodId && search?.branchId && search?.classId ?
                    <Button color="success" icon="report" onClick={onChangeSearch}>
                      Tải dữ liệu
                    </Button>
                    :
                    <Button color="success" icon="report" disabled >
                      Tải dữ liệu
                    </Button>
                }
              </div>
            </div>
            <Tabs
              activeKey={search?.status || head(variablesModules.STATUS_TABS)?.id}
              onChange={(event) => onChangeSelectStatus(event, 'status')}
            >
              {variablesModules.STATUS_TABS.map((item) => (
                <TabPane
                  tab={`${item.name} ${(!isEmpty(dataTotalHeader)) ?
                    `(${dataTotalHeader?.[variablesModules.STATUS_TABS.find(i => i?.id === item?.id)?.type]})` : ""}`}
                  key={item.id}
                />
              ))}
            </Tabs>
          </Form>
          <Table
            bordered={false}
            columns={header()}
            dataSource={data}
            loading={loading['physicalPeriodicMeasurement/GET_DATA'] || loading['physicalPeriodicMeasurement/GET_DATA_APPROVED']}
            pagination={paginationFunction(pagination)}
            defaultExpandAllRows
            rowSelection={
              search?.status === variablesModules.STATUS.NOT_APPROVED ||
                search?.status === variablesModules.STATUS.NOT_SEND ? { ...rowSelection } : null}
            childrenColumnName="children"
            params={{
              header: header(),
              type: 'table',
            }}
            onRow={(record) => ({
              onClick: () => {
                if (search.status === variablesModules.STATUS.MEASURED) {
                  history.push(`${pathname}/${record?.id}/detail?type=done-review`);
                }
                if (search.status === variablesModules.STATUS.APPROVED) {
                  history.push(`${pathname}/${record?.id}/detail?type=done-confirmed`);
                }
                if (search.status === variablesModules.STATUS.SEND) {
                  history.push(`${pathname}/${record?.id}/detail?type=done-send`);
                }
              },
            })}
            rowKey={(record) => record.id}
            scroll={{ x: '100%' }}
          />
        </div>
      </div>
    </>
  );
};

export default Index;
