import { memo, useCallback, useEffect, useState, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useLocation } from 'umi';
import { Helmet } from 'react-helmet';
import { size, isEmpty } from 'lodash';
import csx from 'classnames';
import moment from 'moment';
import { Form, Checkbox } from 'antd';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Loading from '@/components/CommonComponent/Loading';
import FormItem from '@/components/CommonComponent/FormItem';

import infoStyles from '@/assets/styles/Common/information.module.scss';
import styles from '../style.module.scss';
import { variables, Helper } from '@/utils';
import localVariables from '../../utils/variables';

const Index = memo(() => {
  const formRef = useRef();
  const filterRef = useRef();

  const dispatch = useDispatch();
  const [{ data }, loading] = useSelector(({ loading: { effects }, mediaResult }) => [
    mediaResult,
    effects,
  ]);

  const history = useHistory();
  const { query, pathname } = useLocation();

  const [classifyData, setClassifyData] = useState([]);
  const [search, setSearch] = useState({
    search: query?.search,
    sentDateFrom: query?.sentDateFrom,
    sentDateTo: query?.sentDateTo,
  });
  const [groupIds, setGroupIds] = useState([]);

  const changeFilterDate = (values) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      sentDateFrom: values ? values[0].format(variables.DATE_FORMAT.DATE_AFTER) : null,
      sentDateTo: values ? values[1].format(variables.DATE_FORMAT.DATE_AFTER) : null,
    }));
  };

  const groupSelect = (id) => ({ target: { checked } }) => {
    setGroupIds((prev) => (checked ? [...prev, id] : prev.filter((selectId) => selectId !== id)));
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
      query: Helper.convertParamSearch(search),
    });
  }, [search]);

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

  const merge = () => {
    dispatch({
      type: 'mediaResult/MERGE',
      payload: classifyData.map((item) => item.id),
      callback: (response) => {
        if (response) {
          fetchMedia();
        }
      },
    });
  };

  const postAll = async () => {
    const { errorFields } = await formRef.current?.validateFields();
    if (!!size(errorFields)) {
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
        history.push('/ghi-nhan/duyet-hinh');
      },
    });
  };

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  useEffect(() => {
    setClassifyData(data);
  }, [data]);

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
                search?.sentDateFrom ? moment(search?.sentDateFrom) : null,
                search?.sentDateTo ? moment(search?.sentDateTo) : null,
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
                <Button
                  disabled={loading['mediaResult/GET_DATA']}
                  className="mr20"
                  color="dark"
                  type="link"
                  onClick={removeAllPost}
                  disabled={isEmpty(classifyData)}
                >
                  Xóa tất cả ghi nhận
                </Button>
                <Button
                  disabled={loading['mediaResult/GET_DATA']}
                  className="mr20"
                  color="primary"
                  onClick={merge}
                  disabled={isEmpty(classifyData) || classifyData.length <= 1}
                >
                  Gộp ghi nhận
                </Button>
                <Button
                  disabled={loading['mediaResult/GET_DATA']}
                  color="success"
                  onClick={postAll}
                  loading={loading['mediaResult/VALIDATE_ALL']}
                >
                  Gửi tất cả
                </Button>
              </Pane>
            </Pane>
          </Form>
        </Pane>

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
                      <Button
                        className="mr20"
                        color="danger"
                        type="link"
                        onClick={() => removePost(post?.id)}
                      >
                        Xóa ghi nhận
                      </Button>
                      <Pane className="mr20">
                        <label className={csx(infoStyles.infoLabel, 'mb-0')}>
                          Thời gian tải lên:
                        </label>
                        <span className={infoStyles.infoText}>
                          {moment(post?.creationTime).format(variables.DATE_FORMAT.DATE_TIME)}
                        </span>
                      </Pane>
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
                    rules={[variables.RULES.EMPTY]}
                    placeholder="Nhập mô tả"
                    name={['description', index]}
                  />

                  <Pane className="row">
                    {(post?.files || []).map((image) => (
                      <Pane className={csx('col-lg-2 my10', styles.imageWrapper)} key={image?.id}>
                        <img
                          className="d-block w-100"
                          src={`${API_UPLOAD}${image?.url}`}
                          alt={image?.name}
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
