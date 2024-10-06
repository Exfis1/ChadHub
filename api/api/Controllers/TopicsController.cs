using api.Data.Entities;
using api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
                Description = createTopicDto.Description
            };

            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTopic), new { topicId = topic.Id }, topic);
        }

        // PUT /topics/{topicId}
        [HttpPut("{topicId}")]
        public async Task<ActionResult<Topic>> UpdateTopic(int topicId, [FromBody] UpdateTopicDto updateTopicDto)
        {
            var topic = await _context.Topics.FindAsync(topicId);

            if (topic == null)
            {
                return NotFound();
            }

            topic.Description = updateTopicDto.Description;

            _context.Entry(topic).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(topic);
        }

        // DELETE /topics/{topicId}
        [HttpDelete("{topicId}")]
        public async Task<IActionResult> DeleteTopic(int topicId)
        {
            var topic = await _context.Topics.Include(t => t.Posts).ThenInclude(p => p.Comments).FirstOrDefaultAsync(t => t.Id == topicId);

            if (topic == null)
            {
                return NotFound();
            }

            _context.Topics.Remove(topic);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
