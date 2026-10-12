export type HomePhoto = {
  alt: string;
  credit: string;
  href: string;
  source: 'Unsplash' | 'Pexels';
  note: string;
  src: string;
  srcSet: string;
  width: number;
  height: number;
};

const frame = { width: 1600, height: 1068 };

function photo(name: string, widths: number[], fields: Omit<HomePhoto, 'src' | 'srcSet' | 'width' | 'height'>): HomePhoto {
  return {
    ...fields,
    ...frame,
    src: `/images/${name}-${widths[widths.length - 1]}.webp`,
    srcSet: widths.map(width => `/images/${name}-${width}.webp ${width}w`).join(', '),
  };
}

export const homePhotos = {
  cafe: photo('cafe-counter', [640, 960, 1600], {
    alt: 'Illustrative photo of customers at a cafe counter.',
    credit: 'Pavel Danilyuk',
    href: 'https://www.pexels.com/photo/a-woman-standing-behind-the-counter-of-a-coffee-shop-6612738/',
    source: 'Pexels',
    note: 'Not a Clearfig client.',
  }),
  data: photo('data-screen', [960, 1600], {
    alt: 'Illustrative photo of charts and numbers on a laptop screen.',
    credit: 'Antoni Shkraba',
    href: 'https://www.pexels.com/photo/statistics-displayed-on-a-monitor-5466250/',
    source: 'Pexels',
    note: 'Not a Clearfig client.',
  }),
  products: photo('product-bottles', [960, 1600], {
    alt: 'Illustrative photo of bottled products on a pink surface.',
    credit: 'pmv chamara',
    href: 'https://unsplash.com/photos/a-group-of-bottles-of-skin-care-products-on-a-pink-background-5NeK1ZvgCBc',
    source: 'Unsplash',
    note: 'Not a Clearfig client.',
  }),
  team: photo('team-table', [960, 1600], {
    alt: 'Illustrative photo of a team working around a laptop.',
    credit: 'Annie Spratt',
    href: 'https://unsplash.com/photos/group-of-people-using-laptop-computer-QckxruozjRg',
    source: 'Unsplash',
    note: 'Not a Clearfig client.',
  }),
  store: photo('clothing-store', [960, 1600], {
    alt: 'Illustrative photo of a clothing store with shirts on racks.',
    credit: 'Clark Street Mercantile',
    href: 'https://unsplash.com/photos/clothes-store-interior-P3pI6xzovu0',
    source: 'Unsplash',
    note: 'Not a Clearfig client.',
  }),
  counter: photo('cafe-payment', [960, 1600], {
    alt: 'Illustrative photo of a card payment at a cafe counter.',
    credit: 'Clay Banks',
    href: 'https://unsplash.com/photos/man-paying-using-credit-card-oNm9NkTFLfA',
    source: 'Unsplash',
    note: 'Not a Clearfig client.',
  }),
  pour: photo('coffee-pour', [960, 1600], {
    alt: 'Illustrative photo of two people pouring coffee in a cafe.',
    credit: 'Nathan Dumlao',
    href: 'https://unsplash.com/photos/two-person-pouring-coffee-with-piled-cups-eksqjXTLpak',
    source: 'Unsplash',
    note: 'Not the founders.',
  }),
};
