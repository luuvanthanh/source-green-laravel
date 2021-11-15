// import { memo, useState, useRef, useEffect } from 'react';
// import { Helmet } from 'react-helmet';
// import { Form, Select, InputNumber, Tag, Input} from 'antd';
// import classnames from 'classnames';
// import moment from 'moment';
// import { useHistory, useParams } from 'umi';
// import { useSelector, useDispatch } from 'dva';
// import TableCus from '@/components/CommonComponent/Table';
// import Text from '@/components/CommonComponent/Text';
// import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
// import Pane from '@/components/CommonComponent/Pane';
// import Button from '@/components/CommonComponent/Button';
// import { Helper, variables } from '@/utils';
// import styles from '@/assets/styles/Common/common.scss';
// import { isEmpty, isNil, keyBy, omit, omitBy, size } from 'lodash';
// import { v4 as uuidv4 } from 'uuid';
// import FormItem from '@/components/CommonComponent/FormItem';
// import Loading from '@/components/CommonComponent/Loading';

// const { Option } = Select;

// const Index = memo(() => {
//   const {
//     colorTags,
//     loading,
//   } = useSelector(({ loading, crmTags }) => ({
//     loading,
//     colorTags: crmTags.colorTags,
//   }));
// console.log('colorTags',colorTags)
//   const dispatch = useDispatch();
//   const params = useParams();
//   const history = useHistory();
//   const formRef = useRef();

//   const [data, setData] = useState([
//     {
//       id: uuidv4(),
//       category: { name: undefined },
//       product_id: undefined,
//       conversion_unit: undefined,
//       conversion_price: undefined,
//     },
//   ]);

//   const [products, setProducts] = useState({
//     productsChildren: [],
//     productsId: {},
//   });

//   const [units, setUnits] = useState([]);

//   const omitByArrs = (arr) => {
//     const omitObjectArrs = arr.map((val) => omit(omitBy(val, isNil), ['key', 'category']));
//     const filterArrays = omitObjectArrs.filter((val) => !isEmpty(val));
//     return filterArrays.length ? filterArrays : undefined;
//   };

//   const onFinish = (values) => {
//     const payload = {
//       ...params,
//       start_date: Helper.getDate(values.start_date, variables.DATE_FORMAT.DATE_AFTER),
//       end_date: Helper.getDate(values.end_date, variables.DATE_FORMAT.DATE_AFTER),
//       price_row: omitByArrs(data),
//     };
//     console.log('payload',payload)
//     dispatch({
//       type: '',
//       payload,
//       callback: (response, error) => {
//         if (response) {
//           history.goBack();
//         }
//         if (error) {
//           if (error?.errors && !isEmpty(error?.errors)) {
//             error?.errors.forEach((item) => {
//               formRef.current.setFields([
//                 {
//                   name: item?.source?.pointer,
//                   errors: [item.detail],
//                 },
//               ]);
//             });
//           }
//         }
//       },
//     });
//   };

//   useEffect(() => {
//     dispatch({
//       type: 'crmTags/GET_DATA_PRODUCTS',
//       payload: {},
//       callback: (response) => {
//         if (response) {
//           const productsChildren = (response?.parsePayload || []).filter((val) => val);
//           const productsId = keyBy(response?.parsePayload || [], 'id');
//           setProducts({
//             productsChildren,
//             productsId,
//           });
//         }
//       },
//     });
//     dispatch({
//       type: 'crmTags/GET_UNITS',
//       payload: {},
//       callback: (response) => {
//         if (response) {
//           setUnits(response.parsePayload);
//         }
//       },
//     });
//   }, []);
// console.log('data',data)
//   useEffect(() => {
//       dispatch({
//         type: 'crmTags/GET_TAGS',
//         payload: {},
//         callback: (response) => {
//           if (response) {
//             setData(
//               response.parsePayload.map((item) => ({
//                 ...item,
//               })),
//             );
//           }
//         },
//       });
//   }, [params.id]);

//   const onSelectProduct = (productId, record) => {
//     setData((prev) =>
//       prev.map((item) => ({
//             ...item,
//             color_code: item.id === record.id ? productId: item.color_code,
//       })),
//     );
//   };

//   const onSelectConversionUnit = (value, record) => {
//     setData((prev) =>
//       prev.map((item) => ({
//         ...item,
//         conversion_unit: item.id === record.id ? value : item.conversion_price,
//       })),
//     );
//   };

//   const changeConversionPrice = (value, record) => {
//     setData((prev) =>
//       prev.map((item) => ({
//         ...item,
//         name: item.id === record.id ? value : item.name,
//       })),
//     );
//   };

//   const onChangeTitle = (e, record) => {
//     setData((prev) =>
//       prev.map((item) => (item.id === record.id ? { ...item, name: e.target.value } : item)),
//     );
//   };


//   const columns = [
//     {
//       title: 'Màu',
//       key: 'color_code',
//       dataIndex: 'color_code',
//       width: 350,
//       className: classnames('min-width-350', 'max-width-350'),
//       render: (code, record) => {
//         const initValue = code || products?.productsId[record.color_code]?.id;
//         return (
//           <Select
//             className="w-100"
//             defaultValue= {record.color_code}
//             onChange={(val) => onSelectProduct(val, record)}
//           >
//             {colorTags.map((item) => (
//               <Option value={item?.name || ''} key={item.name} style={{ backgroundColor: `${item.name}`}}>
//                 {item?.name || ''}
//               </Option>
//             ))}
//           </Select>
//         );
//       },
//     },
//     {
//       title: 'Tên tags',
//       key: 'name',
//       className: 'min-width-150',
//       width: 150,
//       render: (value,record) => (
//         <Input.TextArea
//           value={value.name}
//           autoSize={{ minRows: 1, maxRows: 1 }}
//           placeholder="Nhập"
//           onChange={(e) => onChangeTitle(e, record)}
//         />
//       ),
//     },
//     {
//       title: 'Hiển thị',
//       dataIndex: 'conversion_unit',
//       key: 'conversion_unit',
//       width: 350,
//       className: classnames('min-width-350', 'max-width-350'),
//       render: (value, record) => (
//         <Tag
//           defaultValue={value}
//           className="w-100"
//           color= {record.color_code}
//         >
//           {record.name}
//         </Tag>
//       ),
//     },
//     {
//       key: 'action',
//       className: 'min-width-80',
//       width: 80,
//       fixed: 'right',
//       render: (record) => (
//         <div className={styles['list-button']}>
//           <Button color="danger" icon="remove"  onClick={() => {
//                setExchange((prev) => prev.filter((val) => val.id !== record.id));
//              }} />
//           {/* <button
//             type="button"
//             className={styles['button-action']}
//             onClick={() => {
//                setExchange((prev) => prev.filter((val) => val.id !== record.id));
//              }}
//           >
//             <span className="icon-remove" />
//           </button> */}
//         </div>
//       ),
//     },
//   ];

//   return (
//     <>
//       <Pane className="pl20 pr20 mt20">
//         <Form ref={formRef} onFinish={onFinish} initialValues={{}} layout="vertical">
//           <Loading
//             loading={loading['crmTags/GET_DATA'] || loading['crmTags/GET_UNITS']}
//           >
//             <Pane className="row">
//               <Pane className="offset-lg-12 col-lg-12">
//                 <Pane
//                   className={classnames(
//                     'd-flex justify-content-between align-items-center mb20',
//                     styles['heading-container'],
//                   )}
//                 >
//                     <Text color="dark">Tags</Text>
//                 </Pane>
//                 <Pane className="card">
//                   <Pane className="p20">
//                     <Pane className={classnames('vertical mt20', styles['table-vertical'])}>
//                       <TableCus
//                         rowKey={(record) => record.id}
//                         className="table-edit"
//                         columns={columns}
//                         dataSource={data}
//                         pagination={false}
//                         scroll={{ x: '100%' }}
//                         footer={() => (
//                           <Button
//                             onClick={() =>
//                               setData([
//                                 ...data,
//                                 {
//                                   id: uuidv4(),
//                                   category: { name: undefined },
//                                   product_id: undefined,
//                                   conversion_unit: undefined,
//                                   conversion_price: undefined,
//                                 },
//                               ])
//                             }
//                             color="transparent-success"
//                             icon="plus"
//                           >
//                             Thêm tags
//                           </Button>
//                         )}
//                       />
//                     </Pane>
//                   </Pane>
//                 </Pane>
//                 <Pane className="d-flex justify-content-between align-items-center mb20">
//                   <Button
//                     loading={
//                       loading['crmTags/ADD'] ||
//                       loading['crmTags/UPDATE'] ||
//                       loading['crmTags/GET_DATA']
//                     }
//                     className="ml-auto px25"
//                     color="success"
//                     htmlType="submit"
//                     size="large"
//                   >
//                     Lưu
//                   </Button>
//                 </Pane>
//               </Pane>
//             </Pane>
//           </Loading>
//         </Form>
//       </Pane>
//     </>
//   );
// });

// export default Index;
