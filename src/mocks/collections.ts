export interface CuratedCollection {
  id: string;
  name: string;
  tagline: string;
  description: string;
  to: string;
  image: string;
  itemCount: number;
}

export const curatedCollections: CuratedCollection[] = [
  {
    id: 'icon-edit',
    name: 'The Icon Edit',
    tagline: 'Most coveted',
    description: 'The defining pieces of the maison — worn, refilled, and loved the world over.',
    to: '/shop?tag=Bestseller',
    image:
      'https://readdy.ai/api/search-image?query=Luxury%20beauty%20still%20life%20with%20crimson%20lipstick%20and%20gold%20compacts%20arranged%20on%20black%20silk%20fabric%2C%20deep%20black%20studio%20background%20with%20cinematic%20crimson%20and%20rose%20pink%20gradient%20glow%2C%20dramatic%20editorial%20lighting%2C%20high-end%20beauty%20magazine%20cover%20aesthetic%2C%20ultra%20detailed%20elegant%20composition&width=1000&height=1200&seq=deesse-curated-01&orientation=portrait',
    itemCount: 12,
  },
  {
    id: 'evening-ritual',
    name: 'The Evening Ritual',
    tagline: 'After hours',
    description: 'A slow, sensorial routine of cleansing, oils, and night treatments.',
    to: '/shop?category=Skincare',
    image:
      'https://readdy.ai/api/search-image?query=Moody%20nighttime%20skincare%20ritual%20scene%20with%20serum%20droppers%20and%20cream%20jars%20lit%20by%20warm%20candle-like%20glow%20on%20a%20dark%20marble%20surface%2C%20deep%20black%20background%20with%20soft%20crimson%20and%20rose%20pink%20light%2C%20cinematic%20luxurious%20atmosphere%2C%20high-end%20editorial%20photography%2C%20elegant%20minimalist%20composition&width=1000&height=1200&seq=deesse-curated-02&orientation=portrait',
    itemCount: 8,
  },
  {
    id: 'bare-radiance',
    name: 'Bare Radiance',
    tagline: 'Skin-first beauty',
    description: 'Second-skin bases and dewy mists for a luminous, barely-there finish.',
    to: '/shop?category=Makeup',
    image:
      'https://readdy.ai/api/search-image?query=Soft%20dewy%20makeup%20flatlay%20with%20foundation%20cushions%2C%20radiant%20mists%20and%20pearlescent%20powder%20on%20pale%20silk%2C%20warmed%20by%20rose%20pink%20and%20crimson%20glow%20on%20a%20dark%20backdrop%2C%20cinematic%20gentle%20lighting%2C%20luxury%20beauty%20editorial%20photography%2C%20elegant%20minimalist%20composition&width=1000&height=1200&seq=deesse-curated-03&orientation=portrait',
    itemCount: 9,
  },
  {
    id: 'gift-guide',
    name: 'The Gift Guide',
    tagline: 'For the divine',
    description: 'Beautifully boxed treasures and signature sets, ready to be gifted.',
    to: '/shop',
    image:
      'https://readdy.ai/api/search-image?query=Luxury%20beauty%20gift%20set%20with%20crimson%20ribbon%2C%20gold%20accents%20and%20elegant%20product%20boxes%20on%20a%20dark%20reflective%20surface%2C%20deep%20black%20background%20with%20warm%20crimson%20and%20rose%20pink%20glow%2C%20cinematic%20festive%20lighting%2C%20high-end%20editorial%20gift%20photography%2C%20ultra%20detailed%20sophisticated%20composition&width=1000&height=1200&seq=deesse-curated-04&orientation=portrait',
    itemCount: 10,
  },
];

export interface CraftStep {
  index: string;
  title: string;
  description: string;
  icon: string;
}

export const craftSteps: CraftStep[] = [
  {
    index: '01',
    title: 'Sourced with intention',
    description:
      'Rare botanicals and skin-identical actives, traced to responsible, small-batch growers across France, Japan, and Morocco.',
    icon: 'ri-leaf-line',
  },
  {
    index: '02',
    title: 'Composed by hand',
    description:
      'Each formula is blended in our Paris atelier by perfumers and cosmetic chemists, then rested until it performs flawlessly.',
    icon: 'ri-flask-line',
  },
  {
    index: '03',
    title: 'Tested with care',
    description:
      'Dermatologist-reviewed and rigorously tested on volunteers — never on animals. Clean, vegan, and thoughtfully formulated.',
    icon: 'ri-heart-2-line',
  },
  {
    index: '04',
    title: 'Finished as objet',
    description:
      'Poured into weighty, re-fillable vessels designed to be displayed — beauty you keep, not just use.',
    icon: 'ri-vip-diamond-line',
  },
];

export interface Adviser {
  name: string;
  role: string;
  specialty: string;
  avatar: string;
}

export const advisers: Adviser[] = [
  {
    name: 'Élise Moreau',
    role: 'Lead Skin Therapist',
    specialty: 'Barrier repair & sensitivity',
    avatar:
      'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20an%20elegant%20female%20beauty%20therapist%20in%20a%20black%20blazer%20against%20a%20deep%20black%20studio%20backdrop%20with%20soft%20crimson%20glow%2C%20gentle%20cinematic%20lighting%2C%20luxury%20brand%20editorial%20headshot%2C%20high%20detail%2C%20minimal%20composition&width=400&height=400&seq=deesse-adviser-01&orientation=squarish',
  },
  {
    name: 'Naomi Adeyemi',
    role: 'Makeup Artist',
    specialty: 'Complexion & glow',
    avatar:
      'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20confident%20Black%20female%20makeup%20artist%20smiling%20softly%20against%20a%20deep%20black%20studio%20backdrop%20with%20subtle%20rose%20pink%20glow%2C%20cinematic%20lighting%2C%20luxury%20brand%20editorial%20headshot%2C%20high%20detail%2C%20minimal%20composition&width=400&height=400&seq=deesse-adviser-02&orientation=squarish',
  },
  {
    name: 'Camille Laurent',
    role: 'Fragrance Curator',
    specialty: 'Signature scent profiles',
    avatar:
      'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20poised%20female%20fragrance%20curator%20against%20a%20deep%20black%20studio%20backdrop%20with%20warm%20crimson%20glow%2C%20cinematic%20editorial%20lighting%2C%20luxury%20brand%20headshot%2C%20high%20detail%2C%20minimal%20elegant%20composition&width=400&height=400&seq=deesse-adviser-03&orientation=squarish',
  },
];

export interface SocialShot {
  image: string;
  handle: string;
  likes: string;
}

export const socialShots: SocialShot[] = [
  {
    image:
      'https://readdy.ai/api/search-image?query=Top%20down%20flatlay%20of%20crimson%20lipstick%2C%20gold%20compact%20and%20rose%20petals%20on%20black%20silk%2C%20warm%20cinematic%20glow%2C%20luxury%20beauty%20social%20media%20aesthetic%2C%20high%20detail%2C%20elegant%20composition&width=600&height=600&seq=deesse-social-01&orientation=squarish',
    handle: '@leahlux',
    likes: '4.2k',
  },
  {
    image:
      'https://readdy.ai/api/search-image?query=Dewy%20close%20up%20of%20glowing%20skin%20holding%20a%20gold%20serum%20dropper%2C%20soft%20rose%20pink%20and%20crimson%20lighting%20on%20a%20dark%20backdrop%2C%20luxury%20beauty%20social%20media%20aesthetic%2C%20cinematic%2C%20high%20detail%2C%20elegant%20composition&width=600&height=600&seq=deesse-social-02&orientation=squarish',
    handle: '@amara.beauty',
    likes: '6.8k',
  },
  {
    image:
      'https://readdy.ai/api/search-image?query=Elegant%20perfume%20bottle%20resting%20on%20dark%20reflective%20surface%20with%20soft%20red%20glow%20and%20shadow%2C%20luxury%20fragrance%20social%20media%20aesthetic%2C%20cinematic%20moody%20lighting%2C%20high%20detail%2C%20minimalist%20composition&width=600&height=600&seq=deesse-social-03&orientation=squarish',
    handle: '@scentdiaires',
    likes: '3.1k',
  },
  {
    image:
      'https://readdy.ai/api/search-image?query=Luxury%20skincare%20bottles%20lined%20up%20on%20a%20dark%20marble%20ledge%20with%20rose%20pink%20backlight%2C%20editorial%20social%20media%20aesthetic%2C%20cinematic%20glow%2C%20high%20detail%2C%20elegant%20minimalist%20composition&width=600&height=600&seq=deesse-social-04&orientation=squarish',
    handle: '@theglossedit',
    likes: '5.5k',
  },
  {
    image:
      'https://readdy.ai/api/search-image?query=Hands%20applying%20a%20shimmering%20gold%20body%20oil%20to%20skin%2C%20warm%20crimson%20and%20rose%20lighting%20on%20a%20dark%20backdrop%2C%20luxury%20beauty%20social%20media%20aesthetic%2C%20cinematic%2C%20high%20detail%2C%20elegant%20composition&width=600&height=600&seq=deesse-social-05&orientation=squarish',
    handle: '@maison.muse',
    likes: '2.9k',
  },
  {
    image:
      'https://readdy.ai/api/search-image?query=Close%20up%20of%20a%20bold%20red%20manicure%20holding%20a%20lipstick%20bullet%2C%20deep%20black%20background%20with%20crimson%20glow%2C%20luxury%20beauty%20social%20media%20aesthetic%2C%20cinematic%20dramatic%20lighting%2C%20high%20detail%2C%20minimal%20composition&width=600&height=600&seq=deesse-social-06&orientation=squarish',
    handle: '@rouge.ritual',
    likes: '7.4k',
  },
];