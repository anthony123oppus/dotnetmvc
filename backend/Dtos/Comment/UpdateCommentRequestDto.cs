using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Comment
{
    public class UpdateCommentRequestDto
    {
        [Required]
        [MinLength(2, ErrorMessage = "Title must be minimum of 2 character")]
        [MaxLength(300, ErrorMessage = "Title must be maximum of 300 character")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MinLength(2, ErrorMessage = "Content must be minimum of 2 character")]
        public string Content { get; set; } = string.Empty;

        [Required]
        public int StockId {get; set;}
    }
}