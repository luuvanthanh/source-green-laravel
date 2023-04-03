import { memo, useEffect, useRef, useState } from 'react';
import { List, Radio, Form, message, Spin } from 'antd';
import { Helmet } from 'react-helmet';
import { history, useParams, useLocation } from 'umi';
import { isEmpty, toString, head } from 'lodash';

import Button from '@/components/CommonComponent/Button';
import Pane from '@/components/CommonComponent/Pane';
import csx from 'classnames';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import { Scrollbars } from 'react-custom-scrollbars';
import FormItem from '@/components/CommonComponent/FormItem';
import { useSelector, useDispatch } from 'dva';
import variables from '@/utils/variables';
import styles from '@/assets/styles/Common/information.module.scss';
import { Helper } from '@/utils';
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import InputNumber from '@/components/CommonComponent/InputNumber';

const { Item: ListItem } = List;
const Index = memo(() => {
  const {
    loading: { effects },
    error,
    criteriaGroupProperties,
    menuData,
    branches,
    classes,
    defaultBranch,
    user
  } = useSelector(({ loading, user, healthAdd, menu }) => ({
    user: user.user,
    defaultBranch: user.defaultBranch,
    loading,
    details: healthAdd.details,
    error: healthAdd.error,
    criteriaGroupProperties: healthAdd.criteriaGroupProperties,
    branches: healthAdd.branches,
    classes: healthAdd.classes,
    menuData: menu.menuLeftHealth,
  }));
  const dispatch = useDispatch();
  const params = useParams();
  const loading = effects[`healthAdd/GET_DETAILS`];
  const loadingSubmit = effects[`healthAdd/ADD`];
  const mounted = useRef(false);
  const filterRef = useRef();
  const formRef = useRef();
  const { query } = useLocation();
  const [studentId, setStudentId] = useState(null);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [defaultBranchs,] = useState(defaultBranch?.id ? [defaultBranch] : []);
  const [searchStudents, setSearchStudents] = useState({
    totalCount: 0,
    classStatus: 'HAS_CLASS',
    position: query?.position || defaultBranch?.id,
    class: query?.classId || user?.roleCode === variables?.LIST_ROLE_CODE?.TEACHER && head(user?.objectInfo?.classTeachers)?.classId,
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.PAGE_SIZE,
  });
  const mountedSet = (setFunction, value) => !!mounted?.current && setFunction(value);
  /**
   * Function change radio
   * @param {string} radio value of editor
   */
  const onChangeRadio = (e, id) => {
    mountedSet(setStudentId, id);
  };

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'healthAdd/GET_DETAILS',
        payload: params,
      });
    }
  }, [params.id]);

  const onChangeBranches = (value) => {
    dispatch({
      type: 'healthAdd/GET_CLASSES',
      payload: {
        branch: value,
      },
    });
  };

  const onChangeClasses = (value) => {
    dispatch({
      type: 'healthAdd/GET_STUDENTS',
      payload: {
        ...searchStudents,
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.PAGE_SIZE,
        class: value,
      },
      callback: (response, error) => {
        if (response) {
          mountedSet(setStudents, response.items);
          mountedSet(setSearchStudents, {
            ...searchStudents,
            page: variables.PAGINATION.PAGE,
            limit: variables.PAGINATION.PAGE_SIZE,
            totalCount: response.totalCount,
          });
        }
        if (error) {
          message.error('Lỗi hệ thống.');
        }
      },
    });
  };

  const onFinish = (values) => {
    dispatch({
      type: 'healthAdd/ADD',
      payload: values.data.map((item) => ({
        reportDate: moment(),
        criteriaGroupPropertyId: item.id,
        studentId,
        value: toString(item.value),
        note: item.note,
      })),
      callback: (response) => {
        if (response) {
          history.push(`/suc-khoe/hom-nay`);
        }
      },
    });
  };

  useEffect(() => {
    mountedSet(setLoadingStudents, true);
    dispatch({
      type: 'healthAdd/GET_STUDENTS',
      payload: {
        ...searchStudents,
      },
      callback: (response) => {
        if (response) {
          mountedSet(setLoadingStudents, false);
          mountedSet(setStudents, response.items);
          mountedSet(setSearchStudents, {
            ...searchStudents,
            totalCount: response.totalCount,
          });
        }
      },
    });
  }, []);

  const handleInfiniteOnLoad = () => {
    mountedSet(setLoadingStudents, true);
    if (students.length >= searchStudents.totalCount) {
      message.warning('Danh sách đã hiển thị tất cả.');
      mountedSet(setHasMore, false);
      mountedSet(setLoadingStudents, false);
      return;
    }
    dispatch({
      type: 'healthAdd/GET_STUDENTS',
      payload: {
        ...searchStudents,
        page: searchStudents.page + 1,
      },
      callback: (response, error) => {
        if (response) {
          mountedSet(setStudents, students.concat(response.items));
          mountedSet(setLoadingStudents, false);
          mountedSet(setSearchStudents, {
            ...searchStudents,
            totalCount: response.totalCount,
            page: searchStudents.page + 1,
          });
        }
        if (error) {
          message.error('Lỗi hệ thống.');
          mountedSet(setHasMore, false);
          mountedSet(setLoadingStudents, false);
        }
      },
    });
  };

  useEffect(() => {
    dispatch({
      type: 'healthAdd/GET_CRITERIA_GROUP_PROPERTIES',
      payload: {},
      callback: (response) => {
        if (!isEmpty(response.items)) {
          formRef.current.setFieldsValue({
            data: Helper.onSortData(response.items),
          });
        }
      },
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: 'healthAdd/GET_BRANCHES',
      payload: {},
    });
    if (defaultBranch?.id) {
      dispatch({
        type: 'healthAdd/GET_CLASSES',
        payload: {
          branch: defaultBranch?.id,
        },
      });
    }
  }, []);

  return (
    <>
      <Helmet title="Tạo mới sức khỏe" />
      <Breadcrumbs last="Tạo mới sức khỏe" menu={menuData} />
      <Pane style={{ padding: 20, paddingBottom: 0, paddingTop: 10 }}>
        <Loading loading={loading} isError={error.isError} params={{ error, type: 'container' }}>
          <Pane className="row">
            <Pane className="col-lg-6">
              <Pane className="card" style={{ padding: 20 }}>
                <Heading type="form-title" style={{ marginBottom: 20 }}>
                  Danh sách học sinh
                </Heading>

                <Form layout="vertical" ref={filterRef}
                  initialValues={{
                    ...searchStudents,
                  }}
                >
                  <Pane className={csx('border-bottom')}>
                    <Pane className={csx('row')}>
                      {
                        !defaultBranch?.id && (
                          <Pane className="col-lg-6">
                            <FormItem
                              data={branches}
                              label="Cơ sở"
                              name="position"
                              type={variables.SELECT}
                              onChange={onChangeBranches}
                            />
                          </Pane>
                        )
                      }
                      {
                        defaultBranch?.id && (
                          <Pane className="col-lg-6">
                            <FormItem
                              data={defaultBranchs}
                              label="Cơ sở"
                              name="position"
                              type={variables.SELECT}
                              onChange={onChangeBranches}
                            />
                          </Pane>
                        )
                      }
                      <Pane className="col-lg-6">
                        <FormItem
                          data={user?.roleCode === variables?.LIST_ROLE_CODE?.TEACHER ? [...classes?.filter(i => i?.id === head(user?.objectInfo?.classTeachers)?.classId)] : [{ name: 'Chọn tất cả lớp', id: null }, ...classes]}
                          label="Lớp"
                          name="class"
                          type={variables.SELECT}
                          onChange={onChangeClasses}
                        />
                      </Pane>
                    </Pane>
                  </Pane>

                  <Scrollbars autoHeight autoHeightMax={window.innerHeight - 333}>
                    <InfiniteScroll
                      hasMore={!loadingStudents && hasMore}
                      initialLoad={loadingStudents}
                      loadMore={handleInfiniteOnLoad}
                      pageStart={0}
                      useWindow={false}
                    >
                      <Radio.Group value={studentId}>
                        <List
                          loading={loadingStudents && hasMore}
                          dataSource={students}
                          renderItem={(item) => (
                            <ListItem key={item.id} className={styles.listItem}>
                              <Radio
                                value={item.id}
                                onChange={(event) => onChangeRadio(event, item.id)}
                              />
                              <AvatarTable
                                fileImage={Helper.getPathAvatarJson(item.fileImage)}
                                fullName={item.fullName}
                                description={`${item.age} tháng tuổi`}
                              />
                            </ListItem>
                          )}
                        >
                          {loadingStudents && !hasMore && (
                            <div className="demo-loading-container">
                              <Spin />
                            </div>
                          )}
                        </List>
                      </Radio.Group>
                    </InfiniteScroll>
                  </Scrollbars>
                </Form>
              </Pane>
            </Pane>

            <Pane className="col-lg-6">
              <Pane className="card">
                <Form layout="vertical" colon={false} ref={formRef} onFinish={onFinish}>
                  <Pane className="border-bottom p20">
                    <Heading type="form-title">Chi tiết</Heading>
                  </Pane>

                  <Form.List name="data">
                    {(fields) => (
                      <>
                        <Scrollbars autoHeight autoHeightMax={window.innerHeight - 300}>
                          {fields.map(({ key }, index) => {
                            const criteria = criteriaGroupProperties.find(
                              (itemCriteria, indexCriteria) => indexCriteria === index,
                            );
                            return (
                              <Pane
                                key={key}
                                className={csx('pb-0', 'border-bottom', 'position-relative')}
                                style={{ padding: 20 }}
                              >
                                <Heading type="form-block-title" className="mb10">
                                  {criteria.property}
                                </Heading>
                                {criteria.criteriaDataType.type === 'radioButton' && (
                                  <Pane className="row">
                                    <Pane className="col-lg-12">
                                      <FormItem
                                        name={[key, 'value']}
                                        label={criteria.property}
                                        data={
                                          Helper.isJSON(criteria.criteriaDataType.value)
                                            ? JSON.parse(criteria.criteriaDataType.value).map(
                                              (item) => ({
                                                value: item,
                                                label: item,
                                              }),
                                            )
                                            : []
                                        }
                                        type={variables.RADIO}
                                        radioInline
                                      />
                                    </Pane>
                                  </Pane>
                                )}
                                {criteria.criteriaDataType.type === 'number' && (
                                  <Pane className="row">
                                    <Pane className="col-lg-12">
                                      <Form.Item name={[key, 'value']} label={criteria.property}>
                                        <InputNumber
                                          className={csx(
                                            'input-number',
                                            styles['input-number-container'],
                                          )}
                                        />
                                      </Form.Item>
                                    </Pane>
                                  </Pane>
                                )}
                                {criteria.criteriaDataType.type === 'textbox' && (
                                  <Pane className="row">
                                    <Pane className="col-lg-12">
                                      <FormItem
                                        name={[key, 'value']}
                                        label={criteria.property}
                                        type={variables.INPUT}
                                      />
                                    </Pane>
                                  </Pane>
                                )}
                                {criteria.criteriaDataType.type !== 'textbox' && (
                                  <Pane className="row">
                                    <Pane className="col-lg-12">
                                      <FormItem
                                        name={[key, 'note']}
                                        label="Ghi chú"
                                        type={variables.INPUT}
                                      />
                                    </Pane>
                                  </Pane>
                                )}
                              </Pane>
                            );
                          })}
                        </Scrollbars>
                      </>
                    )}
                  </Form.List>

                  <Pane className="p20">
                    <Button
                      className="ml-auto"
                      size="large"
                      htmlType="submit"
                      color="success"
                      disabled={!studentId}
                      loading={loadingSubmit}
                      permission={`${FLATFORM.WEB}${permissions.SUCKHOE_SUCKHOEHOMNAY}${ACTION.CREATE}`}
                    >
                      Tạo mới
                    </Button>
                  </Pane>
                </Form>
              </Pane>
            </Pane>
          </Pane>
        </Loading>
      </Pane>
    </>
  );
});

export default Index;
