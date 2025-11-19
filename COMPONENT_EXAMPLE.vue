<!-- EXAMPLE: How to use CSS Variables in Components -->

<template>
  <div class="dashboard">
    <!-- Header -->
    <header class="header">
      <h1>Dashboard</h1>
      <p class="subtitle">Welcome back!</p>
    </header>

    <!-- Main Content -->
    <main class="content">
      <!-- Card Example -->
      <div class="card">
        <h2 class="card-title">Statistics</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Total Users</span>
            <span class="stat-value">1,234</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Active Today</span>
            <span class="stat-value">567</span>
          </div>
        </div>
      </div>

      <!-- Button Examples -->
      <div class="card">
        <h3>Actions</h3>
        <div class="button-group">
          <button class="btn btn-primary">Primary Action</button>
          <button class="btn btn-secondary">Secondary Action</button>
          <button class="btn btn-success">Success</button>
          <button class="btn btn-danger">Danger</button>
        </div>
      </div>

      <!-- Input Example -->
      <div class="card">
        <h3>Form</h3>
        <input type="text" class="input" placeholder="Enter text..." />
      </div>

      <!-- Status Badges -->
      <div class="card">
        <h3>Status</h3>
        <div class="badge-group">
          <span class="badge badge-success">Active</span>
          <span class="badge badge-warning">Pending</span>
          <span class="badge badge-error">Inactive</span>
          <span class="badge badge-info">Info</span>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// No script needed - just CSS variables!
</script>

<style scoped>
/* ==================== LAYOUT ==================== */
.dashboard {
  padding: var(--spacing-lg);
  background: var(--color-background);
  color: var(--color-text-primary);
  font-family: var(--font-family);
  min-height: 100vh;
}

.header {
  margin-bottom: var(--spacing-xxl);
}

.header h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-sm);
}

.subtitle {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

.content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

/* ==================== CARDS ==================== */
.card {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.card-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
}

.card h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-md);
}

/* ==================== STATS ==================== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background: var(--color-background-tertiary);
  border-radius: var(--radius-md);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

/* ==================== BUTTONS ==================== */
.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  border: none;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-light);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--color-secondary);
  color: white;
}

.btn-secondary:hover {
  background: var(--color-secondary-light);
}

.btn-success {
  background: var(--color-success);
  color: white;
}

.btn-danger {
  background: var(--color-error);
  color: white;
}

/* ==================== INPUTS ==================== */
.input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-background);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  transition: all var(--transition-base);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.input::placeholder {
  color: var(--color-text-muted);
}

/* ==================== BADGES ==================== */
.badge-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.badge-success {
  background: var(--color-success);
  color: white;
}

.badge-warning {
  background: var(--color-warning);
  color: white;
}

.badge-error {
  background: var(--color-error);
  color: white;
}

.badge-info {
  background: var(--color-info);
  color: white;
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 768px) {
  .dashboard {
    padding: var(--spacing-md);
  }

  .header h1 {
    font-size: var(--font-size-2xl);
  }

  .button-group {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
