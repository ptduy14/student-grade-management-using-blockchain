import { User, Tooltip, Chip, Button } from "@nextui-org/react";
import React from "react";
import { DeleteIcon } from "@/components/icons/table/delete-icon";
import { EditIcon } from "@/components/icons/table/edit-icon";
import { EyeIcon } from "@/components/icons/table/eye-icon";
import { ITeacher } from "@/interfaces/Teacher";
import { ViewBalance } from "../view-balance";

interface Props {
  teacher: ITeacher;
  columnKey: string | React.Key;
}

export const RenderCell = ({ teacher, columnKey }: Props) => {
  // @ts-ignore
  const cellValue = teacher[columnKey];
  switch (columnKey) {
    case "actions":
      return (
        <div className="flex items-center gap-4 ">
          <Button color="primary" size="sm">Chuyển token</Button>
          <Button color="primary" size="sm">Cấp token</Button>
          <ViewBalance teacher={teacher}/>
          <div>
            <Tooltip content="Edit user" color="secondary">
              <button onClick={() => console.log("Edit user", teacher.teacher_id)}>
                <EditIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              content="Delete user"
              color="danger"
              onClick={() => console.log("Delete user", teacher.teacher_id)}
            >
              <button>
                <DeleteIcon size={20} fill="#FF0080" />
              </button>
            </Tooltip>
          </div>
        </div>
      );
    default:
      return cellValue;
  }
};
