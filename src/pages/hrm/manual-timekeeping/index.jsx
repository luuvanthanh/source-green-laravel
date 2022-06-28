import styles from '@/assets/styles/Common/common.scss';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import { Form, Modal } from 'antd';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'dva';
import { debounce, isEmpty } from 'lodash';
import moment from 'moment';
import React, { memo, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { history, useLocation, useParams } from 'umi';

const Index = memo(() => {
  const [formRef] = Form.useForm();
  const [modalRef] = Form.useForm();
  const { query, pathname } = useLocation();
  const { params } = useParams();
  const dispatch = useDispatch();
  const [{ data, pagination, employees }] = useSelector(({ manualTimekeeping }) => [
    manualTimekeeping,
  ]);

  const [search, setSearch] = useState({
    key: query?.key,
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    employeeId: query?.employeeId,
    endDate: query?.endDate ? moment(query?.endDate) : moment().startOf('month').add(24, 'days'),
    startDate: query?.startDate
      ? moment(query?.startDate)
      : moment().startOf('month').subtract(1, 'months').add(25, 'days'),
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataCopy, setDataCopy] = useState([]);
  const [isLoadDataCopy, setIsLoadDataCopy] = useState(false);

  const onLoad = () => {
    setIsLoadDataCopy(true);
    dispatch({
      type: 'manualTimekeeping/GET_DATA',
      payload: {
        ...search,
        endDate: Helper.getDate(search.endDate, variables.DATE_FORMAT.DATE_AFTER),
        startDate: Helper.getDate(search.startDate, variables.DATE_FORMAT.DATE_AFTER),
      },
      callback: (response) => {
        if (response) {
          setIsLoadDataCopy(false);
        }
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
          endDate: Helper.getDate(search.endDate, variables.DATE_FORMAT.DATE_AFTER),
          startDate: Helper.getDate(search.startDate, variables.DATE_FORMAT.DATE_AFTER),
        },
        variables.QUERY_STRING,
      )}`,
    );
  };
  console.log(employees);
  useEffect(() => {
    dispatch({
      type: 'manualTimekeeping/GET_EMPLOYEES',
    });
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

  const debouncedSearchMonth = debounce((value) => {
    setSearch((prev) => ({
      ...prev,
      startDate: moment(value).startOf('month').subtract(1, 'months').add(25, 'days'),
      endDate: moment(value).startOf('month').add(24, 'days'),
      page: variables.PAGINATION.PAGE,
      limit: variables.PAGINATION.PAGE_SIZE,
    }));
  }, 500);

  const onChange = (e, type) => {
    debouncedSearch(e.target.value, type);
  };

  const onChangeMonth = (e) => {
    debouncedSearchMonth(e);
  };

  const onChangeSelect = (e, type) => {
    debouncedSearch(e, type);
  };

  const changePagination = ({ page, limit }) => {
    setSearch((prev) => ({
      ...prev,
      page,
      limit,
    }));
  };

  const paginationFunction = (pagination) =>
    Helper.paginationLavarel({
      pagination,
      callback: (response) => {
        changePagination(response);
      },
    });

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onChangeDateModal = () => {
    setIsLoadDataCopy(true);
    dispatch({
      type: 'manualTimekeeping/GET_DATA',
      payload: {
        endDate: Helper.getDate(
          moment(modalRef.getFieldValue().startDate).startOf('month').add(24, 'days'),
          variables.DATE_FORMAT.DATE_AFTER,
        ),
        startDate: Helper.getDate(
          moment(modalRef.getFieldValue().startDate)
            .startOf('month')
            .subtract(1, 'months')
            .add(25, 'days'),
          variables.DATE_FORMAT.DATE_AFTER,
        ),
      },
      callback: (response) => {
        if (response) {
          setDataCopy(response);
          setIsLoadDataCopy(false);
        }
      },
    });
  };

  const handleOk = () => {
    modalRef.validateFields().then((values) => {
      const dataDay = Helper.convertArrayDays(Helper.getDate(
        moment(values.startDate).startOf('month').subtract(1, 'months').add(25, 'days'),
        variables.DATE_FORMAT.DATE_AFTER),
        Helper.getDate(
          moment(values.startDate).startOf('month').add(24, 'days'),
          variables.DATE_FORMAT.DATE_AFTER,
        ));
      const check = (i) => moment(i).day() !== 0 && moment(i).day() !== 1;
      const dayFilter = dataDay?.filter(i => check(i));

      const payload =
        employees?.map(item => ({
          employeeId: item?.id,
          listOfDate: dayFilter?.map(i =>
          ({
            date: moment(i),
            type: "X"
          }))
        }));
      dispatch({
        type: 'manualTimekeeping/COPY',
        payload: { data: payload },
        callback: () => {
          modalRef.resetFields();
        },
      });
    });
    setIsModalVisible(false);
  };

  const header = () => {
    const columns = [
      {
        title: 'STT',
        key: 'stt',
        className: 'min-width-60',
        width: 60,
        align: 'center',
        render: (text, record, index) => Helper.serialOrder(search?.page, index, search?.limit),
      },
      {
        title: 'Họ và tên',
        key: 'fullname',
        width: 250,
        className: 'min-width-250',
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record.fileImage)}
            fullName={record.fullName}
          />
        ),
      },
      {
        title: 'Bộ phận',
        key: 'branch',
        width: 250,
        className: 'min-width-250',
        render: (record) => record?.positionLevelNow?.branch?.name,
      },
      {
        title: 'Số ngày công',
        key: 'workdays',
        width: 250,
        className: 'min-width-250',
        align: 'center',
        render: (record) => record?.manualCalculation?.filter((i) => i.type === 'X').length,
      },
      {
        title: 'Số ngày nghỉ có phép',
        key: 'daysOfLeave',
        width: 250,
        className: 'min-width-250',
        align: 'center',
        render: (record) => record?.manualCalculation?.filter((i) => i.type === 'F').length,
      },
      {
        title: 'Số ngày nghỉ không phép',
        key: 'daysOffWithoutLeave',
        width: 250,
        className: 'min-width-250',
        align: 'center',
        render: (record) => record?.manualCalculation?.filter((i) => i.type === 'K').length,
      },
    ];
    return columns;
  };

  return (
    <>
      <Helmet title="Chấm công thủ công" />
      <Modal
        centered
        title="Chấm công nhanh"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={
          <div className="d-flex justify-content-between align-items-center">
            <p key="back" role="presentation" onClick={handleCancel}>
              Hủy
            </p>
            <Button
              key="submit"
              color="success"
              type="primary"
              onClick={handleOk}
              disabled={isEmpty(employees)}
            >
              Lưu
            </Button>
          </div>
        }
      >
        <Form
          form={modalRef}
          layout="vertical"
          initialValues={{
            startDate: moment(),
          }}
        >
          <div className="row">
            <div className="col-lg-6">
              <FormItem
                label="Tháng muốn chấm công"
                name="startDate"
                onChange={(event) => onChangeDateModal(event)}
                type={variables.MONTH_PICKER}
                allowClear={false}
              />
            </div>
            <div className="col-lg-12">
              <Table
                bordered
                isEmpty
                columns={header(params)}
                dataSource={employees}
                pagination={false}
                params={{
                  header: header(),
                  type: 'table',
                }}
                rowKey={(record) => record.id}
                scroll={{ x: '100%', y: '40vh' }}
              />
            </div>
          </div>
        </Form>
      </Modal>
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        <div className="row d-flex justify-content-between align-items-center mt-4 mb-4 w-100">
          <div className="col-lg-3">
            <Text color="dark">Chấm công thủ công</Text>
          </div>
          <div className="col-lg-6 p0 d-flex justify-content-end">
            <Button color="yellow" icon="file" onClick={showModal} className="mr10">
              Chấm công nhanh
            </Button>
            <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
              Chấm công
            </Button>
          </div>
        </div>
        <div className={styles['block-table']}>
          <Form
            initialValues={{
              ...search,
              date: search.endDate && moment(search.endDate),
              employeeId: search.employeeId || null,
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
                  onChange={(event) => onChangeMonth(event, 'date')}
                  type={variables.MONTH_PICKER}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-6">
                <FormItem
                  data={[{ id: null, name: 'Tất cả nhân viên' }, ...employees]}
                  name="employeeId"
                  onChange={(event) => onChangeSelect(event, 'employeeId')}
                  type={variables.SELECT}
                />
              </div>
            </div>
          </Form>
          <Table
            bordered
            isEmpty
            columns={header(params)}
            dataSource={data}
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
});

export default Index;
