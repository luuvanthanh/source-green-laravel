import { memo, useRef, useState, useCallback, useEffect } from 'react';
import { Form } from 'antd';
import { Helmet } from 'react-helmet';
import { Scrollbars } from 'react-custom-scrollbars';
import { useHistory, useLocation } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { size } from 'lodash';
import moment from 'moment';
import csx from 'classnames';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import NoData from '@/components/CommonComponent/NoData';
import UploadModal from './upload';

import { Helper, variables } from '@/utils';
import localVariables from '../utils/variables';
import styles from './style.module.scss';

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
    uploadDate: query?.uploadDate,
  });
  const [images, setImages] = useState([]);

  const removeImage = (removeId) => () => {
    setImages((prevImages) => prevImages.filter((image) => image.id !== removeId));
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
        status: localVariables.CLASSIFY_STATUS.PENDING,
      }
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch(search),
    });
  }, [search]);

  const classify = () => {
    dispatch({
      type: 'mediaBrowser/CLASSIFY',
      payload: images,
      callback: () => {
        history.push({
          pathname: '/ghi-nhan/duyet-hinh/ket-qua',
          query: Helper.convertParamSearch(search),
        })
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
            icon="cloudDownload"
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

          {!size(images) ? (
            <Pane className="p20">
              <NoData />
            </Pane>
          ) : (
            <Scrollbars autoHeight autoHeightMax={window.innerHeight - 312}>
              <Pane className="px20 py10">
                <Pane className="row">
                  {images.map(({ url, id, name }) => (
                    <Pane
                      className={csx('col-lg-2 col-md-4 col-sm-6 my10', styles.imageWrapper)}
                      key={id}
                    >
                      <img className="d-block w-100" src={`${API_UPLOAD}${url}`} alt={name} />

                      <Button icon="cancel" className={styles.close} onClick={removeImage(id)} />
                    </Pane>
                  ))}
                </Pane>
              </Pane>
            </Scrollbars>
          )}
        </Pane>

        <Pane>
          <Button
            disabled={!size(images)}
            loading={loading['mediaBrowser/CLASSIFY']}
            className="mx-auto"
            color="success"
            size="large"
            icon="checkmark"
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
