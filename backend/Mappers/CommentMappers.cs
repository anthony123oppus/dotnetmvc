using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Comment;
using backend.Models;

namespace backend.Mappers
{
    public static class CommentMappers
    {
        public static CommentDto ToCommentDto(this Comment commentModel)
        {
            return new CommentDto
            {
                Id = commentModel.Id,
                Title = commentModel.Title,
                Content = commentModel.Content,
                CreatedOn = commentModel.CreatedOn,
                StockId = commentModel.StockId,
            };
        }

        // kinahanglan mauna ang commentDto para mabasa ang method sa controller
        public static Comment ToCommentFromCreate (this CreateCommentRequestDto commentDto,int stockId)
        {
             return new Comment
            {
                Title = commentDto.Title,
                Content = commentDto.Content,
                StockId = stockId
            };
        }

        public static Comment ToCommentFromUpdate (this UpdateCommentRequestDto updateDto, int stockId)
        {
            return new Comment
            {
                Title = updateDto.Title,
                Content = updateDto.Content,
                StockId = stockId
            };
        }

        public static Comment ToCommentFromUpdateData (this Comment updateDataDto, Comment prevUpdateDto)
        {
            prevUpdateDto.Content = updateDataDto.Content;
            prevUpdateDto.Title = updateDataDto.Title;
            prevUpdateDto.StockId = updateDataDto.StockId;

            return prevUpdateDto;
        }

    }
}