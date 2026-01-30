# Frontend Development Guide
## Working on Games & UI 

This guide is for frontend developers working on the game interfaces and UI components of the Confident Moves Intervention platform.

---

## Table of Contents
1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Safe Files to Edit](#safe-files-to-edit)
4. [Files to Avoid](#files-to-avoid)
5. [Working with Templates](#working-with-templates)
6. [Working with Static Files](#working-with-static-files)
7. [Testing Your Changes](#testing-your-changes)
8. [Best Practices](#best-practices)
9. [Common Tasks](#common-tasks)
10. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites
- Python 3.8+ installed
- Git installed
- A code editor (VS Code, PyCharm, etc.)

### Initial Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd CM_Intervention
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv webdev
   source webdev/bin/activate  # On Windows: webdev\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables** (create `.env` file in project root):
   ```bash
   SECRET_KEY=dev-secret-key-change-me
   USE_LOCAL_DB=True
   DEBUG=True
   ```

5. **Run database migrations**:
   ```bash
   python manage.py migrate
   ```

6. **Create a superuser** (optional, for accessing admin):
   ```bash
   python manage.py createsuperuser
   ```

7. **Start the development server**:
   ```bash
   python manage.py runserver
   ```

8. **Access the site**:
   - Main site: http://127.0.0.1:8000/
   - Admin panel: http://127.0.0.1:8000/admin/

---

## Project Structure

### Frontend-Relevant Directories

```
CM_Intervention/
├── templates/                    # ✅ HTML templates (SAFE TO EDIT)
│   ├── interventions/            # ✅ Game challenge templates
│   │   ├── dom_challenge_19.html
│   │   ├── wr_challenge_9.html
│   │   ├── tr_challenge_14.html
│   │   └── ... (other challenges)
│   ├── dashboard.html           # ✅ Main dashboard
│   ├── intervention_access.html # ✅ Intervention access page
│   └── ... (other UI pages)
│
├── static/                       # ✅ Static files (SAFE TO EDIT)
│   ├── domestic/                 # ✅ Domestic activity icons
│   │   ├── vacuuming.png
│   │   ├── cooking.png
│   │   └── ... (other icons)
│   ├── demo_game/                # ✅ Game assets
│   │   └── images/
│   │       └── obese_man.png
│   ├── styles.css                # ✅ Global styles
│   └── js/                       # ✅ JavaScript files
│
└── testpas/                      # ⚠️ BACKEND - DO NOT EDIT
    ├── models.py                 # ❌ Database models
    ├── views.py                  # ❌ Backend logic
    ├── tasks.py                  # ❌ Celery tasks
    └── settings.py               # ❌ Configuration
```

---

## Safe Files to Edit

### ✅ Templates (HTML)
- **Location**: `templates/` directory
- **What you can do**:
  - Modify HTML structure
  - Add/remove UI elements
  - Change CSS classes
  - Add JavaScript for UI interactions
  - Update game mechanics (client-side only)
- **Examples**:
  - `templates/interventions/dom_challenge_19.html`
  - `templates/interventions/wr_challenge_9.html`
  - `templates/dashboard.html`

### ✅ Static Files
- **Location**: `static/` directory
- **What you can do**:
  - Add/modify CSS in `static/styles.css`
  - Add/modify JavaScript in `static/js/`
  - Add/replace images in `static/domestic/`, `static/demo_game/`
  - Add new game assets
- **Examples**:
  - `static/styles.css`
  - `static/domestic/vacuuming.png`
  - `static/demo_game/images/obese_man.png`

### ✅ Game Challenge Templates
- **Location**: `templates/interventions/`
- **What you can do**:
  - Modify game UI/UX
  - Add animations
  - Change point systems (client-side)
  - Update visual design
  - Add new game features

---

## Files to Avoid

### ❌ Backend Files (DO NOT EDIT)

**Critical Backend Files:**
- `testpas/models.py` - Database structure
- `testpas/views.py` - Server-side logic
- `testpas/tasks.py` - Email automation & Celery tasks
- `testpas/settings.py` - Configuration
- `testpas/forms.py` - Form validation
- `testpas/admin.py` - Admin interface
- `config/celery.py` - Task scheduling
- `config/urls.py` - URL routing
- `manage.py` - Django management

**Why?** These files control:
- User authentication
- Email sending
- Study timeline automation
- Database operations
- Security settings

**If you need backend changes**, contact the backend team first!

---

## Working with Templates

### Understanding Django Template Syntax

Templates use Django's template language. Key tags:

```django
{% load static %}                    {# Load static files #}
{% static 'path/to/file.png' %}     {# Generate static file URL #}
{% url 'view_name' %}                {# Generate URL from view name #}
{{ variable }}                       {# Display variable #}
{% if condition %}...{% endif %}     {# Conditional rendering #}
{% for item in list %}...{% endfor %} {# Loops #}
```

### Example: Adding a New Game Element

```django
{# In templates/interventions/dom_challenge_19.html #}

<div class="new-game-feature">
    <button class="btn" onclick="newFeature()">New Feature</button>
</div>

<script>
function newFeature() {
    // Your frontend-only JavaScript
    console.log('New feature clicked!');
}
</script>
```

### Accessing Backend Data (Read-Only)

Templates receive data from views. You can display it but **don't modify backend logic**:

```django
{# Safe: Displaying data #}
<p>Current Points: {{ current_points }}</p>
<p>User: {{ user.username }}</p>

{# Safe: Using data for UI #}
{% if current_points > 100 %}
    <div class="achievement-badge">Achievement Unlocked!</div>
{% endif %}
```

---

## Working with Static Files

### CSS Files

**Main stylesheet**: `static/styles.css`

```css
/* Add your styles here */
.new-feature {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem;
    border-radius: 8px;
}
```

### JavaScript Files

**Location**: `static/js/` or inline in templates

```javascript
// static/js/game-features.js
function newGameFeature() {
    // Your frontend logic
}
```

**Include in template:**
```django
{% load static %}
<script src="{% static 'js/game-features.js' %}"></script>
```

### Images & Assets

**Add new images:**
1. Place in appropriate `static/` subdirectory
2. Reference using `{% static %}` tag:

```django
<img src="{% static 'domestic/new-activity.png' %}" alt="New Activity">
```

**Supported formats**: PNG, JPG, SVG, GIF

---

## Testing Your Changes
# NOTE: FEEL FREE TO PUSH IT ON GITLAB, BUT CAUTIOUS ON GITHUB

### Local Testing Workflow

1. **Start the server**:
   ```bash
   python manage.py runserver
   ```

2. **Access the game page**:
   - Navigate to: http://127.0.0.1:8000/intervention-access/
   - Click on the challenge you're working on

3. **Check browser console**:
   - Open DevTools (F12)
   - Check Console for JavaScript errors
   - Check Network tab for missing static files

### Quick Test Checklist

- [ ] Page loads without errors
- [ ] All images display correctly
- [ ] CSS styles apply properly
- [ ] JavaScript interactions work
- [ ] No console errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Game mechanics function (client-side)

---

## Best Practices


### 1. Use Django Template Tags Correctly

✅ **DO:**
```django
<img src="{% static 'domestic/vacuuming.png' %}" alt="Vacuuming">
```

❌ **DON'T:**
```django
<img src="static/domestic/vacuuming.png" alt="Vacuuming">
<!-- This breaks on production! -->
```

### 2. Test Before Committing. AND DO NOT COMMIT TO branch 'render'

- Always test locally first
- Check multiple browsers (Chrome, Firefox, Safari)
- Push on GitLab is good. If you push on github, do not push to 'render' branch

### 4. Communicate Backend Needs

Contact Son Vu if you need:
- New data from backend 
- Database changes
- Authentication changes 

**Never commit:**
- Backend files (`testpas/*.py` except if explicitly told)
- Database files (`db.sqlite3`)
- Environment files (`.env`)

---

## Common Tasks

### Adding a New Game Challenge

1. **Create template file**:
   ```bash
   # Copy an existing challenge as template
   cp templates/interventions/dom_challenge_19.html \
      templates/interventions/new_challenge_25.html
   ```

2. **Modify the template**:
   - Update title, game mechanics, UI
   - Add your CSS/JavaScript
   - Test locally

3. **Add route** (if needed - contact backend team):
   - Backend team will add URL routing
   - You just need to provide the template

### Updating Game Icons
**Update template** (if filename changed):
   ```django
   <img src="{% static 'domestic/new-vacuuming.png' %}" alt="Vacuuming">
   ```

 **Test**: Refresh page to see new icon

### Adding Animations - this is up to you guys

### Modifying Game Point System (Client-Side Only)

```javascript
// In template <script> tag
let pointsPerActivity = 10;  // Change this
let bonusMultiplier = 1.5;   // Add bonuses. Right now backend does not account bonus yet, so you can take this or do something else with the point system.

function calculatePoints(activity) {
    return pointsPerActivity * bonusMultiplier;
}
```

**Note**: If you need points to persist in database, contact backend team.

---

## Troubleshooting

### Images Not Showing

**Problem**: Images return 404

**Solutions**:
1. Check file exists in `static/` directory
2. Use `{% static %}` tag, not hardcoded paths
3. Run `python manage.py collectstatic` (if needed)
4. Check `STATIC_URL` in settings (should be `/static/`)

### CSS Not Applying

**Problem**: Styles don't appear

**Solutions**:
1. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
2. Check CSS file is loaded in browser DevTools
3. Verify CSS syntax is correct
4. Check for conflicting styles

### JavaScript Not Working

**Problem**: Scripts don't execute

**Solutions**:
1. Check browser console for errors
2. Ensure script is after DOM elements it references
3. Use `DOMContentLoaded` if needed:
   ```javascript
   document.addEventListener('DOMContentLoaded', function() {
       // Your code here
   });
   ```

### Template Not Found

**Problem**: 404 error on game page

**Solutions**:
1. Check template file exists in `templates/interventions/`
2. Verify filename matches URL route
3. Contact backend team to add route if missing

### Changes Not Reflecting

**Problem**: Updates don't show up

**Solutions**:
1. Hard refresh browser (clear cache)
2. Restart Django server
3. Check you're editing the correct file
4. Verify file was saved

---

## Getting Help

### When to Contact Backend Team

Contact the backend team if you need:
- New database fields
- API endpoints
- Authentication changes
- Email functionality
- Study timeline automation
- Data persistence
- Server-side validation

### When You Can Proceed Independently

You can work independently on:
- UI/UX design
- CSS styling
- Client-side JavaScript
- Game animations
- Visual assets
- Template HTML structure
- Frontend game mechanics

---

## Quick Reference

### Common Django Template Tags

```django
{% load static %}                          {# Load static files #}
{% static 'path/to/file.png' %}           {# Static file URL #}
{% url 'view_name' %}                     {# URL from view name #}
{% url 'view_name' arg1 arg2 %}           {# URL with arguments #}
{{ variable }}                            {# Display variable #}
{{ variable|filter }}                     {# Apply filter #}
{% if condition %}...{% endif %}           {# Conditional #}
{% for item in list %}...{% endfor %}     {# Loop #}
{% include 'template.html' %}              {# Include template #}
{% extends 'base.html' %}                  {# Extend template #}
{% block content %}...{% endblock %}      {# Template block #}
```

### Common Static File Paths

```django
{% static 'styles.css' %}                           {# Main CSS #}
{% static 'domestic/vacuuming.png' %}               {# Activity icons #}
{% static 'demo_game/images/obese_man.png' %}      {# Game assets #}
{% static 'js/account.js' %}                        {# JavaScript #}
```

### Server Commands

```bash
python manage.py runserver              # Start dev server
python manage.py collectstatic          # Collect static files
python manage.py migrate                # Run migrations
python manage.py createsuperuser       # Create admin user
```

---

## Summary

✅ **You CAN edit:**
- `templates/` - All HTML templates
- `static/` - All CSS, JS, images
- Game UI/UX and client-side logic

## THIS APPLIES TO GITHUB.
❌ **You CANNOT edit:**  
- `testpas/` - Backend Python files
- `config/` - Configuration files
- Database models or views

**Remember**: When in doubt, ask the backend team before making changes that might affect server-side functionality!

---

**Last Updated**: January 2026  
**Maintained By**: Backend Development Team
