namespace api.Data.DTOs
{
    public class PostDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<CommentDTO> Comments { get; set; }
    }
}
