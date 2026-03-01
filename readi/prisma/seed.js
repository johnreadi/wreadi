const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Créer l'admin par défaut
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.adminUser.create({
    data: {
      email: 'admin@readi.fr',
      name: 'Administrateur',
      password: adminPassword,
      role: 'SUPER_ADMIN',
    },
  });
  console.log('Created admin:', admin.email);

  // Créer les catégories principales
  const affichageCat = await prisma.category.create({
    data: {
      name: 'Affichage Dynamique',
      slug: 'affichage-dynamique',
      description: 'Solutions d\'affichage dynamique et holographique',
      icon: 'Monitor',
      order: 1,
    },
  });

  const infoCat = await prisma.category.create({
    data: {
      name: 'Informatique & Maintenance',
      slug: 'informatique-maintenance',
      description: 'Services informatiques et maintenance',
      icon: 'Settings',
      order: 2,
    },
  });

  const piecesCat = await prisma.category.create({
    data: {
      name: 'Pièces Détachées',
      slug: 'pieces-detachees',
      description: 'Pièces détachées et consommables',
      icon: 'Package',
      order: 3,
    },
  });

  const formationCat = await prisma.category.create({
    data: {
      name: 'Formation & Création Web',
      slug: 'formation-web',
      description: 'Formation et création de sites web',
      icon: 'GraduationCap',
      order: 4,
    },
  });

  console.log('Created categories');

  // Services Affichage Dynamique
  await prisma.service.create({
    data: {
      name: 'Affichage Dynamique Standard',
      slug: 'affichage-dynamique-standard',
      description: 'Système d\'affichage dynamique moderne et moins cher pour vos besoins. Nous sommes en mesure aujourd\'hui de fournir et d\'installer à nos clients un système holographique 3D autonome ou piloté.',
      shortDesc: 'Solutions d\'affichage dynamique professionnelles',
      categoryId: affichageCat.id,
      order: 1,
      features: JSON.stringify(['Écrans haute définition', 'Gestion à distance', 'Contenu personnalisable', 'Support technique']),
    },
  });

  await prisma.service.create({
    data: {
      name: '3D Holographique',
      slug: '3d-holographique',
      description: 'C\'est un système de ventilation des Leds qui donne l\'illusion de flottabilité des objets dans l\'espace. Très simple à mettre en place et moins coûteux.',
      shortDesc: 'L\'image flotte dans l\'espace',
      categoryId: affichageCat.id,
      order: 2,
      features: JSON.stringify(['Effet holographique 3D', 'Ventilation LED', 'Installation simple', 'Coût optimisé']),
    },
  });

  // Services Informatique
  await prisma.service.create({
    data: {
      name: 'Imprimantes Toute Marque',
      slug: 'imprimantes',
      description: 'Nous réparons toute marque d\'imprimante de toute technologie, cependant en cas de remplacement de pièce si nécessaire, un devis est obligatoirement établi.',
      shortDesc: 'Réparation et maintenance d\'imprimantes',
      categoryId: infoCat.id,
      order: 1,
      features: JSON.stringify(['Toutes marques', 'Toutes technologies', 'Devis gratuit', 'Pièces d\'origine']),
    },
  });

  await prisma.service.create({
    data: {
      name: 'Copieurs Toute Marque',
      slug: 'copieurs',
      description: 'Nous intervenons toujours sur site, sans embarquer le produit. Le devis inclut le déplacement et le forfait du diagnostic.',
      shortDesc: 'Service sur site pour copieurs',
      categoryId: infoCat.id,
      order: 2,
      features: JSON.stringify(['Intervention sur site', 'Sans déplacement matériel', 'Devis transparent', 'Diagnostic inclus']),
    },
  });

  await prisma.service.create({
    data: {
      name: 'Traceurs et Scanner grand format',
      slug: 'traceurs-scanner',
      description: 'Nos partenaires actuels, nous ont toujours fait confiance dans la réactivité, la compétence et la qualité de notre intervention.',
      shortDesc: 'Expertise grand format',
      categoryId: infoCat.id,
      order: 3,
      features: JSON.stringify(['Grand format', 'Réactivité garantie', 'Expertise confirmée', 'Partenariat durable']),
    },
  });

  await prisma.service.create({
    data: {
      name: 'Informatique, Accessoires & Consommables',
      slug: 'informatique-accessoires',
      description: 'Ayant de l\'expérience depuis les débuts de l\'informatique grand public, du DOS jusqu\'à nos jours.',
      shortDesc: 'Conseils et fournitures informatiques',
      categoryId: infoCat.id,
      order: 4,
      features: JSON.stringify(['Expertise depuis 1994', 'Conseils personnalisés', 'Consommables qualité', 'Matériel à jour']),
    },
  });

  await prisma.service.create({
    data: {
      name: 'Installation Antennes Paraboliques',
      slug: 'antennes-paraboliques',
      description: 'Agréé par Orange TV et en partenariat dans l\'installation et le paramétrage du matériel de réception satellite.',
      shortDesc: 'Installation et réparation antennes',
      categoryId: infoCat.id,
      order: 5,
      features: JSON.stringify(['Spécialiste en électronique', 'Réception satellite', 'Réparation TV', 'Caméras IP']),
    },
  });

  await prisma.service.create({
    data: {
      name: 'Développement Site Web',
      slug: 'developpement-web',
      description: 'Nous créons des sites internet et intranet dédiés. Formons les clients qui souhaitent eux-même créer et maintenir leur site.',
      shortDesc: 'Création et formation web',
      categoryId: infoCat.id,
      order: 6,
      features: JSON.stringify(['Sites statiques & dynamiques', 'Formation CMS', 'WordPress, Joomla, Drupal', 'E-commerce']),
    },
  });

  console.log('Created services');

  // Produits exemples
  await prisma.product.create({
    data: {
      name: 'Toner HP LaserJet Pro M404',
      reference: 'CF258X',
      description: 'Toner noir haute capacité pour HP LaserJet Pro M404',
      price: 89.99,
      stock: 15,
      brand: 'HP',
      series: 'LaserJet Pro',
      model: 'M404',
      categoryId: piecesCat.id,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Cartouche Canon PIXMA TS8350',
      reference: 'CLI-581XXL',
      description: 'Cartouche d\'encre cyan XXL',
      price: 24.99,
      stock: 25,
      brand: 'Canon',
      series: 'PIXMA',
      model: 'TS8350',
      categoryId: piecesCat.id,
    },
  });

  console.log('Created products');

  // Témoignages
  await prisma.testimonial.create({
    data: {
      name: 'Jean Dupont',
      company: 'Boulangerie Dupont',
      content: 'Service impeccable ! L\'affichage dynamique a transformé notre vitrine.',
      rating: 5,
      order: 1,
    },
  });

  await prisma.testimonial.create({
    data: {
      name: 'Marie Martin',
      company: 'Agence Immobilière Martin',
      content: 'Réactivité et professionnalisme. Je recommande vivement READI.',
      rating: 5,
      order: 2,
    },
  });

  await prisma.testimonial.create({
    data: {
      name: 'Pierre Bernard',
      company: 'Restaurant Le Gourmet',
      content: 'Le configurateur de câbles m\'a fait gagner un temps précieux.',
      rating: 5,
      order: 3,
    },
  });

  console.log('Created testimonials');

  // Types de câbles
  const hdmiType = await prisma.cableType.create({
    data: {
      name: 'Câble HDMI',
      description: 'Câble HDMI haute qualité pour transmission vidéo/audio',
    },
  });

  const usbType = await prisma.cableType.create({
    data: {
      name: 'Câble USB',
      description: 'Câbles USB de différentes générations',
    },
  });

  const ethernetType = await prisma.cableType.create({
    data: {
      name: 'Câble Ethernet',
      description: 'Câbles réseau RJ45 de différentes catégories',
    },
  });

  const audioType = await prisma.cableType.create({
    data: {
      name: 'Câble Audio',
      description: 'Câbles audio jack, RCA, XLR',
    },
  });

  const vgaType = await prisma.cableType.create({
    data: {
      name: 'Câble VGA/DVI',
      description: 'Câbles vidéo analogiques et numériques',
    },
  });

  const powerType = await prisma.cableType.create({
    data: {
      name: 'Câble d\'alimentation',
      description: 'Câbles d\'alimentation divers',
    },
  });

  console.log('Created cable types');

  // Connecteurs HDMI
  await prisma.cableConnector.create({ data: { name: 'HDMI Standard (Mâle)', type: 'male', cableTypeId: hdmiType.id } });
  await prisma.cableConnector.create({ data: { name: 'HDMI Standard (Femelle)', type: 'female', cableTypeId: hdmiType.id } });
  await prisma.cableConnector.create({ data: { name: 'Mini HDMI', type: 'male', cableTypeId: hdmiType.id } });
  await prisma.cableConnector.create({ data: { name: 'Micro HDMI', type: 'male', cableTypeId: hdmiType.id } });

  // Connecteurs USB
  await prisma.cableConnector.create({ data: { name: 'USB-A', type: 'male', cableTypeId: usbType.id } });
  await prisma.cableConnector.create({ data: { name: 'USB-B', type: 'male', cableTypeId: usbType.id } });
  await prisma.cableConnector.create({ data: { name: 'USB-C', type: 'both', cableTypeId: usbType.id } });
  await prisma.cableConnector.create({ data: { name: 'Micro USB', type: 'male', cableTypeId: usbType.id } });
  await prisma.cableConnector.create({ data: { name: 'Mini USB', type: 'male', cableTypeId: usbType.id } });

  // Connecteurs Ethernet
  await prisma.cableConnector.create({ data: { name: 'RJ45', type: 'male', cableTypeId: ethernetType.id } });

  // Connecteurs Audio
  await prisma.cableConnector.create({ data: { name: 'Jack 3.5mm', type: 'male', cableTypeId: audioType.id } });
  await prisma.cableConnector.create({ data: { name: 'Jack 6.35mm', type: 'male', cableTypeId: audioType.id } });
  await prisma.cableConnector.create({ data: { name: 'RCA (Rouge/Blanc)', type: 'male', cableTypeId: audioType.id } });
  await prisma.cableConnector.create({ data: { name: 'XLR 3 broches', type: 'male', cableTypeId: audioType.id } });
  await prisma.cableConnector.create({ data: { name: 'XLR 3 broches (Femelle)', type: 'female', cableTypeId: audioType.id } });

  // Connecteurs VGA/DVI
  await prisma.cableConnector.create({ data: { name: 'VGA (DB-15)', type: 'male', cableTypeId: vgaType.id } });
  await prisma.cableConnector.create({ data: { name: 'DVI-D', type: 'male', cableTypeId: vgaType.id } });
  await prisma.cableConnector.create({ data: { name: 'DVI-I', type: 'male', cableTypeId: vgaType.id } });

  // Connecteurs Alimentation
  await prisma.cableConnector.create({ data: { name: 'C13 (PC)', type: 'female', cableTypeId: powerType.id } });
  await prisma.cableConnector.create({ data: { name: 'C14', type: 'male', cableTypeId: powerType.id } });
  await prisma.cableConnector.create({ data: { name: 'Prise Murale FR', type: 'male', cableTypeId: powerType.id } });
  await prisma.cableConnector.create({ data: { name: 'Adaptateur Multi-prises', type: 'female', cableTypeId: powerType.id } });

  console.log('Created cable connectors');
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
