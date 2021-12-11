import styles from '@/assets/styles/Common/common.scss';
import FormItem from '@/components/CommonComponent/FormItem';
import Pane from '@/components/CommonComponent/Pane';
import TableCus from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import { Form } from 'antd';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'dva';
import { debounce } from 'lodash';
import moment from 'moment';
import { memo, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import { useHistory, useLocation } from 'umi';
import stylesModule from './styles.module.scss';

const Index = memo(() => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { query, pathname } = useLocation();
  const [
    { pagination, error, data },
    loading,
  ] = useSelector(({ medicalIncidentSituation, loading: { effects } }) => [medicalIncidentSituation, effects]);
  const [search, setSearch] = useState({
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    start_date: query?.start_date || moment().startOf('months'),
    end_date: query?.end_date || moment().endOf('months'),
  });

  const changeFilterDebouce = debounce((name, value) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      start_date: value[0],
      end_date: value[1],
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    }));
  }, 300);

  const changeFilter = (name) => (value) => {
    changeFilterDebouce(name, value);
  };

  const onLoad = () => {
    dispatch({
      type: 'medicalIncidentSituation/GET_DATA',
      payload: {
        ...search,
        start_date: Helper.getDate(search.start_date, variables.DATE_FORMAT.DATE_AFTER),
        end_date: Helper.getDate(search.end_date, variables.DATE_FORMAT.DATE_AFTER),
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
        start_date: Helper.getDate(search.start_date, variables.DATE_FORMAT.DATE_AFTER),
        end_date: Helper.getDate(search.end_date, variables.DATE_FORMAT.DATE_AFTER),
      }),
    });
  };

  const paginationProps = useMemo(
    () => ({
      size: 'default',
      total: pagination?.total || 0,
      pageSize: variables.PAGINATION.PAGE_SIZE,
      defaultCurrent: Number(search.page),
      current: Number(search.page),
      hideOnSinglePage: (pagination?.total || 0) <= 10,
      showSizeChanger: false,
      pageSizeOptions: false,
      onChange: (page, limit) => {
        setSearch((prev) => ({
          ...prev,
          page,
          limit,
        }));
      },
    }),
    [pagination],
  );

  useEffect(() => {
    onLoad();
  }, [search]);

  const columns = () => {

    const columns = [
      {
        title: 'Thời gian',
        dataIndex: 'created_at',
        width: 160,
        className: 'min-width-160',
        render: (value, record) => {
          if (record.items) {
            return (
              <Text size="normal">
                {record.date}
              </Text>
            );
          }
          return <Text size="normal">{Helper.getDate(value)}</Text>;
        },
      },
      {
        title: 'Học sinh',
        dataIndex: 'full_name',
        width: 150,
        className: 'min-width-150',

      },
      {
        title: 'Cơ sở',
        width: 140,
        className: 'min-width-140',
        render: (record) => <Text size="normal">{record.basis}</Text>,
      },
      {
        title: 'Lớp',
        dataIndex: 'class',
        width: 170,
        className: 'min-width-170',

      },
      {
        title: 'Sự cố',
        width: 170,
        dataIndex: 'Wound_location',
        className: 'min-width-170',
      },
      {
        title: 'Vị trí vết thương',
        dataIndex: 'Wound_location',
        key: 'price',
        width: 140,
        className: 'min-width-140',
      },
      {
        title: 'Triệu chứng',
        dataIndex: 'Symptom',
        width: 160,
        className: 'min-width-160',

      },
      {
        title: 'Hình ảnh',
        key: 'totalPrice',
        width: 140,
        className: 'min-width-140',
        render: (value, record) => {
          // if (record.date === 'TOTAL') {
          //   return <strong>TỔNG CỘNG</strong>;
          // }
          if (record.items) {
            return (
              ""
            );
          }
          return <AvatarTable
            fileImage={Helper.getPathAvatarJson(record.file_image)}
            fullName={record.name}
          />;
        },
      },
      {
        title: 'Trạng thái xử lý',
        dataIndex: 'class',
        width: 160,
        className: 'min-width-160',
      },
      {
        title: 'Cách xử lý',
        dataIndex: 'class',
        width: 140,
        className: 'min-width-140',
      },
      {
        title: 'Người xử lý',
        dataIndex: 'class',
        width: 140,
        className: 'min-width-140',
      },
    ];
    return columns;
  };

  return (
    <>
      <Helmet title="Báo cáo tình hình sự cố của học sinh" />
      <Pane className="p20">
        <Pane className={classnames(styles['heading-container'])}>
          <Text color="dark">Báo cáo tình hình sự cố của học sinh</Text>
        </Pane>
        <Pane className="card mt20">
          <Pane className="p20">
            <Form
              layout="vertical"
              initialValues={{
                range_picker: search.start_date &&
                  search.end_date && [moment(search.start_date), moment(search.end_date)],
              }}
            >
              <Pane className="row">
                <Pane className="col-lg-3">
                  <FormItem
                    type={variables.RANGE_PICKER}
                    name="range_picker"
                    onChange={(values) => {
                      changeFilter('range_picker')(values);
                    }}
                    allowClear={false}
                    placeholder="Nhập từ khóa tìm kiếm"
                  />
                </Pane>
                <Pane className="col-lg-2">
                  <FormItem
                    // data={[{  name: 'Tất cả cơ sở' }]}
                    name="district"
                    type={variables.SELECT}
                    allowClear={false}
                    placeholder="Chọn cơ sở"
                  />
                </Pane>
                <Pane className="col-lg-2">
                  <FormItem
                    // data={[{ name: 'Tất cả lớp học' }]}
                    name="district"
                    type={variables.SELECT}
                    allowClear={false}
                    placeholder="Chọn lớp học"
                  />
                </Pane>
              </Pane>
            </Form>
            <div className={stylesModule['wrapper-table']}>
              <TableCus
                columns={columns()}
                dataSource={data}
                loading={loading['medicalIncidentSituation/GET_DATA']}
                isError={error.isError}
                defaultExpandAllRows
                childrenColumnName="items"
                rowKey={(record) => record.date || record.id}
                pagination={paginationProps}
                className="table-normal table-report"
                scroll={{ x: '100%', y: '60vh' }}
                rowClassName={(record) => {
                  if (record.items) {
                    return 'row-table-parent';
                  }
                  return '';
                }}
              />
            </div>
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
