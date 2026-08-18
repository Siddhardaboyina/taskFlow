package com.taskflow.service;

import com.taskflow.dto.TaskRequest;
import com.taskflow.dto.TaskResponse;
import com.taskflow.model.Task;
import com.taskflow.model.User;
import com.taskflow.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public TaskResponse createTask(TaskRequest request, User user) {

        Task task = new Task();

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setUser(user);

        Task savedTask = taskRepository.save(task);

        return new TaskResponse(savedTask);
    }

    public List<TaskResponse> getTasks(User user) {

        return taskRepository.findByUser(user)
                .stream()
                .map(TaskResponse::new)
                .toList();
    }

    public TaskResponse updateStatus(
            Long taskId,
            Task.Status status,
            User user) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized");
        }

        task.setStatus(status);

        return new TaskResponse(taskRepository.save(task));
    }

    public TaskResponse updateTask(
            Long taskId,
            TaskRequest request,
            User user) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());

        return new TaskResponse(taskRepository.save(task));
    }

    public void deleteTask(Long taskId, User user) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized");
        }

        taskRepository.delete(task);
    }
}