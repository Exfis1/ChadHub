using System.ComponentModel.DataAnnotations;

namespace api.Data.DTOs
{
    public class CreateCommentDto
    {
        [Required]
        [MinLength(1), MaxLength(1000)]
        public string Content { get; set; }
    }
}
