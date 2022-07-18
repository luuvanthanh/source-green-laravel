import { memo, useRef, useEffect, useState } from 'react';
import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import { useDispatch } from 'dva';
import classnames from 'classnames';
import { isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { variables } from '@/utils';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import stylesModule from './styles.module.scss';

const mapStateToProps = ({ loading, crmSaleAdmissionAdd }) => ({
  loading,
  configuration: crmSaleAdmissionAdd.configuration,
  details: crmSaleAdmissionAdd.details
});
const General = memo(({ loading: { effects }, error, details }) => {
  const [data, setData] = useState([
    {
      monthNumber: undefined,
      bmiFemale: undefined,
      bmiMale: undefined,
      weightFemale: undefined,
      weightMale: undefined,
      id: uuidv4(),
    },
  ]);
  const [errorTable, setErrorTable] = useState(false);

  const formRef = useRef();
  const mounted = useRef(false);
  const loadingSubmit = effects[`physicalIndexDeclaration/POST`];
  const loading = effects[`physicalIndexDeclaration/GET_DATA`];
  const dispatch = useDispatch();

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);


  useEffect(() => {
    dispatch({
      type: 'physicalIndexDeclaration/GET_DATA',
      payload: {},
      callback: (response) => {
        if (response) {
          if (response?.items?.length > 0) {
            setData(response?.items);
          }
        };
      },
    });
  }, []);


  const onChangeInput = (record, e, type) => {
    setData((prev) =>
      prev.map((item) => ({
        ...item,
        [type]: item.id === record.id ? e : item?.[type],
      })),
    );
  };

  const header = () => {
    const columns = [
      {
        title: 'Số tháng tuổi',
        key: 'monthNumber',
        className: 'min-width-80',
        width: 80,
        render: (value, record) => (
          <>
            <FormItem
              className={classnames('mb-0', stylesModule['icon-input'])}
              type={variables.NUMBER_INPUT}
              rules={[variables.RULES.EMPTY]}
              value={record?.monthNumber || ''}
              onChange={(e) => onChangeInput(record, e, 'monthNumber')}
            />
            {errorTable && !(record?.monthNumber) && (
              <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
            )}
          </>
        )
      },
      {
        title: 'BMI',
        width: 150,
        key: 'BMI',
        children: [
          {
            title: 'Chỉ số nam',
            key: 'bmiMale',
            className: 'min-width-80',
            width: 80,
            render: (value, record) => (
              <>
                <FormItem
                  className={classnames('mb-0')}
                  type={variables.NUMBER_INPUT}
                  rules={[variables.RULES.EMPTY]}
                  value={record?.bmiMale || ''}
                  onChange={(e) => onChangeInput(record, e, 'bmiMale')}
                />
                {errorTable && !(record?.bmiMale) && (
                  <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
                )}
              </>
            )
          },
          {
            title: 'Chỉ số nữ',
            key: 'bmiFemale',
            className: 'min-width-80',
            width: 80,
            render: (value, record) => (
              <>
                <FormItem
                  className={classnames('mb-0')}
                  type={variables.NUMBER_INPUT}
                  rules={[variables.RULES.EMPTY]}
                  value={record?.bmiFemale || ''}
                  onChange={(e) => onChangeInput(record, e, 'bmiFemale')}
                />
                {errorTable && !(record?.bmiFemale) && (
                  <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
                )}
              </>
            )
          },
        ]
      },
      {
        title: 'Cân nặng chuẩn',
        width: 150,
        key: 'time',
        children: [
          {
            title: 'Chỉ số nam',
            key: 'weightMale',
            className: 'min-width-80',
            width: 80,
            render: (value, record) => (
              <>
                <FormItem
                  className={classnames('mb-0', stylesModule['icon-input'])}
                  type={variables.NUMBER_INPUT}
                  rules={[variables.RULES.EMPTY]}
                  min={0}
                  value={record?.weightMale || ''}
                  onChange={(e) => onChangeInput(record, e, 'weightMale')}
                />
                {errorTable && !(record?.weightMale) && (
                  <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
                )}
              </>
            )
          },
          {
            title: 'Chỉ số nữ',
            key: 'weightFemale',
            className: 'min-width-80',
            width: 80,
            render: (value, record) => (
              <>
                <FormItem
                  className={classnames('mb-0', stylesModule['icon-input'])}
                  type={variables.NUMBER_INPUT}
                  rules={[variables.RULES.EMPTY]}
                  value={record?.weightFemale || ''}
                  onChange={(e) => onChangeInput(record, e, 'weightFemale')}
                />
                {errorTable && !(record?.weightFemale) && (
                  <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
                )}
              </>
            )
          },
        ]
      },
    ];
    return columns;
  };

  const onFinish = () => {
    const checkErrorTable = !isEmpty(data) ?
      !!(data.find(item => !item?.monthNumber || !item?.bmiMale || !item?.bmiFemale || !item?.weightMale || !item?.weightFemale))
      : true;

    setErrorTable(checkErrorTable);

    if (checkErrorTable) {
      return true;
    }

    const items = data.map((item) => ({
      monthNumber: item?.monthNumber,
      bmiFemale: `${item?.bmiFemale}`,
      bmiMale: `${item?.bmiMale}`,
      weightFemale: `${item?.weightFemale}`,
      weightMale: `${item?.weightMale}`,
    }));
    dispatch({
      type: 'physicalIndexDeclaration/POST',
      payload: items,
      callback: (response, error) => {
        if (error) {
          if (error?.errors && !isEmpty(error?.errors)) {
            error?.errors.forEach((item) => {
              formRef.current.setFields([
                {
                  name: item?.source?.pointer,
                  errors: [item.detail],
                },
              ]);
            });
          }
        }
      },
    });
  };

  return (
    <Pane className="col-lg-6 offset-lg-3">
      <Loading loading={loading} isError={error.isError} params={{ error }}>
        <Heading type="form-title" style={{ marginBottom: 20, marginTop: 20 }}>
          Khai báo chỉ số BMI theo WHO
        </Heading>
        <Pane className="card">
          <Pane className="border-bottom">
            <Pane className="p20">
              <div className={stylesModule['wrapper-table']}>
                <Table
                  columns={header()}
                  dataSource={data}
                  pagination={false}
                  loading={loading}
                  className="table-edit"
                  isEmpty
                  params={{
                    header: header(),
                    type: 'table',
                  }}
                  bordered
                  rowKey={(record) => record.id}
                  scroll={{ x: '100%' }}
                  footer={(item, index) => (

                    details?.register_status === "CANCEL_REGISTER" ? "" :
                      <Button
                        key={index}
                        onClick={() =>
                          setData([
                            ...data,
                            {
                              id: uuidv4(),
                              status: true,
                              file_image: undefined,
                            },
                          ])
                        }
                        color="transparent-success"
                        icon="plus"
                      >
                        Thêm dòng
                      </Button>

                  )}
                />
              </div>
            </Pane>
          </Pane>
          <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
            <Button color="success" htmlType="submit" loading={loadingSubmit} className="ml-2" onClick={() => onFinish()}>
              Lưu
            </Button>
          </Pane>
        </Pane>
      </Loading>
    </Pane>
  );
});

General.propTypes = {
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
  loading: {},
  error: {},
  details: {},
};

export default withRouter(connect(mapStateToProps)(General));
