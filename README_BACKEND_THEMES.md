# Backend Theme System - Übersicht

## Folder Struktur

```
backend/
├── handlers/              # HTTP Handler für alle Endpoints
│   ├── health_handler.go  # /health Endpoint
│   └── theme_handler.go   # Alle /api/themes/* Endpoints
├── models/                # Datenstrukturen
│   └── theme.go           # Theme Model, Response Types
├── services/              # Business Logic
│   └── theme_service.go   # Theme Service mit TOML-Parsing
├── middleware/            # HTTP Middleware
│   └── cors.go            # CORS Middleware
├── storage/               # Persistente Daten
│   ├── themes/            # Vorkonfigurierte Themes
│   │   ├── default/       # Default Themes (mit App mitgeliefert)
│   │   │   ├── dark.toml
│   │   │   └── light.toml (optional)
│   │   └── community/     # Community Themes (von vigilance-community Repo)
│   │       └── {username}/
│   │           ├── theme1.toml
│   │           ├── theme2.toml
│   │           └── ...
│   └── uploads/           # User-Uploads (pro User-ID)
│       └── {user_id}/
│           ├── my_theme.toml
│           └── ...
├── go.mod                 # Go Module
├── main.go                # App-Start mit Route Registration
└── ARCHITECTURE.md        # Detaillierte Doku
```

## API Endpoints

### ✅ Health Check

```
GET /health
Response: {status, timestamp, version, uptime}
```

### 🎨 Themes

```
GET /api/themes
→ Listet ALLE Themes: default + community
```

```
GET /api/themes/get?source=default&theme=dark
→ Gibt volle TOML-Content eines Themes
```

```
GET /api/themes/my?user_id=user123
→ Zeigt User's eigene Themes
```

```
POST /api/themes/upload
Body: multipart/form-data
  - user_id: string
  - theme_name: string (alphanumeric, -, _)
  - theme_file: .toml file
→ Speichert Theme in storage/uploads/{user_id}/
```

```
DELETE /api/themes/upload?user_id=user123&theme_name=my_theme
→ Löscht User's Theme
```

## Theme Quellen

### 1. Default Themes (`storage/themes/default/`)

- Mit der App mitgeliefert
- Können manuell editiert werden
- Beispiele: dark.toml, light.toml

### 2. Community Themes (`storage/themes/community/`)

- Struktur: `{username}/{theme_name}.toml`
- Quelle: https://github.com/brendlij/vigilance-community
- Jeder mit Git-Account kann einen PR machen
- Angenommene PRs werden ins Backend synced

### 3. User Themes (`storage/uploads/{user_id}/`)

- Von Usern direkt hochgeladen
- Werden permanent auf dem Backend gespeichert
- Pro User einen Ordner

## Für Community-Themes beitragen

1. Fork: https://github.com/brendlij/vigilance-community
2. Folder erstellen: `themes/dein_username/`
3. `.toml` Dateien hinzufügen
4. PR öffnen
5. Nach Accept → Wird ins Backend syncronisiert

## TOML Theme Format

```toml
[metadata]
name = "My Theme"
description = "Description"
version = "1.0.0"
author = "username"

[dark.colors]
primary = "#4f46e5"
# ... Farben für Dark Mode

[light.colors]  # Optional
primary = "#333"
# ... Farben für Light Mode

[shared.spacing]
xs = "0.25rem"
# ... Spacing Variablen

[shared.typography]
font-family = "'Inter', sans-serif"
# ... Typography Settings

[shared.border-radius]
sm = "0.375rem"
# ... Radius

[shared.shadows]
sm = "0 1px 2px..."
# ... Shadows

[shared.transitions]
fast = "150ms ease-in-out"
# ... Transitions
```

## Service Methods

```go
themeService.GetDefaultThemes()          // Alle Default Themes
themeService.GetCommunityThemes()        // Community Themes (map[username][]Theme)
themeService.GetUserThemes(userID)       // User's Themes
themeService.GetThemeContent(...)        // Voller TOML Content
themeService.SaveUserTheme(...)          // Speichert User Upload
themeService.DeleteUserTheme(...)        // Löscht User Theme
```
