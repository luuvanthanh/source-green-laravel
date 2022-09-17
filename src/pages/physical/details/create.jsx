import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector, useParams, useDispatch, useLocation, useHistory } from 'dva';
import { isEmpty, findIndex } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
// import moment from 'moment';

import Pane from '@/components/CommonComponent/Pane';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Heading from '@/components/CommonComponent/Heading';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import { Helper, variables } from '@/utils';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import Loading from '@/components/CommonComponent/Loading';

const Index = memo(() => {
  const [
    menuData,
    { details, error, physicals },
    loading,
  ] = useSelector(({ menu, physicalDetails, loading: { effects } }) => [
    menu.menuLeftPhysical,
    physicalDetails,
    effects,
  ]);

  const location = useLocation();
  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const mounted = useRef(false);
  const [data, setData] = useState([]);
  const [errorTable, setErrorTable] = useState(false);

  // console.log(data, height?.value, weight?.value);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    if (params?.id) {
      dispatch({
        type: 'physicalDetails/GET_DETAILS',
        payload: {
          id: params?.id,
        },
      });
      dispatch({
        type: 'physicalDetails/GET_PHYSICAL',
      });
    }
  }, [params?.id]);

  useEffect(() => {
    if (!isEmpty(details?.studentCriterias)) {
      const weight = details?.studentCriterias.find(
        (item) => item?.criteriaGroupProperty?.property === 'Cân nặng',
      );
      const height = details?.studentCriterias.find(
        (item) => item?.criteriaGroupProperty?.property === 'Chiều cao',
      );
      setData([
        {
          id: uuidv4(),
          weight: {
            ...weight,
            old: weight?.value || 0,
            value: '',
          },
          height: {
            ...height,
            old: height?.value,
            value: '',
          },
        },
      ]);
    }
  }, [details]);

  const onChange = (value, record, name) => {
    const index = findIndex([...data], (item) => item?.id === record?.id);
    const newData = [...data];
    newData[index] = {
      ...record,
      [name]: {
        ...record[name],
        value,
      },
    };
    setData(newData);
  };

  const columns = [
    {
      title: 'Chiều cao (cm)',
      children: [
        {
          title: 'Cũ',
          key: 'old',
          className: 'min-width-100',
          align: 'center',
          render: (record) => record?.height.old || 0,
        },
        {
          title: 'Mới',
          key: 'new',
          className: 'min-width-100',
          align: 'center',
          render: (record) => (
            <>
              <FormItem
                className="mb-0"
                type={variables.INPUT_COUNT}
                rules={[variables.RULES.EMPTY]}
                value={record?.height?.value || ''}
                onChange={(e) => onChange(e, record, 'height')}
              />
              {errorTable && !record?.height?.value && (
                <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
              )}
            </>
          ),
        },
      ],
    },
    {
      title: 'Cân nặng (kg)',
      children: [
        {
          title: 'Cũ',
          key: 'old',
          className: 'min-width-100',
          align: 'center',
          render: (record) => record?.weight?.old || 30,
        },
        {
          title: 'Mới',
          key: 'weight',
          className: 'min-width-100',
          align: 'center',
          render: (record) => (
            <>
              <FormItem
                className="mb-0"
                type={variables.INPUT_COUNT}
                rules={[variables.RULES.EMPTY]}
                value={record?.weight?.value || ''}
                onChange={(e) => onChange(e, record, 'weight')}
              />
              {errorTable && !record?.weight?.value && (
                <span className="text-danger">{variables.RULES.EMPTY_INPUT.message}</span>
              )}
            </>
          ),
        },
      ],
    },
  ];

  const onFinish = () => {
    const checkErrorTable = !isEmpty(data)
      ? !!data.find((item) => !item?.height?.value || !item?.weight?.value)
      : true;
    setErrorTable(checkErrorTable);
    if (checkErrorTable) {
      return true;
    }
    const payload = [];
    [...data].forEach((item) => {
      if (item?.weight?.value) {
        payload.push({
          reportDate: item?.weight?.reportDate,
          criteriaGroupPropertyId: physicals.find((i) => i.code === 'WEIGHT').id || '',
          studentId: params?.id || '',
          value: String(item?.weight?.value || 0),
          note: '',
        });
      }
      if (item?.height?.value) {
        payload.push({
          reportDate: item?.height?.reportDate,
          criteriaGroupPropertyId: physicals.find((i) => i.code === 'HEIGHT').id || '',
          studentId: params?.id || '',
          value: String(item?.height?.value || 0),
          note: '',
        });
      }
    });
    return dispatch({
      type: 'physicalDetails/UPDATE',
      payload,
      callback: (response) => {
        if (response) {
          history.push(location?.pathname.replace('/nhap-the-chat', ''));
        }
      },
    });
  };

  return (
    <Loading
      loading={loading['physicalDetails/GET_DETAILS']}
      isError={error.isError}
      params={{ error, goBack: location?.pathname.replace('/nhap-the-chat', '') }}
    >
      <Helmet title="Nhập thể chất" />
      <Pane style={{ padding: 20, paddingBottom: 0 }}>
        <Breadcrumbs last="Nhập thể chất" menu={menuData} />
        <Pane className="row">
          <Pane className="col-lg-6 offset-lg-3 card">
            <Pane className="p20">
              <Heading type="page-title">Học sinh</Heading>
              <AvatarTable
                fileImage={Helper.getPathAvatarJson(details?.student?.fileImage)}
                fullName={details?.student?.fullName || ''}
                description={`${details?.student?.age || 0} tháng tuổi`}
              />
              <Pane className="row">
                <Pane className="col-lg-6 mt15">
                  <Text size="normal">
                    Cơ sở:{' '}
                    <span className="font-weight-bold">
                      {details?.student?.class?.branch?.name || ''}
                    </span>
                  </Text>
                </Pane>
                <Pane className="col-lg-6 mt15">
                  <Text size="normal">
                    Lớp:{' '}
                    <span className="font-weight-bold">{details?.student?.class?.name || ''}</span>
                  </Text>
                </Pane>
              </Pane>
              <Pane className="py20">
                <Table
                  bordered
                  columns={columns}
                  dataSource={data}
                  loading={false}
                  isError={error?.isError}
                  pagination={false}
                  rowKey={(record) => record.id}
                  scroll={{ x: '100%' }}
                />
              </Pane>
              <div className="d-flex justify-content-between align-items-center">
                <p className="mb0 font-size-14 underline">Hủy</p>
                <Button
                  icon="save"
                  size="large"
                  color="success"
                  onClick={onFinish}
                  loading={
                    loading['physicalDetails/GET_DETAILS'] || loading['physicalDetails/UPDATE']
                  }
                >
                  LƯU
                </Button>
              </div>
            </Pane>
          </Pane>
        </Pane>
      </Pane>
    </Loading>
  );
});

export default Index;
