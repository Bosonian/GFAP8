'use strict';

/**
 * App shell orchestrating routing, state, and UI event wiring.
 * Integrates modular domain logic and screens.
 */

import { renderProgress } from './ui/components/progress.js';

// Screens
import triage1 from './ui/screens/triage1.js';
import triage2 from './ui/screens/triage2.js';
import coma from './ui/screens/coma.js';
import limited from './ui/screens/limited.js';
import full from './ui/screens/full.js';
import results from './ui/screens/results.js';

// Core and domain
import { config } from './core/config.js';
import { state } from './core/state.js';
import { logEvent } from './core/events.js';
import { runModels } from './domain/models.js';

const App = {
  container: null,
  state,
  config,

  init() {
    this.container = document.getElementById('appContainer');
    if (!this.container) {
      console.error('App container not found');
      return;
    }

    this.state.sessionId = this.generateSessionId();
    this.state.startTime = Date.now();

    this.setupEventListeners();
    this.initializeTheme();
    this.render();
    this.startAutoSave();
    this.setupSessionTimeout();

    const yearElement = document.getElementById('currentYear');
    if (yearElement) yearElement.textContent = new Date().getFullYear();

    console.log('App initialized with session:', this.state.sessionId);
  },

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },

  setupEventListeners() {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) darkModeToggle.addEventListener('click', () => this.toggleDarkMode());

    // Help modal
    const helpButton = document.getElementById('helpButton');
    const helpModal = document.getElementById('helpModal');
    const modalClose = helpModal?.querySelector('.modal-close');

    if (helpButton && helpModal) {
      helpButton.addEventListener('click', () => {
        helpModal.classList.add('show');
        helpModal.setAttribute('aria-hidden', 'false');
      });
      modalClose?.addEventListener('click', () => {
        helpModal.classList.remove('show');
        helpModal.setAttribute('aria-hidden', 'true');
      });
      helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
          helpModal.classList.remove('show');
          helpModal.setAttribute('aria-hidden', 'true');
        }
      });
    }

    // Footer links
    document.getElementById('privacyLink')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showPrivacyPolicy();
    });
    document.getElementById('disclaimerLink')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showDisclaimer();
    });

    // Keyboard: ESC closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.getElementById('helpModal')?.classList.remove('show');
      }
    });

    // Before unload warning
    window.addEventListener('beforeunload', (e) => {
      if (this.hasUnsavedData()) {
        e.preventDefault();
        // Some browsers require returnValue to be set
        e.returnValue = 'You have unsaved data. Are you sure you want to leave?';
      }
    });
  },

  initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.body.classList.add('dark-mode');
      if (darkModeToggle) darkModeToggle.textContent = '☀️';
    }
  },

  toggleDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    if (darkModeToggle) darkModeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  },

  startAutoSave() {
    setInterval(() => {
      this.saveFormData();
    }, this.config.autoSaveInterval);
  },

  saveFormData() {
    const forms = this.container.querySelectorAll('form');
    forms.forEach((form) => {
      const formData = new FormData(form);
      const module = form.dataset.module;
      if (module) {
        this.state.formData[module] = {};
        formData.forEach((value, key) => {
          this.state.formData[module][key] = value;
        });
      }
    });
  },

  restoreFormData(module) {
    if (!this.state.formData[module]) return;
    const form = this.container.querySelector(`form[data-module="${module}"]`);
    if (!form) return;

    Object.entries(this.state.formData[module]).forEach(([key, value]) => {
      const input = form.elements[key];
      if (!input) return;
      if (input.type === 'checkbox') {
        input.checked = value === 'on' || value === true || value === 'true';
      } else {
        input.value = value;
      }
    });
  },

  setupSessionTimeout() {
    setTimeout(() => {
      if (confirm('Your session has been idle for 30 minutes. Would you like to continue?')) {
        this.setupSessionTimeout();
      } else {
        this.reset();
      }
    }, this.config.sessionTimeout);
  },

  hasUnsavedData() {
    return Object.keys(this.state.formData).length > 0 && !this.state.results;
  },

  navigate(screen) {
    logEvent(this.state.sessionId, 'navigate', { from: this.state.currentScreen, to: screen });
    this.state.currentScreen = screen;
    this.render();
    window.scrollTo(0, 0);
    this.announceScreenChange(screen);
  },

  announceScreenChange(screen) {
    const announcement = document.createElement('div');
    announcement.className = 'sr-only';
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    const screenNames = {
      triage1: 'Coma assessment',
      triage2: 'Examination capability assessment',
      coma: 'Coma module',
      limited: 'Limited data module',
      full: 'Full stroke assessment',
      results: 'Assessment results'
    };
    announcement.textContent = `Navigated to ${screenNames[screen] || screen}`;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  },

  handleTriage1(isComatose) {
    logEvent(this.state.sessionId, 'triage1_answer', { comatose: isComatose });
    this.navigate(isComatose ? 'coma' : 'triage2');
  },

  handleTriage2(isExaminable) {
    logEvent(this.state.sessionId, 'triage2_answer', { examinable: isExaminable });
    this.navigate(isExaminable ? 'full' : 'limited');
  },

  reset() {
    if (this.hasUnsavedData()) {
      if (!confirm('Are you sure you want to start over? All entered data will be lost.')) return;
    }
    logEvent(this.state.sessionId, 'reset');
    this.state.currentScreen = 'triage1';
    this.state.results = null;
    this.state.inputs = null;
    this.state.sessionId = this.generateSessionId();
    this.state.startTime = Date.now();
    this.state.formData = {};
    this.state.validationErrors = {};
    this.render();
  },

  validateForm(form) {
    const rules = {
      age_years: { required: true, min: 0, max: 120 },
      systolic_bp: { required: true, min: 60, max: 300 },
      diastolic_bp: { required: true, min: 30, max: 200 },
      gfap_value: { required: true, min: this.config.gfapRanges.min, max: this.config.gfapRanges.max },
      fast_ed_score: { required: true, min: 0, max: 9 }
    };

    let ok = true;
    this.state.validationErrors = {};

    Object.entries(rules).forEach(([name, r]) => {
      const el = form.elements[name];
      if (!el) return;

      const raw = el.type === 'checkbox' ? (el.checked ? 1 : '') : el.value;
      const errs = [];

      if (r.required && (raw === '' || raw === undefined)) errs.push('This field is required');
      if (r.min !== undefined && raw !== '' && parseFloat(raw) < r.min) errs.push(`Value must be at least ${r.min}`);
      if (r.max !== undefined && raw !== '' && parseFloat(raw) > r.max) errs.push(`Value must be at most ${r.max}`);

      if (errs.length) {
        ok = false;
        this.state.validationErrors[name] = errs;
      }
    });

    return ok;
  },

  showValidationErrors() {
    Object.entries(this.state.validationErrors).forEach(([name, errors]) => {
      const input = this.container.querySelector(`[name="${name}"]`);
      if (!input) return;
      const group = input.closest('.input-group');
      if (!group) return;

      group.classList.add('error');
      // Remove existing messages
      group.querySelectorAll('.error-message').forEach((el) => el.remove());
      // Add new
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.innerHTML = `<span class="error-icon">⚠️</span> ${errors[0]}`;
      group.appendChild(errorDiv);
    });
  },

  async handleSubmit(e, module) {
    e.preventDefault();
    const form = e.target;

    // Validate
    if (!this.validateForm(form)) {
      this.showValidationErrors();
      return;
    }

    // Collect inputs
    const formData = new FormData(form);
    const inputs = {};
    formData.forEach((value, key) => {
      const el = form.elements[key];
      if (el && el.type === 'checkbox') {
        inputs[key] = el.checked;
      } else {
        const n = parseFloat(value);
        inputs[key] = isNaN(n) ? value : n;
      }
    });

    // Loading state
    const button = form.querySelector('button[type=submit]');
    const original = button ? button.innerHTML : '';
    if (button) {
      button.disabled = true;
      button.innerHTML = '<span class="loading-spinner"></span> Analyzing...';
    }

    try {
      const resultsData = await runModels(inputs, module);
      this.state.results = resultsData;
      this.state.inputs = inputs;
      this.navigate('results');
    } catch (error) {
      console.error('Error running models:', error);
      alert('An error occurred during analysis. Please try again.');
    } finally {
      if (button) {
        button.disabled = false;
        button.innerHTML = original;
      }
    }
  },

  showPrivacyPolicy() {
    alert('Privacy Policy: This tool processes data locally. No patient data is stored or transmitted.');
  },

  showDisclaimer() {
    alert('Medical Disclaimer: This tool is for clinical decision support only. Always use clinical judgment and follow local protocols.');
  },

  render() {
    const screens = {
      triage1,
      triage2,
      coma,
      limited,
      full,
      results: (props) => results(props)
    };

    const renderFunction = screens[this.state.currentScreen] || triage1;

    const props =
      this.state.currentScreen === 'results'
        ? { results: this.state.results, startTime: this.state.startTime, inputs: this.state.inputs }
        : { renderProgress };

    this.container.innerHTML = renderFunction(props);

    // Restore form data if available
    const form = this.container.querySelector('form');
    if (form && form.dataset.module) this.restoreFormData(form.dataset.module);

    this.attachDynamicEventListeners();
  },

  attachDynamicEventListeners() {
    // Action buttons (triage navigation + reset)
    this.container.querySelectorAll('[data-action]').forEach((button) => {
      button.addEventListener('click', (e) => {
        const { action, value } = e.currentTarget.dataset;
        const boolVal = value === 'true';
        if (action === 'triage1') this.handleTriage1(boolVal);
        else if (action === 'triage2') this.handleTriage2(boolVal);
        else if (action === 'reset') this.reset();
      });
    });

    // Form submissions (coma / limited / full)
    this.container.querySelectorAll('form[data-module]').forEach((form) => {
      form.addEventListener('submit', (e) => this.handleSubmit(e, form.dataset.module));
    });

    // Clear visual errors on blur
    this.container.querySelectorAll('input[type="number"]').forEach((input) => {
      input.addEventListener('blur', () => {
        const group = input.closest('.input-group');
        if (group) {
          group.classList.remove('error');
          group.querySelectorAll('.error-message').forEach((el) => el.remove());
        }
      });
    });

    // Print in results
    const printButton = this.container.querySelector('#printResults');
    if (printButton) printButton.addEventListener('click', () => window.print());
  }
};

export default App;