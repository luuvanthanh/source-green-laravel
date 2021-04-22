import { memo, useCallback, useEffect, useState, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useSelector, useDispatch } from 'dva';
import { useHistory } from 'umi'; // useLocation
import { Helmet } from 'react-helmet';
import { size } from 'lodash';
import csx from 'classnames';
import moment from 'moment';
import { Form } from 'antd';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Loading from '@/components/CommonComponent/Loading';
import FormItem from '@/components/CommonComponent/FormItem';

import infoStyles from '@/assets/styles/Common/information.module.scss';
import styles from '../style.module.scss';
import variables from '@/utils/variables';
import localVariables from '../../utils/variables';

const Index = memo(() => {
  const history = useHistory();
  const formRef = useRef();

  const dispatch = useDispatch();
  const [{ data }, loading] = useSelector(({ loading: { effects }, mediaResult }) => [
    mediaResult,
    effects,
  ]);

  // const { query } = useLocation();

  const [classifyData, setClassifyData] = useState([]);

  const fetchMedia = useCallback(() => {
    dispatch({
      type: 'mediaResult/GET_DATA',
      payload: {
        // sentDateFrom: query?.uploadDate,
        status: localVariables.CLASSIFY_STATUS.VALIDATING,
        maxResultCount: variables.PAGINATION.SIZEMAX
      }
    });
  }, []);

  const removeImage = (postId, image) => {
    setClassifyData(prev => prev.map(post => post.id === postId ? ({
      ...post,
      files: (post?.files || []).filter(file => file.id !== image.id),
      removeFiles: [
        ...post?.removeFiles || [],
        image
      ]
    }) : post));
  };

  const changeDesctiption = (postId) => e => {
    setClassifyData(prev => prev.map(post => post.id === postId ? ({
      ...post,
      description: e?.target?.value,
    }) : post));
  };

  const createPost = ({ id, description, removeFiles }, index) => {
    if (!description) {
      formRef?.current?.setFields([{
        name: ['description', index],
        errors: [variables.RULES.EMPTY.message]
      }]);
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

  const postAll = async () => {
    const { errorFields } = await formRef.current?.validateFields();
    if (!!size(errorFields)) {
      return;
    }

    const req = classifyData.map(
      ({ id, description, removeFiles }) =>
      ({
        id,
        description,
        removeFiles
      })
    );
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
        <Pane className="d-flex mb20">
          <Heading type="page-title">Kết quả lọc hình ảnh</Heading>
          <Button
            disabled={loading['mediaResult/GET_DATA']}
            className="ml-auto"
            color="success"
            icon="send"
            onClick={postAll}
            loading={loading['mediaResult/VALIDATE_ALL']}
          >
            Gửi tất cả
          </Button>
        </Pane>

        <Loading loading={loading['mediaResult/GET_DATA']} isEmpty={!size(classifyData)}>
          <Form
            layout="vertical"
            ref={formRef}
            initialValues={{
              description: classifyData.map(item => item.description)
            }}
          >
            <Scrollbars autoHeight autoHeightMax={window.innerHeight - 180}>
              {(classifyData || []).map((post, index) => (
                <Pane className={csx("card p20 mb-0", {
                  mt15: !!index
                })} key={post?.id}>
                  <Pane className="mb15 row">
                    <Pane className="col">
                      <Pane className={infoStyles.userInformation}>
                        <AvatarTable fileImage={post?.student?.fileImage} />
                        <Pane>
                          <h3>{post?.student?.fullName}</h3>
                          <p>{post?.studentMaster?.student?.class?.branch?.name} - {post?.studentMaster?.student?.class?.name}</p>
                        </Pane>
                      </Pane>
                    </Pane>
                    <Pane className="col d-flex justify-content-end align-items-center">
                      <Pane className="mr10">
                        <label className={infoStyles.infoLabel}>Thời gian tải lên:</label>
                        <span className={infoStyles.infoText}>{moment(post?.creationTime).format(variables.DATE_FORMAT.DATE_TIME_VI)}</span>
                      </Pane>
                      <Button
                        color="success"
                        onClick={() => createPost(post, index)}
                      >
                        Gửi
                      </Button>
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
                      <Pane
                        className={csx("col-lg-2 my10", styles.imageWrapper)}
                        key={image?.id}
                      >
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
