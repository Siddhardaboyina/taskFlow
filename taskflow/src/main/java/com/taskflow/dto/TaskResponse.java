package com.taskflow.dto;

import com.taskflow.model.Task;

import java.time.LocalDate;

public class TaskResponse {

    private Long id;
    private String title;
    private String description;
    private Task.Status status;
    private LocalDate dueDate;

    public TaskResponse(Task task) {
        this.id = task.getId();
        this.title = task.getTitle();
        this.description = task.getDescription();
        this.status = task.getStatus();
        this.dueDate = task.getDueDate();
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Task.Status getStatus() {
        return status;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }
}