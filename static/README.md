# CELLEB - Static HTML Website

## Overview

This is a complete static HTML/CSS/JavaScript version of the CELLEB entertainment website. No React or other frameworks are needed - just pure HTML, CSS, and vanilla JavaScript.

## File Structure

```
static/
├── index.html              # Homepage
├── contact.html            # Contact Us page
├── advertise.html          # Advertise page
├── article.html            # Article detail page template
├── box-office.html         # Box Office category page
├── bollywood.html          # Bollywood category page
├── pan-india.html          # PAN India category page
├── trailer-review.html     # Trailer Review category page
├── movie-review.html       # Movie Review category page
├── hollywood.html          # Hollywood category page
├── streaming.html          # Streaming category page
├── tv-serial.html          # TV Serial category page
├── privacy.html            # Privacy Policy page
├── terms.html              # Terms of Service page
├── styles.css              # Global CSS stylesheet
├── script.js               # Global JavaScript file
└── README.md               # This file
```

## Features

### HTML Pages
- **Responsive Design** - Mobile-first approach, works on all devices
- **Semantic HTML** - Proper HTML5 structure
- **Accessibility** - ARIA labels and proper heading hierarchy
- **No Dependencies** - Pure HTML, CSS, and JavaScript

### CSS (styles.css)
- **Mobile Responsive** - Breakpoints for mobile, tablet, desktop
- **Grid Layouts** - Modern CSS Grid for article cards
- **Flexbox** - Used for header and footer layouts
- **CSS Variables** - Easy theme customization
- **Smooth Transitions** - Hover effects and animations

### JavaScript (script.js)
- **Mobile Menu Toggle** - Click menu button to show/hide navigation
- **Smooth Scrolling** - Anchor link navigation with smooth scroll
- **Active Link Highlighting** - Current page link is highlighted
- **Back to Top Button** - Scroll to top functionality
- **Lazy Loading** - Image lazy loading support
- **No External Libraries** - Pure vanilla JavaScript

## How to Use

### Local Development
1. Download all files to a folder
2. Open `index.html` in your web browser
3. No server required - works locally with file:// protocol

### Deploy to Web

#### Option 1: GitHub Pages
1. Create a GitHub repository
2. Upload all files to the repository
3. Go to Settings → Pages
4. Select "Deploy from a branch"
5. Choose the branch and save
6. Your site will be live at `https://yourusername.github.io/repository-name`

#### Option 2: Netlify
1. Go to netlify.com
2. Click "New site from Git"
3. Connect your GitHub repository
4. Netlify will automatically deploy
5. Your site will be live instantly

#### Option 3: Any Static Host
- AWS S3
- Azure Static Web Apps
- Vercel
- Cloudflare Pages
- Any traditional web hosting

### Customization

#### Change Logo
Find this line in each HTML file:
```html
<img src="https://cdn.builder.io/api/v1/image/assets%2F..." alt="CELLEB" class="logo-img">
```
Replace the `src` URL with your logo URL.

#### Change Colors
Edit `styles.css` CSS variables:
```css
:root {
  --primary: #d4af37;           /* Gold color */
  --primary-dark: #b8941f;      /* Dark gold */
  --black: #000000;
  --white: #ffffff;
}
```

#### Update Links
All links are in `href` attributes. Search and replace:
- `contact.html` → Your contact page URL
- `advertise.html` → Your advertise page URL
- Social media links → Your social media URLs

#### Modify Content
Each HTML page is self-contained. Edit text, images, and structure directly in the HTML file.

## Page Templates

### Homepage (index.html)
- Hero section with featured article
- "What's Hot" sidebar
- Multiple category sections (Bollywood, Box Office, Streaming)
- Article grid layout

### Category Pages (bollywood.html, etc.)
- Category header with title
- Article grid (4 columns on desktop, 1-2 on mobile)
- Footer with navigation
- Can be duplicated and modified for new categories

### Article Detail (article.html)
- Full article content
- Author information
- Featured image
- Related articles section
- Comment area (can be added)

### Legal Pages (privacy.html, terms.html)
- Simple text-based pages
- Easy to update with new content
- Linked from footer

## Browser Support

- Chrome/Edge (Latest 2 versions)
- Firefox (Latest 2 versions)
- Safari (Latest 2 versions)
- iOS Safari
- Android Chrome

## Performance

- **No Framework Overhead** - Loads instantly
- **Minified CSS** - 65.8 kB (11.84 kB gzipped)
- **Minified JavaScript** - Only essential features
- **Optimized Images** - Use compressed images from Unsplash/Pexels

## Mobile Optimization

- **Sticky Header** - Always accessible navigation
- **Responsive Grid** - Cards stack on mobile
- **Touch-Friendly** - Large buttons and tap targets
- **Mobile Menu** - Hamburger menu for navigation
- **Flexible Layout** - Adapts to all screen sizes

## SEO

Each page includes:
- Proper `<title>` tags
- Meta descriptions (can be added)
- Semantic HTML structure
- Proper heading hierarchy
- Mobile-responsive meta viewport

## Future Enhancements

To add more features in the future:
1. **Search Functionality** - Add JavaScript search filter
2. **Comments** - Integrate Disqus or similar
3. **Newsletter** - Add email signup form
4. **Analytics** - Add Google Analytics tracking
5. **Forms** - Use Formspree or similar for contact forms
6. **Dark Mode** - Add theme switcher in JavaScript

## Troubleshooting

### Images Not Loading
- Ensure image URLs are absolute (not relative paths)
- Check image URLs are publicly accessible
- Verify no typos in image file paths

### Links Not Working
- Check file names match exactly (case-sensitive)
- Ensure .html extensions are included
- Verify relative paths are correct

### Mobile Menu Not Working
- Check `script.js` is loaded
- Ensure browser supports ES6 JavaScript
- Check browser console for errors

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- Check `styles.css` is in the same folder
- Verify CSS file is linked in all HTML files

## Support

For questions or issues:
1. Check the README thoroughly
2. Review the HTML comments in each file
3. Test in different browsers
4. Validate HTML at validator.w3.org
5. Validate CSS at jigsaw.w3.org/css-validator

## License

Free to use and modify for your project.

## Contact

- Email: managingeditor@cellebindia.com
- Instagram: @CellebIndia
- Twitter: @CellebIndia
- YouTube: @CellebIndia
