import { memo, useRef, useEffect, useState } from 'react';
import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { Helmet } from 'react-helmet';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import { useDispatch } from 'dva';
import classnames from 'classnames';
import { isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { variables } from '@/utils';
import { DeleteOutlined } from '@ant-design/icons';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import variablesModules from './utils/variables';

import stylesModule from './styles.module.scss';

const { TabPane } = Tabs;

const mapStateToProps = ({ loading, crmSaleAdmissionAdd }) => ({
  loading,
  configuration: crmSaleAdmissionAdd.configuration,
  details: crmSaleAdmissionAdd.details
});
const General = memo(({ loading: { effects }, error }) => {
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

  const [checkEdit, setCheckEdit] = useState(false);

  const [search, setSearch] = useState(
    {
      type: "BMIFEMALE",
    },
  );

  const formRef = useRef();
  const mounted = useRef(false);
  const loadingSubmit = effects[`physicalIndexDeclarationV1/POST`];
  const loading = effects[`physicalIndexDeclarationV1/GET_DATA`];
  const dispatch = useDispatch();

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);


  useEffect(() => {
    dispatch({
      type: 'physicalIndexDeclarationV1/GET_DATA',
      payload: { ...search },
      callback: (response) => {
        if (response) {
          if (response?.items?.length > 0) {
            setData(response?.items?.map(i => ({
              ...i,
              ...i?.value,
            })));
          }
        };
      },
    });
  }, [search]);


  const onChangeInput = (record, e, type) => {
    if(type==='delete') {
      setData(data?.filter(i=> i?.id !== record?.id));
    }else {
      setData((prev) =>
        prev.map((item) => ({
          ...item,
          [type]: item.id === record.id ? e : item?.[type],
        })),
      );
    }
  };

  const onChangeSelectStatus = (e) => {
    setSearch({ type: e });
  };

  const header = () => {
    const columns = [
      {
        title: 'Tháng tuổi',
        key: 'monthNumber',
        className: 'min-width-80',
        width: 80,
        render: (value, record) => (
          <>
            <FormItem
              className={classnames('mb-0', stylesModule['icon-input'])}
              type={variables.NUMBER_INPUT}
              rules={[variables.RULES.EMPTY]}
              value={record?.monthNumber}
              onChange={(e) => onChangeInput(record, e, 'monthNumber')}
            />
          </>
        )
      },
      {
        title: 'L',
        key: 'l',
        align: 'center',
        className: 'min-width-80',
        width: 80,
        render: (value, record) => (
          <>
            <FormItem
              className={classnames('mb-0', stylesModule['icon-input'])}
              type={variables.NUMBER_INPUT}
              rules={[variables.RULES.EMPTY]}
              value={record?.l}
              onChange={(e) => onChangeInput(record, e, 'l')}
            />
          </>
        )
      },
      {
        title: 'M',
        key: 'm',
        align: 'center',
        className: 'min-width-80',
        width: 80,
        render: (value, record) => (
          <>
            <FormItem
              className={classnames('mb-0', stylesModule['icon-input'])}
              type={variables.NUMBER_INPUT}
              rules={[variables.RULES.EMPTY]}
              value={record?.m}
              onChange={(e) => onChangeInput(record, e, 'm')}
            />
          </>
        )
      },
      {
        title: 'S',
        key: 's',
        align: 'center',
        className: 'min-width-80',
        width: 80,
        render: (value, record) => (
          <>
            <FormItem
              className={classnames('mb-0', stylesModule['icon-input'])}
              type={variables.NUMBER_INPUT}
              rules={[variables.RULES.EMPTY]}
              value={record?.s}
              onChange={(e) => onChangeInput(record, e, 's')}
            />
          </>
        )
      },
      {
        title: 'Z-scores (BMI in kg/m2)',
        width: 150,
        key: 'scores',
        children: [
          {
            title: '-3 SD',
            key: 'medianSmallerThirdSD',
            className: 'min-width-80',
            width: 80,
            align: 'center',
            render: (value, record) => (
              <>
                <FormItem
                  className={classnames('mb-0')}
                  type={variables.NUMBER_INPUT}
                  rules={[variables.RULES.EMPTY]}
                  value={record?.medianSmallerThirdSD}
                  onChange={(e) => onChangeInput(record, e, 'medianSmallerThirdSD')}
                />
              </>
            )
          },
          {
            title: '-2 SD',
            key: 'medianSmallerSecondSD',
            className: 'min-width-80',
            width: 80,
            align: 'center',
            render: (value, record) => (
              <>
                <FormItem
                  className={classnames('mb-0')}
                  type={variables.NUMBER_INPUT}
                  rules={[variables.RULES.EMPTY]}
                  value={record?.medianSmallerSecondSD}
                  onChange={(e) => onChangeInput(record, e, 'medianSmallerSecondSD')}
                />
              </>
            )
          },
          {
            title: '-1 SD',
            key: 'medianSmallerFirstSD',
            className: 'min-width-80',
            width: 80,
            align: 'center',
            render: (value, record) => (
              <>
                <FormItem
                  className={classnames('mb-0')}
                  type={variables.NUMBER_INPUT}
                  rules={[variables.RULES.EMPTY]}
                  value={record?.medianSmallerFirstSD}
                  onChange={(e) => onChangeInput(record, e, 'medianSmallerFirstSD')}
                />
              </>
            )
          },
          {
            title: 'Median',
            key: 'median',
            className: 'min-width-80',
            width: 80,
            align: 'center',
            render: (value, record) => (
              <>
                <FormItem
                  className={classnames('mb-0')}
                  type={variables.NUMBER_INPUT}
                  rules={[variables.RULES.EMPTY]}
                  value={record?.median}
                  onChange={(e) => onChangeInput(record, e, 'median')}
                />
              </>
            )
          },
          {
            title: '1 SD',
            key: 'medianLargerThirdSD',
            className: 'min-width-80',
            width: 80,
            align: 'center',
            render: (value, record) => (
              <>
                <FormItem
                  className={classnames('mb-0')}
                  type={variables.NUMBER_INPUT}
                  rules={[variables.RULES.EMPTY]}
                  value={record?.medianLargerThirdSD}
                  onChange={(e) => onChangeInput(record, e, 'medianLargerThirdSD')}
                />
              </>
            )
          },
          {
            title: '2 SD',
            key: 'medianLargerSecondSD',
            className: 'min-width-80',
            width: 80,
            align: 'center',
            render: (value, record) => (
              <>
                <FormItem
                  className={classnames('mb-0')}
                  type={variables.NUMBER_INPUT}
                  rules={[variables.RULES.EMPTY]}
                  value={record?.medianLargerSecondSD}
                  onChange={(e) => onChangeInput(record, e, 'medianLargerSecondSD')}
                />
              </>
            )
          },
          {
            title: '3 SD',
            key: 'medianLargerFirstSD',
            className: 'min-width-80',
            width: 80,
            align: 'center',
            render: (value, record) => (
              <>
                <FormItem
                  className={classnames('mb-0')}
                  type={variables.NUMBER_INPUT}
                  rules={[variables.RULES.EMPTY]}
                  value={record?.medianLargerFirstSD}
                  onChange={(e) => onChangeInput(record, e, 'medianLargerFirstSD')}
                />
              </>
            )
          },
        ]
      },
      {
        title: '',
        key: 'delete',
        className: 'min-width-60',
        width: 60,
        align: 'center',
        render: (value, record) => (
          <>
           <DeleteOutlined   onClick={(e) => onChangeInput(record, e, 'delete')}/>
          </>
        )
      },
    ];
    return columns;
  };
  const headerEdit = () => {
    const columns = [
      {
        title: 'Tháng tuổi',
        key: 'monthNumber',
        className: 'min-width-80',
        width: 80,
        render: (value, record) => (
          <>
            {record?.monthNumber}
          </>
        )
      },
      {
        title: 'L',
        key: 'l',
        align: 'center',
        className: 'min-width-80',
        width: 80,
        render: (value, record) => (
          <>
            {record?.l}
          </>
        )
      },
      {
        title: 'M',
        key: 'm',
        align: 'center',
        className: 'min-width-80',
        width: 80,
        render: (value, record) => (
          <>
            {record?.m}
          </>
        )
      },
      {
        title: 'S',
        key: 's',
        align: 'center',
        className: 'min-width-80',
        width: 80,
        render: (value, record) => (
          <>
            {record?.s}
          </>
        )
      },
      {
        title: 'Z-scores (BMI in kg/m2)',
        width: 150,
        key: 'scores',
        children: [
          {
            title: '-3 SD',
            key: 'medianSmallerThirdSD',
            className: 'min-width-80',
            width: 80,
            align: 'center',
            render: (value, record) => (
              <>
                {record?.medianSmallerThirdSD}
              </>
            )
          },
          {
            title: '-2 SD',
            key: 'medianSmallerSecondSD',
            className: 'min-width-80',
            width: 80,
            align: 'center',
            render: (value, record) => (
              <>
                {record?.medianSmallerSecondSD}
              </>
            )
          },
          {
            title: '-1 SD',
            key: 'medianSmallerFirstSD',
            className: 'min-width-80',
            width: 80,
            align: 'center',
            render: (value, record) => (
              <>
                {record?.medianSmallerFirstSD}
              </>
            )
          },
          {
            title: 'Median',
            key: 'median',
            className: 'min-width-80',
            width: 80,
            align: 'center',
            render: (value, record) => (
              <>
                {record?.median}
              </>
            )
          },
          {
            title: '1 SD',
            key: 'medianLargerThirdSD',
            className: 'min-width-80',
            width: 80,
            align: 'center',
            render: (value, record) => (
              <>
                {record?.medianLargerThirdSD}
              </>
            )
          },
          {
            title: '2 SD',
            key: 'medianLargerSecondSD',
            className: 'min-width-80',
            width: 80,
            align: 'center',
            render: (value, record) => (
              <>
                {record?.medianLargerSecondSD}
              </>
            )
          },
          {
            title: '3 SD',
            key: 'medianLargerFirstSD',
            className: 'min-width-80',
            width: 80,
            align: 'center',
            render: (value, record) => (
              <>
                {record?.medianLargerFirstSD}
              </>
            )
          },
        ]
      },
    ];
    return columns;
  };
  const onFinish = () => {
    const items = data.map((item) => ({
      monthNumber: item?.monthNumber ? `${item?.monthNumber}` : "0",
      value: {
        l: item?.l ? `${item?.l}` : "0",
        m: item?.m ? `${item?.m}` : "0",
        s: item?.s ? `${item?.s}` : "0",
        medianSmallerThirdSD: item?.medianSmallerThirdSD ? `${item?.medianSmallerThirdSD}` : "0",
        medianSmallerSecondSD: item?.medianSmallerSecondSD ? `${item?.medianSmallerSecondSD}` : "0",
        medianSmallerFirstSD: item?.medianSmallerFirstSD ? `${item?.medianSmallerFirstSD}` : "0",
        median: item?.median ? `${item?.median}` : "0",
        medianLargerThirdSD: item?.medianLargerThirdSD ? `${item?.medianLargerThirdSD}` : "0",
        medianLargerSecondSD: item?.medianLargerSecondSD ? `${item?.medianLargerSecondSD}` : "0",
        medianLargerFirstSD: item?.medianLargerFirstSD ? `${item?.medianLargerFirstSD}` : "0",
      }
    }));
    dispatch({
      type: 'physicalIndexDeclarationV1/POST',
      payload: { items, type: search?.type },
      callback: (response, error) => {
        if (response) {
          dispatch({
            type: 'physicalIndexDeclarationV1/GET_DATA',
            payload: {},
            callback: (response) => {
              if (response) {
                if (response?.items?.length > 0) {
                  setData(response?.items?.map(i => ({
                    ...i,
                    ...i?.value,
                  })));
                }
              };
            },
          });
        }
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
    <Pane className="p20">
      <Helmet title="BMI" />
      <Heading type="form-title" style={{ marginBottom: 20 }}>
        Khai báo chỉ số BMI theo WHO
      </Heading>
      <Tabs
        activeKey={search?.type}
        onChange={(event) => onChangeSelectStatus(event, 'status')}
      >
        {variablesModules.STATUS_TABS.map((item) => (
          <TabPane tab={`${item.name}`} key={item.id} />
        ))}
      </Tabs>
      <Pane className="card">
        <Pane className="border-bottom">
          <Pane className="p20">
            <div className={stylesModule['wrapper-table']}>
              <Loading loading={loading} isError={error.isError} params={{ error }}>
                <Table
                  columns={checkEdit ? header() : headerEdit()}
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

                    !checkEdit ? false :
                      <Button
                        key={index}
                        onClick={() =>
                          setData([
                            ...data,
                            {
                              id: uuidv4(),
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
              </Loading>
            </div>
          </Pane>
        </Pane>
        {checkEdit ?
          <Pane className="d-flex justify-content-between align-items-center p20">
            <p
              className="btn-delete"
              role="presentation"

              onClick={() => setCheckEdit(false)}
            >
              Cancel
            </p>
            <Button color="success" htmlType="submit" loading={loadingSubmit} className="ml-2" onClick={() => onFinish()}>
              Lưu
            </Button>
          </Pane>
          :
          <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
            <Button color="success" loading={loadingSubmit} className="ml-2" onClick={() => setCheckEdit(true)}>
              Edit
            </Button>
          </Pane>
        }
      </Pane>
    </Pane>
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
