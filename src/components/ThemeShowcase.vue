<template>
  <div class="showcase">
    <!-- Colors Section -->
    <section class="showcase-section">
      <h2>Colors</h2>

      <div class="subsection">
        <h3>Primary Colors</h3>
        <div class="color-grid">
          <div class="color-box">
            <div
              class="color-swatch"
              style="background: var(--color-primary)"
            ></div>
            <span>Primary</span>
            <code>#4f46e5</code>
          </div>
          <div class="color-box">
            <div
              class="color-swatch"
              style="background: var(--color-primary-light)"
            ></div>
            <span>Primary Light</span>
            <code>#6366f1</code>
          </div>
          <div class="color-box">
            <div
              class="color-swatch"
              style="background: var(--color-primary-dark)"
            ></div>
            <span>Primary Dark</span>
            <code>#4338ca</code>
          </div>
        </div>
      </div>

      <div class="subsection">
        <h3>Status Colors</h3>
        <div class="color-grid">
          <div class="color-box">
            <div
              class="color-swatch"
              style="background: var(--color-success)"
            ></div>
            <span>Success</span>
            <code>#10b981</code>
          </div>
          <div class="color-box">
            <div
              class="color-swatch"
              style="background: var(--color-error)"
            ></div>
            <span>Error</span>
            <code>#f43f5e</code>
          </div>
          <div class="color-box">
            <div
              class="color-swatch"
              style="background: var(--color-warning)"
            ></div>
            <span>Warning</span>
            <code>#f59e0b</code>
          </div>
          <div class="color-box">
            <div
              class="color-swatch"
              style="background: var(--color-info)"
            ></div>
            <span>Info</span>
            <code>#06b6d4</code>
          </div>
        </div>
      </div>
    </section>

    <!-- Typography Section -->
    <section class="showcase-section">
      <h2>Typography</h2>
      <div class="subsection">
        <h3>Font Sizes</h3>
        <div class="typography-grid">
          <div class="typography-item">
            <span style="font-size: var(--font-size-sm)">Small Text (sm)</span>
            <code>0.875rem</code>
          </div>
          <div class="typography-item">
            <span style="font-size: var(--font-size-base)"
              >Base Text (base)</span
            >
            <code>1rem</code>
          </div>
          <div class="typography-item">
            <span style="font-size: var(--font-size-lg)">Large Text (lg)</span>
            <code>1.125rem</code>
          </div>
          <div class="typography-item">
            <span style="font-size: var(--font-size-xl)">Extra Large (xl)</span>
            <code>1.25rem</code>
          </div>
          <div class="typography-item">
            <span style="font-size: var(--font-size-2xl)">2XL Text</span>
            <code>1.5rem</code>
          </div>
          <div class="typography-item">
            <span style="font-size: var(--font-size-3xl)">3XL Text</span>
            <code>2rem</code>
          </div>
        </div>
      </div>

      <div class="subsection">
        <h3>Font Weights</h3>
        <div class="typography-grid">
          <div class="typography-item">
            <span style="font-weight: var(--font-weight-normal)"
              >Normal Weight</span
            >
            <code>400</code>
          </div>
          <div class="typography-item">
            <span style="font-weight: var(--font-weight-medium)"
              >Medium Weight</span
            >
            <code>500</code>
          </div>
          <div class="typography-item">
            <span style="font-weight: var(--font-weight-semibold)"
              >Semibold Weight</span
            >
            <code>600</code>
          </div>
          <div class="typography-item">
            <span style="font-weight: var(--font-weight-bold)"
              >Bold Weight</span
            >
            <code>700</code>
          </div>
        </div>
      </div>
    </section>

    <!-- Spacing Section -->
    <section class="showcase-section">
      <h2>Spacing</h2>
      <div class="subsection">
        <h3>Padding & Margins</h3>
        <div class="spacing-demo">
          <div class="spacing-box" style="padding: var(--spacing-xs)">
            XS (4px)
          </div>
          <div class="spacing-box" style="padding: var(--spacing-sm)">
            SM (8px)
          </div>
          <div class="spacing-box" style="padding: var(--spacing-md)">
            MD (16px)
          </div>
          <div class="spacing-box" style="padding: var(--spacing-lg)">
            LG (24px)
          </div>
          <div class="spacing-box" style="padding: var(--spacing-xl)">
            XL (32px)
          </div>
          <div class="spacing-box" style="padding: var(--spacing-xxl)">
            XXL (48px)
          </div>
        </div>
      </div>
    </section>

    <!-- Buttons Section -->
    <section class="showcase-section">
      <h2>Buttons</h2>
      <div class="subsection">
        <div class="button-demo">
          <button class="btn btn-primary">Primary</button>
          <button class="btn btn-secondary">Secondary</button>
          <button class="btn btn-success">Success</button>
          <button class="btn btn-warning">Warning</button>
          <button class="btn btn-error">Error</button>
          <button class="btn btn-info">Info</button>
        </div>
        <div class="button-demo">
          <button class="btn btn-primary" disabled>Disabled</button>
          <button class="btn btn-outline">Outline</button>
        </div>
      </div>
    </section>

    <!-- Cards Section -->
    <section class="showcase-section">
      <h2>Cards & Containers</h2>
      <div class="card-grid">
        <div class="card">
          <h3>Card with Border Radius</h3>
          <p>
            This card uses var(--radius-lg) for rounded corners and
            var(--shadow-md) for depth.
          </p>
          <button class="btn btn-primary btn-sm">Learn More</button>
        </div>
        <div class="card card-hover">
          <h3>Hoverable Card</h3>
          <p>
            Hover over this card to see the transition effect using
            var(--transition-base).
          </p>
          <button class="btn btn-secondary btn-sm">Action</button>
        </div>
        <div class="card card-alt">
          <h3>Alternative Card</h3>
          <p>This card uses background-tertiary for a different look.</p>
          <button class="btn btn-info btn-sm">Explore</button>
        </div>
      </div>
    </section>

    <!-- Input Section -->
    <section class="showcase-section">
      <h2>Form Elements</h2>
      <div class="subsection">
        <div class="form-demo">
          <input type="text" class="input" placeholder="Normal Input" />
          <input type="text" class="input" value="Focused Input" focus />
          <input
            type="text"
            class="input"
            placeholder="Disabled Input"
            disabled
          />
          <textarea class="input" placeholder="Textarea..." rows="4"></textarea>
        </div>
      </div>
    </section>

    <!-- Badges Section -->
    <section class="showcase-section">
      <h2>Badges & Labels</h2>
      <div class="subsection">
        <div class="badge-demo">
          <span class="badge badge-success">Success</span>
          <span class="badge badge-warning">Warning</span>
          <span class="badge badge-error">Error</span>
          <span class="badge badge-info">Info</span>
          <span class="badge badge-primary">Primary</span>
          <span class="badge badge-secondary">Secondary</span>
        </div>
      </div>
    </section>

    <!-- Border Radius Section -->
    <section class="showcase-section">
      <h2>Border Radius</h2>
      <div class="subsection">
        <div class="radius-grid">
          <div class="radius-box" style="border-radius: var(--radius-sm)">
            SM (6px)
          </div>
          <div class="radius-box" style="border-radius: var(--radius-md)">
            MD (8px)
          </div>
          <div class="radius-box" style="border-radius: var(--radius-lg)">
            LG (12px)
          </div>
          <div class="radius-box" style="border-radius: var(--radius-full)">
            Full (9999px)
          </div>
        </div>
      </div>
    </section>

    <!-- Shadows Section -->
    <section class="showcase-section">
      <h2>Shadows</h2>
      <div class="subsection">
        <div class="shadow-grid">
          <div class="shadow-box" style="box-shadow: var(--shadow-sm)">
            Shadow SM
          </div>
          <div class="shadow-box" style="box-shadow: var(--shadow-md)">
            Shadow MD
          </div>
          <div class="shadow-box" style="box-shadow: var(--shadow-lg)">
            Shadow LG
          </div>
          <div class="shadow-box" style="box-shadow: var(--shadow-xl)">
            Shadow XL
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Showcase component - no script logic needed
</script>

<style scoped>
/* ==================== MAIN LAYOUT ==================== */
.showcase {
  padding: var(--spacing-xl);
  background: var(--color-background);
  color: var(--color-text-primary);
  font-family: var(--font-family);
  max-width: 1200px;
  margin: 0 auto;
}

.showcase-section {
  margin-bottom: var(--spacing-xxl);
}

.showcase-section h2 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-lg);
  color: var(--color-primary);
  padding-bottom: var(--spacing-md);
  border-bottom: 2px solid var(--color-border);
}

.subsection {
  margin-bottom: var(--spacing-lg);
}

.subsection h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-md);
  color: var(--color-text-secondary);
}

/* ==================== COLORS ==================== */
.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--spacing-md);
}

.color-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.color-swatch {
  width: 100%;
  height: 100px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
}

.color-box span {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
}

.color-box code {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-family: monospace;
}

/* ==================== TYPOGRAPHY ==================== */
.typography-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.typography-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-background-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.typography-item code {
  font-size: var(--font-size-sm);
  color: var(--color-accent);
  font-family: monospace;
}

/* ==================== SPACING ==================== */
.spacing-demo {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.spacing-box {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: white;
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-md);
  min-width: 100px;
  text-align: center;
  transition: all var(--transition-base);
}

.spacing-box:hover {
  background: var(--color-primary-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* ==================== BUTTONS ==================== */
.button-demo {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--color-background-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  border: none;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-base);
  font-family: var(--font-family);
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-light);
}

.btn-secondary {
  background: var(--color-secondary);
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-secondary-light);
}

.btn-success {
  background: var(--color-success);
  color: white;
}

.btn-warning {
  background: var(--color-warning);
  color: white;
}

.btn-error {
  background: var(--color-error);
  color: white;
}

.btn-info {
  background: var(--color-info);
  color: white;
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
}

.btn-outline:hover:not(:disabled) {
  background: var(--color-primary);
  color: white;
}

.btn-sm {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
}

/* ==================== CARDS ==================== */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.card {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.card h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
}

.card p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
}

.card-hover:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-base);
  transform: translateY(-2px);
}

.card-alt {
  background: var(--color-background-tertiary);
}

/* ==================== FORM ELEMENTS ==================== */
.form-demo {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--color-background-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.input {
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
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  background: var(--color-background-secondary);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input::placeholder {
  color: var(--color-text-muted);
}

/* ==================== BADGES ==================== */
.badge-demo {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--color-background-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
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

.badge-primary {
  background: var(--color-primary);
  color: white;
}

.badge-secondary {
  background: var(--color-secondary);
  color: white;
}

/* ==================== BORDER RADIUS ==================== */
.radius-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
}

.radius-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-secondary)
  );
  color: white;
  font-weight: var(--font-weight-semibold);
  box-shadow: var(--shadow-md);
}

/* ==================== SHADOWS ==================== */
.shadow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-lg);
}

.shadow-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-semibold);
  transition: all var(--transition-base);
}

.shadow-box:hover {
  transform: translateY(-4px);
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 768px) {
  .showcase {
    padding: var(--spacing-lg);
  }

  .color-grid,
  .typography-grid,
  .radius-grid,
  .shadow-grid {
    grid-template-columns: 1fr;
  }

  .button-demo {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
