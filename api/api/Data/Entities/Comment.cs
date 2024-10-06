namespace api.Data.Entities
{
    public class Comment
    {
        public int Id { get; set; }
        public required string Content { get; set; }
        public required DateTimeOffset CreatedAt { get; set; }

        public int PostId { get; set; }
        public Post Post { get; set; }
    }
}
