import { useDispatch, useSelector } from 'dva';
import React, { memo, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import classnames from 'classnames';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import FormItem from '@/components/CommonComponent/FormItem';
import Button from '@/components/CommonComponent/Button';
import { Form, Tabs } from 'antd';
import { isEmpty } from 'lodash';
import Table from '@/components/CommonComponent/Table';
import { useLocation, useHistory } from 'umi';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

const Index = memo(() => {
  const [
    {
      branches,
      classes,
      years,
      dataExpected,
      dataStudying,
      paginationStudying,
      paginationExpected,
    },
    { effects },
    { defaultBranch },
  ] = useSelector(({ timetableAsymptotic, loading, user }) => [timetableAsymptotic, loading, user]);
  const dispatch = useDispatch();
  const { pathname, query } = useLocation();
  const history = useHistory();
  const yearsConvert = years.map((item) => ({
    id: item.id,
    name: `Năm học  ${item.fromYear} - ${item.toYear}`,
  }));

  const [search, setSearch] = useState({
    keyWord: query?.keyWord,
    branchId: query?.branchId || defaultBranch?.id,
    timetableSettingId: query?.timetableSettingId,
    classId: query?.classId,
    status: 'EXPECTED',
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
  });

  const [studentId, setStudentId] = useState([]);
  const [keyPane, setKeyPane] = useState('1');

  const getYears = () => {
    dispatch({
      type: 'timetableAsymptotic/GET_YEARS',
      payload: {},
      callback: (response) => {
        if (response) {
          setSearch((prev) => ({
            ...prev,
            timetableSettingId: search.timetableSettingId || response[0]?.id,
          }));
        }
      },
    });
  };

  const onLoad = () => {
    dispatch({
      type: 'timetableAsymptotic/GET_DATA',
      payload: {
        timetableSettingId: search.timetableSettingId || years[0]?.id,
        ...search,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({ ...search }),
    });
  };

  const loadCategories = () => {
    if (search.branchId) {
      dispatch({
        type: 'timetableAsymptotic/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    dispatch({
      type: 'timetableAsymptotic/GET_BRANCHES',
      payload: {},
    });
  };

  useEffect(() => {
    getYears();
  }, []);

  useEffect(() => {
    loadCategories();
    onLoad();
  }, [search]);

  
  const onChangeStudying = (event, type) => {
    switch (type) {
      case 'keyWord':
        setSearch((prevState) => ({
          ...prevState,
          [type]: event.target.value,
        }));
        break;
      case 'timetableSettingId':
        setSearch((prevState) => ({
          ...prevState,
          [type]: event,
        }));
        break;
      case 'branchId':
        setSearch((prevState) => ({
          ...prevState,
          [type]: event,
        }));
        break;
      case 'classId':
        setSearch((prevState) => ({
          ...prevState,
          [type]: event,
        }));
        break;

      default:
        break;
    }
  };

  const onChangeExpected = (event, type) => {
    switch (type) {
      case 'keyWord':
        setSearch((prevState) => ({
          ...prevState,
          [type]: event.target.value,
        }));
        break;
      case 'timetableSettingId':
        setSearch((prevState) => ({
          ...prevState,
          [type]: event,
        }));
        break;
      case 'branchId':
        setSearch((prevState) => ({
          ...prevState,
          [type]: event,
        }));
        break;
      case 'classId':
        setSearch((prevState) => ({
          ...prevState,
          [type]: event,
        }));
        break;

      default:
        break;
    }
  };

  const header = () => [
    {
      title: 'Học sinh',
      key: 'name',
      width: 300,
      className: 'min-width-200',
      render: (value) => (
        <AvatarTable
          fileImage={Helper.getPathAvatarJson(value.fileImage)}
          fullName={value.fullName}
        />
      ),
    },
    {
      title: 'Cơ sở',
      key: 'branch',
      className: 'min-width-100',
      render: (value) => value?.class?.branch?.name,
    },
    {
      title: 'Lớp',
      key: 'class',
      dataIndex: 'class',
      className: 'min-width-100',
      render: (value) => value?.name,
    },
    {
      title: 'Số tháng tuổi',
      key: 'age',
      dataIndex: 'age',
      className: 'min-width-100',
      render: (value) => (
        <div className="d-flex align-items-center justify-content-center">
          <Text size="normal">{value}</Text>
        </div>
      ),
    },
    {
      title: 'Ngày  nhập học',
      key: 'date',
      className: 'min-width-100',
      render: (value) => Helper.getDate(value?.registerDate, variables.DATE_FORMAT.DATE_VI),
    },
  ];

  const remove = () => {
    dispatch({
      type: 'timetableAsymptotic/REMOVE',
      payload: {
        timetableSettingId: search.timetableSettingId,
        studentIds: studentId,
      },
      callback: (response) => {
        if (response) {
          setKeyPane('1');
          setSearch((prev) => ({
            ...prev,
            status: 'EXPECTED',
            page: variables.PAGINATION.PAGE,
            limit: variables.PAGINATION.PAGE_SIZE,
          }));
        }
      },
    });
  };

  const create = () => {
    if (!isEmpty(studentId)) {
      const payload = studentId.map((item) => ({
        timetableSettingId: search.timetableSettingId,
        status: 'STUDYING',
        studentId: item,
      }));
      dispatch({
        type: 'timetableAsymptotic/CREATE',
        payload,
        callback: (response) => {
          if (response) {
            setKeyPane('2');
            setSearch((prev) => ({
              ...prev,
              status: 'STUDYING',
              page: variables.PAGINATION.PAGE,
              limit: variables.PAGINATION.PAGE_SIZE,
            }));
          }
        },
      });
    }
  };

  const changePaginationExpected = (pagination) =>
    Helper.paginationNet({
      pagination,
      query,
      callback: (response) => {
        setSearch((prevSate) => ({
          ...prevSate,
          page: response.page,
          limit: response.limit,
        }));
      },
    });
  const changePaginationStudying = (pagination) =>
    Helper.paginationNet({
      pagination,
      query,
      callback: (response) => {
        setSearch((prevSate) => ({
          ...prevSate,
          page: response.page,
          limit: response.limit,
        }));
      },
    });

  return (
    <>
      <Helmet title="Thống kê tiệm cận" />
      {!isEmpty(years) && (
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Thống kê tiệm cận</Text>
          </div>
          <div className={styles.tabStyle}>
            <Tabs
              activeKey={keyPane}
              className={styles.tabContent}
              onTabClick={(key, _) => {
                setKeyPane(key);
                if (key === '1') {
                  setSearch((prev) => ({
                    ...prev,
                    status: 'EXPECTED',
                  }));
                }
                if (key === '2') {
                  setSearch((prev) => ({
                    ...prev,
                    status: 'STUDYING',
                  }));
                }
              }}
            >
              <Tabs.TabPane tab="Dự kiến học tiệm cận" key="1">
                <div className={classnames('pt20')}>
                  <Form
                    initialValues={{
                      ...search,
                      timetableSettingId: search.timetableSettingId || years[0].id,
                      branchId: search.branchId || null,
                      classId: search.classId || null,
                    }}
                    layout="vertical"
                  >
                    <div className="row">
                      <div className="col-lg-3">
                        <FormItem
                          className="ant-form-item-row"
                          name="keyWord"
                          type={variables.INPUT_SEARCH}
                          placeholder="Từ khóa tìm kiếm"
                          onChange={(event) => onChangeExpected(event, 'keyWord')}
                        />
                      </div>
                      <div className="col-lg-3">
                        <FormItem
                          className="ant-form-item-row"
                          name="timetableSettingId"
                          data={[...yearsConvert]}
                          onChange={(event) => onChangeExpected(event, 'timetableSettingId')}
                          type={variables.SELECT}
                        />
                      </div>
                      <div className="col-lg-3">
                        <FormItem
                          className="ant-form-item-row"
                          data={[{ id: null, name: 'Chọn tất cả cơ sở' }, ...branches]}
                          name="branchId"
                          onChange={(event) => onChangeExpected(event, 'branchId')}
                          type={variables.SELECT}
                          allowClear={false}
                        />
                      </div>
                      <div className="col-lg-">
                        <FormItem
                          className="ant-form-item-row"
                          data={[{ id: null, name: 'Chọn tất cả các lớp' }, ...classes]}
                          name="classId"
                          onChange={(event) => onChangeExpected(event, 'classId')}
                          type={variables.SELECT}
                          allowClear={false}
                        />
                      </div>
                    </div>
                  </Form>
                </div>
                <div>
                  <Table
                    bordered
                    columns={header()}
                    dataSource={dataExpected?.filter(
                      (item) => item.age <= 72 && item.age >= 60 && item,
                    )}
                    loading={effects['timetableAsymptotic/GET_DATA']}
                    pagination={changePaginationExpected(paginationExpected)}
                    rowSelection={{
                      onChange: (selectedRowKeys, _) => {
                        setStudentId(selectedRowKeys);
                      },
                      getCheckboxProps: (record) => ({ name: record.name }),
                    }}
                    params={{
                      header: header(),
                      type: 'table',
                    }}
                    rowKey={(record) => record.id}
                    scroll={{ x: '100%' }}
                  />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Đang học tiệm cận" key="2">
                <div className={classnames(styles.search, 'pt20')}>
                  <Form
                    initialValues={{
                      ...search,
                      timetableSettingId: years[1]?.id,
                      branchId: search.branchId || null,
                      classId: search.classId || null,
                    }}
                    layout="vertical"
                  >
                    <div className="row">
                      <div className="col-lg-3">
                        <FormItem
                          className="ant-form-item-row"
                          name="keyWord"
                          type={variables.INPUT_SEARCH}
                          onChange={(event) => onChangeStudying(event, 'keyWord')}
                          placeholder="Từ khóa tìm kiếm"
                        />
                      </div>
                      <div className="col-lg-3">
                        <FormItem
                          className="ant-form-item-row"
                          name="timetableSettingId"
                          data={[...yearsConvert]}
                          onChange={(event) => onChangeStudying(event, 'timetableSettingId')}
                          type={variables.SELECT}
                        />
                      </div>
                      <div className="col-lg-3">
                        <FormItem
                          className="ant-form-item-row"
                          data={[{ id: null, name: 'Chọn tất cả cơ sở' }, ...branches]}
                          name="branchId"
                          onChange={(event) => onChangeStudying(event, 'branchId')}
                          type={variables.SELECT}
                          allowClear={false}
                        />
                      </div>
                      <div className="col-lg-">
                        <FormItem
                          className="ant-form-item-row"
                          data={[{ id: null, name: 'Chọn tất cả các lớp' }, ...classes]}
                          name="classId"
                          onChange={(event) => onChangeStudying(event, 'classId')}
                          type={variables.SELECT}
                          allowClear={false}
                        />
                      </div>
                    </div>
                  </Form>
                </div>
                <div>
                  <Table
                    bordered
                    columns={header()}
                    dataSource={dataStudying}
                    loading={effects['timetableAsymptotic/GET_DATA']}
                    pagination={changePaginationStudying(paginationStudying)}
                    rowSelection={{
                      onChange: (selectedRowKeys, _) => {
                        setStudentId(selectedRowKeys);
                      },
                      getCheckboxProps: (record) => ({ name: record.name }),
                    }}
                    params={{
                      header: header(),
                      type: 'table',
                    }}
                    rowKey={(record) => record.id}
                    scroll={{ x: '100%' }}
                  />
                </div>
              </Tabs.TabPane>
            </Tabs>
          </div>
          <div className="d-flex justify-content-end py-4">
            {search.status === 'EXPECTED' ? (
              <Button color="success" onClick={create}>
                Áp dụng cho học tiệm cận
              </Button>
            ) : (
              <Button color="success" onClick={remove}>
                Chuyển về dự kiến
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
});

export default Index;