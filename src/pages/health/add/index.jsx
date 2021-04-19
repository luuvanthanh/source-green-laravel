import { memo, useEffect, useRef, useState } from 'react';
import { List, Radio, Avatar, Form, message, Spin } from 'antd';
import { Helmet } from 'react-helmet';
import { connect } from 'umi';
import { isEmpty, head, toString } from 'lodash';

import Button from '@/components/CommonComponent/Button';
import Pane from '@/components/CommonComponent/Pane';
import csx from 'classnames';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import { Scrollbars } from 'react-custom-scrollbars';
import FormItem from '@/components/CommonComponent/FormItem';
import { history, useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import variables from '@/utils/variables';
import variablesModules from '..//utils/variables';
import styles from '@/assets/styles/Common/information.module.scss';
import { Helper } from '@/utils';
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';

const { Item: ListItem } = List;
const Index = memo(({}) => {
  const {
    details,
    loading: { effects },
    branches,
    divisions,
    positions,
    transfers,
    error,
    criteriaGroupProperties,
    menuData,
  } = useSelector(({ loading, user, healthAdd, menu }) => ({
    user: user.user,
    loading,
    details: healthAdd.details,
    error: healthAdd.error,
    criteriaGroupProperties: healthAdd.criteriaGroupProperties,
    menuData: menu.menuLeftHealth,
  }));
  const dispatch = useDispatch();
  const params = useParams();
  const loading = effects[`healthAdd/GET_DETAILS`];
  const loadingSubmit = effects[`healthAdd/ADD`];
  const mounted = useRef(false);
  const filterRef = useRef();
  const formRef = useRef();
  const [studentId, setStudentId] = useState(null);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchStudents, setSearchStudents] = useState({
    totalCount: 0,
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
    return () => (mounted.current = false);
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'healthAdd/GET_DETAILS',
        payload: params,
      });
    }
  }, [params.id]);

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
      callback: (response, error) => {
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
            data: response.items,
          });
        }
      },
    });
  }, []);

  return (
    <>
      <Helmet title="Tạo mới sức khỏe" />
      <Breadcrumbs last="Tạo mới sức khỏe" menu={menuData} />
      <Pane style={{ padding: 20, paddingBottom: 0 }}>
        <Loading loading={loading} isError={error.isError} params={{ error, type: 'container' }}>
          <Pane className="row">
            <Pane className="col-lg-6">
              <Pane className="card" style={{ padding: 20 }}>
                <Heading type="form-title" style={{ marginBottom: 20 }}>
                  Danh sách học sinh
                </Heading>

                <Form layout="vertical" ref={filterRef}>
                  <Pane className={csx('border-bottom')}>
                    <Pane className={csx('row')}>
                      <Pane className="col-lg-6">
                        <FormItem label="Cơ sở" name="position" type={variables.SELECT} />
                      </Pane>
                      <Pane className="col-lg-6">
                        <FormItem label="Lớp" name="class" type={variables.SELECT} />
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
                          dataSource={students}
                          renderItem={(item) => {
                            let fileImage = '';
                            if (Helper.isJSON(item.fileImage)) {
                              const files = JSON.parse(item.fileImage);
                              if (!isEmpty(files)) {
                                fileImage = head(files);
                              }
                            }
                            return (
                              <ListItem key={item.id} className={styles.listItem}>
                                <Radio
                                  value={item.id}
                                  onChange={(event) => onChangeRadio(event, item.id)}
                                />
                                <Pane className={styles.userInformation}>
                                  <Avatar
                                    shape="square"
                                    size={40}
                                    src={fileImage ? `${API_UPLOAD}${fileImage}` : null}
                                  />
                                  <Pane>
                                    <h3>{item.fullName}</h3>
                                    <p>{item.age} tháng tuổi</p>
                                  </Pane>
                                </Pane>
                              </ListItem>
                            );
                          }}
                        >
                          {loadingStudents && hasMore && (
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
                    {(fields, { add, remove }) => (
                      <>
                        <Scrollbars autoHeight autoHeightMax={window.innerHeight - 300}>
                          {fields.map(({ key, name }, index) => {
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
                                        rules={[variables.RULES.EMPTY]}
                                        radioInline
                                      />
                                    </Pane>
                                  </Pane>
                                )}
                                {criteria.criteriaDataType.type === 'number' && (
                                  <Pane className="row">
                                    <Pane className="col-lg-12">
                                      <FormItem
                                        name={[key, 'value']}
                                        label={criteria.property}
                                        type={variables.INPUT_COUNT}
                                        rules={[variables.RULES.EMPTY]}
                                      />
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
                                        rules={[variables.RULES.EMPTY]}
                                      />
                                    </Pane>
                                  </Pane>
                                )}
                                {criteria.criteriaDataType.isHasNote && (
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
                      loading={loadingSubmit}
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
