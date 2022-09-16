import { memo, useCallback, useEffect, useState, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useLocation } from 'umi';
import { Helmet } from 'react-helmet';
import { size, isEmpty, includes } from 'lodash';
import csx from 'classnames';
import moment from 'moment';
import { Form, Checkbox, Menu, Dropdown, Button as ButtonAnt, notification } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Loading from '@/components/CommonComponent/Loading';
import FormItem from '@/components/CommonComponent/FormItem';

import infoStyles from '@/assets/styles/Common/information.module.scss';
import { variables, Helper } from '@/utils';
import styles from '../style.module.scss';
import localVariables from '../../utils/variables';

const Index = memo(() => {
  const formRef = useRef();
  const filterRef = useRef();

  const dispatch = useDispatch();
  const [
    { data },
    loading,
  ] = useSelector(({ loading: { effects }, mediaResult }) => [mediaResult, effects]);

  const history = useHistory();
  const { query, pathname } = useLocation();

  const [classifyData, setClassifyData] = useState([]);

  const [pageFile, setPageFile] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [recordedFiles, setRecordedFiles] = useState([]);

  const [search, setSearch] = useState({
    search: query?.search,
    creationTimeFrom: query?.creationTimeFrom
      ? moment(query?.creationTimeFrom)
      : moment().startOf('weeks')?.format(variables.DATE_FORMAT.DATE_AFTER),
    creationTimeTo: query?.creationTimeTo ? moment(query?.creationTimeTo) : moment().endOf('weeks')?.format(variables.DATE_FORMAT.DATE_AFTER),
  });
  const [groupIds, setGroupIds] = useState([]);
  const [validateDescription, setValidateDescription] = useState(false);

  const changeFilterDate = (values) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      creationTimeFrom: values ? values[0].format(variables.DATE_FORMAT.DATE_AFTER) : null,
      creationTimeTo: values ? values[1].format(variables.DATE_FORMAT.DATE_AFTER) : null,
    }));
  };

  const groupSelect = (id) => ({ target: { checked } }) => {
    setGroupIds((prev) => (checked ? [...prev, id] : prev.filter((selectId) => selectId !== id)));
    const index = classifyData.findIndex(item => item.id === id);
    formRef?.current?.setFields([
      {
        name: ['description', index],
        errors: '',
      },
    ]);

  };

  const fetchMedia = useCallback(() => {
    dispatch({
      type: 'mediaResult/GET_DATA',
      payload: {
        ...search,
        status: localVariables.CLASSIFY_STATUS.VALIDATING,
        maxResultCount: variables.PAGINATION.SIZEMAX,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
        creationTimeFrom: Helper.getDate(search.creationTimeFrom, variables.DATE_FORMAT.DATE_AFTER),
        creationTimeTo: Helper.getDate(search.creationTimeTo, variables.DATE_FORMAT.DATE_AFTER),
      }),
    });
  }, [search]);

  const fetchRecordedFiles = () => {
    dispatch({
      type: 'mediaResult/GET_RECORDED_FILES',
      payload: {
        status: localVariables.CLASSIFY_STATUS.UNDEFINED,
        skipCount: pageFile,
        maxResultCount: 18,
      },
      callback: (response) => {
        if (pageFile === 1) {
          setRecordedFiles(response.items);
          setTotalCount(response.totalCount);
        }
        if (response?.totalCount > total) {
          setPageFile(pageFile + 18);
          setTotal(total + 18);
        }
      },
    });
  };

  const onLoadMoreFiles = () => {
    dispatch({
      type: 'mediaResult/GET_RECORDED_FILES',
      payload: {
        status: localVariables.CLASSIFY_STATUS.UNDEFINED,
        skipCount: pageFile,
        maxResultCount: 18,
      },
      callback: (response) => {
        if (response?.totalCount > total) {
          setRecordedFiles(recordedFiles.concat(response.items));
          setPageFile(pageFile + 18);
          setTotal(total + 18);
        }
      },
    });
  };

  const removeImage = (postId, image) => {
    dispatch({
      type: 'mediaResult/REMOVE_IMAGE',
      payload: {
        postId,
        fileId: image?.id,
      },
      callback: () => {
        setClassifyData((prev) =>
          prev.map((post) =>
            post.id === postId
              ? {
                ...post,
                files: (post?.files || []).filter((file) => file.id !== image.id),
              }
              : post,
          ),
        );
      },
    });
  };

  const changeDesctiption = (postId) => (e) => {
    setClassifyData((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
            ...post,
            description: e?.target?.value,
          }
          : post,
      ),
    );
  };

  const createPost = ({ id, description, removeFiles }, index) => {
    if (!description) {
      formRef?.current?.setFields([
        {
          name: ['description', index],
          errors: [variables.RULES.EMPTY.message],
        },
      ]);
      return;
    }

    const req = [{ id, description, removeFiles }];
    dispatch({
      type: 'mediaResult/VALIDATE',
      payload: req,
      callback: () => {
        fetchMedia();
        notification.success({
          message: 'Thông báo',
          description: 'Bạn đã gửi thành công dữ liệu',
        });
      },
    });
  };

  const removePost = (id) => {
    dispatch({
      type: 'mediaResult/REMOVE',
      payload: { id },
      callback: () => {
        setClassifyData((prev) => prev.filter((post) => post.id !== id));
      },
    });
  };

  const removePostChoose = () => {
    dispatch({
      type: 'mediaResult/REMOVE_ALL',
      payload: groupIds,
      callback: (response) => {
        if (response) {
          fetchMedia();
        }
      },
    });
  };

  const removeAllPost = () => {
    dispatch({
      type: 'mediaResult/REMOVE_ALL',
      payload: classifyData.map((item) => item.id),
      callback: (response) => {
        if (response) {
          fetchMedia();
        }
      },
    });
  };

  const removeRecordOnlyFiles = (id) => {
    dispatch({
      type: 'mediaResult/REMOVE_RECORD_FILES',
      payload: [id],
      callback: (response) => {
        if (response) {
          setRecordedFiles(recordedFiles?.filter(i => i?.id !== id));
        }
      },
    });
  };

  const removeRecordFiles = () => {
    dispatch({
      type: 'mediaResult/REMOVE_RECORD_FILES',
      payload: recordedFiles.map((item) => item.id),
      callback: (response) => {
        if (response) {
          setRecordedFiles([]);
        }
      },
    });
  };

  const merge = () => {
    dispatch({
      type: 'mediaResult/MERGE',
      payload: groupIds,
      callback: (response) => {
        if (response) {
          fetchMedia();
          setGroupIds([]);
        }
      },
    });
  };

  const sendPostChoose = async () => {
    setValidateDescription(true);
  };

  const postAll = async () => {
    const { errorFields } = await formRef.current?.validateFields();
    if (size(errorFields)) {
      return;
    }

    const req = classifyData.map(({ id, description, removeFiles }) => ({
      id,
      description,
      removeFiles,
    }));
    dispatch({
      type: 'mediaResult/VALIDATE_ALL',
      payload: req,
      callback: () => {
        history.push('/hinh-anh/duyet-hinh');
        notification.success({
          message: 'Thông báo',
          description: 'Bạn đã gửi thành công dữ liệu',
        });
        fetchMedia();
      },
    });
  };

  useEffect(async () => {
    if (validateDescription) {
      formRef.current.validateFields().then(() => {
        const payload = [...classifyData].filter(item => includes(groupIds, item?.id))?.map((item) => ({
          id: item?.id,
          description: item?.description,
          removeFiles: item?.removeFiles,
        }));
        return dispatch({
          type: 'mediaResult/VALIDATE_ALL',
          payload,
          callback: () => {
            fetchMedia();
            notification.success({
              message: 'Thông báo',
              description: 'Bạn đã gửi thành công dữ liệu',
            });
          },
        });
      }).finally(() => {
        setValidateDescription(false);
      });
    }
    return true;
  }, [validateDescription]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  useEffect(() => {
    fetchRecordedFiles();
  }, []);

  useEffect(() => {
    setClassifyData(data);
  }, [data]);

  const handleMenuClick = (e) => {
    if (e.key === 'MERGE_CHOOSE') {
      merge();
    }
    if (e.key === 'REMOVE_ALL') {
      removeAllPost();
    }
    if (e.key === 'REMOVE_CHOOSE') {
      removePostChoose();
    }
    if (e.key === 'SEND_CHOOSE') {
      sendPostChoose();
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {isEmpty(groupIds) ||
        (groupIds.length >= 1 && <Menu.Item key="SEND_CHOOSE">Gửi ghi nhận đã chọn</Menu.Item>)}
      {isEmpty(groupIds) ||
        (groupIds.length >= 2 && <Menu.Item key="MERGE_CHOOSE">Gộp ghi nhận đã chọn</Menu.Item>)}
      {isEmpty(groupIds) ||
        (groupIds.length >= 1 && <Menu.Item key="REMOVE_CHOOSE">Xóa ghi nhận đã chọn</Menu.Item>)}
      <Menu.Item key="REMOVE_ALL">Xóa tất cả ghi nhận</Menu.Item>
    </Menu>
  );

  return (
    <>
      <Helmet title="Duyệt hình" />
      <Pane className="p20">
        <Pane className="mb20">
          <Heading type="page-title">Kết quả lọc hình ảnh</Heading>
        </Pane>

        <Pane className="mb20">
          <Form
            layout="vertical"
            ref={filterRef}
            initialValues={{
              rangeTime: [
                search?.creationTimeFrom ? moment(search?.creationTimeFrom) : null,
                search?.creationTimeTo ? moment(search?.creationTimeTo) : null,
              ],
            }}
          >
            <Pane className="row">
              <Pane className="col-lg-3">
                <FormItem
                  name="rangeTime"
                  type={variables.RANGE_PICKER}
                  onChange={changeFilterDate}
                  className="mb-0"
                />
              </Pane>

              <Pane className="col-lg-9 d-flex justify-content-end">
                <Dropdown overlay={menu} trigger={['click']} disabled={loading['mediaResult/VALIDATE_ALL'] || loading['mediaResult/GET_DATA']}>
                  <ButtonAnt>
                    Thao tác <DownOutlined />
                  </ButtonAnt>
                </Dropdown>
                <Button
                  color="success"
                  className="ml20"
                  onClick={postAll}
                  loading={loading['mediaResult/VALIDATE_ALL'] || loading['mediaResult/GET_DATA']}
                >
                  Gửi tất cả ghi nhận
                </Button>
              </Pane>
            </Pane>
          </Form>
        </Pane>
        {!!size(classifyData) && (
          <Loading loading={loading['mediaResult/GET_DATA']} isEmpty={!size(classifyData)}>
            <Form
              layout="vertical"
              ref={formRef}
              initialValues={{
                description: classifyData.map((item) => item.description),
              }}
            >
              <Scrollbars autoHeight autoHeightMax={window.innerHeight - 214}>
                {(classifyData || []).map((post, index) => (
                  <Pane
                    className={csx('card p20 mb-0', {
                      mt15: !!index,
                      'border border-primary': groupIds.includes(post?.id),
                    })}
                    key={post?.id}
                  >
                    <Pane className="mb15 row">
                      <Pane className="col-lg-3">
                        <Pane>
                          <label className={csx(infoStyles.infoLabel, 'mb-0')}>
                            Thời gian tải lên:
                          </label>
                          <span className={infoStyles.infoText}>
                            {moment(post?.creationTime).format(variables.DATE_FORMAT.DATE_TIME)}
                          </span>
                        </Pane>
                        <Pane className={infoStyles.userInformation}>
                          <AvatarTable
                            fileImage={Helper.getPathAvatarJson(post?.student?.fileImage)}
                          />
                          <Pane>
                            <h3>{post?.student?.fullName}</h3>
                            <p>
                              {post?.studentMaster?.student?.class?.branch?.name} -{' '}
                              {post?.studentMaster?.student?.class?.name}
                            </p>
                          </Pane>
                        </Pane>
                      </Pane>
                      <Pane className="col-lg-9 d-flex justify-content-end align-items-center">
                        <Button className="mr20" color="gray" onClick={() => removePost(post?.id)}>
                          Xóa
                        </Button>

                        <Button
                          className="mr20"
                          color="success"
                          onClick={() => createPost(post, index)}
                        >
                          Gửi
                        </Button>
                        <Pane className="px5">
                          <Checkbox
                            style={{ transform: 'scale(1.5)' }}
                            onChange={groupSelect(post?.id)}
                          />
                        </Pane>
                      </Pane>
                    </Pane>

                    <FormItem
                      label="Mô tả"
                      onChange={changeDesctiption(post?.id)}
                      type={variables.INPUT}
                      rules={[
                        {
                          ...variables.RULES.EMPTY,
                          required: validateDescription ? includes(groupIds, post?.id) : true,
                        }
                      ]}
                      placeholder="Nhập mô tả"
                      name={['description', index]}
                    />

                    <Pane className="row">
                      {(post?.files || []).map((image) => (
                        <Pane className={csx('col-lg-2 my10 col-4', styles.imageWrapper)} key={image?.id}>
                          <img
                            className="d-block w-100"
                            src={`${API_UPLOAD}${image?.url}`}
                            alt="imageUpload"
                          />
                          <Button
                            icon="cancel"
                            className={styles.close}
                            onClick={() => removeImage(post?.id, image)}
                          />
                        </Pane>
                      ))}
                    </Pane>
                  </Pane>
                ))}
              </Scrollbars>
            </Form>
          </Loading>
        )}

        {!isEmpty(recordedFiles) && (
          <>
            <Pane className={csx('card p20 mb-0 mt10')}>
              <Pane className="d-flex justify-content-between">
                <Heading type="page-title">Hình ảnh không xác định</Heading>
                <Button
                  color="dark"
                  type="link"
                  onClick={removeRecordFiles}
                  disabled={isEmpty(recordedFiles) || loading['mediaResult/GET_DATA']}
                >
                  Xóa tất cả
                </Button>
              </Pane>
              <Pane className="row">
                {(recordedFiles || []).map((image) => (
                  <Pane className={csx('col-lg-2 my10', styles.imageWrapper)} key={image?.id}>
                    <img
                      className="d-block w-100"
                      src={`${API_UPLOAD}${image?.url}`}
                      alt="imageUpload"
                    />
                    <Button
                      icon="cancel"
                      className={styles.close}
                      onClick={() => removeRecordOnlyFiles(image?.id)}
                    />
                  </Pane>
                ))}
              </Pane>
              {
                total < totalCount && (
                  <div className={styles.more}>
                    <Button color="success"
                      className="ml20"
                      loading={loading['mediaResult/GET_RECORDED_FILES']} onClick={() => onLoadMoreFiles()} >Load More</Button>
                  </div>
                )
              }
            </Pane>
          </>
        )}

        {/* <Pane className="mt15">
          <Button
            className="mx-auto"
            color="success"
            icon="send"
            onClick={postAll}
          >
            Gửi tất cả
          </Button>
        </Pane> */}
      </Pane>
    </>
  );
});

export default Index;
