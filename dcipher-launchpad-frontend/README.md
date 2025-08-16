# DCipher Launchpad Frontend

A provably fair launchpad application built with Next.js 14 and a neo-brutalist design system.

## 🎨 Neo-Brutalism Design System

This frontend implements a **neo-brutalist design philosophy** characterized by:

### Design Principles
- **Clean white backgrounds** with sharp, geometric shapes and no rounded corners
- **High contrast** color schemes with black borders and vibrant neon accents
- **Typography-focused** layouts with strong, monospace fonts
- **Modern, industrial aesthetic** that prioritizes clarity and impact
- **Grid-based layouts** with clear visual hierarchy and white space

### Color Palette
- **Primary**: `#ff006e` (Hot Pink)
- **Secondary**: `#00d4ff` (Electric Blue)
- **Accent**: `#ffbe0b` (Bright Yellow)
- **Success**: `#06ffa5` (Neon Green)
- **Error**: `#ff006e` (Hot Pink)
- **Warning**: `#ffbe0b` (Bright Yellow)
- **Background**: `#ffffff` (Pure White)
- **Foreground**: `#000000` (Pure Black)
- **Text Secondary**: `#666666` (Medium Gray)

### Typography
- **Display Font**: Courier New (Monospace) for headings
- **Body Font**: Arial Black (Bold Sans-serif) for body text
- **Monospace Font**: Courier New for code and technical content
- **All text is UPPERCASE** for maximum impact
- **Bold weights** throughout for strong visual presence

### Components
- **Cards**: Pure white backgrounds with thick black borders and drop shadows
- **Buttons**: High-contrast with hover animations and active states
- **Inputs**: Monospace fonts with focus states and validation
- **Grids**: Responsive layouts that adapt to different screen sizes
- **Color Variants**: Pre-built card and button styles for different purposes

## 📱 Responsive Design

The application is fully responsive and follows a **mobile-first approach**:

### Breakpoints
- **Mobile**: `< 640px` - Single column layouts, stacked elements
- **Tablet**: `640px - 1024px` - Two-column grids, optimized spacing
- **Desktop**: `> 1024px` - Multi-column layouts, enhanced spacing

### Responsive Features
- **Fluid typography** using `clamp()` for optimal scaling
- **Adaptive grids** that collapse to single columns on mobile
- **Flexible spacing** that adjusts based on screen size
- **Touch-friendly** buttons and interactive elements
- **Optimized layouts** for different device orientations

## 🚀 Features

### Core Functionality
- **Participant Management**: Add multiple wallet addresses
- **Winner Selection**: Configurable number of winners
- **Verification**: On-chain proof with transaction hashes
- **History**: Complete selection history with expandable details
- **Copy Functions**: Easy copying of addresses and hashes

### User Experience
- **Real-time Validation**: Form validation with clear error messages
- **Loading States**: Visual feedback during processing
- **Sample Data**: Quick start with example addresses
- **Responsive Forms**: Optimized for all device sizes

## 🛠️ Technical Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Custom CSS Variables**: Design system tokens
- **Responsive Design**: Mobile-first approach

## 🎯 Design Goals

1. **Accessibility**: High contrast and clear typography
2. **Performance**: Optimized for fast loading and smooth interactions
3. **Usability**: Intuitive interface that works on all devices
4. **Branding**: Distinctive neo-brutalist aesthetic that stands out
5. **Scalability**: Design system that can grow with the application

## 🔧 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📐 Design System Usage

### CSS Classes
- `.btn` - Base button styles
- `.btn-primary`, `.btn-secondary`, etc. - Button variants
- `.card` - Card container with borders and shadows
- `.card-primary`, `.card-secondary`, etc. - Card color variants
- `.input` - Form input styling
- `.textarea` - Textarea styling
- `.grid-brutal` - Responsive grid system

### Spacing Utilities
- `.space-brutal` - Standard spacing between elements
- `.space-brutal-sm` - Small spacing
- `.space-brutal-lg` - Large spacing

### Responsive Utilities
- `.container` - Responsive container with proper padding
- `.grid-brutal-1`, `.grid-brutal-2`, etc. - Responsive grid columns

### Color Utilities
- `.text-primary`, `.text-secondary`, etc. - Text color variants
- `.card-primary`, `.card-secondary`, etc. - Card color variants

## 🎨 Customization

The design system is built with CSS custom properties, making it easy to customize:

```css
:root {
  --primary: #ff006e;        /* Change primary color */
  --border-width: 3px;       /* Adjust border thickness */
  --shadow-md: 4px 4px 0px; /* Modify shadow styles */
  --card-bg: #ffffff;        /* Change card background */
}
```

## 📱 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **CSS Features**: CSS Grid, Flexbox, Custom Properties, Clamp()

## 🚀 Performance

- **Optimized Images**: WebP format with proper sizing
- **Efficient CSS**: Minimal CSS with utility classes
- **Fast Loading**: Optimized bundle sizes and lazy loading
- **Smooth Animations**: Hardware-accelerated transitions

## 🌟 Neo-Brutalism Features

### Visual Impact
- **Pure white backgrounds** for maximum contrast
- **Vibrant neon colors** for important elements
- **Sharp geometric shapes** with no rounded corners
- **Bold typography** that commands attention

### Modern Aesthetic
- **Clean, minimal design** that focuses on content
- **High contrast elements** for better readability
- **Consistent spacing** using the brutal spacing system
- **Professional appearance** suitable for business applications

---

Built with ❤️ and neo-brutalist design principles for the DCipher ecosystem.
