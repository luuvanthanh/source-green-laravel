import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Upload, message, Image, InputNumber } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { head, isEmpty, last } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import classnames from 'classnames';
import common from '@/assets/styles/Common/common.scss';
import styles from './index.scss';

const WATERMARKS = [
  {
    key: 'TOPLEFT',
    center: false,
  },
  {
    key: 'TOPCENTER',
    center: false,
  },
  {
    key: 'TOPRIGHT',
    center: false,
  },
  {
    key: 'LEFTCENTER',
    center: true,
  },
  {
    key: 'CENTER',
    center: true,
  },
  {
    key: 'RIGHTCENTER',
    center: true,
  },
  {
    key: 'BOTTOMLEFT',
    center: false,
  },
  {
    key: 'BOTTOMCENTER',
    center: false,
  },
  {
    key: 'BOTTOMRIGHT',
    center: false,
  },
];
const Index = memo(() => {
  const [loading, { error }] = useSelector(({ loading: { effects }, watermark }) => [
    effects,
    watermark,
  ]);
  const dispatch = useDispatch();

  const formRef = useRef();
  const mounted = useRef(false);
  const [watermark, setWatermark] = useState(null);
  const [watermarkRatio, setWatermarkRatio] = useState(30);
  const [watermarkPosition, setWatermarkPosition] = useState('CENTER');
  const [watermarkPadding, setWatermarkPadding] = useState(0);
  const [imageBefore, setImageBefore] = useState(null);
  const [imageAfter, setImageAfter] = useState(null);
  const [file, setFile] = useState(null);

  const getBase64 = (file, cb) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      cb(reader.result);
    };
    reader.onerror = () => {};
  };

  const onUploadWatermark = (files) => {
    setFile(files);
    getBase64(files, (result) => {
      setImageBefore(result);
    });
    dispatch({
      type: 'watermark/UPLOAD',
      payload: files,
      callback: (response) => {
        if (response) {
          setImageAfter(head(response.results)?.fileInfo?.url);
        }
      },
    });
  };

  const onFinish = () => {
    dispatch({
      type: 'watermark/ADD',
      payload: {
        watermark: watermark.replace('data:image/png;base64,', ''),
        watermarkRatio,
        watermarkPosition,
        watermarkPadding,
      },
      callback: (response, error) => {
        if (response) {
          onUploadWatermark(file);
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

  useEffect(() => {
    dispatch({
      type: 'watermark/GET_DATA',
      payload: {},
      callback: (response) => {
        if (response) {
          setWatermark(`data:image/png;base64,${response.watermark}`);
          setWatermarkRatio(response.watermarkRatio);
          setWatermarkPosition(response.watermarkPosition);
          setWatermarkPadding(response.watermarkPadding);
        }
      },
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const onChangeWater = (key) => {
    setWatermarkPosition(key);
  };

  const onUpload = (files) => {
    getBase64(files, (result) => {
      setWatermark(result);
    });
  };

  const props = {
    beforeUpload() {
      return null;
    },
    customRequest({ file }) {
      const { name, size } = file;
      const allowTypes = ['png'];
      const maxSize = 5 * 2 ** 20;
      if (!allowTypes.includes(last(name.split('.'))) || size > maxSize) {
        message.error('Định dạng hỗ trợ:  .png. Tổng dung lượng không vượt quá 20MB');
        return;
      }
      onUpload(file);
    },
    showUploadList: false,
    fileList: [],
  };

  const propsWatermark = {
    beforeUpload() {
      return null;
    },
    customRequest({ file }) {
      const { name, size } = file;
      const allowTypes = ['jpeg', 'jpg', 'png'];
      const maxSize = 5 * 2 ** 20;
      if (!allowTypes.includes(last(name.split('.'))) || size > maxSize) {
        message.error('Định dạng hỗ trợ:  .jpeg, .jpg, .png. Tổng dung lượng không vượt quá 20MB');
        return;
      }
      onUploadWatermark(file);
    },
    showUploadList: false,
    fileList: [],
  };

  return (
    <Pane style={{ paddingTop: 20 }}>
      <Helmet title="Cấu hình ghi nhận" />
      <Pane style={{ padding: 20, paddingBottom: 0 }}>
        <Pane className="row justify-content-center">
          <Pane className="col-lg-10">
            <Form layout="vertical" ref={formRef} onFinish={onFinish} initialValues={{}}>
              <Pane className="p20 pt20 card">
                <Loading
                  loading={loading['watermark/GET_MEASURE_UNITS'] || loading['watermark/GET_DATA']}
                  isError={error.isError}
                  params={{ error, goBack: '/thuc-don/mon-an' }}
                >
                  <Heading type="form-title" className="mb20">
                    Cấu hình Watermark
                  </Heading>

                  <Pane className="row">
                    <Pane className="col-12">
                      <label
                        className={classnames('ant-col ant-form-item-label d-block', styles.label)}
                      >
                        <span>Ảnh Watermark</span>
                      </label>
                      {watermark && (
                        <div className={classnames(styles['image-main'], 'mb10')}>
                          <Image width={200} src={watermark} />
                        </div>
                      )}
                      <Upload {...props}>
                        <Button color="primary" icon="upload1">
                          Tải ảnh lên
                        </Button>
                      </Upload>
                      <span className="ml10">Chỉ hỗ trợ định dạng .png (Trong suốt nền)</span>
                    </Pane>
                  </Pane>
                  <Pane className="row mt20">
                    <Pane className="col-lg-6">
                      <label
                        className={classnames('ant-col ant-form-item-label d-block', styles.label)}
                      >
                        <span>Chọn vị trí</span>
                      </label>
                      <div
                        className={styles['watermark-container']}
                        style={{ padding: `${watermarkPadding}px` }}
                      >
                        {WATERMARKS.map((item) => (
                          <div
                            className={classnames(styles['watermark-item'], {
                              [styles['watermark-active']]: watermarkPosition === item.key,
                              [styles['watermark-center']]: item.center,
                            })}
                            role="presentation"
                            key={item.key}
                            onClick={() => onChangeWater(item.key)}
                          />
                        ))}
                      </div>
                    </Pane>
                    <Pane className="col-lg-6">
                      <div>
                        <label
                          className={classnames(
                            'ant-col ant-form-item-label d-block',
                            styles.label,
                          )}
                        >
                          <span>Chọn tỷ lệ kích thước</span>
                        </label>
                        <div className="d-flex align-items-center">
                          <InputNumber
                            className={classnames(
                              'input-number',
                              common['input-number-container'],
                              common['input-number-count'],
                              styles['input-number'],
                            )}
                            value={watermarkRatio}
                            onChange={setWatermarkRatio}
                          />
                          <span className="ml10">%</span>
                        </div>
                      </div>
                      <div className="mt20">
                        <label
                          className={classnames(
                            'ant-col ant-form-item-label d-block',
                            styles.label,
                          )}
                        >
                          <span>Canh lề</span>
                        </label>
                        <div className="d-flex align-items-center">
                          <InputNumber
                            min={0}
                            max={20}
                            className={classnames(
                              'input-number',
                              common['input-number-container'],
                              common['input-number-count'],
                              styles['input-number'],
                            )}
                            value={watermarkPadding}
                            onChange={setWatermarkPadding}
                          />
                          <span className="ml10">px</span>
                        </div>
                      </div>
                    </Pane>
                  </Pane>
                  {imageBefore && imageAfter && (
                    <Pane className="row mt30">
                      <Pane className="col-lg-6">
                        <label
                          className={classnames(
                            'ant-col ant-form-item-label d-block',
                            styles.label,
                          )}
                        >
                          <span>Thử nghiệm</span>
                        </label>
                        {imageBefore && (
                          <Pane className={classnames(styles['image-main'], 'mb10')}>
                            <Image width="100%" src={imageBefore} />
                          </Pane>
                        )}
                      </Pane>
                      <Pane className="col-lg-6">
                        <label
                          className={classnames(
                            'ant-col ant-form-item-label d-block',
                            styles.label,
                          )}
                        >
                          <span>Kết quả</span>
                        </label>
                        {imageAfter && (
                          <Pane className={classnames(styles['image-main'], 'mb10')}>
                            <Image width="100%" src={`${API_UPLOAD}${imageAfter}`} />
                          </Pane>
                        )}
                      </Pane>
                    </Pane>
                  )}
                  <Pane className="mt20">
                    <Upload {...propsWatermark}>
                      <Button color="primary" icon="upload1">
                        Tải ảnh lên
                      </Button>
                    </Upload>
                  </Pane>
                </Loading>
              </Pane>

              <Pane className="py20 d-flex justify-content-between align-items-center">
                <Button
                  className="ml-auto px25"
                  color="success"
                  htmlType="submit"
                  size="large"
                  loading={
                    loading['watermark/ADD'] ||
                    loading['watermark/UPDATE'] ||
                    loading['watermark/GET_DATA']
                  }
                >
                  Lưu
                </Button>
              </Pane>
            </Form>
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
