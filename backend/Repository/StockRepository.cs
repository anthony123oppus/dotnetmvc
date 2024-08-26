using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Stock;
using backend.Helpers;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class StockRepository : IStockRepository
    {
        private readonly ApplicationDBContext _context;
        public StockRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<Stock>> GetAllAsync(StockQueryObject query)
        {
            // return await _context.Stocks.Include(c => c.Comments).ToListAsync();

            var stocks = _context.Stocks.Include(c => c.Comments).AsQueryable();

            if (!string.IsNullOrWhiteSpace(query.CompanyName))
            {
                stocks = stocks.Where(item => item.CompanyName.Contains(query.CompanyName));
            }

            if (!string.IsNullOrWhiteSpace(query.Symbol))
            {
                stocks = stocks.Where(item => item.Symbol.Contains(query.Symbol));
            }

            // Sorting Method
            if (!string.IsNullOrWhiteSpace(query.SortBy))
            {
                // if statement in Sorting  sa tutorial --comment
                // if (query.SortBy.Equals("Symbol", StringComparison.OrdinalIgnoreCase))
                // {
                //     stocks = query.IsDecsending ? stocks.OrderByDescending(item => item.Symbol) : stocks.OrderBy(item => item.Symbol);
                // }

                // --ako ga himo gi switch case gi improve ra sa c#
                stocks = query.SortBy switch
                {
                    "Symbol" => query.IsDecsending ? stocks.OrderByDescending(item => item.Symbol) : stocks.OrderBy(item => item.Symbol),
                    "CompanyName" => query.IsDecsending ? stocks.OrderByDescending(item => item.CompanyName) : stocks.OrderBy(item => item.CompanyName),
                    "Industry" => query.IsDecsending ? stocks.OrderByDescending(item => item.Industry) : stocks.OrderBy(item => item.Industry),
                    _ => throw new ArgumentException($"Invalid sort field: {query.SortBy}"),
                };
            }

            // return await stocks.ToListAsync(); ----- No Pagination


            var skipNumber = (query.PageNumber - 1) * query.PageSize; 

            return await stocks.Skip(skipNumber).Take(query.PageSize).ToListAsync();
        }

        public async Task<Stock> CreateAsync(Stock stockModel)
        {
            await _context.Stocks.AddAsync(stockModel);
            await _context.SaveChangesAsync();

            return stockModel;
        }

        public async Task<Stock?> GetByIdAsync(int id)
        {
            return await _context.Stocks.Include(c => c.Comments).FirstOrDefaultAsync(item => item.Id == id);
        }

        public async Task<Stock?> UpdateAsync(int id, UpdateStockRequestDto updateStockModel)
        {
            var stockModel = await _context.Stocks.FirstOrDefaultAsync(item => item.Id == id);

            if (stockModel == null)
            {
                return null;
            }

            updateStockModel.ToStockFromUpdateDTO(stockModel);

            await _context.SaveChangesAsync();

            return stockModel;
        }

        public async Task<Stock?> DeleteAsync(int id)
        {
            // kinahanglan na i includes and relation para macascade -- ex Include(s => s.Comments)
            var stockModel = await _context.Stocks.Include(s => s.Comments).FirstOrDefaultAsync(item => item.Id == id);

            if (stockModel == null)
            {
                return null;
            }

            // Manually delete related comments
            // Kung dili mugana and cascade  mag manual deleting
            //  _context.Comments.RemoveRange(stockModel.Comments);

            _context.Stocks.Remove(stockModel);

            await _context.SaveChangesAsync();

            return stockModel;

        }

        public async Task<bool> IsStockExist(int id)
        {
            return await _context.Stocks.AnyAsync(s => s.Id == id);
        }
    }
}