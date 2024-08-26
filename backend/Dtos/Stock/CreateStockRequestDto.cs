using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Stock
{
    public class CreateStockRequestDto
    {
        [Required]
        public string Symbol { get; set; } = string.Empty;

        [Required]
        public string CompanyName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Purchase is Required")]
        // [Range(1, 1000000000000)] --- sample to range
        public decimal Purchase { get; set; }
        
        [Required]
        public decimal LastDiv { get; set; }

        [Required]
        public string Industry { get; set; } = string.Empty;

        [Required]
        public long MarketCap { get; set;} 
    }

    
}