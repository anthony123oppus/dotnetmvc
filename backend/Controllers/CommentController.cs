using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using backend.Dtos.Comment;
using backend.Helpers;
using backend.Interfaces;
using backend.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("/api/comment")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ICommentRepository _commentRepo;
        private readonly IStockRepository _stockRepo;
        public CommentController(ICommentRepository commentRepository, IStockRepository stockRepository)
        {
            _commentRepo = commentRepository;
            _stockRepo = stockRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] CommentQueryObject query)
        {
            // validation purpose -- validate
            // ModelState is came from the ControllerBase inheritance
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var comments = await _commentRepo.GetAllAsync(query);

            var commentsModel = comments.Select(item => item.ToCommentDto());

            return Ok(commentsModel);

        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            // validation purpose -- validate
            // ModelState is came from the ControllerBase inheritance
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var commentModel = await _commentRepo.GetByIdAsync(id);

            if(commentModel == null)
            {
                return NotFound();
            }

            return Ok(commentModel.ToCommentDto());
        }

        [HttpPost("{stockId:int}")]
        public async Task<IActionResult> Create([FromRoute] int stockId, CreateCommentRequestDto commentRequestDto)
        {
            // validation purpose -- validate
            // ModelState is came from the ControllerBase inheritance
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var isStockExist = await _stockRepo.IsStockExist(stockId);

            if(!isStockExist)
            {
                return BadRequest("Sorry, Stock does not exist");
            }

            var commentModel = commentRequestDto.ToCommentFromCreate(stockId);
            await _commentRepo.CreateAsync(commentModel);

            return CreatedAtAction(nameof(GetById), new {id = commentModel.Id}, commentModel.ToCommentDto());
        }

        [HttpPatch]
        [Route("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateCommentRequestDto updateCommentDto)
        {
            // validation purpose -- validate
            // ModelState is came from the ControllerBase inheritance
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var isStockExist = await _stockRepo.IsStockExist(updateCommentDto.StockId);

            if(!isStockExist)
            {
                return BadRequest("Sorry, Stock does not exist");
            }

            var commentModel = updateCommentDto.ToCommentFromUpdate(updateCommentDto.StockId);

            var commentUpdateMode = await _commentRepo.UpdateAsync(id, commentModel);

            if(commentUpdateMode == null)
            {
                return NotFound();
            }

            return Ok(commentUpdateMode.ToCommentDto());
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            // validation purpose -- validate
            // ModelState is came from the ControllerBase inheritance
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var commentModel =await _commentRepo.DeleteAsync(id);

            if(commentModel == null)
            {
                return NotFound();
            }

            return Ok($"Comment with an Id of {id} deleted successfully");
        }

        [HttpDelete("multipleDelete")]
        public async Task<IActionResult> MultipleDelete([FromBody] int[] ids)
        {
            // validation purpose -- validate
            // ModelState is came from the ControllerBase inheritance
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            if(ids == null || ids.Length == 0)
            {
                return BadRequest("No Ids Provided");
            }

            var itemDeleted = await _commentRepo.MultipleDeleteAsync(ids);

            if(itemDeleted)
            {
                return Ok("Successsfully deleting multiple item");
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting records.");
            }
        }
    }
}