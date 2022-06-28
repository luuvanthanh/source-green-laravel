import React, { useState, useEffect } from 'react';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce, get } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import { useHistory, useLocation, useRouteMatch } from 'umi';
import { useDispatch, useSelector } from 'dva';

function Index() {
  const [formRef] = Form.useForm();
  const { query, pathname } = useLocation();
  const { params } = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();

  const [
    { data, pagination, employees, categories },
    loading,
  ] = useSelector(({ loading: { effects }, seasonalContracts }) => [seasonalContracts, effects]);

  const [search, setSearch] = useState({
    type: query?.type,
    fullName: query?.fullName,
    branchId: query?.branchId,
    positionId: query?.positionId,
    typeOfContractId: query?.typeOfContractId,
    employeeId: query?.employeeId ? query?.employeeId.split(',') : undefined,
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
  });

  const loadCategories = () => {
    dispatch({
      type: 'seasonalContracts/GET_EMPLOYEES',
      payload: {},
    });
    dispatch({
      type: 'seasonalContracts/GET_CATEGORIES',
      payload: {},
    });
  };

  const onLoad = () => {
    dispatch({
      type: 'seasonalContracts/GET_DATA',
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
    loadCategories();
  }, []);

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

  const onChangeSelect = (e, type) => {
    debouncedSearch(e, type);
  };

  const changePagination = ({ page, limit }) => {
    setSearch(
      (prev) => ({
        ...prev,
        page,
        limit,
      }),
      () => {
        onLoad();
      },
    );
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
          type: 'seasonalContracts/REMOVE',
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

  const exportFile = (id) => {
    Helper.exportExcel(`/v1/seasonal-contracts-export-word/${id}`, {}, 'HopDongThoiVu.docx');
  };

  /**
   * Function header table
   */
  const header = () => {
    const columns = [
      {
        title: 'Nhân viên',
        key: 'name',
        className: 'min-width-220',
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(get(record, 'employee.fileImage'))}
            fullName={get(record, 'employee.fullName')}
          />
        ),
      },
      {
        title: 'Số hợp đồng',
        key: 'contract_number',
        dataIndex: 'contractNumber',
        className: 'min-width-120',
      },
      {
        title: 'Ngày hợp đồng',
        key: 'date',
        dataIndex: 'contractDate',
        className: 'min-width-150',
        render: (value) => Helper.getDate(value, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Loại hợp đồng',
        key: 'contract_category',
        dataIndex: 'typeOfContract',
        className: 'min-width-120',
        render: (value) => value?.name,
      },
      {
        title: 'Số tháng/Số ngày hợp đồng',
        key: 'contract_category',
        className: 'min-width-150',
        render: (record) => `${record.month} tháng`,
      },
      {
        title: 'Nơi làm việc',
        key: 'branch',
        dataIndex: 'branch',
        className: 'min-width-150',
        render: (value) => value?.name,
      },
      {
        title: 'Chức vụ',
        key: 'position',
        dataIndex: 'position',
        className: 'min-width-150',
        render: (value) => value?.name,
      },
      {
        title: 'Trạng thái',
        key: 'status',
        width: 150,
        className: 'min-width-150',
        render: (record) =>
          Helper.getStatusContracts(moment(record?.contractFrom), moment(record?.contractTo), record),
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
            <li className="list-inline-item">
              <Button
                color="success"
                icon="export"
                className="ml-2"
                onClick={() => exportFile(record.id)}
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
      <Helmet title="Danh sách hợp đồng thời vụ" />
      <div className={classnames(styles['content-form'], styles['content-form-seasonalContracts'])}>
        {/* FORM SEARCH */}
        <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
          <Text color="dark">Danh sách hợp đồng thời vụ</Text>
          <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
            Thêm mới
          </Button>
        </div>
        <div className={classnames(styles['block-table'])}>
          <Form
            initialValues={{
              ...search,
              typeOfContractId: search.typeOfContractId || null,
              branchId: search.branchId || null,
              positionId: search.positionId || null,
            }}
            layout="vertical"
            form={formRef}
          >
            <div className="row">
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tất cả hợp đồng' }, ...categories.typeOfContracts]}
                  name="typeOfContractId"
                  onChange={(event) => onChangeSelect(event, 'typeOfContractId')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tất cả nơi làm việc' }, ...categories.branches]}
                  name="branchId"
                  onChange={(event) => onChangeSelect(event, 'branchId')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={[{ id: null, name: 'Tất cả chức vụ' }, ...categories.positions]}
                  name="positionId"
                  onChange={(event) => onChangeSelect(event, 'positionId')}
                  type={variables.SELECT}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  data={Helper.convertSelectUsers(employees)}
                  name="employeeId"
                  onChange={(event) => onChangeSelect(event, 'employeeId')}
                  type={variables.SELECT_MUTILPLE}
                  placeholder="Chọn tất cả"
                />
              </div>
            </div>
          </Form>
          <Table
            bordered
            columns={header(params)}
            dataSource={data}
            loading={loading['seasonalContracts/GET_DATA']}
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
