import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import { useDispatch, useSelector } from 'dva';

const Index = () => {
  const [formRef] = Form.useForm();
  const dispatch = useDispatch();
  const { params } = useRouteMatch();
  const { query, pathname } = useLocation();
  const history = useHistory();

  const [{ data }, loading] = useSelector(({ loading: { effects }, timetableGroupActivities }) => [
    timetableGroupActivities,
    effects,
  ]);

  const [search, setSearch] = useState({
    type: query?.type,
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
  });

  const onLoad = () => {
    dispatch({
      type: 'timetableGroupActivities/GET_DATA',
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
    setSearch((prevState) => ({
      ...prevState.search,
      [`${type}`]: value,
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    }));
  }, 300);

  const onChangeInput = (e, type) => {
    debouncedSearch(e.target.value, type);
  };

  /**
   * Function set pagination
   * @param {integer} page page of pagination
   * @param {integer} size size of pagination
   */
  const changePagination = ({ page, limit }) => {
    setSearch((prevState) => ({
      ...prevState.search,
      page,
      limit,
    }));
  };

  /**
   * Function pagination of table
   * @param {object} pagination value of pagination items
   */
  const pagination = (pagination) =>
    Helper.paginationNet({
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
          type: 'timetableGroupActivities/REMOVE',
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

  const header = () => {
    const columns = [
      {
        title: 'STT',
        key: 'text',
        width: 50,
        align: 'center',
        // render: (text, record, index) =>
        //   Helper.sttList(pagination?.current_page, index, pagination?.per_page),
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Mã nhóm',
        key: 'code',
        className: 'min-width-180',
        width: 180,
        render: (record) => record?.code,
      },
      {
        title: 'Tên nhóm',
        key: 'name',
        className: 'min-width-150',
        width: 150,
        render: (record) => record?.name,
      },
      {
        title: 'Số hoạt động',
        key: 'totalDetails',
        className: 'min-width-150',
        width: 130,
        render: (record) => record?.totalDetails,
      },
      {
        key: 'action',
        className: 'min-width-50',
        width: 50,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="primary"
              icon="edit"
              onClick={() => history.push(`${pathname}/${record.id}/chi-tiet`)}
            />
            <Button color="danger" icon="remove" onClick={() => onRemove(record.id)} />
          </div>
        ),
      },
    ];

    return columns;
  };

  return (
    <>
      <Helmet title="Nhóm hoạt động" />
      <div
        className={classnames(
          styles['content-form'],
          styles['content-form-timetableGroupActivities'],
        )}
      >
        {/* FORM SEARCH */}
        <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
          <Text color="dark">Nhóm hoạt động</Text>
          <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
            Tạo mới
          </Button>
        </div>
        <div className={classnames(styles['block-table'])}>
          <Form
            initialValues={{
              ...search,
            }}
            layout="vertical"
            form={formRef}
          >
            <div className="row">
              <div className="col-lg-3">
                <FormItem
                  name="fullName"
                  onChange={(event) => onChangeInput(event, 'fullName')}
                  placeholder="Nhập từ khóa tìm kiếm"
                  type={variables.INPUT_SEARCH}
                />
              </div>
            </div>
          </Form>
          <Table
            bordered
            columns={header(params)}
            dataSource={data}
            loading={loading['timetableGroupActivities/GET_DATA']}
            pagination={pagination(pagination)}
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
};

export default Index;
