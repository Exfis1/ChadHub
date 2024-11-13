using api.Auth.Model;

namespace api.Data.Entities
{
    public class Post
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Body { get; set; }
        public required DateTimeOffset CreatedAt { get; set; }

        public int TopicId { get; set; }
        public Topic Topic { get; set; }

        public ICollection<Comment> Comments { get; set; }

        // Relationship to ForumUser
        public required string UserId { get; set; }
        public ForumUser User { get; set; }
    }
}
