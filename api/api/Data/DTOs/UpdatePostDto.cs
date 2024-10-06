using System.ComponentModel.DataAnnotations;

namespace api.Data.DTOs
{
    public class UpdatePostDto
    {
        [Required]
        [MinLength(3), MaxLength(5000)]
        public string Body { get; set; }
    }
}
