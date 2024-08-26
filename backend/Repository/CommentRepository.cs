using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Comment;
using backend.Helpers;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class CommentRepository : ICommentRepository
    {

        private readonly ApplicationDBContext _context;

        public CommentRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Comment> CreateAsync(Comment commentModel)
        {
            await _context.Comments.AddAsync(commentModel);

            await _context.SaveChangesAsync();

            return commentModel;
        }

        public async Task<List<Comment>> GetAllAsync(CommentQueryObject query)
        {
            // return await _context.Comments.ToListAsync();
            var comments = _context.Comments.AsQueryable();

            if (!string.IsNullOrWhiteSpace(query.Title))
            {
                comments = comments.Where(item => item.Title.Contains(query.Title));
            }

            if (query.StockId.HasValue)
            {
                comments = comments.Where(item => item.StockId == query.StockId);
            }

            // Sorting Code
            if (!string.IsNullOrWhiteSpace(query.SortBy))
            {
                // enhance switch case
                comments = query.SortBy switch
                {
                    "Title" => query.IsDecsending ? comments.OrderByDescending(item => item.Title) : comments.OrderBy(item => item.Title),
                    "Id" => query.IsDecsending ? comments.OrderByDescending(item => item.Id) : comments.OrderBy(item => item.Id),
                    _ => throw new ArgumentException($"Invalid sort field: {query.SortBy}"),
                };
            }

            // return await comments.ToListAsync(); ------ No Pagination


            var skipNumber = (query.PageNumber - 1) * query.PageSize;

            return await comments.Skip(skipNumber).Take(query.PageSize).ToListAsync();

        }

        public async Task<Comment?> GetByIdAsync(int id)
        {
            return await _context.Comments.FindAsync(id);
        }

        public async Task<Comment?> UpdateAsync(int id, Comment updateDataDto)
        {
            var commentModel = await _context.Comments.FirstOrDefaultAsync(item => item.Id == id);

            if (commentModel == null)
            {
                return null;
            }

            updateDataDto.ToCommentFromUpdateData(commentModel);

            await _context.SaveChangesAsync();

            return commentModel;
        }

        public async Task<Comment?> DeleteAsync(int id)
        {
            var commentModel = await _context.Comments.FirstOrDefaultAsync(item => item.Id == id);

            if (commentModel == null)
            {
                return null;
            }

            _context.Comments.Remove(commentModel);

            await _context.SaveChangesAsync();

            return commentModel;
        }

        public async Task<bool> MultipleDeleteAsync(int[] ids)
        {
            var itemsDelete = _context.Comments.Where(item => ids.Contains(item.Id));

            if (!itemsDelete.Any())
            {
                return false;
            }

            _context.Comments.RemoveRange(itemsDelete);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}