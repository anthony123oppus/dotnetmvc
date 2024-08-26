using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Comment;
using backend.Dtos.Stock;
using backend.Models;

namespace backend.Mappers
{
    public static class StockMappers
    {
        public static StockDto ToStockDto(this Stock stockModel)
        {
            return new StockDto
            {
                Id = stockModel.Id,
                Symbol = stockModel.Symbol,
                CompanyName = stockModel.CompanyName,
                Purchase = stockModel.Purchase,
                LastDiv = stockModel.LastDiv,
                Industry = stockModel.Industry,
                MarketCap = stockModel.MarketCap,
                Comments = stockModel.Comments.Select(item => item.ToCommentDto()).ToList()
            };
        }

        public static Stock ToStockFromCreateDTO (this CreateStockRequestDto stockDto)
        {
            return new Stock
            {
                Symbol = stockDto.Symbol,
                CompanyName = stockDto.CompanyName,
                Purchase = stockDto.Purchase,
                LastDiv = stockDto.LastDiv,
                Industry = stockDto.Industry,
                MarketCap = stockDto.MarketCap
            };
        }

        public static Stock ToStockFromUpdateDTO (this UpdateStockRequestDto updateStockDto, Stock prevStockDto)
        {
            prevStockDto.CompanyName = updateStockDto.CompanyName;
            prevStockDto.Industry = updateStockDto.Industry;
            prevStockDto.Symbol = updateStockDto.Symbol;
            prevStockDto.Purchase = updateStockDto.Purchase;
            prevStockDto.LastDiv = updateStockDto.LastDiv;
            prevStockDto.MarketCap = updateStockDto.MarketCap;
            
            return prevStockDto;
        }
    }
}