import React, { ChangeEvent, FormEventHandler } from 'react'
import Modal from '../Components/Modal'
import { AddStockTypes } from '../Types/Stock'
import axios from 'axios'
import { EditFilled } from '@ant-design/icons'

interface StockModalProps {
  isStockModal : boolean
  modaltype : string
  stockId : number
  handleStockModal : () => void
  fetchStock : () => void
  handleModalType : (type : string, id? : number) => void
  data : AddStockTypes
  setData : React.Dispatch<React.SetStateAction<AddStockTypes>>
}

const StockModal : React.FC<StockModalProps> = ({modaltype, stockId, isStockModal,handleModalType, handleStockModal, data, setData, fetchStock }) => {

  const handleInput = (event : ChangeEvent<HTMLInputElement>) => {
    const inputName = event.target.id
    const inputValue = event.target.value

    setData(prevData => ({
      ...prevData,
      [inputName] : inputValue
    }))
  }

  const handleSubmit : FormEventHandler = async (event : React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    
    try {

      let responseStatus

      if(stockId) {
        const response = await axios.put(`http://localhost:5042/api/stock/${stockId}`, data)
        responseStatus = response.status
      }else{
        const response = await axios.post("http://localhost:5042/api/stock", data)
        responseStatus = response.status
      }

      if(responseStatus === 201 || responseStatus === 200 ) {
        handleStockModal()
        fetchStock()
      }
      
    } catch (error) {
      console.log(error)
    }
  } 


  return (
    <Modal isOpen={isStockModal} onClick={handleStockModal} className='h-[80vh] w-full md:w-[500px]' >
      <form method='' onSubmit={handleSubmit} className='w-full h-full py-8 px-8 flex flex-col gap-4'>

        {/* modal header */}
        <div className='flex gap-2'>
          <h5 className='w-fit text-2xl'>{modaltype} Stock</h5>
          {modaltype === 'View' &&
            <button
            type="button"
            className="text-blue-500 text-xl rounded-[12px] hover:text-blue-600 hover:scale-110 transition-all duration-300 delay-75"
            onClick={() => { handleModalType("Update", stockId) }}
          >
            <EditFilled />
          </button>
          }

        </div>

        {/* modal body */}
        <div className='h-full w-full md:flex flex-col gap-3'>
          <div className='flex flex-col gap-1 w-full'>
            <label htmlFor="symbol">Symbol</label>
            <input type="text" name="symbol" id="symbol" disabled={modaltype === "View"} title={modaltype === "View" ? "Disabled" : ""} className='disabled:bg-gray-200 bg-white border h-[30px] rounded-[8px] px-2 border-black' value={data.symbol} onChange={handleInput}/>
          </div>
          <div className='flex flex-col gap-1 w-full'>
            <label htmlFor="companyName">Company Name</label>
            <input type="text" name="companyName" id="companyName" disabled={modaltype === "View"} title={modaltype === "View" ? "Disabled" : ""} className='disabled:bg-gray-200 bg-white border h-[30px] rounded-[8px] px-2 border-black' value={data.companyName} onChange={handleInput}/>
          </div>
          <div className='flex flex-col gap-1 w-full'>
            <label htmlFor="industry">Industry</label>
            <input type="text" name="industry" id="industry" disabled={modaltype === "View"} title={modaltype === "View" ? "Disabled" : ""} className='disabled:bg-gray-200 bg-white border h-[30px] rounded-[8px] px-2 border-black' value={data.industry} onChange={handleInput}/>
          </div>
          <div className='flex flex-col gap-1 w-full'>
            <label htmlFor="lastDiv">LastDiv</label>
            <input type="number" name="lastDiv" id="lastDiv" disabled={modaltype === "View"} title={modaltype === "View" ? "Disabled" : ""} className='disabled:bg-gray-200 bg-white border h-[30px] rounded-[8px] px-2 border-black' value={data.lastDiv ? data.lastDiv : ""} onChange={handleInput}/>
          </div>
          <div className='flex flex-col gap-1 w-full'>
            <label htmlFor="purchase">Purchase</label>
            <input type="number" name="purchase" id="purchase" disabled={modaltype === "View"} title={modaltype === "View" ? "Disabled" : ""} className='disabled:bg-gray-200 bg-white border h-[30px] rounded-[8px] px-2 border-black' value={data.purchase ? data.purchase : ""} onChange={handleInput}/>
          </div>
          <div className='flex flex-col gap-1 w-full'>
            <label htmlFor="marketCap">MarketCap</label>
            <input type="number"  name="marketCap" id="marketCap" disabled={modaltype === "View"} title={modaltype === "View" ? "Disabled" : ""} className='disabled:bg-gray-200 bg-white border h-[30px] rounded-[8px] px-2 border-black' value={data.marketCap ? data.marketCap : ""} onChange={handleInput}/>
          </div>
        </div>

        {/* modal footer */}
        <div className='w-full mt-2 flex h-[40px] gap-6 justify-end'>
          <button type="button" className='h-[40px] w-fit px-10 flex justify-center items-center text-white bg-red-500 rounded-[8px]' onClick={handleStockModal}>{modaltype === "View" ? "Close" : "Cancel"}</button>
          {modaltype !== "View" &&
              <button type="submit" className='h-[40px] w-fit px-10 flex justify-center items-center bg-emerald-600 rounded-[8px] text-white'>Submit</button>
          }
        </div>

      </form>
    </Modal>
  )
}

export default StockModal
