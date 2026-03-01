import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Affichage Dynamique',
        slug: 'affichage-dynamique',
        description: 'Solutions d\'affichage dynamique et holographique',
        icon: 'Monitor',
        order: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Informatique & Maintenance',
        slug: 'informatique-maintenance',
        description: 'Services informatiques et maintenance',
        icon: 'Settings',
        order: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Pièces Détachées',
        slug: 'pieces-detachees',
        description: 'Pièces détachées et consommables',
        icon: 'Package',
        order: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Formation & Création Web',
        slug: 'formation-web',
        description: 'Formation et création de sites web',
        icon: 'GraduationCap',
        order: 4,
      },
    }),
  ]);
  console.log('Created categories:', categories.map(c => c.name));

  // Créer les services pour chaque catégorie
  const affichageCat = categories[0];
  const infoCat = categories[1];
  const piecesCat = categories[2];
  const formationCat = categories[3];

  // Services Affichage Dynamique
  await prisma.service.createMany({
    data: [
      {
        name: 'Affichage Dynamique Standard',
        slug: 'affichage-dynamique-standard',
        description: 'Système d\'affichage dynamique moderne et moins cher pour vos besoins. Nous sommes en mesure aujourd\'hui de fournir et d\'installer à nos clients un système holographique 3D autonome ou piloté.',
        shortDesc: 'Solutions d\'affichage dynamique professionnelles',
        categoryId: affichageCat.id,
        order: 1,
        features: JSON.stringify(['Écrans haute définition', 'Gestion à distance', 'Contenu personnalisable', 'Support technique']),
      },
      {
        name: '3D Holographique',
        slug: '3d-holographique',
        description: 'C\'est un système de ventilation des Leds qui donne l\'illusion de flottabilité des objets dans l\'espace. Très simple à mettre en place et moins coûteux. Par contre, il faut avoir une petite compétence dans la réalisation des vidéos et des maquettes.',
        shortDesc: 'L\'image flotte dans l\'espace',
        categoryId: affichageCat.id,
        order: 2,
        features: JSON.stringify(['Effet holographique 3D', 'Ventilation LED', 'Installation simple', 'Coût optimisé']),
      },
    ],
  });

  // Services Informatique & Maintenance
  await prisma.service.createMany({
    data: [
      {
        name: 'Imprimantes Toute Marque',
        slug: 'imprimantes',
        description: 'Nous réparons toute marque d\'imprimante de toute technologie, cependant en cas de remplacement de pièce si nécessaire, un devis est obligatoirement établi.',
        shortDesc: 'Réparation et maintenance d\'imprimantes',
        categoryId: infoCat.id,
        order: 1,
        features: JSON.stringify(['Toutes marques', 'Toutes technologies', 'Devis gratuit', 'Pièces d\'origine']),
      },
      {
        name: 'Copieurs Toute Marque',
        slug: 'copieurs',
        description: 'Nous intervenons toujours sur site, sans embarquer le produit. Le devis inclut le déplacement et le forfait du diagnostic.',
        shortDesc: 'Service sur site pour copieurs',
        categoryId: infoCat.id,
        order: 2,
        features: JSON.stringify(['Intervention sur site', 'Sans déplacement matériel', 'Devis transparent', 'Diagnostic inclus']),
      },
      {
        name: 'Traceurs et Scanner grand format',
        slug: 'traceurs-scanner',
        description: 'Nos partenaires actuels, nous ont toujours fait confiance dans la réactivité, la compétence et la qualité de notre intervention. Ils continuent à garder ce lien, de là notre expérience dans le grand format.',
        shortDesc: 'Expertise grand format',
        categoryId: infoCat.id,
        order: 3,
        features: JSON.stringify(['Grand format', 'Réactivité garantie', 'Expertise confirmée', 'Partenariat durable']),
      },
      {
        name: 'Informatique, Accessoires & Consommables',
        slug: 'informatique-accessoires',
        description: 'Ayant de l\'expérience depuis les débuts de l\'informatique grand public, du DOS jusqu\'à nos jours, nos clients, croient en notre expertise du fait de notre mise à jour dans l\'évolution de cette technologie. Nous fournissons des conseils et des consommables de qualité à nos clients.',
        shortDesc: 'Conseils et fournitures informatiques',
        categoryId: infoCat.id,
        order: 4,
        features: JSON.stringify(['Expertise depuis 1994', 'Conseils personnalisés', 'Consommables qualité', 'Matériel à jour']),
      },
      {
        name: 'Installation Antennes Paraboliques',
        slug: 'antennes-paraboliques',
        description: 'Agréé par Orange TV et en partenariat dans l\'installation et le paramétrage du matériel de réception satellite, nous réparons aussi des postes de TV et installons le système de surveillance par Caméras IP.',
        shortDesc: 'Installation et réparation antennes',
        categoryId: infoCat.id,
        order: 5,
        features: JSON.stringify(['Spécialiste en électronique', 'Réception satellite', 'Réparation TV', 'Caméras IP']),
      },
      {
        name: 'Développement Site Web (Statique & Dynamique)',
        slug: 'developpement-web',
        description: 'Nous créons des sites internet et intranet dédiés. Formons les clients qui souhaitent eux-même créer et maintenir leur site. Pour les clients désireux de découvrir les CMS, tels que (WordPress, Joomla, Drupal, PrestaShop et OpenCart), une base rapide dans la prise en main leur sera dispensée en quelques heures. D\'autres logiciels tels que ( WebSite X5, EZGenerator, Artisteer ), une prise en main sera nécessaire. Faites juste une demande de devis.',
        shortDesc: 'Création et formation web',
        categoryId: infoCat.id,
        order: 6,
        features: JSON.stringify(['Sites statiques & dynamiques', 'Formation CMS', 'WordPress, Joomla, Drupal', 'E-commerce']),
      },
    ],
  });

  // Créer quelques produits exemples
  await prisma.product.createMany({
    data: [
      {
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
      {
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
    ],
  });

  // Créer des témoignages
  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Jean Dupont',
        company: 'Boulangerie Dupont',
        content: 'Service impeccable ! L\'affichage dynamique a transformé notre vitrine.',
        rating: 5,
        order: 1,
      },
      {
        name: 'Marie Martin',
        company: 'Agence Immobilière Martin',
        content: 'Réactivité et professionnalisme. Je recommande vivement READI.',
        rating: 5,
        order: 2,
      },
      {
        name: 'Pierre Bernard',
        company: 'Restaurant Le Gourmet',
        content: 'Le configurateur de câbles m\'a fait gagner un temps précieux.',
        rating: 5,
        order: 3,
      },
    ],
  });

  // Créer des types de câbles
  const cableTypes = await Promise.all([
    prisma.cableType.create({
      data: {
        name: 'Câble HDMI',
        description: 'Câble HDMI haute qualité pour transmission vidéo/audio',
      },
    }),
    prisma.cableType.create({
      data: {
        name: 'Câble USB',
        description: 'Câbles USB de différentes générations',
      },
    }),
    prisma.cableType.create({
      data: {
        name: 'Câble Ethernet',
        description: 'Câbles réseau RJ45 de différentes catégories',
      },
    }),
    prisma.cableType.create({
      data: {
        name: 'Câble Audio',
        description: 'Câbles audio jack, RCA, XLR',
      },
    }),
    prisma.cableType.create({
      data: {
        name: 'Câble VGA/DVI',
        description: 'Câbles vidéo analogiques et numériques',
      },
    }),
    prisma.cableType.create({
      data: {
        name: 'Câble d\'alimentation',
        description: 'Câbles d\'alimentation divers',
      },
    }),
  ]);

  // Créer des connecteurs pour chaque type
  for (const cableType of cableTypes) {
    if (cableType.name === 'Câble HDMI') {
      await prisma.cableConnector.createMany({
        data: [
          { name: 'HDMI Standard (Mâle)', type: 'male', cableTypeId: cableType.id },
          { name: 'HDMI Standard (Femelle)', type: 'female', cableTypeId: cableType.id },
          { name: 'Mini HDMI', type: 'male', cableTypeId: cableType.id },
          { name: 'Micro HDMI', type: 'male', cableTypeId: cableType.id },
        ],
      });
    } else if (cableType.name === 'Câble USB') {
      await prisma.cableConnector.createMany({
        data: [
          { name: 'USB-A', type: 'male', cableTypeId: cableType.id },
          { name: 'USB-B', type: 'male', cableTypeId: cableType.id },
          { name: 'USB-C', type: 'both', cableTypeId: cableType.id },
          { name: 'Micro USB', type: 'male', cableTypeId: cableType.id },
          { name: 'Mini USB', type: 'male', cableTypeId: cableType.id },
        ],
      });
    } else if (cableType.name === 'Câble Ethernet') {
      await prisma.cableConnector.createMany({
        data: [
          { name: 'RJ45', type: 'male', cableTypeId: cableType.id },
        ],
      });
    } else if (cableType.name === 'Câble Audio') {
      await prisma.cableConnector.createMany({
        data: [
          { name: 'Jack 3.5mm', type: 'male', cableTypeId: cableType.id },
          { name: 'Jack 6.35mm', type: 'male', cableTypeId: cableType.id },
          { name: 'RCA (Rouge/Blanc)', type: 'male', cableTypeId: cableType.id },
          { name: 'XLR 3 broches', type: 'male', cableTypeId: cableType.id },
          { name: 'XLR 3 broches (Femelle)', type: 'female', cableTypeId: cableType.id },
        ],
      });
    } else if (cableType.name === 'Câble VGA/DVI') {
      await prisma.cableConnector.createMany({
        data: [
          { name: 'VGA (DB-15)', type: 'male', cableTypeId: cableType.id },
          { name: 'DVI-D', type: 'male', cableTypeId: cableType.id },
          { name: 'DVI-I', type: 'male', cableTypeId: cableType.id },
        ],
      });
    } else if (cableType.name === "Câble d'alimentation") {
      await prisma.cableConnector.createMany({
        data: [
          { name: 'C13 (PC)', type: 'female', cableTypeId: cableType.id },
          { name: 'C14', type: 'male', cableTypeId: cableType.id },
          { name: 'Prise Murale FR', type: 'male', cableTypeId: cableType.id },
          { name: 'Adaptateur Multi-prises', type: 'female', cableTypeId: cableType.id },
        ],
      });
    }
  }

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
