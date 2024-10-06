namespace api.Data.DTOs
{
    public class TopicDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<PostDto> Posts { get; set; }
    }
}
