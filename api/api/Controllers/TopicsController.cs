using api.Data.Entities;
using api.Data;
using api.Data.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using api.Auth.Model;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace api.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class TopicsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TopicsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET /topics
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Topic>>> GetAllTopics()
        {
            return Ok(await _context.Topics.ToListAsync());
        }

        // GET /topics/{topicId}
        [HttpGet("{topicId}")]
        public async Task<ActionResult<Topic>> GetTopic(int topicId)
        {
            var topic = await _context.Topics.FindAsync(topicId);

            if (topic == null)
            {
                return NotFound();
            }

            return Ok(topic);
        }

        // POST /topics
        [Authorize(Roles = ForumRoles.ForumUser)]
        [HttpPost]
        public async Task<ActionResult<Topic>> CreateTopic([FromBody] CreateTopicDto createTopicDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var topic = new Topic
            {
                Title = createTopicDto.Title,
                Description = createTopicDto.Description,
                CreatedAt = DateTime.UtcNow,
                UserID = HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)
            };

            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTopic), new { topicId = topic.Id }, topic);
        }

        // PUT /topics/{topicId}
        [Authorize]
        [HttpPut("{topicId}")]
        public async Task<ActionResult<Topic>> UpdateTopic(int topicId, [FromBody] UpdateTopicDto updateTopicDto)
        {
            var topic = await _context.Topics.FindAsync(topicId);

            if (topic == null)
            {
                return NotFound();
            }

            if (!HttpContext.User.IsInRole(ForumRoles.Admin) &&
                HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) != topic.UserID)
            {
                return Forbid();
            }

            topic.Description = updateTopicDto.Description;

            _context.Entry(topic).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(topic);
        }

        // DELETE /topics/{topicId}
        [Authorize]
        [HttpDelete("{topicId}")]
        public async Task<IActionResult> DeleteTopic(int topicId)
        {
            var topic = await _context.Topics.Include(t => t.Posts).ThenInclude(p => p.Comments).FirstOrDefaultAsync(t => t.Id == topicId);

            if (topic == null)
            {
                return NotFound();
            }

            if (!HttpContext.User.IsInRole(ForumRoles.Admin) &&
               HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) != topic.UserID)
            {
                return Forbid();
            }

            _context.Topics.Remove(topic);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
