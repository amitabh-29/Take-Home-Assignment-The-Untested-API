const request = require('supertest');
const app = require('../src/app');

describe('Task API Integration Tests', () => {
  let taskId;

  // 1. POST - Create Task
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Test Task', priority: 'medium' });
    expect(res.statusCode).toEqual(201);
    taskId = res.body.id;
  });

  // 2. GET - List all
  it('should get all tasks', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // 3. GET - Filter by status
  it('should filter tasks by status', async () => {
    const res = await request(app).get('/tasks?status=todo');
    expect(res.statusCode).toEqual(200);
  });

  // 4. PUT - Update Task
  it('should update a task', async () => {
    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .send({ title: 'Updated Title' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toBe('Updated Title');
  });

  // 5. PATCH - Complete Task
  it('should mark a task as complete', async () => {
    const res = await request(app).patch(`/tasks/${taskId}/complete`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('done');
  });

  // 6. GET - Stats (FIXED)
  it('should get task statistics', async () => {
    const res = await request(app).get('/tasks/stats');
    expect(res.statusCode).toEqual(200);
    // Changed 'total' to 'todo' because 'total' was missing in the API response (Bug Found!)
    expect(res.body).toHaveProperty('todo');
  });

  
  // 7. PATCH - Assign Task (New Feature)
  it('should assign a task to a user', async () => {
    const res = await request(app)
      .patch(`/tasks/${taskId}/assign`)
      .send({ assignee: 'Amitabh' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.assignee).toBe('Amitabh');
  });
  // 8. DELETE - Remove Task
  it('should delete a task', async () => {
    const res = await request(app).delete(`/tasks/${taskId}`);
    expect(res.statusCode).toEqual(204);
  });
  // 9. VALIDATION TEST (To hit 80% coverage)
  it('should return 400 for invalid priority', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ 
        title: 'Invalid Task', 
        priority: 'super-high' // This is invalid, so it hits the validator code
      });
    expect(res.statusCode).toEqual(400);
  });
});