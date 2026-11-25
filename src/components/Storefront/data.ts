const photo = (id: string, width: number) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const heroSlides = [
	{
		image: photo('photo-1605100804763-247f67b3557e', 1600),
		alt: 'Hand wearing an intricate 925 sterling silver filigree band ring',
	},
	{
		image: photo('photo-1515562141207-7a88fb7ce338', 1600),
		alt: 'Fine sterling silver chain and pendant detail in natural light',
	},
	{
		image: photo('photo-1611591437281-460bfbe1220a', 1600),
		alt: 'Sculpted sterling silver cuff bracelet',
	},
];

export const products = [
	{
		id: 'p1',
		badge: 'Bestseller',
		title: 'Heart Station Chain Bracelet',
		metal: '18k Gold Vermeil / Silver',
		swatch: '#D6B97B',
		originalPrice: 85,
		price: 68,
		image: photo('photo-1611591437281-460bfbe1220a', 600),
	},
	{
		id: 'p2',
		badge: 'Bestseller',
		title: 'Heart Charm Necklace',
		metal: '18k Gold Vermeil / Silver',
		swatch: '#D6B97B',
		originalPrice: 105,
		price: 84,
		image: photo('photo-1599643478518-a784e5dc4c8f', 600),
	},
	{
		id: 'p3',
		badge: 'New in',
		title: 'The Angellica Moonstone Cabochon Ring',
		metal: '925 Sterling Silver',
		swatch: '#D4D6D8',
		price: 120,
		image: photo('photo-1603561591411-07134e71a2a9', 600),
	},
	{
		id: 'p4',
		badge: '',
		title: 'The Ferosia Multi Gemstone Cuff',
		metal: '925 Sterling Silver',
		swatch: '#D4D6D8',
		price: 155,
		image: photo('photo-1573408301185-9146fe634ad0', 600),
	},
	{
		id: 'p5',
		badge: 'Limited',
		title: 'Baguette Sterling Silver Blue Opal & Marcasite Set',
		metal: '925 Sterling Silver',
		swatch: '#A9C8E8',
		price: 135,
		image: photo('photo-1535632066927-ab7c9ab60908', 600),
	},
];

export type StorefrontProduct = (typeof products)[number];

export const categories = [
	{ name: 'Bracelets', image: photo('photo-1611591437281-460bfbe1220a', 900) },
	{ name: 'Earrings', image: photo('photo-1535632066927-ab7c9ab60908', 900) },
	{ name: 'Brooches', image: photo('photo-1599643478518-a784e5dc4c8f', 900) },
	{ name: 'Necklaces', image: photo('photo-1515562141207-7a88fb7ce338', 900) },
];

export const navigation = [
	{ href: '/', label: 'Home' },
	{ href: '#collections-section', label: 'Collections' },
	{ href: '#heritage-section', label: 'About' },
	{ href: '#service-strip', label: 'Shipping & Returns Policy' },
	{ href: '#craftsmen-section', label: 'More' },
];

export const workshopImage = photo('photo-1584302179602-e4c3d3fd629d', 1600);
