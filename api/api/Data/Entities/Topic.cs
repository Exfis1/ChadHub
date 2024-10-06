using Microsoft.Extensions.Hosting;

namespace api.Data.Entities
{
    public class Topic
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required DateTimeOffset CreatedAt { get; set; }


        // Only can be set/seen by admin
        public bool IsHidden { get; set; }
        public ICollection<Post> Posts { get; set; }

    }
}
