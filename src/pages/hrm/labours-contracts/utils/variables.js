export const variables = {
  TYPES: [
    { value: 'contract', label: 'Hợp đồng không uỷ quyền' },
    { value: 'contract_authority', label: 'Hợp đồng uỷ quyền' },
    { value: 'contract_english', label: 'Hợp đồng song ngữ' },
    { value: 'contract_addendum', label: 'Phụ lục hợp đồng' },
  ],
  TYPE: {
    AUTHORITY: 'labours-contracts-export-word-authority',
    WORD: 'labours-contracts-export-word',
    ENGLISH: 'labours-contracts-export-word-english',
    ADDENDUM: 'contract-addendum',
  },
  STATUS: {
    CHUA_DEN_HAN: 'CHUA_DEN_HAN',
    DANG_HIEU_LUC: 'DANG_HIEU_LUC',
    GAN_HET_HAN: 'GAN_HET_HAN',
    DA_HET_HAN: 'DA_HET_HAN',
  },
  STATUS_NAME: {
    CHUA_DEN_HAN: 'Chưa đến hạn',
    DANG_HIEU_LUC: 'Đang hiệu lực',
    GAN_HET_HAN: 'Gần hết hạn',
    DA_HET_HAN: 'Đã hết hạn',
  },
};

export default variables;
