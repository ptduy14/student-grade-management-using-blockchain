export enum TransactionTypeEnum {
    ADD = "Add",      // Thêm mới
    UPDATE = "Update" // Cập nhật
}

interface TransactionTypeNamesType {
    [key: string]: string;
}

export const TransactionTypeNames: TransactionTypeNamesType = {
    [TransactionTypeEnum.ADD]: "Thêm điểm",
    [TransactionTypeEnum.UPDATE]: "Cập nhật điểm"
}
