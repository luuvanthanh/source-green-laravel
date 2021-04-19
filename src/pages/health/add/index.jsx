import { memo, useEffect, useRef, useState } from 'react';
import { List, Radio, Avatar, Form, message, Spin } from 'antd';
import { Helmet } from 'react-helmet';
import { connect } from 'umi';
import { isEmpty, head } from 'lodash';

import Button from '@/components/CommonComponent/Button';
import Pane from '@/components/CommonComponent/Pane';
import csx from 'classnames';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import { Scrollbars } from 'react-custom-scrollbars';
import FormItem from '@/components/CommonComponent/FormItem';

import variables from '@/utils/variables';
import variablesModules from '..//utils/variables';
import styles from '@/assets/styles/Common/information.module.scss';
import { Helper } from '@/utils';
import InfiniteScroll from 'react-infinite-scroller';

const { Item: ListItem } = List;
const mapStateToProps = ({ loading, user, healthAdd }) => ({
  user: user.user,
  loading,
  details: healthAdd.details,
  error: healthAdd.error,
});
const Index = memo(({ dispatch, loading: { effects }, match: { params }, details, error }) => {
  const loading = effects[`healthAdd/GET_DETAILS`];
  const mounted = useRef(false);
  const filterRef = useRef();
  const formRef = useRef();
  const [studentId, setStudentId] = useState(null);
  const [student, setStudent] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchStudents, setSearchStudents] = useState({});
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
      type: 'healthAdd/UPDATE_STATUS',
      payload: {
        ...values,
        id: params.id,
      },
      callback: (response) => {
        if (response) {
        }
      },
    });
  };

  useEffect(() => {
    mountedSet(setLoadingStudents, true);
    dispatch({
      type: 'healthAdd/GET_STUDENTS',
      payload: {},
      callback: (response, error) => {
        if (response) {
          mountedSet(setLoadingStudents, false);
          mountedSet(setStudent, response.items);
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
    this.props.dispatch({
      type: 'healthAdd/GET_STUDENTS',
      payload: {
        ...searchStudents,
        page: searchStudents.page + 1,
      },
      callback: (response, error) => {
        if (response) {
          mountedSet(setStudent, students.concat(response.items));
          mountedSet(setLoadingStudents, false);
          mountedSet(setSearchStudents, {
            ...searchStudents,
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
    });
  }, []);

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Loading loading={loading} isError={error.isError} params={{ error, type: 'container' }}>
        <Helmet title="Chi tiết" />
        <Pane className="row" style={{ marginBottom: 20 }}>
          <Pane className="col">
            <Heading type="page-title">Chi tiết</Heading>
          </Pane>
        </Pane>

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
                        dataSource={student}
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
              <Form layout="vertical" initialValues={{}} colon={false} ref={formRef}>
                <Pane className="border-bottom p20">
                  <Heading type="form-title">Chi tiết</Heading>
                </Pane>

                {/* <Pane className="border-bottom p20">
                  <Heading type="form-block-title" className="mb10">
                    Pipi
                  </Heading>
                  <FormItem label="Số lần pipi" type={variables.INPUT_COUNT} />
                  <FormItem label="Ghi chú" type={variables.INPUT} className="mb-0" />
                </Pane>

                <Pane className="border-bottom p20">
                  <Heading type="form-block-title" className="mb10">
                    Pupu
                  </Heading>
                  <FormItem label="Số lần pupu" type={variables.INPUT_COUNT} />
                  <FormItem label="Ghi chú" type={variables.INPUT} className="mb-0" />
                </Pane>

                <Pane className="border-bottom p20">
                  <Heading type="form-block-title" className="mb10">
                    Lượng nước uống
                  </Heading>
                  <FormItem label="Số bình" type={variables.INPUT_COUNT} className="mb-0" />
                </Pane>

                <Pane className="border-bottom p20">
                  <Heading type="form-block-title" className="mb10">
                    Ăn uống
                  </Heading>
                  <FormItem label="Ăn sáng" type={variables.RADIO} data={lunchData} radioInline />
                  <FormItem label="Ghi chú khác" type={variables.INPUT} />
                  <FormItem label="Ăn trưa" type={variables.RADIO} data={lunchData} radioInline />
                  <FormItem label="Ghi chú khác" type={variables.INPUT} />
                  <FormItem label="Ăn xế" type={variables.RADIO} data={lunchData} radioInline />
                  <FormItem label="Ghi chú khác" type={variables.INPUT} className="mb-0" />
                </Pane>

                <Pane className="border-bottom p20">
                  <Heading type="form-block-title" className="mb10">
                    Ngủ
                  </Heading>
                  <FormItem label="Ăn xế" type={variables.RADIO} radioInline />
                  <FormItem label="Ghi chú khác" type={variables.INPUT} className="mb-0" />
                </Pane>

                <Pane className="border-bottom p20">
                  <Heading type="form-block-title" className="mb10">
                    Tình huống
                  </Heading>
                  <FormItem label="Nội dung" type={variables.INPUT} className="mb-0" />
                </Pane> */}

                <Pane className="p20">
                  <Button className="ml-auto" size="large" htmlType="submit" color="success">
                    Tạo mới
                  </Button>
                </Pane>
              </Form>
            </Pane>
          </Pane>
        </Pane>
      </Loading>
    </Pane>
  );
});

export default connect(mapStateToProps)(Index);
