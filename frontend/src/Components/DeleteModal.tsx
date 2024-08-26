import React, { ChangeEvent, FormEventHandler } from "react";
import Modal from "./Modal";
import { WarningOutlined } from "@ant-design/icons";
import axios from "axios";

interface DeleteModalProps {
  isStockDelete: boolean;
  deleteStockitem: { id: number; symbol: string };
  deleteRoute: string;
  fetchStock: () => void;
  handleStockModalDelete: (id?: number, symbol?: string) => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isStockDelete,
  deleteStockitem,
  deleteRoute,
  fetchStock,
  handleStockModalDelete,
}) => {
  const onDelete: FormEventHandler = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    try {
      const response = await axios.delete(
        `${deleteRoute}/${deleteStockitem.id}`
      );
      if (response.status === 200) {
        fetchStock();
        handleStockModalDelete();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      isOpen={isStockDelete}
      onClick={handleStockModalDelete}
      className=" sm:mx-auto w-fit xl:w-[25vw] h-[45vh]"
    >
      <form
        method=""
        onSubmit={onDelete}
        className="h-full flex flex-col p-6 justify-between"
      >
        <div className="flex flex-col justify-center items-center">
          <WarningOutlined className="text-red-500 text-3xl h-full bg-/50" />
          <h2 className="text-2xl bg-/50">Delete Stock </h2>
        </div>

        <div className="w-full h-fit rounded-[8px] p-1 flex flex-col gap-4">
          <h5 className="indent-[25px] text-justify">
            Are you sure you want to delete stock with an stock symbol{" "}
            <span className="font-bold"> {deleteStockitem.symbol}</span>?
          </h5>
          <h5 className="text-justify bg-red-200 rounded-[8px] p-1">
            <span className="font-bold text-red-900">Note:</span> All of your
            data will be permanently removed from our servers forever.
          </h5>
        </div>

        <div className="w-full mt-2 flex h-[40px] gap-6 justify-between">
          <button
            type="button"
            className="h-[40px] w-fit px-10 flex justify-center items-center text-white bg-red-500 rounded-[8px]"
            onClick={() => handleStockModalDelete()}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="h-[40px] w-fit px-10 flex justify-center items-center bg-emerald-600 rounded-[8px] text-white"
          >
            Submit
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DeleteModal;
