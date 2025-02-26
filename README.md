# DivvyDime

DivvyDime is an open-source expense sharing application, designed as a clean, fast, and browser-based alternative to Splitwise. It helps groups of friends, roommates, or travelers easily track and split shared expenses.

## 🚀 Features

- **Group Expense Tracking**: Create groups for trips, roommates, events, and more
- **Multiple Split Options**: Split expenses evenly, by percentage, by shares, or by specific amounts
- **Expense Categories**: Organize expenses with customizable categories
- **Activity Timeline**: Track all changes and updates within your groups
- **Document Attachments**: Attach receipts and documents to expenses
- **Currency Support**: Track expenses in different currencies
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode**: Toggle between light and dark themes

## 💻 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: NextUI, TailwindCSS, Framer Motion
- **Database**: PostgreSQL with Prisma ORM
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: TailwindCSS with tailwind-variants

## 🛠️ Getting Started

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AnimeshRy/divvydime.git
   cd divvydime
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.template` to `.env`
   - Update the database connection strings and other required variables

4. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:4000](http://localhost:4000) in your browser

## 🧪 Development

### Available Scripts

- `npm run dev` - Start the development server on port 4000
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier

## 📝 Database Schema

DivvyDime uses a PostgreSQL database with the following main models:

- **Group**: Represents a collection of people sharing expenses
- **Participant**: Members of a group who share expenses
- **Expense**: Individual expenses with details like amount, payer, and split information
- **Category**: Expense categories for better organization
- **Activity**: Timeline of actions within a group

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [NextUI](https://nextui.org/)
- [Prisma](https://www.prisma.io/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
