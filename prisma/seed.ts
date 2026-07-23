import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const adminPassword = await bcrypt.hash('admin123', 12)
  const customerPassword = await bcrypt.hash('customer123', 12)

  const businesses = ['cleaning', 'carwash', 'barber', 'massage', 'nails']

  for (const slug of businesses) {
    await prisma.user.upsert({
      where: { email: `admin@${slug}.demo` },
      update: {},
      create: {
        email: `admin@${slug}.demo`,
        name: `${slug.charAt(0).toUpperCase() + slug.slice(1)} Admin`,
        password: adminPassword,
        role: 'admin',
        businessSlug: slug,
      },
    })
  }

  const customer = await prisma.user.upsert({
    where: { email: 'customer@demo.com' },
    update: {},
    create: {
      email: 'customer@demo.com',
      name: 'Demo Customer',
      password: customerPassword,
      role: 'customer',
    },
  })

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 7)

  await prisma.booking.create({
    data: {
      businessSlug: 'cleaning',
      userId: customer.id,
      serviceName: 'Deep Clean',
      servicePrice: 189,
      serviceDuration: 240,
      date: tomorrow.toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '13:00',
      status: 'confirmed',
      staffName: 'Sarah M.',
    },
  })

  await prisma.booking.create({
    data: {
      businessSlug: 'barber',
      userId: customer.id,
      serviceName: 'Skin Fade',
      servicePrice: 35,
      serviceDuration: 45,
      date: nextWeek.toISOString().split('T')[0],
      startTime: '11:00',
      endTime: '11:45',
      status: 'confirmed',
      staffName: 'Marcus J.',
    },
  })

  console.log('✅ Seed complete!')
  console.log('\nDemo admin credentials (per business):')
  console.log('  Email: admin@cleaning.demo / admin@carwash.demo / etc.')
  console.log('  Password: admin123')
  console.log('\nDemo customer credentials:')
  console.log('  Email: customer@demo.com')
  console.log('  Password: customer123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
