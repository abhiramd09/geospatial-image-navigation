# Geospatial Image Navigation

A modular, scalable geospatial web application for map navigation using Leaflet.js with a focus on clean architecture and maintainability.

## 🏗️ Architecture

The application follows a modular architecture pattern with clear separation of concerns:

```
src/
├── config/
│   └── constants.js          # Configuration constants
├── utils/
│   └── coordinateUtils.js    # Coordinate and tile calculations
├── services/
│   ├── MapService.js         # Map initialization and management
│   ├── TileService.js        # Tile operations and state
│   └── GridService.js        # Grid overlay management
├── controllers/
│   └── UIController.js       # UI interactions and DOM manipulation
├── app.js                    # Main application orchestrator
└── index.html               # Entry point
```

## 🚀 Features

- **Modular Architecture**: Clean separation of concerns with services and controllers
- **ES6 Modules**: Modern JavaScript with import/export syntax
- **Configuration Management**: Centralized configuration in constants
- **Service Layer**: Reusable services for different functionalities
- **Event-Driven**: Clean event handling between components
- **Scalable**: Easy to extend with new features

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🏛️ Architecture Benefits

### 1. **Separation of Concerns**
- **Config**: All constants and configuration in one place
- **Utils**: Pure functions for calculations
- **Services**: Business logic and state management
- **Controllers**: UI interactions and DOM manipulation

### 2. **Scalability**
- Easy to add new features by creating new services
- Modular structure allows independent development
- Clear interfaces between components

### 3. **Maintainability**
- Each module has a single responsibility
- Easy to test individual components
- Clear dependencies and imports

### 4. **Reusability**
- Services can be reused across different parts of the application
- Utility functions are pure and testable
- Configuration can be easily modified

## 🔧 Adding New Features

### Adding a New Service
1. Create a new service file in `src/services/`
2. Export a class with clear methods
3. Import and initialize in `app.js`

### Adding New Configuration
1. Add constants to `src/config/constants.js`
2. Import where needed

### Adding New Utilities
1. Create functions in `src/utils/` or create a new utility file
2. Export functions and import where needed

## 🧪 Testing Strategy

The modular structure makes testing easy:

```javascript
// Example test for coordinateUtils
import { isWithinBoundingBox } from './utils/coordinateUtils.js';

describe('isWithinBoundingBox', () => {
    it('should return true for coordinates within bounds', () => {
        expect(isWithinBoundingBox(17.4, 78.45)).toBe(true);
    });
});
```

## 📈 Future Enhancements

- **State Management**: Add a state management solution for complex state
- **API Layer**: Create service classes for external API calls
- **Error Handling**: Centralized error handling service
- **Logging**: Add logging service for debugging
- **Performance**: Add performance monitoring and optimization
- **Testing**: Add comprehensive test suite
- **Build System**: Add Webpack or Vite for bundling

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production (placeholder)
- `npm run test` - Run tests (placeholder)

### Code Style
- Use ES6+ features
- Follow single responsibility principle
- Add JSDoc comments for public methods
- Use meaningful variable and function names

## 📝 License

ISC