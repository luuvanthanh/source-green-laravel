import { memo, useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Checkbox, List, message } from 'antd';
import { history, useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { head, size, isEmpty } from 'lodash';
import { Scrollbars } from 'react-custom-scrollbars';
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';

import { variables, Helper } from '@/utils';
import Table from '@/components/CommonComponent/Table';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Text from '@/components/CommonComponent/Text';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import styles from '@/assets/styles/Common/information.module.scss';

const { Item: FormItemAntd } = Form;
const { Item: ListItem } = List;

const Index = memo(() => {
  const [
    menuData,
    { branches, classes, error },
    loading,
  ] = useSelector(({ menu, physicalCreate, loading: { effects } }) => [
    menu.menuLeftPhysical,
    physicalCreate,
    effects,
  ]);

  const formRef = useRef();
  const mounted = useRef(false);
  const params = useParams();
  const mountedSet = (action, value) => mounted?.current && action(value);
  const dispatch = useDispatch();

  const [isAllStudent, setIsAllStudents] = useState(false);
  const [searchStudent, setSearchStudents] = useState({
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.PAGE_SIZE,
    total: 0,
    hasMore: true,
    loading: false,
    branchId: null,
    classId: null,
  });
  const [students, setStudents] = useState([]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    dispatch({
      type: 'physicalCreate/GET_BRANCHES',
      payload: {},
    });
  }, []);

  useEffect(() => {
    mountedSet(setSearchStudents, { ...searchStudent, loading: true });
    dispatch({
      type: 'physicalCreate/GET_STUDENTS',
      payload: {
        ...searchStudent,
      },
      callback: (response) => {
        if (response) {
          mountedSet(setStudents, response?.items || []);
          setSearchStudents((prev) => ({
            ...prev,
            total: response?.totalCount,
            loading: false,
          }));
        }
      },
    });
  }, []);

  const getClasses = (branchId) => {
    dispatch({
      type: 'physicalCreate/GET_CLASSES',
      payload: {
        branch: branchId
      },
    });
  };

  const onChangeBranch = (value) => {
    getClasses(value);
    mountedSet(setSearchStudents, { ...searchStudent, loading: true });
    dispatch({
      type: 'physicalCreate/GET_STUDENTS',
      payload: {
        ...searchStudent,
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.PAGE_SIZE,
        branchId: value,
      },
      callback: (response) => {
        if (response) {
          mountedSet(setStudents, response?.items || []);
          mountedSet(setSearchStudents, {
            ...searchStudent,
            page: variables.PAGINATION.PAGE,
            limit: variables.PAGINATION.PAGE_SIZE,
            branchId: value,
            total: response?.totalCount,
            loading: false,
          });
        }
      },
    });
  };

  const onChangeClasses = (value) => {
    mountedSet(setSearchStudents, { ...searchStudent, loading: true });
    dispatch({
      type: 'physicalCreate/GET_STUDENTS',
      payload: {
        ...searchStudent,
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.PAGE_SIZE,
        classId: value,
      },
      callback: (response) => {
        if (response) {
          mountedSet(setStudents, response?.items || []);
          mountedSet(setSearchStudents, {
            ...searchStudent,
            page: variables.PAGINATION.PAGE,
            limit: variables.PAGINATION.PAGE_SIZE,
            classId: value,
            total: response.totalCount,
            loading: false,
          });
        }
      },
    });
  };

  const changeCheckboxEmployee = (id) => {
    mountedSet(
      setStudents,
      students.map((item) => (item.id === id ? { ...item, checked: !item?.checked } : item)),
    );
  };

  const handleInfiniteOnLoad = () => {
    mountedSet(setSearchStudents, { ...searchStudent, loading: true });
    if (students.length >= searchStudent.total) {
      message.warning('Danh sách đã hiển thị tất cả.');
      mountedSet(setSearchStudents, { ...searchStudent, hasMore: false, loading: false });
      return;
    }
    dispatch({
      type: 'physicalCreate/GET_STUDENTS',
      payload: {
        ...searchStudent,
        page: searchStudent.page + 1,
      },
      callback: (response, error) => {
        if (response) {
          mountedSet(setStudents, students.concat(response.parsePayload));
          mountedSet(setSearchStudents, {
            ...searchStudent,
            total: response.pagination.total,
            page: searchStudent.page + 1,
            loading: false,
          });
        }
        if (error) {
          message.error('Lỗi hệ thống.');
          mountedSet(setSearchStudents, { ...searchStudent, hasMore: false, loading: false });
        }
      },
    });
  };

  const changeAll = (event) => {
    mountedSet(setIsAllStudents, event.target.checked);
  };

  const onFinish = (values) => {
    const payload = {
      ...values,
      id: params.id,
      sentDate: moment(),
      setIsAllStudents,
    };
    dispatch({
      type: params.id ? 'physicalCreate/UPDATE' : 'physicalCreate/ADD',
      payload,
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              formRef.current.setFields([
                {
                  name: head(item.members),
                  errors: [item.message],
                },
              ]);
            });
          }
        }
      },
    });
  };

  const columns = [
    {
      title: 'Học sinh',
      key: 'student',
      className: 'min-width-140',
      render: (record) => (
        <AvatarTable
          fileImage={Helper.getPathAvatarJson(record?.fileImage)}
          fullName={record?.fullName || ''}
        />
      )
    },
    {
      title: 'Tuổi (tháng)',
      key: 'age',
      className: 'min-width-120',
      render: (record) => (
        <Text size="normal">{record?.age || 0} tháng</Text>
      ),
    },
    {
      title: 'Chiều cao (cm)',
      children: [
        {
          title: 'Cũ',
          key: 'old',
          className: 'min-width-120',
          align: 'center',
          render: (record) => !record?.old ? (
            <span className="font-weight-bold text-danger">{record?.old || 30}</span>
          ) : ''
        },
        {
          title: 'Mới',
          key: 'heightNew',
          className: 'min-width-120',
          align: 'center',
          render: (record) => (
            <>
              <FormItem
                className="mb-0"
                type={variables.INPUT_COUNT}
                rules={[variables.RULES.EMPTY]}
                value={record?.heightNew || ''}
                // onChange={(e) => onChange(e, record, 'heightNew')}
              />
              {error && !(record?.heightNew) && (
                <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
              )}
            </>
          )
        },
      ]
    },
    {
      title: 'Cân nặng (kg)',
      children: [
        {
          title: 'Cũ',
          key: 'weightOld',
          className: 'min-width-120',
          align: 'center',
          render: (record) => !record?.weightOld ? (
            <span className="font-weight-bold text-danger">{record?.weightOld || 30}</span>
          ) : ''
        },
        {
          title: 'Mới',
          key: 'weightNew',
          className: 'min-width-120',
          align: 'center',
          render: (record) => (
            <>
              <FormItem
                className="mb-0"
                type={variables.INPUT_COUNT}
                rules={[variables.RULES.EMPTY]}
                value={record?.weightNew || ''}
                // onChange={(e) => onChange(e, record, 'weightNew')}
              />
              {error && !(record?.weightNew) && (
                <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
              )}
            </>
          )
        },
      ]
    },
  ];

  return (
    <Form layout="vertical" ref={formRef} initialValues={{}} onFinish={onFinish}>
      <Helmet title={params.id ? 'Chỉnh sửa thông báo' : 'Tạo thông báo'} />
      <Breadcrumbs last={params.id ? 'Chỉnh sửa thông báo' : 'Tạo thông báo'} menu={menuData} />
      <Pane className="pr20 pl20">
        <Pane className="row">
          <Pane className="col-lg-6">
            <Pane className="card">
              <Pane className="border-bottom" style={{ padding: '20px 20px 0 20px' }}>
                <Pane className="mb20">
                  <Heading type="form-title">Chọn học sinh</Heading>
                </Pane>
              </Pane>
              <Pane className="border-bottom" style={{ padding: '20px 20px 0 20px' }}>
                <Pane className="row">
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Cơ sở"
                      name="branchId"
                      data={branches}
                      type={variables.SELECT}
                      onChange={onChangeBranch}
                    />
                  </Pane>
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Lớp"
                      name="classId"
                      data={classes}
                      type={variables.SELECT}
                      onChange={onChangeClasses}
                    />
                  </Pane>
                </Pane>
              </Pane>
              <Pane className="border-bottom" style={{ padding: '10px 20px 0 20px' }}>
                <FormItemAntd label="Người nhận thông báo">
                  <Checkbox
                    checked={isAllStudent}
                    onChange={(event) => changeAll(event)}
                  >
                    Tất cả học sinh
                  </Checkbox>
                </FormItemAntd>
              </Pane>
              <Pane className="border-bottom">
                <Scrollbars autoHeight autoHeightMax={window.innerHeight - 600}>
                  <InfiniteScroll
                    hasMore={!searchStudent.loading && searchStudent.hasMore}
                    initialLoad={searchStudent.loading}
                    loadMore={handleInfiniteOnLoad}
                    pageStart={0}
                    useWindow={false}
                  >
                    <List
                      loading={searchStudent.loading}
                      dataSource={students}
                      renderItem={({ id, fullName, positionLevel, fileImage, checked }) => (
                        <ListItem key={id} className={styles.listItem}>
                          <Pane className="px20 w-100 d-flex align-items-center">
                            <Checkbox
                              checked={!!checked}
                              className="mr15"
                              onChange={() => changeCheckboxEmployee(id)}
                            />
                            <Pane className={styles.userInformation}>
                              <AvatarTable fileImage={Helper.getPathAvatarJson(fileImage)} />
                              <Pane>
                                <h3>{fullName}</h3>
                                <p>{head(positionLevel)?.position?.name}</p>
                              </Pane>
                            </Pane>
                          </Pane>
                        </ListItem>
                      )}
                    />
                  </InfiniteScroll>
                </Scrollbars>
              </Pane>

              <Pane className="d-flex justify-content-between align-items-center p20">
                <Text color="dark" size="normal">
                  Đã chọn {size(students.filter((item) => item?.checked))} nhân viên
                </Text>
                <Button
                  color="success"
                  size="large"
                  loading={ loading['physicalCreate/GET_BRANCHES'] }
                  style={{ marginLeft: 'auto' }}
                  htmlType="submit"
                  disabled={false}
                >
                  Áp dụng
                </Button>
              </Pane>
            </Pane>
          </Pane>

          <Pane className="col-lg-6">
            <Pane className="card">
              <Pane className="border-bottom" style={{ padding: '20px 20px 0 20px' }}>
                <Pane className="mb20">
                  <Heading type="form-title">Nhập thể chất</Heading>
                </Pane>
              </Pane>
              <Pane className="p20">
                <Table
                  columns={columns}
                  dataSource={[{ id: 1 }]}
                  loading={loading['physicalStudents/GET_DATA']}
                  isError={error?.isError}
                  pagination={false}
                  rowKey={(record) => record.id}
                  scroll={{ x: '100%' }}
                />
              </Pane>
              <Pane className="p20 border-top">
                <Button
                  color="success"
                  size="large"
                  loading={ loading['physicalCreate/GET_BRANCHES'] }
                  style={{ marginLeft: 'auto' }}
                  htmlType="submit"
                  disabled={false}
                >
                  Lưu
                </Button>
              </Pane>
            </Pane>
          </Pane>
        </Pane>
      </Pane>
    </Form>
  );
});

export default Index;
