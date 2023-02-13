import React, { useEffect, useState, useMemo } from 'react';
import { useHistory, useLocation } from 'umi';
import { Form, Tabs } from 'antd';
import classnames from 'classnames';
import { debounce, head } from 'lodash';

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
    key: query?.key,
    branchId: query?.branchId || defaultBranch?.id,
    classId: query?.classId || user?.roleCode === variables?.LIST_ROLE_CODE?.TEACHER && head(user?.objectInfo?.classTeachers)?.classId,
    schoolYearId: query?.schoolYearId || user?.schoolYear?.id,
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    status: query?.status || head(variablesModules.STATUS_TABS)?.id,
    assessmentPeriodId: query?.assessmentPeriodId
  });

  const [checkLoad, setCheckLoad] = useState(false);
  const [data, setData] = useState([]);
  const [defaultBranchs] = useState(defaultBranch?.id ? [defaultBranch] : []);


  const loadingData = loading[`physicalPeriodicMeasurement/GET_DATA`];

  const onLoad = () => {
    const status = search?.status;
    if (status === variablesModules.STATUS?.NOT_MEASURED) {
      dispatch({
        type: 'physicalPeriodicMeasurement/GET_DATA',
        payload: {
          ...search,
        },
        callback: (response, err) => {
          if (response) {
            setData(response?.items?.map(item => ({
              ...item,
              nameAssessmentPeriod: period?.find(i => search?.assessmentPeriodId === i?.id)?.nameAssessmentPeriod?.name,
              assessmentPeriodId: period?.find(i => search?.assessmentPeriodId === i?.id)?.id,
            })
            ));
          } if (err) {
            setData([]);
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
        },
        callback: (response, err) => {
          if (response) {
            setData(response?.items?.map(item => ({
              ...item,
              nameAssessmentPeriod: period?.find(i => search?.assessmentPeriodId === i?.id)?.nameAssessmentPeriod?.name,
            })
            ));
          } if (err) {
            setData([]);
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


  useEffect(() => {
    dispatch({
      type: 'physicalPeriodicMeasurement/GET_YEARS',
      payload: {},
    });
    if (query?.branchId && query?.classId && query?.schoolYearId) {
      dispatch({
        type: 'physicalPeriodicMeasurement/GET_PERIOD',
        payload: {
          // branchId: query?.branchId,
          // classId: query?.classId,
          // schoolYearId: query?.schoolYearId,
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
  }, []);

  useEffect(() => {
    if (search?.branchId && search?.classId && search?.assessmentPeriodId && checkLoad) {
      onLoad();
    }
  }, [search]);
  console.log("SEAR", search)
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
            // branchId: search?.branchId,
            // classId: e,
            // schoolYearId: search?.schoolYearId,
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


  const paginationFunction = useMemo(
    () =>
      Helper.paginationLavarel({
        pagination,
        callback: (response) => {
          changePagination(response);
        },
      }),
    [pagination],
  );

  const onFormEdit = (record) => {
    if (search?.status === variablesModules.STATUS.NOT_MEASURED) {
      return (
        <Button
          icon="edit"
          className={stylesModule.edit}
          onClick={(e) => { e.stopPropagation(); history.push(`${pathname}/${record?.student?.id}/add?assessmentPeriodId=${search?.assessmentPeriodId}&classId=${record?.class?.id}&schoolYearId=${search?.schoolYearId}`); }}
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
    return "";
  };

  const header = () => {
    const columns = [
      ...(search?.status === "NOT_MEASURED" ?
        [{
          title: 'NO',
          key: 'text',
          width: 60,
          align: 'center',
          render: (text, record, index) =>
            Helper.serialOrder(search?.page, index, search?.limit),
        },] : []),
      // ...(search?.status !== "NOT_REVIEW" ?
      //   [{
      //     title: this.titleTime(),
      //     key: 'text',
      //     width: 150,
      //     render: (record) => this.reportTime(record),
      //   },] : []),
      {
        title: 'Center',
        key: 'email',
        width: 200,
        className: 'min-width-200',
        render: (record) => record?.branch?.name,
      },
      {
        title: 'Class',
        key: 'Class',
        width: 200,
        className: 'min-width-200',
        render: (record) => record?.class?.name,
      },
      {
        title: 'Student',
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
      {
        title: 'Monthly comment',
        key: 'Assessment',
        className: 'min-width-200',
        width: 200,
        render: (record) => record?.nameAssessmentPeriod,
      },
      {
        key: 'action',
        className: 'min-width-100',
        width: 100,
        fixed: 'right',
        render: (record) => (
          <div className={stylesModule['wraper-container-monthlyComment']}>
            <div className={stylesModule['list-button']} >
              {onFormEdit(record)}
              {/* {this.onFormSent(record)} */}
            </div>
          </div>
        ),
      },
    ];
    return columns;
  };

  console.log("data", data);
  return (
    <>
      <Helmet title="Đo lường định kỳ" />
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
          <Text color="dark" className={styles['title-header']}>
            Đo lường định kỳ
          </Text>
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
                    placeholder="Select branch"
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
                    placeholder="Select branch"
                    onChange={(event) => onChangeSelectBranch(event, 'branchId')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
              )}
              <div className="col-lg-3">
                <FormItem
                  data={user?.roleCode === variables?.LIST_ROLE_CODE?.TEACHER ? [...classes?.filter(i => i?.id === head(user?.objectInfo?.classTeachers)?.classId)] : [...classes]}
                  name="classId"
                  onChange={(event) => onChangeSelect(event, 'classId')}
                  type={variables.SELECT}
                  placeholder="Select class"
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={period}
                  name="assessmentPeriodId"
                  onChange={(event) => onChangeSelect(event, 'assessmentPeriodId')}
                  type={variables.SELECT}
                  placeholder="Select kỳ"
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  name="key"
                  onChange={(event) => onChange(event, 'key')}
                  type={variables.INPUT_SEARCH}
                  placeholder="Enter keyword"
                />
              </div>
              <div className='col-lg-3'>
                {
                  search?.schoolYearId && search?.assessmentPeriodId && search?.branchId && search?.classId ?
                    <Button color="success" icon="report" onClick={onChangeSearch}>
                      Load data
                    </Button>
                    :
                    <Button color="success" icon="report" disabled >
                      Load data
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
                  tab={`${item.name}`}
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
            pagination={paginationFunction}
            defaultExpandAllRows
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
