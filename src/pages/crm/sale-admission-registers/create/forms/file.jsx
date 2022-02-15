import { memo, useRef, useEffect, useState } from 'react';
import { Form, Radio, Upload, message, } from 'antd';
import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import { useDispatch } from 'dva';
import { last, head, } from 'lodash';
import Table from '@/components/CommonComponent/Table';
import stylesModule from '../../styles.module.scss';

const dataTable = [
  {
    stt: '1',
    full_name: 'Đơn đăng ký nhập học',
    status: 0
  },
  {
    stt: '2',
    full_name: 'Thông tin y tế',
    status: 1
  },
  {
    stt: '3',
    full_name: 'Giấy đồng ý',
    status: 1
  },
  {
    stt: '4',
    full_name: 'Hộ khẩu',
    status: 0
  },
  {
    stt: '5',
    full_name: 'Khai sinh',
    status: 0
  },
  {
    stt: '6',
    full_name: 'Form phỏng vấn',
    status: 1
  }
];
const mapStateToProps = ({ loading }) => ({
  loading,
});
const General = memo(({ loading: { effects }, error }) => {
  const formRef = useRef();
  const mounted = useRef(false);
  const loadingSubmit = "";
  const loading = effects[``];
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const onUpload = (file) => {
    dispatch({
      type: 'upload/UPLOAD',
      payload: file,
      callback: (response) => {
        if (response) {
          setFile([head(response.results)?.fileInfo.url, head(response.results)?.fileInfo.name]);
        }
      },
    });
  };

  const props = {
    beforeUpload() {
      return null;
    },
    customRequest({ file }) {
      const { name } = file;
      const allowTypes = ['pdf', 'docx', 'xlsx'];
      if (!allowTypes.includes(last(name.split('.')))) {
        message.error('Chỉ hỗ trợ định dạng .pdf, .docx, .xlsx. Dung lượng không được quá 5mb');
        return;
      }
      onUpload(file);
    },
    showUploadList: false,
    fileList: [],
  };

  const header = () => {
    const columns = [
      {
        title: 'STT',
        key: 'type',
        className: 'min-width-100',
        width: 100,
        dataIndex: 'stt',
      },
      {
        title: 'Tên giấy tờ',
        key: 'type',
        className: 'min-width-150',
        width: 150,
        dataIndex: 'full_name',
      },
      {
        title: 'Tình trạng',
        key: 'format',
        className: 'min-width-250',
        width: 250,
        render: (record) => (
          <>
            <Radio.Group
              value={record.status}
            >
              <Radio value={0} >Đã nhận</Radio>
              <Radio value={1} >Chưa nhận</Radio>
            </Radio.Group>
          </>
        ),
      },
      {
        title: 'File đính kèm',
        key: 'name',
        className: 'min-width-150',
        width: 150,
        render: () => (
          <>
            {file ? file[1] : ""}
          </>
        ),
      },
      {
        title: 'Thao tác',
        key: 'action',
        width: 100,
        fixed: 'right',
        render: () => (
          <div className={stylesModule['list-button']}>
            <Upload {...props} >
              <Button icon="cloud-upload" className={stylesModule.plan} />
            </Upload>
            <Button icon="remove" className={stylesModule.remove} />
          </div>
        ),
      },
    ];
    return columns;
  };

  return (
    <Form layout="vertical" ref={formRef} >
      {/* <Pane className="card"> */}
      <Loading loading={loading} isError={error.isError} params={{ error }}>
        <Pane className="card">
          <Pane className="border-bottom">
            <Pane className="p20">
              <Heading type="form-title" style={{ marginBottom: 20 }}>
                Thông tin hồ sơ
              </Heading>
              <div className={stylesModule['wrapper-table']}>
                <Table
                  columns={header()}
                  dataSource={dataTable}
                  pagination={false}
                  loading={loading}
                  className="table-edit"
                  isEmpty
                  params={{
                    header: header(),
                    type: 'table',
                  }}
                  bordered={false}
                  rowKey={(record) => record.id}
                  scroll={{ x: '100%' }}
                />
              </div>
            </Pane>
          </Pane>
          <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
            <Button color="success" htmlType="submit" loading={loadingSubmit} className="ml-2">
              Lưu
            </Button>
          </Pane>
        </Pane>
      </Loading>
    </Form>
  );
});

General.propTypes = {
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
  loading: {},
  error: {},
};

export default withRouter(connect(mapStateToProps)(General));
