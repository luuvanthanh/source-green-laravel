import { memo, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Helmet } from 'react-helmet';
import Button from '@/components/CommonComponent/Button';
import { Form, Select } from 'antd';
import { useParams } from 'umi';
import Text from '@/components/CommonComponent/Text';
import { head, isEmpty } from 'lodash';

import Heading from '@/components/CommonComponent/Heading';
import styles from '@/assets/styles/Common/common.scss';
import { useSelector, useDispatch } from 'dva';

import Table from '@/components/CommonComponent/Table';
import stylesModule from '../../styles.module.scss';

const { Option } = Select;

const Index = memo(() => {
  const dispatch = useDispatch();

  const {
    loading: { effects },
    details,
    dataFoodMaterials,
  } = useSelector(({ loading, OPchildrenAdd }) => ({
    loading,
    details: OPchildrenAdd.details,
    dataFoodMaterials: OPchildrenAdd.dataFoodMaterials,
    error: OPchildrenAdd.error,
  }));
  const [data, setData] = useState([
    {
      materialId: undefined,
      id: uuidv4(),
    },
  ]);
  const onChange = (e, record, key) => {
    setData((prev) =>
      prev.map((item) => (item.id === record.id ? { ...item, [key]: e } : { ...item })),
    );
  };

  const [remove, setRemove] = useState([]);
  const params = useParams();
  const [form] = Form.useForm();
  const mounted = useRef(false);
  const loading = effects[`OPchildrenAdd/GET_ALLERGIC_INGREDIENTS`];

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const header = () => {
    const columns = [
      {
        title: 'STT',
        key: 'a',
        className: 'min-width-80',
        width: 80,
        render: (text, record, index) => <Text size="normal">{index + 1}</Text>,
      },
      {
        title: 'Tên nguyên liệu',
        key: 'a',
        className: 'min-width-120',
        render: (record) => (
          <Select
            showSearch
            className="w-100"
            defaultValue={record.materialName}
            onChange={(e) => onChange(e, record, 'materialId')}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {dataFoodMaterials?.map((item) => (
              <Option key={item.id}>{item?.name || ''}</Option>
            ))}
          </Select>
        ),
      },
      {
        key: 'action',
        width: 120,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              onClick={() => {
                setData(
                  data.filter(
                    (val) =>
                      (val.key || val.id || val.test) !== (record.key || record.id || record.test),
                  ),
                );
                setRemove([...remove, record.id]);
              }}
              type="button"
              color="danger"
              icon="remove"
              className={stylesModule.remove}
            />
          </div>
        ),
      },
    ];
    return columns;
  };

  const onLoad = () => {
    dispatch({
      type: 'OPchildrenAdd/GET_ALLERGIC_INGREDIENTS',
      payload: {
        studentId: params?.id,
        classId: details?.student?.classId,
      },
      callback: (res) => {
        if (res) {
          setData(res?.items);
        }
      },
    });
  };

  const addMaterials = () => {
    dispatch({
      type: 'OPchildrenAdd/ADD_MATERIALS',
      payload: data?.map((item) => ({
        studentId: params?.id,
        classId: details?.student?.classId,
        materialId: item?.materialId,
        id: item?.id,
      })),
      callback: (res, error) => {
        if (res) {
          onLoad();
        }
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              form.setFields([
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
    if (params?.id && details?.student?.classId) {
      onLoad();
    }
  }, [params?.id, details]);

  useEffect(() => {
    dispatch({
      type: 'OPchildrenAdd/GET_FOOD_COMMONS_MATERIALS',
      payload: {},
    });
  }, []);

  return (
    <>
      <Helmet title="Nguyên liệu dị ứng" />
      <div>
        <Heading type="form-title" className="mb15">
          Nguyên liệu dị ứng
        </Heading>
        <Form layout="vertical" form={form} initialValues={{}}>
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
              bordered={false}
              rowKey={(record) => record.id}
              scroll={{ x: '100%' }}
              footer={(item, index) => (
                <Button
                  key={index}
                  onClick={() =>
                    setData([
                      ...data,
                      {
                        id: uuidv4(),
                        materialId: undefined,
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
        </Form>
        <div className="p20 d-flex justify-content-end align-items-center ">
          <Button
            color="success"
            htmlType="submit"
            className="ml-2"
            loading={loading}
            onClick={() => addMaterials()}
          >
            Lưu
          </Button>
        </div>
      </div>
    </>
  );
});

export default Index;
