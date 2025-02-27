import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  // Uncategorized
  { grouping: 'Uncategorized', name: 'General' },
  { grouping: 'Uncategorized', name: 'Payment' },

  // Entertainment
  { grouping: 'Entertainment', name: 'Entertainment' },
  { grouping: 'Entertainment', name: 'Games' },
  { grouping: 'Entertainment', name: 'Movies' },
  { grouping: 'Entertainment', name: 'Music' },
  { grouping: 'Entertainment', name: 'Sports' },

  // Food and Drink
  { grouping: 'Food and Drink', name: 'Food and Drink' },
  { grouping: 'Food and Drink', name: 'Dining Out' },
  { grouping: 'Food and Drink', name: 'Groceries' },
  { grouping: 'Food and Drink', name: 'Liquor' },

  // Home
  { grouping: 'Home', name: 'Home' },
  { grouping: 'Home', name: 'Electronics' },
  { grouping: 'Home', name: 'Furniture' },
  { grouping: 'Home', name: 'Household Supplies' },
  { grouping: 'Home', name: 'Maintenance' },
  { grouping: 'Home', name: 'Mortgage' },
  { grouping: 'Home', name: 'Pets' },
  { grouping: 'Home', name: 'Rent' },
  { grouping: 'Home', name: 'Services' },

  // Life
  { grouping: 'Life', name: 'Childcare' },
  { grouping: 'Life', name: 'Clothing' },
  { grouping: 'Life', name: 'Education' },
  { grouping: 'Life', name: 'Gifts' },
  { grouping: 'Life', name: 'Insurance' },
  { grouping: 'Life', name: 'Medical Expenses' },
  { grouping: 'Life', name: 'Taxes' },

  // Transportation
  { grouping: 'Transportation', name: 'Transportation' },
  { grouping: 'Transportation', name: 'Bicycle' },
  { grouping: 'Transportation', name: 'Bus/Train' },
  { grouping: 'Transportation', name: 'Car' },
  { grouping: 'Transportation', name: 'Gas/Fuel' },
  { grouping: 'Transportation', name: 'Hotel' },
  { grouping: 'Transportation', name: 'Parking' },
  { grouping: 'Transportation', name: 'Plane' },
  { grouping: 'Transportation', name: 'Taxi' },

  // Utilities
  { grouping: 'Utilities', name: 'Utilities' },
  { grouping: 'Utilities', name: 'Cleaning' },
  { grouping: 'Utilities', name: 'Electricity' },
  { grouping: 'Utilities', name: 'Heat/Gas' },
  { grouping: 'Utilities', name: 'Trash' },
  { grouping: 'Utilities', name: 'TV/Phone/Internet' },
  { grouping: 'Utilities', name: 'Water' },
]

async function main() {
  console.log('Start seeding categories...')

  // Clear existing categories first
  await prisma.category.deleteMany()

  // Reset the auto-increment counter
  await prisma.$executeRaw`ALTER SEQUENCE "Category_id_seq" RESTART WITH 1;`

  // Insert all categories
  await prisma.category.createMany({
    data: categories,
  })

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
