import { ITransactionHistory } from "@/interfaces/TransactionHistory";
import { transactionHistoryService } from "@/services/transaction-history-service";
import { Avatar, Card, CardBody } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { TransactionTypeNames } from "../course-section/course-section-with-student-and-score/enum/transaction-type-enum";

const items = [
  {
    id: 1,
    name: "Jose Perez",
    picture: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    amount: "4500 USD",
    date: "9/20/2021",
  },
  {
    id: 5,
    name: "Jose Perez",
    picture: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    amount: "4500 USD",
    date: "9/20/2021",
  },
  {
    id: 2,
    name: "Jose Perez",
    picture: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    amount: "4500 USD",
    date: "9/20/2021",
  },
  {
    id: 3,
    name: "Jose Perez",
    picture: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    amount: "4500 USD",
    date: "9/20/2021",
  },
  {
    id: 4,
    name: "Jose Perez",
    picture: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    amount: "4500 USD",
    date: "9/20/2021",
  },
];

export const CardTransactions = () => {
  const [latestTransactions, setLatestTransactions] = useState<ITransactionHistory[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const getLatestTransactionHistory = async() => {
    const res = await transactionHistoryService.getLatesTranstractionHistory();
    setLatestTransactions(res.data);
    setIsFetching(false);
  }

  useEffect(() => {
    getLatestTransactionHistory();
  }, [])

  if (isFetching) return <div className="w-full h-full flex justify-center items-center" >Waiting...</div>;

  return (
    <Card className=" bg-default-50 rounded-xl shadow-md px-3">
      <CardBody className="py-5 gap-4">
        <div className="flex flex-col gap-6 ">
          {latestTransactions.map((item: ITransactionHistory) => (
            <div key={item.id} className="w-full gap-x-4 flex items-center align-middle">
              <a className="text-sky-500 underline block w-2/3" href={`https://app.tryethernal.com/transaction/${item.transaction_hash}`}>
                {item.transaction_hash}
              </a>
              <span className="block">{TransactionTypeNames[item.transaction_type]}</span>
              <span className="block">{item.block_number}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
