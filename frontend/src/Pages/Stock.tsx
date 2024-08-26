import { useEffect, useState } from "react";
import axios from "axios";
import { DeleteFilled, EditFilled, SnippetsFilled } from "@ant-design/icons";
import { AddStockTypes, StockTypes } from "../Types/Stock";
import { formatter } from "../util/Currency";
import StockModal from "./StockModal";
import DeleteModal from "../Components/DeleteModal";
import DefaultLayout from "../Layout/DefaultLayout";

const Stock = () => {
  const [stockData, setStockData] = useState<StockTypes[]>([]);
  const [isStockModal, setIsStockModal] = useState<boolean>(false);
  const [isStockDelete, setIsStockDelete] = useState<boolean>(false);
  const [deleteStockitem, setDeleteStockItem] = useState<{
    id: number;
    symbol: string;
  }>({
    id: 0,
    symbol: "",
  });
  const [modaltype, setModalType] = useState<string>("");
  const [stockId, setStockId] = useState<number>(0);

  const [data, setData] = useState<AddStockTypes>({
    companyName: "",
    industry: "",
    lastDiv: null,
    marketCap: null,
    purchase: null,
    symbol: "",
  });

  const resetData = () => {
    setData((prevData) => ({
      ...prevData,
      companyName: "",
      industry: "",
      lastDiv: null,
      marketCap: null,
      purchase: null,
      symbol: "",
    }));
  };

  const handleStockModalDelete = (id?: number, symbol?: string) => {
    setIsStockDelete(!isStockDelete);
    if (!isStockDelete) {
      if (id && symbol) {
        setDeleteStockItem((prevData) => ({
          ...prevData,
          id,
          symbol,
        }));
      }
    } else {
      setDeleteStockItem((prevData) => ({
        ...prevData,
        id: 0,
        symbol: "",
      }));
    }
  };

  const handleStockModal = () => {
    setIsStockModal(!isStockModal);
    if (isStockModal) {
      resetData();
    }
  };

  const handleModalType = async (type: string, id?: number) => {
    setModalType(type);

    if (id) {
      setStockId(id);
      try {
        const response = await axios.get<StockTypes>(
          `http://localhost:5042/api/stock/${id}`
        );

        if (response.status === 200) {
          const responseData: StockTypes = response.data;

          setData((prevData) => ({
            ...prevData,
            companyName: responseData.companyName,
            industry: responseData.industry,
            lastDiv: responseData.lastDiv,
            marketCap: responseData.marketCap,
            purchase: responseData.purchase,
            symbol: responseData.symbol,
          }));
        } else {
          setStockId(0);
          resetData();
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setStockId(0);
    }
  };

  const fetchStock = async () => {
    try {
      const response = await axios.get("http://localhost:5042/api/stock");
      setStockData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  return (
    <DefaultLayout>
      <section className="bg-emerald-300 min-h-[80vh] rounded-[12px] px-8 py-6">
        <div className="flex justify-between">
          <h1 className="text-3xl font-semibold">STOCKS DATA</h1>
          <button
            type="button"
            className="py-2 px-6 bg-blue-500 text-white rounded-[12px] hover:bg-blue-600 transition-all duration-200 delay-75"
            onClick={() => {
              handleStockModal();
              handleModalType("Add");
            }}
          >
            Add Stock
          </button>
        </div>

        <div className="mt-8 flow-root bg-white rounded-[12px] overflow-hidden p-2">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300 rounded-[12px] overflow-hidden">
                <thead className="bg-black/20">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-3"
                    >
                      Id
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Symbol
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Company Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      LastDiv
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Purchase
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Industry
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      MarketCap
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {stockData.map((stock) => (
                    <tr key={stock.id} className="even:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                        {stock.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {stock.symbol}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {stock.companyName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {stock.lastDiv}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatter.format(stock.purchase)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {stock.industry}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatter.format(stock.marketCap)}
                      </td>
                      <td className="relative text-xl whitespace-nowrap py-4 pl-3 pr-4 text-center font-medium sm:pr-3 flex justify-evenly">
                        <button
                          type="button"
                          className="text-gray-500 rounded-[12px] hover:text-gray-600 hover:scale-110 transition-all duration-300 delay-75"
                          onClick={() => {
                            handleStockModal();
                            handleModalType("View", stock.id);
                          }}
                        >
                          <SnippetsFilled />
                        </button>
                        <button
                          type="button"
                          className="text-blue-500 rounded-[12px] hover:text-blue-600 hover:scale-110 transition-all duration-300 delay-75"
                          onClick={() => {
                            handleStockModal();
                            handleModalType("Update", stock.id);
                          }}
                        >
                          <EditFilled />
                        </button>
                        <button
                          type="button"
                          className="text-red-500 rounded-[12px] hover:text-red-600 hover:scale-110 transition-all duration-300 delay-75"
                          onClick={() =>
                            handleStockModalDelete(stock.id, stock.symbol)
                          }
                        >
                          <DeleteFilled />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <StockModal
          isStockModal={isStockModal}
          handleStockModal={handleStockModal}
          data={data}
          setData={setData}
          fetchStock={fetchStock}
          modaltype={modaltype}
          handleModalType={handleModalType}
          stockId={stockId}
        />

        <DeleteModal
          isStockDelete={isStockDelete}
          handleStockModalDelete={handleStockModalDelete}
          deleteStockitem={deleteStockitem}
          fetchStock={fetchStock}
          deleteRoute="http://localhost:5042/api/stock"
        />
      </section>
    </DefaultLayout>
  );
};

export default Stock;
