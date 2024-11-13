using api.Data.Entities;
using api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data.DTOs;

namespace api.Controllers
{
    [ApiController]
    [Route("api/v1/topics/{topicId}/posts/{postId}/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CommentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET /topics/{topicId}/posts/{postId}/comments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Comment>>> GetComments(int topicId, int postId)
        {
            var post = await _context.Posts.Include(p => p.Comments).FirstOrDefaultAsync(p => p.Id == postId && p.TopicId == topicId);

            if (post == null)
            {
                return NotFound();
            }

            return Ok(post.Comments);
        }

        // GET /topics/{topicId}/posts/{postId}/comments/{commentId}
        [HttpGet("{commentId}")]
        public async Task<ActionResult<Comment>> GetComment(int topicId, int postId, int commentId)
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId && c.PostId == postId);

            if (comment == null)
            {
                return NotFound();
            }

            return Ok(comment);
        }

        // POST /topics/{topicId}/posts/{postId}/comments
        [HttpPost]
        public async Task<ActionResult<Comment>> CreateComment(int topicId, int postId, [FromBody] CreateCommentDto createCommentDto)
        {
            var post = await _context.Posts.FindAsync(postId);

            if (post == null || post.TopicId != topicId)
            {
                return NotFound();
            }

            var comment = new Comment
            {
                Content = createCommentDto.Content,
                PostId = postId,
                CreatedAt = DateTime.UtcNow,
                UserId = ""
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetComment), new { topicId = topicId, postId = postId, commentId = comment.Id }, comment);
        }

        // PUT /topics/{topicId}/posts/{postId}/comments/{commentId}
        [HttpPut("{commentId}")]
        public async Task<ActionResult<Comment>> UpdateComment(int topicId, int postId, int commentId, [FromBody] UpdateCommentDto updateCommentDto)
        {
            var comment = await _context.Comments.FindAsync(commentId);

            if (comment == null || comment.PostId != postId)
            {
                return NotFound();
            }

            comment.Content = updateCommentDto.Content;

            _context.Entry(comment).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(comment);
        }

        // DELETE /topics/{topicId}/posts/{postId}/comments/{commentId}
        [HttpDelete("{commentId}")]
        public async Task<IActionResult> DeleteComment(int topicId, int postId, int commentId)
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId && c.PostId == postId);

            if (comment == null)
            {
                return NotFound();
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
