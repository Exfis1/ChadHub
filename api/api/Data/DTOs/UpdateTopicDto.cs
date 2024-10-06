using System.ComponentModel.DataAnnotations;

namespace api.Data.DTOs
{
    public class UpdateTopicDto
    {
        [Required]
        [MinLength(3), MaxLength(500)]
        public string Description { get; set; }
    }
}
