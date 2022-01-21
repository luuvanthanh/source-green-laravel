import React, { useEffect, useState, memo } from 'react';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import { useHistory, useLocation } from 'umi';
import { useDispatch, useSelector } from 'dva';
import stylesModule from './styles.module.scss';

const Index = memo(() => {
  const [
    { data, pagination, branches, classes, error },
    loading,
  ] = useSelector(({ loading: { effects }, reportAngleTools }) => [reportAngleTools, effects]);

  const formRef = React.createRef();
  const { query, pathname } = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [search, setSearch] = useState({
    KeyWord: query?.KeyWord,
    branchId: query?.branchId,
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    date: query.date ? moment(query.date) : moment(),
  });

  const onLoad = () => {
    dispatch({
      type: 'medicalStudentProblem/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
          date: Helper.getDate(search.from, variables.DATE_FORMAT.DATE_AFTER),
        },
        variables.QUERY_STRING,
      )}`,
    );
  };

  const loadCategories = () => {
    if (search.branchId) {
      dispatch({
        type: 'medicalStudentProblem/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    dispatch({
      type: 'medicalStudentProblem/GET_BRACHES',
      payload: {},
    });
  };

  useEffect(() => {
    onLoad();
    loadCategories();
  }, [search]);

  const debouncedSearch = debounce((value, type) => {
    setSearch((prev) => ({
      ...prev.search,
      [`${type}`]: value,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    }));
  }, 300);

  const onChange = (e, type) => {
    debouncedSearch(e.target.value, type);
  };

  const onChangeSelect = (e, type) => {
    debouncedSearch(e, type);
  };

  const onChangeSelectBranch = (e, type) => {
    debouncedSearch(e, type);
    dispatch({
      type: 'medicalStudentProblem/GET_CLASSES',
      payload: {
        branch: e,
      },
    });
  };

  const changePagination = ({ page, limit }) => {
    setSearch((prev) => ({
      ...prev.search,
      page,
      limit,
    }));
  };

  const onChangeDate = (e, type) => {
    debouncedSearch(moment(e).format(variables.DATE_FORMAT.DATE_AFTER), type);
  };

  const paginationFunction = (pagination) => {
    Helper.paginationNet({
      pagination,
      query,
      callback: (response) => {
        changePagination(response);
      },
    });
  };

  const header = () => {
    const columns = [
      {
        title: 'Họ và tên',
        key: 'name',
        width: 200,
        fixed: 'left',
        // render: (record) => <Text size="normal">{record?.name}</Text>,
        render: (text, record, index) => {
          const obj = {
            children: record.name,
            props: {},
          };
          if (index > 0) {
            obj.props.rowSpan = 0;
            return obj;
          }
          obj.props.rowSpan = 3;
          return obj;
        },
      },
      {
        title: 'Cơ sở',
        key: 'branch',
        width: 150,
        fixed: 'left',
        render: (record) => <Text size="normal">{record?.branch}</Text>,
      },
      {
        title: 'Lớp',
        key: 'class',
        width: 150,
        render: (record) => <Text size="normal">{record?.class}</Text>,
      },
      {
        title: 'Góc giáo cụ',
        key: 'angle_tools',
        width: 150,
        render: (record) => <Text size="normal">{record?.angle_tools}</Text>,
      },
      {
        title: 'Ý nghĩa cuộc sống',
        key: 'meaningful_life',
        width: 150,
        render: (record) => <Text size="normal">{record?.meaningful_life}</Text>,
      },
      {
        title: 'Ngày học giáo cụ',
        key: 'date',
        width: 150,
        render: (record) => <Text size="normal">{record?.date}</Text>,
      },
      {
        title: 'Thời gian',
        key: 'time',
        width: 150,
        render: (record) => <Text size="normal">{record?.time}</Text>,
      },
      {
        title: 'Giáo cụ',
        key: 'angle_tool',
        width: 150,
        render: (record) => <Text size="normal">{record?.angle_tool}</Text>,
      },
      {
        title: 'Hình ảnh giáo cụ',
        key: 'image',
        width: 150,
        render: (record) => <Text size="normal">{record?.image}</Text>,
      },
      {
        title: 'Nội dung giáo cụ',
        key: 'content',
        width: 150,
        render: (record) => <Text size="normal">{record?.content}</Text>,
      },
      {
        title: 'Ý nghĩa giáo cụ',
        key: 'meaningful_angle_tools',
        width: 150,
        render: (record) => <Text size="normal">{record?.meaningful_angle_tools}</Text>,
      },
      {
        title: 'Kĩ năng đạt được',
        key: 'skill',
        width: 150,
        render: (record) => <Text size="normal">{record?.skill}</Text>,
      },
      {
        title: 'Cấp độ',
        key: 'level',
        width: 150,
        render: (record) => <Text size="normal">{record?.level}</Text>,
      },
      {
        title: 'Diễn giải cấp độ',
        key: 'description_level',
        width: 150,
        render: (record) => <Text size="normal">{record?.description_level}</Text>,
      },
      {
        title: 'Thời kỳ nhạy cảm',
        key: 'sensitive_period',
        width: 150,
        render: (record) => <Text size="normal">{record?.sensitive_period}</Text>,
      },
      {
        title: 'Diễn giải thời kỳ nhạy cảm',
        key: 'description_sensitive_period',
        width: 150,
        render: (record) => <Text size="normal">{record?.description_sensitive_period}</Text>,
      },
      {
        title: 'Tham gia của phụ huynh',
        key: 'attention_parent',
        width: 150,
        render: (record) => <Text size="normal">{record?.attention_parent}</Text>,
      },
      {
        title: 'Nhận xét của giáo viên',
        key: 'description_teacher',
        width: 150,
        render: (record) => <Text size="normal">{record?.description_teacher}</Text>,
      },
    ];
    return columns;
  };

  return (
    <>
      <Helmet title="Danh sách học sinh theo năm học theo cơ sở hoặc tổng" />
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        {/* FORM SEARCH */}
        <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
          <Text color="dark">Danh sách học sinh theo năm học theo cơ sở hoặc tổng</Text>
          <Button color="primary" icon="export" className="ml-2">
            Tải danh sách
          </Button>
        </div>
        <div className={classnames(styles['block-table'])}>
          <Form
            initialValues={{
              ...search,
              branchId: search.branchId || null,
              classId: search.classId || null,
              date: search.date && moment(search.date),
            }}
            layout="vertical"
            ref={formRef}
          >
            <div className="row">
              <div className="col-lg-3">
                <FormItem
                  name="year"
                  onChange={(event) => onChangeDate(event, 'date')}
                  type={variables.RANGE_PICKER}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tất cả cơ sở ' }, ...branches]}
                  name="branchId"
                  onChange={(event) => onChangeSelectBranch(event, 'branchId')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tất cả lớp' }, ...classes]}
                  name="classId"
                  onChange={(event) => onChangeSelect(event, 'classId')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  name="KeyWord"
                  onChange={(event) => onChange(event, 'KeyWord')}
                  placeholder="Nhập từ khóa tìm kiếm"
                  type={variables.INPUT_SEARCH}
                />
              </div>
            </div>
          </Form>
          <div className={stylesModule['wrapper-table']}>
            <Table
              columns={header()}
              dataSource={data}
              loading={loading['medicalStudentProblem/GET_DATA']}
              error={error}
              isError={error.isError}
              defaultExpandAllRows
              childrenColumnName="children"
              bordered
              pagination={paginationFunction(pagination)}
              params={{
                header: header(),
                type: 'table',
              }}
              rowKey={(record) => record.key || record.id}
              scroll={{ x: '100%' }}
            />
          </div>
        </div>
      </div>
    </>
  );
});

export default Index;
