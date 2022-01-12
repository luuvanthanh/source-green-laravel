// import React, { useState, useEffect } from 'react';
// import { useHistory, useRouteMatch } from 'umi';
// import { Form, Checkbox, List, message, Upload } from 'antd';
// import Pane from '@/components/CommonComponent/Pane';
// import Heading from '@/components/CommonComponent/Heading';
// import Quill from '@/components/CommonComponent/Quill';
// import Button from '@/components/CommonComponent/Button';
// import FormItem from '@/components/CommonComponent/FormItem';
// import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
// import Loading from '@/components/CommonComponent/Loading';
// import AvatarTable from '@/components/CommonComponent/AvatarTable';
// import Text from '@/components/CommonComponent/Text';
// import styles from '@/assets/styles/Common/common.scss';
// import { Helper, variables } from '@/utils';
// import { useDispatch, useSelector } from 'dva';
// import { debounce, head, isEmpty, last, size, slice } from 'lodash';
// import InfiniteScroll from 'react-infinite-scroller';
// import { Scrollbars } from 'react-custom-scrollbars';
// import './styles.module.scss';

// const { Item: FormItemAntd } = Form;

// function Index() {
//   const [formRef] = Form.useForm();
//   const dispatch = useDispatch();
//   const { params } = useRouteMatch();
//   const history = useHistory();

//   const [
//     { error, branches, divisions },
//     loading,
//     { menuLeftHRM },
//   ] = useSelector(({ loading: { effects }, HRMdocumentaryAdd, menu }) => [
//     HRMdocumentaryAdd,
//     effects,
//     menu,
//   ]);

//   const [content, setContent] = useState('');
//   const [employees, setEmployees] = useState([]);
//   const [sentEmployees, setSentEmployees] = useState([]);
//   const [file, setFile] = useState([]);
//   const [isAllEmployees, setIsAllEmployees] = useState(false);
//   const [searchEmployee, setSearchEmployee] = useState({
//     total: 0,
//     hasMore: true,
//     loading: false,
//     branchId: null,
//     divisionId: null,
//   });

//   const checkHasValue = (value) => {
//     setEmployees(
//       employees.map((item) => {
//         const itemEmloyee = value?.parsePayload.employee.find((itemE) => itemE?.id === item.id);
//         return {
//           ...item,
//           checked: !!itemEmloyee,
//         };
//       }),
//     );
//   };

//   const onChangeEditor = (value) => {
//     setContent(value);
//   };

//   const debouncedSearchKeyWorkEmployee = debounce((value) => {
//     setSearchEmployee({ ...searchEmployee, loading: true });
//     dispatch({
//       type: 'HRMdocumentaryAdd/GET_EMPLOYEES',
//       payload: {
//         fullName: value?.trim(),
//       },
//       callback: (response) => {
//         if (response) {
//           setEmployees(response?.parsePayload);
//           setSearchEmployee({
//             ...searchEmployee,
//             total: response.totalCount,
//           });
//           checkHasValue(response);
//         }
//       },
//     });
//   }, 300);

//   const onChangeKeyworkEmployee = (e) => {
//     debouncedSearchKeyWorkEmployee(e.target.value);
//   };

//   useEffect(() => {
//     dispatch({
//       type: 'HRMdocumentaryAdd/GET_BRANCHES',
//       payload: {},
//     });

//     dispatch({
//       type: 'HRMdocumentaryAdd/GET_DIVISIONS',
//       payload: {},
//     });
//   }, []);

//   useEffect(() => {
//     setSearchEmployee({ ...searchEmployee, loading: true });
//     dispatch({
//       type: 'HRMdocumentaryAdd/GET_EMPLOYEES',
//       payload: {
//         ...searchEmployee,
//       },
//       callback: (response) => {
//         if (response) {
//           setEmployees(response?.parsePayload);
//           setSearchEmployee({
//             ...searchEmployee,
//             total: response.pagination.total,
//             loading: false,
//           });
//         }
//       },
//     });
//   }, []);

//   const changeCheckboxEmployee = (id) => {
//     setEmployees(
//       employees.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
//     );
//   };

//   const handleInfiniteOnLoad = () => {
//     setSearchEmployee({ ...searchEmployee, loading: true });
//     if (employees.length >= searchEmployee.total) {
//       message.warning('Danh sách đã hiển thị tất cả.');
//       setSearchEmployee({ ...searchEmployee, hasMore: false, loading: false });
//       return;
//     }
//     dispatch({
//       type: 'HRMdocumentaryAdd/GET_EMPLOYEES',
//       payload: {
//         ...searchEmployee,
//       },
//       callback: (response, error) => {
//         if (response) {
//           setEmployees((prev) => prev.concat(response?.parsePayload));
//           setSearchEmployee({
//             ...searchEmployee,
//             total: response.pagination.total,
//             loading: false,
//           });
//         }
//         if (error) {
//           message.error('Lỗi hệ thống.');
//           setSearchEmployee({ ...searchEmployee, hasMore: false, loading: false });
//         }
//       },
//     });
//   };

//   const changeAll = (event) => {
//     setIsAllEmployees(event.target.checked);
//   };

//   const onChangeSendDivision = (value) => {
//     setSearchEmployee({ ...searchEmployee, loading: true });
//     if (value) {
//       dispatch({
//         type: 'HRMdocumentaryAdd/GET_EMPLOYEES',
//         payload: {
//           divisionId: value,
//         },
//         callback: (response) => {
//           if (response) {
//             setSentEmployees(response?.parsePayload);
//           }
//         },
//       });
//     }
//   };

//   const onChangeBranch = (value) => {
//     setSearchEmployee({ ...searchEmployee, loading: true });
//     dispatch({
//       type: 'HRMdocumentaryAdd/GET_EMPLOYEES',
//       payload: {
//         ...searchEmployee,
//         branchId: value,
//       },
//       callback: (response) => {
//         if (response) {
//           setEmployees(response.parsePayload);
//           setSearchEmployee({
//             ...searchEmployee,
//             branchId: value,
//             total: response.pagination.total,
//             loading: false,
//           });
//         }
//       },
//     });
//   };

//   const onChangeDivision = (value) => {
//     setSearchEmployee({ ...searchEmployee, loading: true });
//     dispatch({
//       type: 'HRMdocumentaryAdd/GET_EMPLOYEES',
//       payload: {
//         ...searchEmployee,
//         divisionId: value,
//       },
//       callback: (response) => {
//         if (response) {
//           setEmployees(response.parsePayload);
//           setSearchEmployee({
//             ...searchEmployee,
//             divisionId: value,
//             total: response.pagination.total,
//             loading: false,
//           });
//         }
//       },
//     });
//   };

//   const removeFiles = () => {
//     setFile([]);
//   };

//   const onUpload = (file) => {
//     dispatch({
//       type: 'upload/UPLOAD',
//       payload: file,
//       callback: (response) => {
//         if (response) {
//           setFile((prev) => [
//             ...prev,
//             head(response.results)?.fileInfo.url,
//             head(response.results)?.fileInfo.name,
//           ]);
//         }
//       },
//     });
//   };

//   const props = {
//     beforeUpload() {
//       return null;
//     },
//     customRequest({ file }) {
//       const { name } = file;
//       const allowTypes = ['pdf', 'docx', 'xlsx'];
//       if (!allowTypes.includes(last(name.split('.')))) {
//         message.error('Chỉ hỗ trợ định dạng .pdf, .docx, .xlsx. Dung lượng không được quá 5mb');
//         return;
//       }
//       onUpload(file);
//     },
//     showUploadList: false,
//     fileList: [],
//   };

//   const onFinish = (values) => {
//     const payload = {
//       ...values,
//       id: params.id,
//       content,
//       fileDocument: JSON.stringify(slice(file, 0, 1)),
//       fileName: last(file),
//       detail: !isAllEmployees
//         ? employees.filter((item) => item.checked).map((item) => item.id)
//         : [],
//     };
//     // console.log(payload);
//     dispatch({
//       type: params.id ? 'HRMdocumentaryAdd/UPDATE' : 'HRMdocumentaryAdd/ADD',
//       payload,
//       callback: (response, error) => {
//         if (response) {
//           history.goBack();
//         }
//         if (error) {
//           if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
//             error?.validationErrors.forEach((item) => {
//               formRef.setFields([
//                 {
//                   name: head(item.members),
//                   errors: [item.message],
//                 },
//               ]);
//             });
//           }
//         }
//       },
//     });
//   };

//   useEffect(() => {
//     if (params.id && !isEmpty(employees)) {
//       dispatch({
//         type: 'HRMdocumentaryAdd/GET_DETAILS',
//         payload: params,
//         callback: (response) => {
//           if (response.parsePayload?.sentDivisionId) {
//             dispatch({
//               type: 'HRMdocumentaryAdd/GET_EMPLOYEES',
//               payload: {},
//               callback: (response) => {
//                 if (response) {
//                   setSentEmployees(response.parsePayload);
//                 }
//               },
//             });
//           }
//           if (response) {
//             formRef.setFieldsValue({
//               typeOfDocument: response.parsePayload?.typeOfDocument,
//               topic: response.parsePayload?.topic,
//               sentDivisionId: response.parsePayload?.sentDivisionId,
//               employeeId: response.parsePayload?.employeeId,
//               branchId: response.parsePayload?.branchId,
//               receiveDivisionId: response.parsePayload?.receiveDivisionId,
//               title: response.parsePayload.title,
//             });
//             setContent(response.parsePayload?.content);
//             setFile([response.parsePayload?.fileDocument, response.parsePayload?.fileName]);
//             checkHasValue(response);
//           }
//         },
//       });
//     }
//   }, [params.id && !isEmpty(employees)]);

//   return (
//     <>
//       <Breadcrumbs last={params.id ? 'Chỉnh sửa' : 'Thêm mới'} menu={menuLeftHRM} />
//       <Form className={styles['layout-form']} layout="vertical" form={formRef} onFinish={onFinish}>
//         <div className={styles['content-form']}>
//           <Loading
//             loading={loading['HRMdocumentaryAdd/GET_DETAILS']}
//             isError={error.isError}
//             params={{ error, type: 'container', goBack: '/quan-ly-nhan-su/quan-ly-cong-van' }}
//           >
//             <Pane className="row">
//               <Pane className="col-lg-6">
//                 <Pane className="card">
//                   <Pane className="border-bottom" style={{ padding: '20px 20px 0 20px' }}>
//                     <Pane className="mb20">
//                       <Heading type="form-title">Thông tin chung</Heading>
//                     </Pane>
//                   </Pane>

//                   <Pane className="border-bottom" style={{ padding: '20px 20px 0 20px' }}>
//                     <Pane className="row">
//                       <Pane className="col-lg-6">
//                         <FormItem
//                           label="Loại công văn"
//                           name="typeOfDocument"
//                           data={variables.DOCUMENT_TYPE}
//                           type={variables.SELECT}
//                           rules={[variables.RULES.EMPTY]}
//                         />
//                       </Pane>
//                       <Pane className="col-lg-6">
//                         <FormItem
//                           label="Chủ đề"
//                           name="topic"
//                           data={variables.TOPIC_TYPE}
//                           type={variables.SELECT}
//                         />
//                       </Pane>
//                       <Pane className="col-lg-6">
//                         <FormItem
//                           label="Bộ phận gửi"
//                           name="sentDivisionId"
//                           data={divisions}
//                           type={variables.SELECT}
//                           rules={[variables.RULES.EMPTY]}
//                           onChange={onChangeSendDivision}
//                         />
//                       </Pane>
//                       <Pane className="col-lg-6">
//                         <FormItem
//                           label="Người gửi"
//                           name="employeeId"
//                           data={Helper.convertSelectUsers(sentEmployees)}
//                           type={variables.SELECT}
//                           rules={[variables.RULES.EMPTY]}
//                         />
//                       </Pane>
//                     </Pane>
//                   </Pane>
//                   <Pane className="border-bottom" style={{ padding: '20px 20px 0 20px' }}>
//                     <Pane className="row">
//                       <Pane className="col-lg-6">
//                         <FormItem
//                           label="Cơ sở"
//                           name="branchId"
//                           data={branches}
//                           type={variables.SELECT}
//                           onChange={onChangeBranch}
//                         />
//                       </Pane>
//                       <Pane className="col-lg-6">
//                         <FormItem
//                           label="Bộ phận"
//                           name="receiveDivisionId"
//                           data={divisions}
//                           type={variables.SELECT}
//                           onChange={onChangeDivision}
//                         />
//                       </Pane>
//                     </Pane>
//                   </Pane>
//                   <Pane className="border-bottom" style={{ padding: '10px 20px 0 20px' }}>
//                     <Pane className="row">
//                       <Pane className="col-lg-12">
//                         <FormItem
//                           label="Người nhận"
//                           name="fullName"
//                           type={variables.INPUT_SEARCH}
//                           onChange={onChangeKeyworkEmployee}
//                         />
//                       </Pane>
//                     </Pane>
//                     <FormItemAntd label="Người nhận thông báo">
//                       <Checkbox checked={isAllEmployees} onChange={changeAll}>
//                         Tất cả nhân viên
//                       </Checkbox>
//                     </FormItemAntd>
//                   </Pane>
//                   {!isAllEmployees && (
//                     <Pane className="border-bottom">
//                       <Scrollbars autoHeight autoHeightMax="40vh">
//                         <InfiniteScroll
//                           hasMore={!searchEmployee.loading && searchEmployee.hasMore}
//                           initialLoad={searchEmployee.loading}
//                           loadMore={handleInfiniteOnLoad}
//                           pageStart={0}
//                           useWindow={false}
//                         >
//                           {employees?.map(({ id, fullName, positionLevel, fileImage, checked }) => (
//                             <List.Item key={id} className="border-bottom">
//                               <Pane className="px20 w-100 d-flex align-items-center">
//                                 <Checkbox
//                                   defaultChecked={checked}
//                                   className="mr15"
//                                   onChange={() => changeCheckboxEmployee(id)}
//                                 />
//                                 <Pane className="d-flex align-items-center">
//                                   <AvatarTable fileImage={Helper.getPathAvatarJson(fileImage)} />
//                                   <Pane className="ml15">
//                                     <h3 className="font-weight-bold" style={{ fontSize: '14px' }}>
//                                       {fullName}
//                                     </h3>
//                                     <Text size="small" style={{ color: '#7a7e84' }}>
//                                       {head(positionLevel)?.position?.name}
//                                     </Text>
//                                   </Pane>
//                                 </Pane>
//                               </Pane>
//                             </List.Item>
//                           ))}
//                         </InfiniteScroll>
//                       </Scrollbars>
//                     </Pane>
//                   )}
//                   <Pane className="p20">
//                     {!isAllEmployees && (
//                       <Text color="dark" size="normal">
//                         Đã chọn {size(employees?.filter((item) => item.checked))} nhân viên
//                       </Text>
//                     )}
//                   </Pane>
//                 </Pane>
//               </Pane>

//               <Pane className="col-lg-6">
//                 <Pane className="card">
//                   <Pane className="border-bottom" style={{ padding: '20px' }}>
//                     <Pane className="mb20">
//                       <Heading type="form-title">Tạo thông báo</Heading>
//                     </Pane>

//                     <FormItem
//                       name="title"
//                       label="Tiêu đề"
//                       type={variables.INPUT}
//                       rules={[variables.RULES.EMPTY_INPUT]}
//                     />
//                     <div className="ant-row ant-form-item mb0">
//                       <div className="ant-col ant-form-item-label">
//                         <label htmlFor="content" className="ant-form-item-required">
//                           <span>Nội dung</span>
//                         </label>
//                       </div>
//                     </div>
//                     <Quill className="mb20" onChange={onChangeEditor} value={content} />
//                     <div>
//                       <label className="ant-col ant-form-item-label d-flex">
//                         <span>Tài liệu đính kèm</span>
//                       </label>
//                       <Upload {...props} className="upload-file">
//                         <Button color="transparent" icon="upload1">
//                           Tải lên
//                         </Button>
//                         <i>Chỉ hỗ trợ định dạng .xlsx. Dung lượng không được quá 5mb</i>
//                       </Upload>
//                     </div>
//                     {!isEmpty(file) && (
//                       <div className="documentary-file">
//                         <div>{last(file)}</div>
//                         <Button
//                           color="danger"
//                           icon="remove"
//                           className="ml-2"
//                           onClick={removeFiles}
//                         />
//                       </div>
//                     )}
//                   </Pane>
//                   <Pane className="p20 d-flex justify-content-end align-items-center">
//                     <Button color="gray" size="large" onClick={() => history.goBack()}>
//                       Huỷ
//                     </Button>
//                     <Button
//                       color="success"
//                       size="large"
//                       loading={
//                         loading['HRMdocumentaryAdd/GET_BRANCHES'] ||
//                         loading['HRMdocumentaryAdd/GET_DIVISIONS'] ||
//                         loading['HRMdocumentaryAdd/ADD'] ||
//                         loading['HRMdocumentaryAdd/UPDATE']
//                       }
//                       style={{ marginLeft: '10px' }}
//                       htmlType="submit"
//                     >
//                       Lưu
//                     </Button>
//                   </Pane>
//                 </Pane>
//               </Pane>
//             </Pane>
//           </Loading>
//         </div>
//       </Form>
//     </>
//   );
// }

// export default Index;
