const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Database Check Start ---');
  try {
    // 1. Check table structure
    console.log('Checking SiteSettings table columns...');
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'SiteSettings';
    `;
    console.log('Columns found:', columns);

    if (Array.isArray(columns) && columns.length === 0) {
        console.warn('WARNING: SiteSettings table not found in information_schema! Trying lowercase...');
        const columnsLower = await prisma.$queryRaw`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'sitesettings';
        `;
        console.log('Columns found (lowercase):', columnsLower);
    }

    // 2. Check current data
    console.log('Fetching current SiteSettings (id="default")...');
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });
    console.log('Current SiteSettings Data:', settings);
    
  } catch (e) {
    console.error('Error during DB check:', e);
  } finally {
    await prisma.$disconnect();
    console.log('--- Database Check End ---');
  }
}

main();
