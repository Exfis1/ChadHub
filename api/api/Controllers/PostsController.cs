﻿using api.Data.Entities;
using api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data.DTOs;
using api.Auth.Model;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace api.Controllers
{
    [ApiController]
    [Route("api/v1/topics/{topicId}/[controller]")]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET /topics/{topicId}/posts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Post>>> GetPosts(int topicId)
        {
            var topic = await _context.Topics.Include(t => t.Posts).FirstOrDefaultAsync(t => t.Id == topicId);

            if (topic == null)
            {
                return NotFound();
            }

            return Ok(topic.Posts);
        }

        // GET /topics/{topicId}/posts/{postId}
        [HttpGet("{postId}")]
        public async Task<ActionResult<Post>> GetPost(int topicId, int postId)
        {
            var post = await _context.Posts.FindAsync(postId);

            if (post == null || post.TopicId != topicId)
            {
                return NotFound();
            }

            return Ok(post);
        }

        // POST /topics/{topicId}/posts
        [Authorize(Roles = ForumRoles.ForumUser)]
        [HttpPost]
        public async Task<ActionResult<Post>> CreatePost(int topicId, [FromBody] CreatePostDto createPostDto)
        {
            var topic = await _context.Topics.FindAsync(topicId);

            if (topic == null)
            {
                return NotFound();
            }

            var post = new Post
            {
                Title = createPostDto.Title,
                Body = createPostDto.Body,
                TopicId = topicId,
                CreatedAt = DateTime.UtcNow,
                UserId = HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)

            };

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPost), new { topicId = topicId, postId = post.Id }, post);
        }

        // PUT /topics/{topicId}/posts/{postId}
        [Authorize]
        [HttpPut("{postId}")]
        public async Task<ActionResult<Post>> UpdatePost(int topicId, int postId, [FromBody] UpdatePostDto updatePostDto)
        {
            var post = await _context.Posts.FindAsync(postId);

            if (post == null || post.TopicId != topicId)
            {
                return NotFound();
            }
            if (!HttpContext.User.IsInRole(ForumRoles.Admin) &&
                HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) != post.UserId)
            {
                return Forbid();
            }

            post.Body = updatePostDto.Body;

            _context.Entry(post).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(post);
        }

        // DELETE /topics/{topicId}/posts/{postId}
        [HttpDelete("{postId}")]
        public async Task<IActionResult> DeletePost(int topicId, int postId)
        {
            var post = await _context.Posts.Include(p => p.Comments).FirstOrDefaultAsync(p => p.Id == postId && p.TopicId == topicId);

            if (post == null)
            {
                return NotFound();
            }

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
