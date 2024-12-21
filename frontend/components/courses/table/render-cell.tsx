import { Tooltip } from "@nextui-org/react";
import React from "react";
import { DeleteIcon } from "@/components/icons/table/delete-icon";
import { EditIcon } from "@/components/icons/table/edit-icon";
import { ICourse } from "@/interfaces/Course";
import { EyeIcon } from "@/components/icons/table/eye-icon";

interface Props {
  course: ICourse;
  columnKey: string | React.Key;
}

export const RenderCell = ({ course, columnKey }: Props) => {
  // @ts-ignore
  const cellValue = course[columnKey];
  switch (columnKey) {
    case "actions":
      return (
        <div className="flex items-center gap-4 ">
          <div>
            <Tooltip content="Edit user" color="secondary">
              <button onClick={() => console.log("Edit user")}>
                <EditIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              content="Delete user"
              color="danger"
              onClick={() => console.log("Delete user")}
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
