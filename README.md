# CifrasDelMundo - Next.js Version

A trivia web application where all questions are answered with numbers. Built with Next.js, TypeScript, and modern React.

## Features

- 1000+ trivia questions answered with numbers
- Hold-to-reveal answer and next question functionality
- Mobile-friendly with touch support
- Session tracking to avoid repeated questions
- Beautiful animated gradient background
- Category-based questions with color coding
- Responsive design

## Setup Instructions

### Prerequisites

Make sure you have Node.js installed (version 18 or higher recommended).

### Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main page component
├── components/         # React components
└── data/              # Data files
    └── questions.ts   # Questions database
```

## How to Play

1. **Hold the button** to reveal the answer to the current question
2. **Hold the button again** to move to the next question
3. The counter in the top right shows how many questions you've seen
4. Questions are categorized and color-coded for easy identification

## Categories

- **Naturaleza** (Nature) - Blue gradient
- **Geografía** (Geography) - Green gradient  
- **Historia** (History) - Pink gradient
- **Matemáticas** (Mathematics) - Purple gradient
- **Deportes** (Sports) - Magenta gradient
- **Demografía** (Demographics) - Teal gradient

## Deployment

This project can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- Any static hosting service

## Migration from Static HTML

This Next.js version includes all the features from the original static HTML version:
- ✅ Hold-to-reveal functionality
- ✅ Mobile touch support
- ✅ Session tracking
- ✅ Animated background
- ✅ Category system
- ✅ Responsive design
- ✅ SEO optimization
- ✅ Favicon support

## Development

The project uses:
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **React 18** with hooks
- **CSS Modules** for styling
- **ESLint** for code quality

## Adding More Questions

Edit `src/data/questions.ts` to add more questions. Each question should follow this structure:

```typescript
{
  question: "Your question here?",
  answer: 123,
  explanation: "Explanation of the answer",
  category: "Category Name"
}
``` 