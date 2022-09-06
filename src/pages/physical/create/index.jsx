import { memo, useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Checkbox, List, message } from 'antd';
import { history, useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { head, size, isEmpty, findIndex } from 'lodash';
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
  const [studentsPost, setStudentsPost] = useState([]);
  const [reLoadData, setReLoadData] = useState(false);
  const [errorTable, setErrorTable] = useState(false);

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
          mountedSet(setStudents, response?.items?.map(i => (
            {
              ...i,
              checked: false,
            }
          )) || []);
          setSearchStudents((prev) => ({
            ...prev,
            total: response?.totalCount,
            loading: false,
          }));
        }
      },
    });
  }, []);
  console.log("student", students)
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
          let newStudent = [];
          if (!isEmpty(response?.items)) {
            if (!isEmpty(studentsPost)) {
              newStudent = response?.items.filter(item => !(studentsPost.find(object => object?.student?.id === item?.student?.id)));
            } else {
              newStudent = response?.items;
            }
          }
          mountedSet(setStudents, newStudent);
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
          let newStudent = [];
          if (!isEmpty(response?.items)) {
            if (!isEmpty(studentsPost)) {
              newStudent = response?.items.filter(item => !(studentsPost.find(object => object?.student?.id === item?.student?.id)));
            } else {
              newStudent = response?.items;
            }
          }
          mountedSet(setStudents, newStudent);
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

  const changeCheckboxEmployee = (e, id) => {
    const newStudent = [...students].map((item) => (item?.student?.id === id ? { ...item, checked: !item?.checked } : item));
    if (size([...newStudent].filter((item) => !item?.checked)) === 0) {
      setIsAllStudents(true);
    }
    if (size([...newStudent].filter((item) => item?.checked)) === 0) {
      setIsAllStudents(false);
    }
    mountedSet(
      setStudents,
      newStudent
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
          mountedSet(setStudents, students.concat(isAllStudent ? response.items.map(item => ({ ...item, checked: true })) : response.items));
          mountedSet(setSearchStudents, {
            ...searchStudent,
            total: response.totalCount,
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
    if (event.target.checked) {
      mountedSet(setStudents, [...students].map(item => ({ ...item, checked: true })));
    } else {
      mountedSet(setStudents, [...students].map(item => ({ ...item, checked: false })));
    }
    mountedSet(setIsAllStudents, event.target.checked);
  };

  const onChange = (value, record, name) => {
    const index = findIndex(studentsPost, (item) => item?.student?.id === record?.student?.id);
    const newStudentsPost = [...studentsPost];
    newStudentsPost[index] = {
      ...record,
      [name]: {
        ...record[name],
        new: value
      }
    };
    setStudentsPost(newStudentsPost);
  };

  const columns = [
    {
      title: 'Học sinh',
      key: 'student',
      className: 'min-width-200',
      with: 200,
      render: (record) => (
        <AvatarTable
          fileImage={Helper.getPathAvatarJson(record?.student?.fileImage)}
          fullName={record?.student?.fullName || ''}
        />
      )
    },
    {
      title: 'Tuổi (tháng)',
      key: 'age',
      className: 'min-width-120',
      render: (record) => (
        <Text size="normal">{record?.student?.age || 0} tháng</Text>
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
          render: (record) => (
            <span className="font-weight-bold text-danger">{record?.height?.value || 0}</span>
          )
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
                // rules={[variables.RULES.EMPTY]}
                value={record?.height?.new || ''}
                onChange={(e) => onChange(e, record, 'height')}
              />
              {/* {errorTable && !(record?.height?.new) && (
                <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
              )} */}
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
          render: (record) => (
            <span className="font-weight-bold text-danger">{record?.weight?.value || 0}</span>
          )
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
                // rules={[variables.RULES.EMPTY]}
                value={record?.weight?.new || ''}
                onChange={(e) => onChange(e, record, 'weight')}
              />
              {/* {errorTable && !(record?.weight?.new) && (
                <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
              )} */}
            </>
          )
        },
      ]
    },
  ];

  const handleApply = () => {
    const newStudent = [...students].filter(item => !item.checked);
    setStudents(newStudent);
    if (newStudent?.length <= 7 && searchStudent?.total > 7) {
      setReLoadData(true);
    }
    setStudentsPost(studentsPost.concat([...students].filter(item => item.checked)));
  };

  useEffect(() => {
    if (reLoadData) {
      handleInfiniteOnLoad();
    }
  }, [reLoadData]);

  const onFinish = () => {
    // const errorStudentsPost = !isEmpty(studentsPost) ?
    //   !!(studentsPost.find(item => !item?.height?.new || !item?.weight?.new))
    //   : true;
    // setErrorTable(errorStudentsPost);
    // if (errorStudentsPost) {
    //   return true;
    // }
    const payload = [];
    [...studentsPost].forEach(item => {
      if (item?.weight?.new) {
        payload.push({
          id: item?.weight?.id,
          studentCriteriaRequest: {
            reportDate: Helper.getDateTime({
              value: Helper.setDate({
                ...variables.setDateData,
                originValue: moment(),
              }),
              isUTC: false,
            }),
            criteriaGroupPropertyId: item?.weight?.criteriaGroupProperty?.id || '',
            studentId: item?.student?.id || '',
            value: String(item?.weight?.new || 0),
            note: ""
          }
        });
      }
      if (item?.height?.new) {
        payload.push({
          id: item?.height?.id,
          studentCriteriaRequest: {
            reportDate: Helper.getDateTime({
              value: Helper.setDate({
                ...variables.setDateData,
                originValue: moment(),
              }),
              isUTC: false,
            }),
            criteriaGroupPropertyId: item?.height?.criteriaGroupProperty?.id || '',
            studentId: item?.student?.id || '',
            value: String(item?.height?.new || 0),
            note: ""
          }
        });
      }
    });
    return dispatch({
      type: 'physicalCreate/ADD',
      payload,
      callback: (response) => {
        if (response) {
          history.push('/phat-trien-the-chat/tat-ca-hoc-sinh');
        }
      },
    });
  };

  return (
    <Form layout="vertical" ref={formRef} initialValues={{}} onFinish={onFinish}>
      <Helmet title={params.id ? 'Chỉnh sửa thông báo' : 'Tạo thông báo'} />
      <Breadcrumbs last={params.id ? 'Chỉnh sửa thông báo' : 'Tạo thông báo'} menu={menuData} />
      <Pane className="pr20 pl20">
        <Pane className="row">
          <Pane className="col-lg-4">
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
                      disabled={searchStudent.loading}
                    />
                  </Pane>
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Lớp"
                      name="classId"
                      data={classes}
                      type={variables.SELECT}
                      onChange={onChangeClasses}
                      disabled={searchStudent.loading}
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
                {
                  !isEmpty(students) && (
                    <Scrollbars autoHeight autoHeightMax={window.innerHeight - 450}>
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
                                  onChange={(e) => changeCheckboxEmployee(e, id)}
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
                  )
                }
              </Pane>

              <Pane className="d-flex justify-content-between align-items-center p20">
                <Text color="dark" size="normal">
                  Đã chọn {size(students.filter((item) => item?.checked))} học sinh
                </Text>
                <Button
                  color="success"
                  size="large"
                  style={{ marginLeft: 'auto' }}
                  disabled={size(students.filter((item) => item?.checked)) === 0}
                  onClick={handleApply}
                >
                  Áp dụng
                </Button>
              </Pane>
            </Pane>
          </Pane>

          <Pane className="col-lg-8">
            <Pane className="card">
              <Pane className="border-bottom" style={{ padding: '20px 20px 0 20px' }}>
                <Pane className="mb20">
                  <Heading type="form-title">Nhập thể chất <span className="text-danger">*</span></Heading>
                </Pane>
              </Pane>
              <Pane className="p20">
                <Table
                  bordered
                  columns={columns}
                  dataSource={studentsPost}
                  loading={loading['physicalStudents/GET_DATA']}
                  isError={error?.isError}
                  pagination={false}
                  rowKey={(record) => record?.student?.id}
                  scroll={{ x: '100%' }}
                />
              </Pane>
              <Pane className="p20 border-top">
                <Button
                  color="success"
                  size="large"
                  style={{ marginLeft: 'auto' }}
                  disabled={isEmpty(studentsPost)}
                  htmlType="submit"
                  loading={loading['physicalCreate/ADD']}
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
