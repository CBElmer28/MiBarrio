export const restaurants = [
  {
    id: 1,
    name: 'Mc Donalds',
    rating: 4.7,
    type: 'Restaurante',
    categories: ['Hamburguesa', 'Pollo'],
    image: require('../assets/images/mcdonalds.jpg'),
    deliveryCost: 'Gratis',
    time: '20 min',
  },
  {
    id: 2,
    name: 'Burger King',
    rating: 4.3,
    type: 'Restaurante',
    categories: ['Hamburguesa'],
    image: require('../assets/images/burgerking.jpg'),
    deliveryCost: 'Gratis',
    time: '25 min',
  },
  {
    id: 3,
    name: 'Starbucks',
    rating: 4.0,
    type: 'Cafetería',
    categories: ['Café', 'Postres'],
    image: require('../assets/images/starbucks.jpg'),
    deliveryCost: 'S/ 5.00',
    time: '15 min',
  },
  {
    id: 4,
    name: 'Pizza Hut',
    rating: 4.2,
    type: 'Restaurante',
    categories: ['Pizza'],
    image: require('../assets/images/pizzahut.jpg'),
    deliveryCost: 'S/ 3.00',
    time: '30 min',
  },
  {
    id: 5,
    name: 'KFC',
    rating: 4.5,
    type: 'Restaurante',
    categories: ['Pollo'],
    image: require('../assets/images/kfc.jpg'),
    deliveryCost: 'Gratis',
    time: '22 min',
  },
  {
    id: 6,
    name: 'Dunkin Donuts',
    rating: 4.1,
    type: 'Cafetería',
    categories: ['Postres', 'Café'],
    image: require('../assets/images/dunkin.jpg'),
    deliveryCost: 'S/ 4.00',
    time: '18 min',
  },
  {
    id: 7,
    name: 'Torito Grill',
    rating: 4.8,
    type: 'Restaurante',
    categories: ['Pollo', "Parrillas"],
    image: require('../assets/images/toritogrill.jpeg'),
    deliveryCost: 'Gratis',
    time: '20 min',
  },
];

export const foods = [
  {
    id: 101,
    name: 'Pizza Europea',
    rating: 4.5,
    type: 'Comida',
    categories: ['Pizza'],
    image: require('../assets/images/pizzaeuropea.jpg'),
    price: 40,
    restaurantId: 4, // Pizza Hut
  },
  {
    id: 102,
    name: 'Pizza Buffalo',
    rating: 4.4,
    type: 'Comida',
    categories: ['Pizza'],
    image: require('../assets/images/pizzabuffalo.jpg'),
    price: 45,
    restaurantId: 4, // Pizza Hut
  },
  {
    id: 103,
    name: 'Burger Bistro',
    rating: 4.6,
    type: 'Comida',
    categories: ['Hamburguesa'],
    image: require('../assets/images/burgerbistro.jpg'),
    price: 35,
    restaurantId: 1, // Mc Donalds
  },
  {
    id: 104,
    name: 'Pollo Crispy',
    rating: 4.3,
    type: 'Comida',
    categories: ['Pollo'],
    image: require('../assets/images/pollocrispy.jpg'),
    price: 38,
    restaurantId: 5, // KFC
  },
  {
    id: 105,
    name: 'Café Latte',
    rating: 4.2,
    type: 'Bebida',
    categories: ['Café'],
    image: require('../assets/images/cafelatte.jpg'),
    price: 15,
    restaurantId: 3, // Starbucks
  },
  {
    id: 106,
    name: 'Dona Glaseadas',
    rating: 4.1,
    type: 'Postre',
    categories: ['Postres'],
    image: require('../assets/images/dona.jpg'),
    price: 12,
    restaurantId: 6, // Dunkin Donuts
  },
  {
    id: 107,
    name: 'Combo Hamburguesa BBQ',
    rating: 4.7,
    type: 'Comida',
    categories: ['Hamburguesa'],
    image: require('../assets/images/bbqcombo.jpg'),
    price: 48,
    restaurantId: 2, // Burger King
  },
  {
    id: 108,
    name: 'Café Mocha',
    rating: 4.0,
    type: 'Bebida',
    categories: ['Café'],
    image: require('../assets/images/mocha.jpg'),
    price: 16,
    restaurantId: 3, // Starbucks
  },
  {
    id: 109,
    name: 'Big Mac',
    rating: 4.8,
    type: 'Comida',
    categories: ['Hamburguesa'],
    image: require('../assets/images/burgerbistro.jpg'), // Reutilizando imagen
    price: 25,
    restaurantId: 1, // Mc Donalds
  },
  {
    id: 110,
    name: 'McNuggets',
    rating: 4.6,
    type: 'Comida',
    categories: ['Pollo'],
    image: require('../assets/images/pollocrispy.jpg'), // Reutilizando imagen
    price: 20,
    restaurantId: 1, // Mc Donalds
  },
  {
    id: 111,
    name: 'Whopper',
    rating: 4.7,
    type: 'Comida',
    categories: ['Hamburguesa'],
    image: require('../assets/images/bbqcombo.jpg'), // Reutilizando imagen
    price: 30,
    restaurantId: 2, // Burger King
  },
  {
    id: 112,
    name: 'Bucket Familiar',
    rating: 4.9,
    type: 'Comida',
    categories: ['Pollo'],
    image: require('../assets/images/pollocrispy.jpg'), // Reutilizando imagen
    price: 55,
    restaurantId: 5, // KFC
  },
  {
    id: 113,
    name: 'Frappuccino',
    rating: 4.5,
    type: 'Bebida',
    categories: ['Café'],
    image: require('../assets/images/cafelatte.jpg'), // Reutilizando imagen
    price: 18,
    restaurantId: 3, // Starbucks
  },
  {
    id: 114,
    name: 'Parrilla Mixta',
    rating: 4.9,
    type: 'Comida',
    categories: ['Parrillas'],
    image: require('../assets/images/pollocrispy.jpg'), // Reutilizando imagen
    price: 65,
    restaurantId: 7, // Torito Grill
  },
];