import { TransactionTypeEnum } from "@/components/course-section/course-section-with-student-and-score/enum/transaction-type-enum";

export interface ITransactionHistory {
    id: number,
    transaction_hash: string,
    transaction_type: TransactionTypeEnum,
    block_number: number
}