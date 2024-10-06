﻿using System.ComponentModel.DataAnnotations;

namespace api.Data.DTOs
{
    public class CreateTopicDto
    {
        [Required]
        [MinLength(2), MaxLength(100)]
        public string Title { get; set; }

        [Required]
        [MinLength(3), MaxLength(500)]
        public string Description { get; set; }
    }
}
