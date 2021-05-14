import { memo, useRef, useState, useCallback, useEffect } from 'react';
import { Form, Image, Tag, Modal } from 'antd';
import { Helmet } from 'react-helmet';
import { Scrollbars } from 'react-custom-scrollbars';
import { useHistory, useLocation } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { size } from 'lodash';
import moment from 'moment';
import csx from 'classnames';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import NoData from '@/components/CommonComponent/NoData';
import UploadModal from './upload';
import Loading from '@/components/CommonComponent/Loading';

import { Helper, variables } from '@/utils';
import localVariables from '../utils/variables';
import styles from './style.module.scss';

const { confirm } = Modal;
const Index = memo(() => {
  const filterRef = useRef();

  const history = useHistory();
  const { query, pathname } = useLocation();

  const [{ data }, loading] = useSelector(({ mediaBrowser, loading: { effects } }) => [
    mediaBrowser,
    effects,
  ]);
  const dispatch = useDispatch();

  const [visibleUpload, setVisibleUpload] = useState(false);
  const [search, setSearch] = useState({
    uploadDate: query?.uploadDate || moment(),
  });
  const [images, setImages] = useState([]);

  const removeImage = (removeId) => () => {
    confirm({
      title: 'Khi xóa thì dữ liệu trước thời điểm xóa vẫn giữ nguyên?',
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: 'Có',
      cancelText: 'Không',
      content: 'Dữ liệu này đang được sử dụng, nếu xóa dữ liệu này sẽ ảnh hưởng tới dữ liệu khác?',
      onOk() {
        dispatch({
          type: 'mediaBrowser/REMOVE',
          payload: {
            id: removeId,
          },
          callback: () => {
            setImages((prevImages) => prevImages.filter((image) => image.id !== removeId));
          },
        });
      },
      onCancel() {},
    });
  };

  const onOk = useCallback(() => {
    setVisibleUpload(false);
    fetchMedia();
  }, []);

  const changeFilter = (name) => (value) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,
    }));
  };

  const fetchMedia = useCallback(() => {
    dispatch({
      type: 'mediaBrowser/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
        uploadDate: Helper.getDate(search.uploadDate, variables.DATE_FORMAT.DATE_AFTER),
      }),
    });
  }, [search]);

  const classify = () => {
    dispatch({
      type: 'mediaBrowser/CLASSIFY',
      payload: images,
      callback: () => {
        history.push({
          pathname: '/ghi-nhan/duyet-hinh',
          // query: Helper.convertParamSearch(search),
        });
      },
    });
  };

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  useEffect(() => {
    setImages(data);
  }, [data]);

  return (
    <>
      <Helmet title="Duyệt hình" />
      <Pane className="p20">
        <Pane className="d-flex mb20">
          <Heading type="page-title">Danh sách hình ảnh đã tải lên</Heading>
          <Button
            className="ml-auto"
            color="primary"
            size="large"
            onClick={() => setVisibleUpload(true)}
          >
            Tải ảnh lên
          </Button>
        </Pane>

        <Pane className="card">
          <Pane className="pt20 px20 border-bottom">
            <Form
              layout="vertical"
              ref={filterRef}
              initialValues={{
                uploadDate: search?.uploadDate && moment(search.uploadDate),
              }}
            >
              <Pane className="row">
                <Pane className="col-lg-3">
                  <FormItem
                    name="uploadDate"
                    type={variables.DATE_PICKER}
                    allowClear={false}
                    onChange={(date) =>
                      changeFilter('uploadDate')(
                        date ? date.format(variables.DATE_FORMAT.DATE_AFTER) : null,
                      )
                    }
                  />
                </Pane>
              </Pane>
            </Form>
          </Pane>

          <Loading loading={loading['mediaBrowser/GET_DATA']} params={{ type: 'container' }}>
            {!size(images) ? (
              <Pane className="p20">
                <NoData />
              </Pane>
            ) : (
              <Scrollbars autoHeight autoHeightMax={window.innerHeight - 312}>
                <Pane className={csx('px20 py10', styles['preview-image'])}>
                  <Image.PreviewGroup>
                    {(images || []).map((item, index) => (
                      <Image
                        width={175}
                        height={138}
                        src={`${API_UPLOAD}${item.url}`}
                        key={index}
                        preview={{
                          maskClassName: 'customize-mask',
                          mask: (
                            <>
                              <Tag
                                className={csx(styles.tag, {
                                  [`${styles.yellow}`]:
                                    item.status === localVariables.CLASSIFY_STATUS.PENDING,
                                  [`${styles.success}`]:
                                    item.status === localVariables.CLASSIFY_STATUS.CLASSIFIED,
                                  [`${styles.danger}`]:
                                    item.status === localVariables.CLASSIFY_STATUS.UNDEFINED,
                                })}
                              >
                                {localVariables.CLASSIFY_STATUS_NAME[item.status] ||
                                  localVariables.CLASSIFY_STATUS_NAME.PENDING}
                              </Tag>
                              {/* <Tag className={csx(styles.tag)}>Đã xử lý</Tag>
                            <Tag className={csx(styles.tag)}>Không xác định</Tag> */}
                              <div
                                className={styles['cancel']}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  removeImage(id);
                                }}
                              >
                                <span className="icon-cancel"></span>
                              </div>
                            </>
                          ),
                        }}
                      />
                    ))}
                  </Image.PreviewGroup>
                </Pane>
              </Scrollbars>
            )}
          </Loading>
        </Pane>

        <Pane>
          <Button
            disabled={!size(images)}
            loading={loading['mediaBrowser/CLASSIFY']}
            className="mx-auto"
            color="success"
            size="large"
            onClick={classify}
          >
            Lọc hình ảnh
          </Button>
        </Pane>
      </Pane>

      <UploadModal visible={visibleUpload} onCancel={() => setVisibleUpload(false)} onOk={onOk} />
    </>
  );
});

export default Index;
