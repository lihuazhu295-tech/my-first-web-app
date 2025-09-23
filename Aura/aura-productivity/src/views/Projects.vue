<template>
  <div class="ai-projects-container">
    <!-- AI助手头部 -->
    <div class="ai-header">
      <div class="header-content">
        <div class="ai-assistant">
          <div class="ai-avatar">
            <div class="avatar-glow"></div>
            <svg class="avatar-icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
              <path d="M19 15L20.09 18.26L24 19L20.09 19.74L19 23L17.91 19.74L14 19L17.91 18.26L19 15Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="assistant-text">
            <h1 class="title">AI项目管理</h1>
            <p class="subtitle">智能化项目协作与任务管理</p>
          </div>
        </div>
        <div class="ai-actions">
          <button @click="showAIInsights = !showAIInsights" class="ai-btn insights-btn">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            AI洞察
          </button>
          <button @click="showCreateModal = true" class="ai-btn create-btn">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            创建项目
          </button>
        </div>
      </div>
    </div>

    <!-- AI洞察面板 -->
    <div v-if="showAIInsights" class="ai-insights-panel">
      <div class="insights-content">
        <div class="insight-card">
          <div class="insight-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="insight-text">
            <h3>效率提升建议</h3>
            <p>基于您的项目数据，建议优先完成高优先级任务以提升整体进度</p>
          </div>
        </div>
        <div class="insight-card">
          <div class="insight-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="insight-text">
            <h3>项目健康度</h3>
            <p>{{ getProjectHealthStatus() }}</p>
          </div>
        </div>
        <div class="insight-card">
          <div class="insight-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="insight-text">
            <h3>智能推荐</h3>
            <p>建议为"{{ getMostActiveProject()?.name || '新项目' }}"添加更多子任务以细化管理</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 智能统计仪表板 -->
    <div class="ai-dashboard">
      <div class="dashboard-grid">
        <div class="stat-card primary">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 11H5a2 2 0 00-2 2v7a2 2 0 002 2h4a2 2 0 002-2v-7a2 2 0 00-2-2zM21 11h-4a2 2 0 00-2 2v7a2 2 0 002 2h4a2 2 0 002-2v-7a2 2 0 00-2-2zM15 3H9a2 2 0 00-2 2v4a2 2 0 002 2h6a2 2 0 002-2V5a2 2 0 00-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ projects.length }}</div>
            <div class="stat-label">总项目数</div>
            <div class="stat-trend">+{{ projects.length > 0 ? Math.round(activeProjects.length / projects.length * 100) : 0 }}% 活跃</div>
          </div>
        </div>
        
        <div class="stat-card success">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 4L12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ completedProjects.length }}</div>
            <div class="stat-label">已完成</div>
            <div class="stat-trend">{{ getCompletionRate() }}% 完成率</div>
          </div>
        </div>
        
        <div class="stat-card warning">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 12l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ activeProjects.length }}</div>
            <div class="stat-label">进行中</div>
            <div class="stat-trend">{{ getAverageProgress() }}% 平均进度</div>
          </div>
        </div>
        
        <div class="stat-card info">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 5c0 1.66-4 3-9 3S3 6.66 3 5s4-3 9-3 9 1.34 9 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ totalTasks }}</div>
            <div class="stat-label">总任务数</div>
            <div class="stat-trend">{{ getCompletedTasksCount() }} 已完成</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 智能项目列表 -->
    <div class="ai-projects-list">
      <div class="projects-header">
        <div class="header-left">
          <h2 class="projects-title">智能项目管理</h2>
          <div class="filter-tabs">
            <button @click="filterStatus = 'all'" :class="['filter-tab', { active: filterStatus === 'all' }]">
              全部项目
            </button>
            <button @click="filterStatus = 'active'" :class="['filter-tab', { active: filterStatus === 'active' }]">
              进行中
            </button>
            <button @click="filterStatus = 'completed'" :class="['filter-tab', { active: filterStatus === 'completed' }]">
              已完成
            </button>
          </div>
        </div>
        <div class="header-actions">
          <button @click="loadSampleData" class="ai-btn secondary">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            加载示例
          </button>
        </div>
      </div>

      <!-- AI智能项目卡片网格 -->
      <div class="projects-grid">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="project-card"
        >
          <!-- 项目卡片头部 -->
          <div class="project-header">
            <div class="project-info">
              <div class="project-status" :class="getProjectStatusClass(project.status)">
                <div class="status-dot"></div>
                <span class="status-text">{{ getStatusText(project.status) }}</span>
              </div>
              <h3 class="project-title">{{ project.name }}</h3>
              <p class="project-description">{{ project.description }}</p>
            </div>
            <div class="project-actions">
              <button @click="editProject(project)" class="action-btn edit">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button @click="deleteProject(project.id)" class="action-btn delete">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- AI智能进度分析 -->
          <div class="ai-progress-section">
            <div class="progress-header">
              <div class="progress-info">
                <span class="progress-label">智能进度分析</span>
                <span class="progress-percentage">{{ Math.round(getProjectProgress(project)) }}%</span>
              </div>
              <div class="ai-insight-badge">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
                AI分析
              </div>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: getProjectProgress(project) + '%' }"></div>
                <div class="progress-glow" :style="{ width: getProjectProgress(project) + '%' }"></div>
              </div>
            </div>
            <div class="progress-insights">
              <div class="insight-item">
                <span class="insight-label">预计完成时间:</span>
                <span class="insight-value">{{ getEstimatedCompletion(project) }}</span>
              </div>
              <div class="insight-item">
                <span class="insight-label">效率评分:</span>
                <span class="insight-value">{{ getEfficiencyScore(project) }}/10</span>
              </div>
            </div>
          </div>
            
           <!-- AI智能任务管理 -->
           <div class="ai-tasks-section">
             <div class="tasks-header">
               <div class="tasks-title">
                 <svg viewBox="0 0 24 24" fill="none">
                   <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                   <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                   <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                   <path d="M21 5c0 1.66-4 3-9 3S3 6.66 3 5s4-3 9-3 9 1.34 9 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                 </svg>
                 <span>智能任务 ({{ project.tasks.filter(t => t.completed).length }}/{{ project.tasks.length }})</span>
               </div>
               <button @click="showTaskModal(project.id)" class="add-task-btn">
                 <svg viewBox="0 0 24 24" fill="none">
                   <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                 </svg>
               </button>
             </div>
             
             <div v-if="project.tasks.length === 0" class="empty-tasks">
               <div class="empty-icon">
                 <svg viewBox="0 0 24 24" fill="none">
                   <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                   <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                   <path d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                 </svg>
               </div>
               <p>暂无任务，AI建议添加一些任务来开始项目</p>
             </div>
             
             <div v-else class="tasks-list">
               <div v-for="task in project.tasks" :key="task.id" class="task-item">
                 <div class="task-checkbox">
                   <input type="checkbox" 
                          :checked="task.completed"
                          @change="toggleTask(project.id, task.id)"
                          class="checkbox-input">
                   <div class="checkbox-custom">
                     <svg class="checkbox-icon" viewBox="0 0 24 24" fill="none">
                       <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                     </svg>
                   </div>
                 </div>
                 <div class="task-content">
                   <span :class="['task-title', { completed: task.completed }]">
                     {{ task.title }}
                   </span>
                   <div class="task-meta">
                     <span class="task-priority">{{ getTaskPriority(task) }}</span>
                     <span class="task-estimate">{{ getTaskEstimate(task) }}</span>
                   </div>
                 </div>
                 <button @click="deleteTask(project.id, task.id)" class="remove-task-btn">
                   <svg viewBox="0 0 24 24" fill="none">
                     <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                   </svg>
                 </button>
               </div>
             </div>
           </div>

           <!-- AI项目建议 -->
           <div class="ai-suggestions">
             <div class="suggestion-header">
               <svg viewBox="0 0 24 24" fill="none">
                 <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
               </svg>
               <span>AI智能建议</span>
             </div>
             <div class="suggestions-list">
               <div class="suggestion-item">
                 {{ getProjectSuggestion(project) }}
               </div>
             </div>
           </div>
        </div>

      <!-- AI智能空状态 -->
      <div v-if="filteredProjects.length === 0" class="ai-empty-state">
          <div class="empty-illustration">
            <div class="ai-brain">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                <path d="M19 15L20.09 18.26L24 19L20.09 19.74L19 23L17.91 19.74L14 19L17.91 18.26L19 15Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="floating-elements">
              <div class="element element-1"></div>
              <div class="element element-2"></div>
              <div class="element element-3"></div>
            </div>
          </div>
          <div class="empty-content">
            <h3 class="empty-title">AI助手准备就绪</h3>
            <p class="empty-description">让AI帮助您创建和管理项目，开启智能化工作流程</p>
            <div class="empty-actions">
              <button @click="showCreateModal = true" class="ai-btn primary large">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                创建智能项目
              </button>
              <button @click="loadSampleData" class="ai-btn secondary large">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                体验示例项目
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI智能项目创建/编辑模态框 -->
    <div v-if="showCreateModal || showEditModal" class="ai-modal-overlay">
      <div class="ai-modal">
        <div class="modal-header">
          <div class="modal-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="modal-title">
            <h2>{{ showCreateModal ? 'AI智能项目创建' : 'AI项目编辑' }}</h2>
            <p>{{ showCreateModal ? '让AI助手帮您规划项目结构' : '优化您的项目配置' }}</p>
          </div>
          <button @click="closeModal" class="modal-close">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="saveProject" class="modal-form">
          <div class="form-group">
            <label class="form-label">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              项目名称
            </label>
            <input
              v-model="projectForm.name"
              type="text"
              class="form-input"
              placeholder="AI建议：使用描述性名称，如'移动应用开发'"
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              项目描述
            </label>
            <textarea
              v-model="projectForm.description"
              class="form-textarea"
              placeholder="AI建议：详细描述项目目标和预期成果"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              项目状态
            </label>
            <select v-model="projectForm.status" class="form-select">
              <option value="active">🚀 进行中</option>
              <option value="completed">✅ 已完成</option>
            </select>
          </div>
          
          <div class="modal-actions">
            <button type="submit" class="ai-btn primary">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ showCreateModal ? 'AI智能创建' : '保存更改' }}
            </button>
            <button type="button" @click="closeModal" class="ai-btn secondary">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              取消
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- AI智能任务创建模态框 -->
    <div v-if="showAddTaskModal" class="ai-modal-overlay">
      <div class="ai-modal compact">
        <div class="modal-header">
          <div class="modal-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 5c0 1.66-4 3-9 3S3 6.66 3 5s4-3 9-3 9 1.34 9 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="modal-title">
            <h2>AI智能任务创建</h2>
            <p>让AI帮您分解和规划任务</p>
          </div>
          <button @click="closeTaskModal" class="modal-close">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="addTask" class="modal-form">
          <div class="form-group">
            <label class="form-label">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              任务标题
            </label>
            <input
              v-model="taskForm.title"
              type="text"
              class="form-input"
              placeholder="AI建议：使用动词开头，如'完成用户界面设计'"
              required
            />
            <div class="ai-suggestions">
              <div class="suggestion-header">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
                <span>AI智能建议</span>
              </div>
              <div class="suggestion-item">使用SMART原则：具体、可衡量、可实现、相关性、时限性</div>
            </div>
          </div>
          
          <div class="modal-actions">
            <button type="submit" class="ai-btn primary">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              AI智能添加
            </button>
            <button type="button" @click="closeTaskModal" class="ai-btn secondary">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Task {
  id: string
  title: string
  completed: boolean
  priority?: 'high' | 'medium' | 'low'
  estimatedHours?: number
  createdAt?: string
}

interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'completed'
  progress: number
  tasks: Task[]
  createdAt: Date
  priority?: 'high' | 'medium' | 'low'
  estimatedCompletion?: string
}

const projects = ref<Project[]>([])
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showAddTaskModal = ref(false)
const showAIInsights = ref(false)
const filterStatus = ref('all')
const currentProjectId = ref('')
const projectForm = ref({
  id: '',
  name: '',
  description: '',
  status: 'active' as 'active' | 'completed'
})
const taskForm = ref({
  title: ''
})

// 计算属性
const activeProjects = computed(() => 
  projects.value.filter(p => p.status === 'active')
)

const completedProjects = computed(() => 
  projects.value.filter(p => p.status === 'completed')
)

const totalTasks = computed(() => 
  projects.value.reduce((total, project) => total + project.tasks.length, 0)
)

const filteredProjects = computed(() => {
  if (filterStatus.value === 'all') return projects.value
  return projects.value.filter(p => p.status === filterStatus.value)
})

// 方法
const loadProjects = () => {
  const saved = localStorage.getItem('aura-projects')
  if (saved) {
    projects.value = JSON.parse(saved).map((p: any) => ({
      ...p,
      createdAt: new Date(p.createdAt)
    }))
  }
}

const saveProjects = () => {
  localStorage.setItem('aura-projects', JSON.stringify(projects.value))
}

const createProject = () => {
  const newProject: Project = {
    id: Date.now().toString(),
    name: projectForm.value.name,
    description: projectForm.value.description,
    status: projectForm.value.status,
    progress: 0,
    tasks: [],
    createdAt: new Date()
  }
  projects.value.push(newProject)
  saveProjects()
  closeModal()
}

const updateProject = () => {
  const index = projects.value.findIndex(p => p.id === projectForm.value.id)
  if (index !== -1) {
    projects.value[index] = {
      ...projects.value[index],
      name: projectForm.value.name,
      description: projectForm.value.description,
      status: projectForm.value.status
    }
    saveProjects()
  }
  closeModal()
}

const saveProject = () => {
  if (showEditModal.value) {
    updateProject()
  } else {
    createProject()
  }
}

const editProject = (project: Project) => {
  projectForm.value = {
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status
  }
  showEditModal.value = true
}

const deleteProject = (id: string) => {
  if (confirm('确定要删除这个项目吗？')) {
    projects.value = projects.value.filter(p => p.id !== id)
    saveProjects()
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  projectForm.value = {
    id: '',
    name: '',
    description: '',
    status: 'active'
  }
}

// 任务管理方法
const showTaskModal = (projectId: string) => {
  currentProjectId.value = projectId
  showAddTaskModal.value = true
}

const closeTaskModal = () => {
  showAddTaskModal.value = false
  currentProjectId.value = ''
  taskForm.value.title = ''
}

const addTask = () => {
  const project = projects.value.find(p => p.id === currentProjectId.value)
  if (project && taskForm.value.title.trim()) {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskForm.value.title.trim(),
      completed: false
    }
    project.tasks.push(newTask)
    updateProjectProgress(project)
    saveProjects()
    closeTaskModal()
  }
}

const toggleTask = (projectId: string, taskId: string) => {
  const project = projects.value.find(p => p.id === projectId)
  if (project) {
    const task = project.tasks.find(t => t.id === taskId)
    if (task) {
      task.completed = !task.completed
      updateProjectProgress(project)
      saveProjects()
    }
  }
}

const deleteTask = (projectId: string, taskId: string) => {
  if (confirm('确定要删除这个任务吗？')) {
    const project = projects.value.find(p => p.id === projectId)
    if (project) {
      project.tasks = project.tasks.filter(t => t.id !== taskId)
      updateProjectProgress(project)
      saveProjects()
    }
  }
}

const updateProjectProgress = (project: Project) => {
  if (project.tasks.length === 0) {
    project.progress = 0
  } else {
    const completedTasks = project.tasks.filter(t => t.completed).length
    project.progress = Math.round((completedTasks / project.tasks.length) * 100)
  }
}

const loadSampleData = () => {
  const sampleProjects: Project[] = [
    {
      id: '1',
      name: '水瓶座应用开发',
      description: '基于Vue3和TypeScript的现代化生产力应用',
      status: 'active',
      progress: 75,
      tasks: [
        { id: '1', title: '完成UI设计', completed: true },
        { id: '2', title: '实现核心功能', completed: true },
        { id: '3', title: '添加项目管理模块', completed: true },
        { id: '4', title: '优化性能', completed: false }
      ],
      createdAt: new Date()
    },
    {
      id: '2',
      name: '个人博客重构',
      description: '使用现代技术栈重构个人技术博客',
      status: 'active',
      progress: 30,
      tasks: [
        { id: '5', title: '设计新界面', completed: true },
        { id: '6', title: '迁移文章数据', completed: false },
        { id: '7', title: '添加评论系统', completed: false }
      ],
      createdAt: new Date()
    }
  ]
  
  projects.value = sampleProjects
  saveProjects()
}

// AI功能方法
const getProjectProgress = (project: Project) => {
  if (project.tasks.length === 0) return 0
  const completedTasks = project.tasks.filter(t => t.completed).length
  return Math.round((completedTasks / project.tasks.length) * 100)
}

const getProjectStatusClass = (status: string) => {
  return {
    'status-active': status === 'active',
    'status-completed': status === 'completed'
  }
}

const getStatusText = (status: string) => {
  const statusMap = {
    'active': '进行中',
    'completed': '已完成'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const getCompletionRate = () => {
  if (projects.value.length === 0) return 0
  return Math.round((completedProjects.value.length / projects.value.length) * 100)
}

const getAverageProgress = () => {
  if (activeProjects.value.length === 0) return 0
  const totalProgress = activeProjects.value.reduce((sum, project) => sum + getProjectProgress(project), 0)
  return Math.round(totalProgress / activeProjects.value.length)
}

const getCompletedTasksCount = () => {
  return projects.value.reduce((total, project) => {
    return total + project.tasks.filter(t => t.completed).length
  }, 0)
}

const getProjectHealthStatus = () => {
  const activeCount = activeProjects.value.length
  const avgProgress = getAverageProgress()
  
  if (activeCount === 0) return '暂无活跃项目'
  if (avgProgress >= 80) return '项目进展良好，保持当前节奏'
  if (avgProgress >= 50) return '项目进展正常，建议加快关键任务'
  return '项目进展较慢，建议重新评估优先级'
}

const getMostActiveProject = () => {
  return activeProjects.value.reduce((most, current) => {
    return current.tasks.length > (most?.tasks.length || 0) ? current : most
  }, null as Project | null)
}

const getEstimatedCompletion = (project: Project) => {
  const progress = getProjectProgress(project)
  if (progress >= 100) return '已完成'
  if (progress === 0) return '未开始'
  
  const daysRemaining = Math.ceil((100 - progress) / 10)
  return `约${daysRemaining}天后`
}

const getEfficiencyScore = (project: Project) => {
  const progress = getProjectProgress(project)
  const taskCount = project.tasks.length
  
  if (taskCount === 0) return 5
  if (progress >= 80) return Math.min(10, 8 + Math.floor(taskCount / 5))
  if (progress >= 50) return Math.min(8, 6 + Math.floor(taskCount / 3))
  return Math.max(3, Math.floor(progress / 10))
}

const getTaskPriority = (task: Task) => {
  return task.priority || '普通'
}

const getTaskEstimate = (task: Task) => {
  return task.estimatedHours ? `${task.estimatedHours}h` : '未估算'
}

const getProjectSuggestion = (project: Project) => {
  const progress = getProjectProgress(project)
  const taskCount = project.tasks.length
  
  if (taskCount === 0) {
    return '建议添加具体任务来启动项目'
  }
  
  if (progress < 30) {
    return '项目刚起步，建议专注于核心功能开发'
  }
  
  if (progress < 70) {
    return '项目进展良好，建议定期回顾和调整计划'
  }
  
  return '项目接近完成，建议进行最终测试和优化'
}

// 生命周期
onMounted(() => {
  loadProjects()
})
</script>

<style scoped>
/* AI-native 项目管理样式 */
.ai-projects-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  position: relative;
  overflow-x: hidden;
}

.ai-projects-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

/* AI助手头部 */
.ai-header {
  position: relative;
  z-index: 10;
  padding: 2rem 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.ai-assistant {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ai-avatar {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-glow {
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
  animation: rotate 3s linear infinite;
  z-index: -1;
}

.avatar-icon {
  width: 28px;
  height: 28px;
  color: white;
  z-index: 1;
}

.assistant-text .title {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.assistant-text .subtitle {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0.25rem 0 0 0;
}

.ai-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* AI按钮样式 */
.ai-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.ai-btn svg {
  width: 18px;
  height: 18px;
}

.ai-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.ai-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

.ai-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.ai-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.ai-btn.insights-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.ai-btn.create-btn {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.ai-btn.large {
  padding: 1rem 2rem;
  font-size: 1rem;
}

/* AI洞察面板 */
.ai-insights-panel {
  position: relative;
  z-index: 10;
  padding: 0 1.5rem 2rem;
  animation: slideDown 0.3s ease-out;
}

.insights-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.insight-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  transition: all 0.3s ease;
}

.insight-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.insight-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.insight-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.insight-text h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.5rem 0;
}

.insight-text p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.5;
}

/* 智能统计仪表板 */
.ai-dashboard {
  position: relative;
  z-index: 10;
  padding: 2rem 1.5rem;
}

.dashboard-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, currentColor, transparent);
  opacity: 0.6;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.stat-card.primary { color: #667eea; }
.stat-card.success { color: #4ade80; }
.stat-card.warning { color: #fbbf24; }
.stat-card.info { color: #06b6d4; }

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 28px;
  height: 28px;
  color: currentColor;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.25rem;
}

.stat-trend {
  font-size: 0.85rem;
  color: currentColor;
  font-weight: 500;
}

/* 智能项目列表 */
.ai-projects-list {
  position: relative;
  z-index: 10;
  padding: 0 1.5rem 2rem;
}

.projects-header {
  max-width: 1200px;
  margin: 0 auto 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.projects-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.25rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.filter-tab {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.filter-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.filter-tab:hover:not(.active) {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

/* 项目卡片网格 */
.projects-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
}

.project-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.project-info {
  flex: 1;
}

.project-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  width: fit-content;
}

.project-status.status-active {
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.project-status.status-completed {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s infinite;
}

.project-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
}

.project-description {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  margin: 0;
}

.project-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.action-btn.edit:hover {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

/* AI智能进度分析 */
.ai-progress-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.progress-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.progress-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.progress-percentage {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.ai-insight-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}

.ai-insight-badge svg {
  width: 14px;
  height: 14px;
}

.progress-bar-container {
  margin-bottom: 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.8s ease;
  position: relative;
}

.progress-glow {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  border-radius: 4px;
  animation: shimmer 2s infinite;
}

.progress-insights {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.insight-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.insight-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.insight-value {
  font-size: 0.85rem;
  color: white;
  font-weight: 600;
}

/* AI智能任务管理 */
.ai-tasks-section {
  margin-bottom: 2rem;
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tasks-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
}

.tasks-title svg {
  width: 20px;
  height: 20px;
  color: #667eea;
}

.add-task-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-task-btn svg {
  width: 16px;
  height: 16px;
}

.add-task-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.empty-tasks {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.6);
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon svg {
  width: 24px;
  height: 24px;
  color: rgba(255, 255, 255, 0.4);
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.task-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
}

.task-checkbox {
  position: relative;
}

.checkbox-input {
  opacity: 0;
  position: absolute;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.checkbox-input:checked + .checkbox-custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.checkbox-icon {
  width: 12px;
  height: 12px;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.checkbox-input:checked + .checkbox-custom .checkbox-icon {
  opacity: 1;
}

.task-content {
  flex: 1;
}

.task-title {
  font-size: 0.95rem;
  color: white;
  font-weight: 500;
  margin-bottom: 0.25rem;
  transition: all 0.3s ease;
}

.task-title.completed {
  text-decoration: line-through;
  color: rgba(255, 255, 255, 0.5);
}

.task-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.remove-task-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-task-btn svg {
  width: 14px;
  height: 14px;
}

.remove-task-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

/* AI项目建议 */
.ai-suggestions {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
}

.suggestion-header svg {
  width: 18px;
  height: 18px;
  color: #f093fb;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.suggestion-item {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border-left: 3px solid #f093fb;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

/* AI智能空状态 */
.ai-empty-state {
  max-width: 600px;
  margin: 4rem auto;
  text-align: center;
  padding: 3rem 2rem;
}

.empty-illustration {
  position: relative;
  margin-bottom: 2rem;
}

.ai-brain {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: float 3s ease-in-out infinite;
}

.ai-brain svg {
  width: 60px;
  height: 60px;
  color: white;
}

.floating-elements {
  position: absolute;
  inset: 0;
}

.element {
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float-element 4s ease-in-out infinite;
}

.element-1 {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.element-2 {
  top: 30%;
  right: 15%;
  animation-delay: 1s;
}

.element-3 {
  bottom: 25%;
  left: 15%;
  animation-delay: 2s;
}

.empty-content {
  margin-top: 2rem;
}

.empty-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.empty-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.empty-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* AI模态框 */
.ai-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.3s ease-out;
}

.ai-modal {
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease-out;
}

.ai-modal.compact {
  max-width: 400px;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.modal-title {
  flex: 1;
}

.modal-title h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.25rem 0;
}

.modal-title p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.modal-close {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close svg {
  width: 18px;
  height: 18px;
}

.modal-close:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.modal-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.75rem;
}

.form-label svg {
  width: 16px;
  height: 16px;
  color: #667eea;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-select option {
  background: #1a1a2e;
  color: white;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

/* 动画 */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes float-element {
  0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
  50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .ai-assistant {
    justify-content: center;
  }
  
  .ai-actions {
    justify-content: center;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .projects-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-left {
    align-items: center;
  }
  
  .filter-tabs {
    justify-content: center;
  }
  
  .progress-insights {
    grid-template-columns: 1fr;
  }
  
  .empty-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .ai-modal {
    margin: 1rem;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .ai-header {
    padding: 1.5rem 1rem;
  }
  
  .ai-dashboard,
  .ai-projects-list {
    padding: 1rem;
  }
  
  .project-card {
    padding: 1.5rem;
  }
  
  .modal-header,
  .modal-form {
    padding: 1.5rem;
  }
  
  .insights-content {
    grid-template-columns: 1fr;
  }
  
  .insight-card {
    padding: 1rem;
  }
}
</style>