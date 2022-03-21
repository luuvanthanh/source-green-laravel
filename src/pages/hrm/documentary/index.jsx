import React, { useState, useEffect } from 'react';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce, get, isEmpty, head, last } from 'lodash';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import { useHistory, useLocation, useRouteMatch } from 'umi';
import { useDispatch, useSelector } from 'dva';
import moment from 'moment';

function Index() {
  const [formRef] = Form.useForm();
  const { query, pathname } = useLocation();
  const { params } = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();

  const [
    { data, pagination },
    loading,
  ] = useSelector(({ loading: { effects }, HRMdocumentary }) => [HRMdocumentary, effects]);

  const [search, setSearch] = useState({
    typeOfDocument: query?.typeOfDocument,
    topic: query?.topic,
    key: query?.key,
    startDate:
      query?.startDate || moment().startOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
    endDate: query?.endDate || moment().endOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
  });

  const onLoad = () => {
    dispatch({
      type: 'HRMdocumentary/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
        },
        variables.QUERY_STRING,
      )}`,
    );
  };

  useEffect(() => {
    onLoad();
  }, [search]);

  const debouncedSearch = debounce((value, type) => {
    setSearch((prev) => ({
      ...prev,
      [`${type}`]: value,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    }));
  }, 300);

  const debouncedSearchDateRank = debounce((startDate, endDate) => {
    setSearch((prevState) => ({
      ...prevState.search,
      startDate,
      endDate,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    }));
  }, 300);

  const onChangeSelect = (e, type) => {
    debouncedSearch(e, type);
  };

  const onChange = (e, type) => {
    debouncedSearch(e.target.value, type);
  };

  const onChangeDateRank = (e) => {
    if (!isEmpty(e)) {
      debouncedSearchDateRank(
        moment(head(e))?.format(variables.DATE_FORMAT.DATE_AFTER),
        moment(last(e))?.format(variables.DATE_FORMAT.DATE_AFTER),
      );
    } else {
      debouncedSearchDateRank(
        moment().startOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
        moment().endOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
      );
    }
  };

  const changePagination = ({ page, limit }) => {
    setSearch((prev) => ({
      ...prev,
      page,
      limit,
    }));
  };

  /**
   * Function pagination of table
   * @param {object} pagination value of pagination items
   */
  const paginationFunction = (pagination) =>
    Helper.paginationLavarel({
      pagination,
      callback: (response) => {
        changePagination(response);
      },
    });

  /**
   * Function remove items
   * @param {uid} id id of items
   */
  const onRemove = (id) => {
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'HRMdocumentary/REMOVE',
          payload: {
            id,
          },
          callback: (response) => {
            if (response) onLoad();
          },
        });
      },
    });
  };

  /**
   * Function header table
   */
  const header = () => {
    const columns = [
      {
        title: 'Mã ID',
        key: 'STT',
        className: 'min-width-80',
        render: (text, record, index) =>
          `CV${Helper.serialOrder(search?.page, index, search?.limit)}`,
      },
      {
        title: 'Thời gian gởi',
        key: 'date',
        dataIndex: 'creationTime',
        className: 'min-width-150',
        render: (value) => Helper.getDate(value, variables.DATE_FORMAT.DATE_TIME),
      },
      {
        title: 'BP gởi',
        key: 'sentDivisionId',
        className: 'min-width-120',
        render: (record) => <Text size="normal">{get(record, 'sentDivision.name')}</Text>,
      },
      {
        title: 'Người gởi',
        key: 'name',
        className: 'min-width-220',
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(get(record, 'employeeSender.fileDocument'))}
            fullName={get(record, 'employeeSender.fullName')}
          />
        ),
      },
      {
        title: 'Loại công văn',
        key: 'typeOfDocument',
        dataIndex: 'typeOfDocument',
        className: 'min-width-120',
        render: (value) => {
          const result = variables.DOCUMENT_TYPE.find((item) => item.id === value);
          return <Text size="normal">{result?.name}</Text>;
        },
      },
      {
        title: 'Chủ đề',
        key: 'topic',
        dataIndex: 'topic',
        className: 'min-width-150',
        render: (value) => {
          const result = variables.TOPIC_TYPE.find((item) => item.id === value);
          return <Text size="normal">{result?.name}</Text>;
        },
      },
      {
        title: 'Tiêu đề',
        key: 'title',
        dataIndex: 'title',
        className: 'min-width-150',
        render: (value) => <Text size="normal">{value}</Text>,
      },
      {
        title: 'Thao tác',
        key: 'actions',
        width: 180,
        className: 'min-width-180',
        fixed: 'right',
        align: 'center',
        render: (record) => (
          <ul className="list-unstyled list-inline">
            <li className="list-inline-item">
              <Button
                color="primary"
                icon="edit"
                onClick={() => history.push(`${pathname}/${record.id}/chi-tiet`)}
              />
            </li>
            <li className="list-inline-item">
              <Button
                color="danger"
                icon="remove"
                className="ml-2"
                onClick={() => onRemove(record.id)}
              />
            </li>
          </ul>
        ),
      },
    ];

    return columns;
  };

  return (
    <>
      <Helmet title="Quản lý công văn" />
      <div className={classnames(styles['content-form'], styles['content-form-HRMdocumentary'])}>
        {/* FORM SEARCH */}
        <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
          <Text color="dark">Quản lý công văn</Text>
          <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
            Thêm mới
          </Button>
        </div>
        <div className={classnames(styles['block-table'])}>
          <Form
            initialValues={{
              ...search,
              typeOfDocument: search.typeOfDocument || null,
              topic: search.topic || null,
              date: search.startDate &&
                search.endDate && [moment(search.startDate), moment(search.endDate)],
            }}
            layout="vertical"
            form={formRef}
          >
            <div className="row">
              <div className="col-lg-3">
                <FormItem
                  name="key"
                  onChange={(event) => onChange(event, 'key')}
                  placeholder="Nhập từ khóa tìm kiếm"
                  type={variables.INPUT_SEARCH}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  name="date"
                  onChange={(event) => onChangeDateRank(event, 'date')}
                  type={variables.RANGE_PICKER}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tất cả loại công văn' }, ...variables.DOCUMENT_TYPE]}
                  name="typeOfDocument"
                  onChange={(event) => onChangeSelect(event, 'typeOfDocument')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tất cả chủ đề' }, ...variables.DOCUMENT_TOPIC]}
                  name="topic"
                  onChange={(event) => onChangeSelect(event, 'topic')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
            </div>
          </Form>
          <Table
            bordered
            columns={header(params)}
            dataSource={data}
            loading={loading['HRMdocumentary/GET_DATA']}
            pagination={paginationFunction(pagination)}
            params={{
              header: header(),
              type: 'table',
            }}
            rowKey={(record) => record.id}
            scroll={{ x: '100%' }}
          />
        </div>
      </div>
    </>
  );
}

export default Index;
