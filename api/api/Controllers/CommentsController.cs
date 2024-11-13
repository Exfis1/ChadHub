using api.Data.Entities;
using api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data.DTOs;
using api.Auth.Model;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;

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
        [Authorize(Roles = ForumRoles.ForumUser)]
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
                UserId = HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetComment), new { topicId = topicId, postId = postId, commentId = comment.Id }, comment);
        }

        // PUT /topics/{topicId}/posts/{postId}/comments/{commentId}
        [Authorize]
        [HttpPut("{commentId}")]
        public async Task<ActionResult<Comment>> UpdateComment(int topicId, int postId, int commentId, [FromBody] UpdateCommentDto updateCommentDto)
        {
            var comment = await _context.Comments.FindAsync(commentId);

            if (comment == null || comment.PostId != postId)
            {
                return NotFound();
            }

            if (!HttpContext.User.IsInRole(ForumRoles.Admin) &&
                HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) != comment.UserId)
            {
                return Forbid();
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
