export type ProductStatus = 'Active' | 'Draft' | 'Out of Stock';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  images: string[];
  tagline: string;
  description: string;
  rating: number;
  reviews: number;
  shades?: string[];
  tags: string[];
  stock: number;
  sku?: string;
  status: ProductStatus;
  featured: boolean;
  linkPreviewDescription?: string;
}

interface ProductSeed {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  tagline: string;
  description: string;
  rating: number;
  reviews: number;
  shades?: string[];
  tags: string[];
}

export const categories = [
  'Skincare',
  'Makeup',
  'Fragrance',
  'Body Care',
  'Hair Care',
] as const;

export const statusOptions: ProductStatus[] = ['Active', 'Draft', 'Out of Stock'];

export const tagOptions = ['Bestseller', 'New', 'Icon', 'Limited', 'Vegan', 'Gift'];

export function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'product'
  );
}

export function productImages(product: Pick<Product, 'image' | 'images'>): string[] {
  if (product.images && product.images.length > 0) return product.images.filter(Boolean);
  return product.image ? [product.image] : [];
}

export function normalizeProduct(input: Partial<Product> = {}, index = 0): Product {
  const rawImages =
    input.images && input.images.length > 0 ? input.images : input.image ? [input.image] : [];
  const images = rawImages.filter((src): src is string => typeof src === 'string' && src.length > 0);
  const stock = typeof input.stock === 'number' ? input.stock : (index * 13 + 7) % 46;
  const status: ProductStatus = input.status ?? (stock === 0 ? 'Out of Stock' : 'Active');
  const tags = Array.isArray(input.tags) ? input.tags : [];
  return {
    id: input.id || `product-${index + 1}`,
    name: input.name || 'Untitled product',
    category: input.category || 'Uncategorized',
    price: typeof input.price === 'number' ? input.price : 0,
    compareAtPrice:
      typeof input.compareAtPrice === 'number' ? input.compareAtPrice : undefined,
    image: images[0] || '',
    images,
    tagline: input.tagline || '',
    description: input.description || '',
    rating: typeof input.rating === 'number' ? input.rating : 5,
    reviews: typeof input.reviews === 'number' ? input.reviews : 0,
    shades: input.shades,
    tags,
    stock,
    sku: input.sku,
    status,
    featured: input.featured ?? tags.includes('Bestseller'),
    linkPreviewDescription: input.linkPreviewDescription,
  };
}

const seedProducts: ProductSeed[] = [
  {
    id: 'velvet-rouge-lipstick',
    name: 'Velvet Rouge Lipstick',
    category: 'Makeup',
    price: 42,
    image:
      'https://readdy.ai/api/search-image?query=Luxury%20crimson%20red%20lipstick%20with%20polished%20gold%20casing%20standing%20upright%20on%20a%20glossy%20black%20reflective%20surface%2C%20deep%20black%20studio%20background%20illuminated%20by%20a%20soft%20rose%20pink%20and%20crimson%20gradient%20glow%2C%20cinematic%20rim%20lighting%20highlighting%20the%20elegant%20product%20silhouette%2C%20high-end%20beauty%20editorial%20photography%2C%20ultra%20detailed%2C%20minimalist%20dramatic%20composition%20with%20gentle%20shadows&width=800&height=1000&seq=deesse-product-01&orientation=portrait',
    tagline: 'A single stroke of couture crimson',
    description:
      'A weightless, silk-matte lipstick enriched with cold-pressed rosehip oil for a velvet finish that never dries. One swipe delivers full, feather-proof pigment that lasts from first light to last glass.',
    rating: 4.9,
    reviews: 1284,
    shades: ['Rouge Nocturne', 'Rose Poudré', 'Écarlate', 'Bordeaux'],
    tags: ['Bestseller', 'Icon'],
  },
  {
    id: 'lumiere-radiance-serum',
    name: 'Lumière Radiance Serum',
    category: 'Skincare',
    price: 128,
    image:
      'https://readdy.ai/api/search-image?query=Elegant%20glass%20serum%20bottle%20with%20gold%20dropper%20cap%20filled%20with%20golden%20liquid%20on%20a%20black%20reflective%20surface%2C%20dark%20moody%20studio%20background%20with%20soft%20crimson%20and%20rose%20pink%20gradient%20glow%2C%20cinematic%20lighting%20and%20gentle%20reflections%2C%20luxury%20skincare%20editorial%20photography%2C%20high%20detail%2C%20minimalist%20elegant%20composition&width=800&height=1000&seq=deesse-product-02&orientation=portrait',
    tagline: 'Radiance, distilled to a single drop',
    description:
      'A featherlight elixir of 15% vitamin C, hyaluronic acid, and white truffle extract. It visibly brightens, plumps, and restores that lit-from-within glow in fourteen days.',
    rating: 4.8,
    reviews: 2107,
    tags: ['Bestseller', 'New'],
  },
  {
    id: 'noir-eclat-mascara',
    name: 'Noir Éclat Mascara',
    category: 'Makeup',
    price: 34,
    image:
      'https://readdy.ai/api/search-image?query=Sleek%20matte%20black%20mascara%20tube%20with%20gold%20accents%20standing%20on%20a%20glossy%20dark%20surface%2C%20deep%20black%20studio%20backdrop%20with%20subtle%20crimson%20and%20pink%20gradient%20lighting%2C%20cinematic%20dramatic%20shadows%2C%20luxury%20cosmetic%20product%20photography%2C%20high%20detail%2C%20refined%20minimalist%20composition&width=800&height=1000&seq=deesse-product-03&orientation=portrait',
    tagline: 'Volume, without the weight',
    description:
      'A buildable, clump-free formula with a tapered precision brush that coats every lash from root to tip. Delivers dramatic, glossy-black volume that stays lifted all day.',
    rating: 4.7,
    reviews: 943,
    shades: ['Noir Intense', 'Brun Profond'],
    tags: ['Bestseller'],
  },
  {
    id: 'rose-eternelle-parfum',
    name: 'Rose Éternelle Eau de Parfum',
    category: 'Fragrance',
    price: 185,
    image:
      'https://readdy.ai/api/search-image?query=Luxurious%20rose%20pink%20glass%20perfume%20bottle%20with%20gold%20cap%20surrounded%20by%20delicate%20rose%20petals%20on%20a%20dark%20reflective%20surface%2C%20black%20studio%20background%20with%20soft%20crimson%20and%20pink%20glow%2C%20cinematic%20dramatic%20lighting%2C%20high-end%20fragrance%20editorial%20photography%2C%20ultra%20detailed%2C%20elegant%20minimalist%20composition&width=800&height=1000&seq=deesse-product-04&orientation=portrait',
    tagline: 'A rose that never fades',
    description:
      'An intoxicating eau de parfum built around Damask rose, saffron, and a whisper of oud. It unfolds like silk — warm, velvety, and impossibly long-lasting.',
    rating: 4.9,
    reviews: 1672,
    tags: ['Icon', 'Limited'],
  },
  {
    id: 'creme-riche-hydra',
    name: 'Crème Riche Hydra',
    category: 'Skincare',
    price: 95,
    image:
      'https://readdy.ai/api/search-image?query=Luxury%20face%20cream%20in%20a%20frosted%20glass%20jar%20with%20gold%20lid%20and%20a%20swirl%20of%20rich%20white%20cream%20texture%20on%20a%20dark%20reflective%20surface%2C%20black%20studio%20background%20with%20soft%20rose%20and%20crimson%20gradient%20glow%2C%20cinematic%20lighting%2C%20premium%20skincare%20editorial%20photography%2C%20high%20detail%2C%20minimalist%20composition&width=800&height=1000&seq=deesse-product-05&orientation=portrait',
    tagline: 'Deep hydration, rich as velvet',
    description:
      'A decadent barrier-repair cream of ceramides, squalane, and shea butter. It melts into skin, quenching dryness for up to 72 hours without a trace of grease.',
    rating: 4.8,
    reviews: 786,
    tags: ['Bestseller'],
  },
  {
    id: 'silk-veil-foundation',
    name: 'Silk Veil Foundation',
    category: 'Makeup',
    price: 58,
    image:
      'https://readdy.ai/api/search-image?query=Elegant%20glass%20foundation%20bottle%20with%20pump%20and%20gold%20cap%20on%20a%20glossy%20black%20surface%20with%20a%20soft%20swatch%20of%20skin-tone%20liquid%20nearby%2C%20dark%20moody%20studio%20background%20with%20subtle%20rose%20pink%20and%20crimson%20glow%2C%20cinematic%20lighting%2C%20luxury%20makeup%20editorial%20photography%2C%20high%20detail%2C%20minimalist%20composition&width=800&height=1000&seq=deesse-product-06&orientation=portrait',
    tagline: 'Skin, but more luminous',
    description:
      'A weightless, medium-buildable foundation with skincare-grade niacinamide. It blurs imperfections into a soft-focus, second-skin finish that never cakes or creases.',
    rating: 4.7,
    reviews: 1105,
    shades: ['Porcelaine', 'Ivoire', 'Beige Rosé', 'Ambre', 'Moka'],
    tags: ['New'],
  },
  {
    id: 'elixir-nuit-repair',
    name: 'Élixir Nuit Repair Cream',
    category: 'Skincare',
    price: 145,
    image:
      'https://readdy.ai/api/search-image?query=Midnight%20blue-black%20glass%20jar%20of%20night%20repair%20cream%20with%20gold%20lid%20on%20a%20dark%20reflective%20surface%2C%20black%20studio%20background%20with%20soft%20crimson%20and%20deep%20pink%20gradient%20glow%2C%20cinematic%20moody%20lighting%20with%20gentle%20shadows%2C%20luxury%20night%20skincare%20editorial%20photography%2C%20high%20detail%2C%20elegant%20minimalist%20composition&width=800&height=1000&seq=deesse-product-07&orientation=portrait',
    tagline: 'Beauty, while you dream',
    description:
      'An overnight treatment of encapsulated retinol, peptides, and black rose extract. Wake to visibly smoother, firmer, more rested skin — every single morning.',
    rating: 4.9,
    reviews: 654,
    tags: ['Icon', 'New'],
  },
  {
    id: 'poudre-lumiere',
    name: 'Poudre Lumière',
    category: 'Makeup',
    price: 48,
    image:
      'https://readdy.ai/api/search-image?query=Round%20gold%20compact%20of%20luminous%20setting%20powder%20open%20with%20delicate%20powder%20puff%20on%20a%20dark%20reflective%20surface%2C%20black%20studio%20background%20with%20soft%20rose%20and%20crimson%20gradient%20lighting%2C%20cinematic%20glow%2C%20luxury%20makeup%20editorial%20photography%2C%20high%20detail%2C%20minimalist%20elegant%20composition&width=800&height=1000&seq=deesse-product-08&orientation=portrait',
    tagline: 'A soft-focus veil of light',
    description:
      'An ultra-fine, light-diffusing setting powder that blurs pores and sets makeup without flashback. Skin looks airbrushed, never powdery.',
    rating: 4.6,
    reviews: 438,
    shades: ['Translucide', 'Doré', 'Rosé'],
    tags: ['Bestseller'],
  },
  {
    id: 'baume-divine',
    name: 'Baume Divin Lip Balm',
    category: 'Makeup',
    price: 28,
    image:
      'https://readdy.ai/api/search-image?query=Slim%20rose%20gold%20lip%20balm%20tube%20with%20a%20soft%20swatch%20of%20pink%20balm%20on%20a%20glossy%20black%20surface%2C%20dark%20moody%20studio%20background%20with%20subtle%20crimson%20and%20rose%20pink%20glow%2C%20cinematic%20lighting%2C%20luxury%20lip%20care%20editorial%20photography%2C%20high%20detail%2C%20minimalist%20composition&width=800&height=1000&seq=deesse-product-09&orientation=portrait',
    tagline: 'A kiss of nourishment',
    description:
      'A buttery balm of murumuru, camellia, and honey that melts into lips, leaving a subtle rosy sheen and hours of cushiony comfort.',
    rating: 4.8,
    reviews: 892,
    tags: ['New'],
  },
  {
    id: 'huile-dor-body',
    name: "Huile d'Or Body Oil",
    category: 'Body Care',
    price: 68,
    image:
      'https://readdy.ai/api/search-image?query=Amber%20glass%20bottle%20of%20shimmering%20gold%20body%20oil%20with%20gold%20pump%20on%20a%20dark%20reflective%20surface%2C%20black%20studio%20background%20with%20warm%20crimson%20and%20rose%20pink%20gradient%20glow%2C%20cinematic%20dramatic%20lighting%2C%20luxury%20body%20care%20editorial%20photography%2C%20high%20detail%2C%20elegant%20minimalist%20composition&width=800&height=1000&seq=deesse-product-10&orientation=portrait',
    tagline: 'Liquid gold for the skin',
    description:
      'A dry-touch body oil of jojoba, argan, and a trace of gold mica. It leaves limbs gleaming, silky, and delicately scented for hours.',
    rating: 4.7,
    reviews: 511,
    tags: ['Icon'],
  },
  {
    id: 'serum-regard',
    name: 'Sérum Regard Eye Serum',
    category: 'Skincare',
    price: 88,
    image:
      'https://readdy.ai/api/search-image?query=Slim%20silver%20and%20white%20eye%20serum%20tube%20with%20cooling%20metal%20tip%20on%20a%20dark%20reflective%20surface%2C%20black%20studio%20background%20with%20soft%20rose%20pink%20and%20crimson%20gradient%20lighting%2C%20cinematic%20glow%2C%20luxury%20eye%20care%20editorial%20photography%2C%20high%20detail%2C%20minimalist%20elegant%20composition&width=800&height=1000&seq=deesse-product-11&orientation=portrait',
    tagline: 'Eyes, bright and awake',
    description:
      'A cooling rollerball serum of caffeine, peptides, and cucumber water that de-puffs, brightens dark circles, and smooths fine lines on contact.',
    rating: 4.8,
    reviews: 723,
    tags: ['Bestseller'],
  },
  {
    id: 'vernis-nuit',
    name: 'Vernis Nuit Nail Lacquer',
    category: 'Makeup',
    price: 26,
    image:
      'https://readdy.ai/api/search-image?query=Glossy%20deep%20red%20nail%20lacquer%20bottle%20with%20gold%20cap%20and%20a%20dramatic%20swatch%20stroke%20of%20red%20polish%20on%20a%20dark%20reflective%20surface%2C%20black%20studio%20background%20with%20soft%20crimson%20and%20rose%20pink%20gradient%20glow%2C%20cinematic%20lighting%2C%20luxury%20nail%20care%20editorial%20photography%2C%20high%20detail%2C%20minimalist%20composition&width=800&height=1000&seq=deesse-product-12&orientation=portrait',
    tagline: 'Ten little masterpieces',
    description:
      'A chip-resistant, high-shine lacquer in the maison\u2019s signature red. One coat glides on for a gel-like, glassy finish that endures.',
    rating: 4.6,
    reviews: 317,
    shades: ['Rouge Noir', 'Rose Satin', 'Écarlate'],
    tags: ['New'],
  },
  {
    id: 'serum-eclat-vitamin-c',
    name: 'Sérum Éclat Vitamin C',
    category: 'Skincare',
    price: 110,
    image:
      'https://readdy.ai/api/search-image?query=Luxury%20amber%20glass%20dropper%20bottle%20of%20brightening%20vitamin%20C%20serum%20with%20a%20golden%20droplet%20suspended%20mid-air%20on%20a%20dark%20reflective%20surface%2C%20deep%20black%20studio%20background%20with%20soft%20crimson%20and%20rose%20pink%20gradient%20glow%2C%20cinematic%20rim%20lighting%2C%20high-end%20skincare%20editorial%20photography%2C%20ultra%20detailed%2C%20elegant%20minimalist%20composition&width=800&height=1000&seq=deesse-product-13&orientation=portrait',
    tagline: 'A glow you can bottle',
    description:
      'A potent 20% stabilised vitamin C concentrate with ferulic acid and vitamin E. It fades dark spots, evens tone, and leaves skin luminous and firm in weeks.',
    rating: 4.9,
    reviews: 1420,
    tags: ['Bestseller', 'Icon'],
  },
  {
    id: 'rouge-velours-matte',
    name: 'Rouge Velours Matte',
    category: 'Makeup',
    price: 45,
    image:
      'https://readdy.ai/api/search-image?query=Deep%20burgundy%20matte%20lipstick%20bullet%20lifted%20from%20an%20engraved%20gold%20case%20on%20a%20glossy%20black%20surface%2C%20dark%20studio%20background%20with%20crimson%20and%20rose%20pink%20gradient%20glow%2C%20cinematic%20dramatic%20shadows%2C%20luxury%20lipstick%20editorial%20photography%2C%20ultra%20detailed%2C%20minimalist%20refined%20composition&width=800&height=1000&seq=deesse-product-14&orientation=portrait',
    tagline: 'Pigment, perfected',
    description:
      'An ultra-blurring matte lipstick with a one-swipe, full-coverage finish. Infused with murumuru butter so it stays comfortable, never chalky, from day to night.',
    rating: 4.8,
    reviews: 878,
    shades: ['Rouge Velours', 'Prune Nocturne', 'Terracotta', 'Rose Nue'],
    tags: ['New'],
  },
  {
    id: 'nuit-blanche-night-oil',
    name: 'Nuit Blanche Night Oil',
    category: 'Skincare',
    price: 132,
    image:
      'https://readdy.ai/api/search-image?query=Luxurious%20navy%20black%20glass%20bottle%20of%20golden%20overnight%20facial%20oil%20with%20a%20dropper%20and%20a%20glossy%20oil%20droplet%20on%20a%20dark%20reflective%20surface%2C%20black%20studio%20background%20with%20deep%20crimson%20and%20rose%20gradient%20glow%2C%20cinematic%20moody%20lighting%2C%20premium%20skincare%20editorial%20photography%2C%20high%20detail%2C%20elegant%20minimalist%20composition&width=800&height=1000&seq=deesse-product-15&orientation=portrait',
    tagline: 'Restoration by moonlight',
    description:
      'A nine-oil elixir of rosehip, bakuchiol, and squalane that repairs the skin barrier overnight. Wake to plump, cushiony, deeply rested skin.',
    rating: 4.9,
    reviews: 611,
    tags: ['New', 'Limited'],
  },
  {
    id: 'fleur-de-nuit-parfum',
    name: 'Fleur de Nuit Eau de Parfum',
    category: 'Fragrance',
    price: 210,
    image:
      'https://readdy.ai/api/search-image?query=Sculptural%20dark%20glass%20perfume%20bottle%20with%20a%20gold%20cap%20surrounded%20by%20dark%20burgundy%20blooms%20on%20a%20black%20reflective%20surface%2C%20deep%20black%20studio%20background%20with%20soft%20crimson%20and%20rose%20pink%20gradient%20glow%2C%20cinematic%20dramatic%20lighting%2C%20luxury%20fragrance%20editorial%20photography%2C%20ultra%20detailed%2C%20elegant%20minimalist%20composition&width=800&height=1000&seq=deesse-product-16&orientation=portrait',
    tagline: 'An nocturnal bloom',
    description:
      'A dark, addictive floral of tuberose, black plum, and suede. It opens lush and closes smoky — a signature that lingers long after midnight.',
    rating: 4.9,
    reviews: 1043,
    tags: ['Icon'],
  },
  {
    id: 'baume-demaquillant',
    name: 'Baume Démaquillant Cleansing Balm',
    category: 'Skincare',
    price: 54,
    image:
      'https://readdy.ai/api/search-image?query=Luxury%20cleansing%20balm%20in%20a%20frosted%20glass%20jar%20with%20a%20gold%20lid%20beside%20a%20swirl%20of%20silky%20melting%20balm%20texture%20on%20a%20dark%20reflective%20surface%2C%20black%20studio%20background%20with%20soft%20rose%20and%20crimson%20glow%2C%20cinematic%20lighting%2C%20premium%20skincare%20editorial%20photography%2C%20high%20detail%2C%20minimalist%20composition&width=800&height=1000&seq=deesse-product-17&orientation=portrait',
    tagline: 'Melt the day away',
    description:
      'A sherbet-to-oil balm that dissolves makeup, sunscreen, and city grime in seconds, then rinses clean without stripping. Skin is left soft, calm, and luminous.',
    rating: 4.9,
    reviews: 1362,
    tags: ['Bestseller'],
  },
  {
    id: 'poudre-perlee-highlighter',
    name: 'Poudre Perlée Highlighter',
    category: 'Makeup',
    price: 44,
    image:
      'https://readdy.ai/api/search-image?query=Open%20gold%20highlighter%20compact%20with%20a%20shimmering%20champagne%20powder%20and%20a%20sunburst%20emboss%20on%20a%20glossy%20black%20surface%2C%20dark%20studio%20background%20with%20soft%20rose%20pink%20and%20crimson%20gradient%20glow%2C%20cinematic%20glow%2C%20luxury%20makeup%20editorial%20photography%2C%20ultra%20detailed%2C%20minimalist%20elegant%20composition&width=800&height=1000&seq=deesse-product-18&orientation=portrait',
    tagline: 'Light, at your fingertips',
    description:
      'A finely-milled, buildable highlighter that melts into skin for a lit-from-within sheen. No glitter — just a soft, believable glow.',
    rating: 4.7,
    reviews: 529,
    shades: ['Champagne', 'Rose Or', 'Perle'],
    tags: ['New'],
  },
  {
    id: 'masque-eclat-clay',
    name: 'Masque Éclat Purifying Clay',
    category: 'Skincare',
    price: 62,
    image:
      'https://readdy.ai/api/search-image?query=Luxury%20purifying%20clay%20mask%20in%20a%20dark%20ceramic%20jar%20with%20a%20gold%20lid%20and%20a%20smooth%20swatch%20of%20grey-pink%20clay%20texture%20on%20a%20dark%20reflective%20surface%2C%20black%20studio%20background%20with%20soft%20crimson%20and%20rose%20glow%2C%20cinematic%20lighting%2C%20high-end%20skincare%20editorial%20photography%2C%20high%20detail%2C%20minimalist%20composition&width=800&height=1000&seq=deesse-product-19&orientation=portrait',
    tagline: 'Clarity, in ten minutes',
    description:
      'A creamy pink clay mask with niacinamide and willow bark that decongests pores and refines texture — without ever over-drying.',
    rating: 4.8,
    reviews: 703,
    tags: ['Bestseller'],
  },
  {
    id: 'huile-capillaire',
    name: 'Huile Capillaire Restorative Hair Oil',
    category: 'Hair Care',
    price: 72,
    image:
      'https://readdy.ai/api/search-image?query=Luxury%20golden%20hair%20oil%20in%20a%20tall%20amber%20glass%20bottle%20with%20a%20pump%20on%20a%20dark%20reflective%20surface%2C%20deep%20black%20studio%20background%20with%20warm%20crimson%20and%20rose%20pink%20gradient%20glow%2C%20cinematic%20dramatic%20lighting%2C%20premium%20hair%20care%20editorial%20photography%2C%20ultra%20detailed%2C%20elegant%20minimalist%20composition&width=800&height=1000&seq=deesse-product-20&orientation=portrait',
    tagline: 'Glass-smooth, weightless',
    description:
      'A featherweight blend of argan, camellia, and monoi oils that tames frizz, adds mirror shine, and shields against heat — never greasy.',
    rating: 4.8,
    reviews: 486,
    tags: ['New'],
  },
  {
    id: 'shampooing-riche',
    name: 'Shampooing Riche Nourishing Wash',
    category: 'Hair Care',
    price: 48,
    image:
      'https://readdy.ai/api/search-image?query=Luxury%20pearl-white%20shampoo%20in%20a%20sculpted%20bottle%20with%20a%20gold%20cap%20on%20a%20dark%20reflective%20surface%20beside%20a%20soft%20lather%2C%20black%20studio%20background%20with%20soft%20rose%20and%20crimson%20glow%2C%20cinematic%20lighting%2C%20high-end%20hair%20care%20editorial%20photography%2C%20high%20detail%2C%20minimalist%20composition&width=800&height=1000&seq=deesse-product-21&orientation=portrait',
    tagline: 'The richest lather',
    description:
      'A sulfate-free nourishing wash with silk proteins and plant ceramides that cleanses gently while restoring softness and bounce.',
    rating: 4.7,
    reviews: 342,
    tags: [],
  },
  {
    id: 'creme-mains',
    name: 'Crème Mains Hand Cream',
    category: 'Body Care',
    price: 32,
    image:
      'https://readdy.ai/api/search-image?query=Luxury%20hand%20cream%20in%20a%20slim%20rose%20gold%20tube%20with%20a%20swirl%20of%20rich%20cream%20on%20a%20dark%20reflective%20surface%2C%20black%20studio%20background%20with%20soft%20crimson%20and%20rose%20pink%20glow%2C%20cinematic%20lighting%2C%20high-end%20body%20care%20editorial%20photography%2C%20high%20detail%2C%20minimalist%20elegant%20composition&width=800&height=1000&seq=deesse-product-22&orientation=portrait',
    tagline: 'Softness on demand',
    description:
      'A fast-absorbing hand cream of shea, glycerin, and rose extract that quenches dry hands and leaves a delicate, lasting scent.',
    rating: 4.8,
    reviews: 617,
    tags: ['Bestseller'],
  },
  {
    id: 'gommage-corps',
    name: 'Gommage Corps Renewing Body Scrub',
    category: 'Body Care',
    price: 58,
    image:
      'https://readdy.ai/api/search-image?query=Luxury%20body%20scrub%20in%20a%20wide%20glass%20jar%20with%20a%20gold%20lid%20and%20rose-pink%20sugar%20crystals%20texture%20on%20a%20dark%20reflective%20surface%2C%20black%20studio%20background%20with%20soft%20crimson%20and%20rose%20gradient%20glow%2C%20cinematic%20lighting%2C%20high-end%20body%20care%20editorial%20photography%2C%20high%20detail%2C%20minimalist%20composition&width=800&height=1000&seq=deesse-product-23&orientation=portrait',
    tagline: 'Polish to glow',
    description:
      'A sugar-and-oil polish scented with jasmine and vanilla that buffs away dullness and leaves skin silky, nourished, and radiant.',
    rating: 4.7,
    reviews: 398,
    tags: ['New'],
  },
  {
    id: 'encre-sourcils',
    name: 'Encre à Sourcils Brow Definer',
    category: 'Makeup',
    price: 29,
    image:
      'https://readdy.ai/api/search-image?query=Sleek%20thin%20brow%20definer%20pencil%20in%20a%20matte%20black%20and%20gold%20barrel%20on%20a%20glossy%20dark%20surface%20with%20a%20fine%20swatch%20line%2C%20deep%20black%20studio%20background%20with%20subtle%20crimson%20and%20rose%20glow%2C%20cinematic%20lighting%2C%20luxury%20brow%20makeup%20editorial%20photography%2C%20high%20detail%2C%20minimalist%20composition&width=800&height=1000&seq=deesse-product-24&orientation=portrait',
    tagline: 'Hair-thin precision',
    description:
      'A micro-tip brow pencil that draws hair-like strokes with a natural finish. Smudge-proof, buildable, and endlessly blendable.',
    rating: 4.6,
    reviews: 274,
    shades: ['Blonde', 'Taupe', 'Brun', 'Ébène'],
    tags: [],
  },
  {
    id: 'brume-lumineuse',
    name: 'Brume Lumineuse Radiance Mist',
    category: 'Skincare',
    price: 42,
    image:
      'https://readdy.ai/api/search-image?query=Luxury%20facial%20mist%20in%20an%20elegant%20frosted%20bottle%20with%20a%20fine%20spray%20head%20and%20a%20dewy%20droplet%20on%20a%20dark%20reflective%20surface%2C%20black%20studio%20background%20with%20soft%20rose%20pink%20and%20crimson%20glow%2C%20cinematic%20lighting%2C%20high-end%20skincare%20editorial%20photography%2C%20high%20detail%2C%20minimalist%20elegant%20composition&width=800&height=1000&seq=deesse-product-25&orientation=portrait',
    tagline: 'A drink for the skin',
    description:
      'An ultra-fine mist of hyaluronic acid, rosewater, and niacinamide that instantly hydrates, sets makeup, and revives a tired complexion.',
    rating: 4.8,
    reviews: 452,
    tags: ['New'],
  },
  {
    id: 'rouge-satin',
    name: 'Rouge Satin Lipstick',
    category: 'Makeup',
    price: 42,
    image:
      'https://readdy.ai/api/search-image?query=Classic%20satin%20finish%20lipstick%20in%20a%20gold%20and%20black%20case%20with%20a%20soft%20rose%20swatch%20stroke%20on%20a%20dark%20reflective%20surface%2C%20black%20studio%20background%20with%20soft%20crimson%20and%20rose%20pink%20gradient%20glow%2C%20cinematic%20dramatic%20lighting%2C%20luxury%20lipstick%20editorial%20photography%2C%20ultra%20detailed%2C%20minimalist%20composition&width=800&height=1000&seq=deesse-product-26&orientation=portrait',
    tagline: 'A softer kind of bold',
    description:
      'A creamy satin lipstick with a cushioned, semi-luminous finish. Colour-rich, non-drying, and effortlessly elegant on every skin tone.',
    rating: 4.7,
    reviews: 588,
    shades: ['Rose Satin', 'Corail', 'Framboise', 'Nude Rosé'],
    tags: ['Bestseller'],
  },
  {
    id: 'ambre-noir-parfum',
    name: 'Ambre Noir Eau de Parfum',
    category: 'Fragrance',
    price: 195,
    image:
      'https://readdy.ai/api/search-image?query=Masculine%20dark%20amber%20perfume%20bottle%20with%20a%20heavy%20gold%20cap%20on%20a%20black%20reflective%20surface%2C%20deep%20black%20studio%20background%20with%20deep%20crimson%20and%20rose%20pink%20gradient%20glow%2C%20cinematic%20dramatic%20lighting%2C%20luxury%20fragrance%20editorial%20photography%2C%20ultra%20detailed%2C%20sophisticated%20minimalist%20composition&width=800&height=1000&seq=deesse-product-27&orientation=portrait',
    tagline: 'Warm, golden, unforgettable',
    description:
      'A rich oriental of amber, vanilla bourbon, and smoked oud. Deeply sensual and long-wearing — a scent that announces you before you enter.',
    rating: 4.9,
    reviews: 771,
    tags: ['Icon', 'Limited'],
  },
  {
    id: 'cushion-eclat',
    name: 'Cushion Éclat de Teint',
    category: 'Makeup',
    price: 56,
    image:
      'https://readdy.ai/api/search-image?query=Luxury%20cushion%20foundation%20compact%20open%20revealing%20a%20saturated%20sponge%20and%20a%20mirrored%20lid%20in%20gold%20casing%20on%20a%20dark%20reflective%20surface%2C%20black%20studio%20background%20with%20soft%20rose%20and%20crimson%20glow%2C%20cinematic%20lighting%2C%20high-end%20makeup%20editorial%20photography%2C%20high%20detail%2C%20minimalist%20elegant%20composition&width=800&height=1000&seq=deesse-product-28&orientation=portrait',
    tagline: 'Dewy, buildable, effortless',
    description:
      'A cushion compact of luminous, buildable coverage with SPF and skincare actives. Tap on for a fresh, my-skin-but-better finish anywhere.',
    rating: 4.8,
    reviews: 634,
    shades: ['Clair', 'Naturel', 'Doré', 'Caramel'],
    tags: ['New', 'Bestseller'],
  },
];

export const products: Product[] = seedProducts.map((p, i) => normalizeProduct(p, i));

export const testimonials = [
  {
    name: 'Camille Laurent',
    role: 'Beauty Editor, Paris',
    quote:
      'déesse feels less like shopping and more like stepping into a couture atelier. Every product is a ritual, every detail is considered.',
    rating: 5,
  },
  {
    name: 'Avery Thompson',
    role: 'Creative Director',
    quote:
      'The Lumière Serum gave me the glow I\u2019ve spent years chasing in filters. This is the most beautiful skincare I\u2019ve ever owned.',
    rating: 5,
  },
  {
    name: 'Sofia Marchetti',
    role: 'Makeup Artist',
    quote:
      'Velvet Rouge is the only lipstick my kit can\u2019t live without. It photographs like a dream and wears like couture.',
    rating: 5,
  },
];