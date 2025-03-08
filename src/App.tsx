import React, { useState } from 'react';
import { ShoppingCart, Heart, User, Search, Mail, X, ChevronLeft, ChevronRight, Filter, SortDesc, Coins, Plus, Minus } from 'lucide-react';
import bag from './Bag.jpg';
import shirt from './Shirt.jpg';
import cap from './Cap.jpg';

// Mock data
const products = [
  {
    id: 1,
    name: "Trendy Caps",
    price: 199.99,
    points: 1999,
    description: "Trendy cap with a sleek design, offering both style and sun protection for any occasion.",
    image: bag,
    category: "Cloths",
    stock: 5
  },
  {
    id: 2,
    name: "Cool Tees",
    price: 299.99,
    points: 2999,
    description: "Comfortable, stylish t-shirt with a modern design, perfect for everyday wear.",
    image: shirt,
    category: "Cloths",
    stock: 3
  },
  {
    id: 3,
    name: "Leather Weekend Bag",
    price: 159.99,
    points: 1599,
    description: "Handcrafted genuine leather travel DUrable bag.",
    image: bag,
    category: "Accessories",
    stock: 8
  }
];

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [cart, setCart] = useState([]);
  const [points, setPoints] = useState(5000);
  const [usePoints, setUsePoints] = useState(false);
  const [showPointsWarning, setShowPointsWarning] = useState(false);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartPoints = cart.reduce((total, item) => total + (item.points * item.quantity), 0);

  const canAddToCart = (product) => {
    const currentQuantity = cart.find(item => item.id === product.id)?.quantity || 0;
    const inStock = currentQuantity < product.stock;
    const hasEnoughPoints = usePoints ? points >= (cartPoints + product.points) : true;
    return inStock && hasEnoughPoints;
  };

  const addToCart = (product) => {
    if (!canAddToCart(product)) {
      setShowPointsWarning(true);
      setTimeout(() => setShowPointsWarning(false), 3000);
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + delta;
          if (newQuantity <= 0) return null;
          if (newQuantity > item.stock) return item;
          if (usePoints && (points < cartPoints + (delta * item.points))) return item;
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const handleCheckout = () => {
    if (usePoints) {
      if (points >= cartPoints) {
        setPoints(points - cartPoints);
        setCart([]);
        alert('Purchase successful! .');
      } else {
        alert('Insufficient points!');
      }
    } else {
      setPoints(points + Math.floor(cartTotal * 10));
      setCart([]);
      alert('Purchase successful! Points earned.');
    }
    setCartOpen(false);
  };

  const filteredProducts = products
    .filter(product => currentCategory === 'All' || product.category === currentCategory)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {showPointsWarning && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {usePoints ? 'Insufficient points!' : 'Item out of stock!'}
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-white text-xl font-bold">Codestrive Store</h1>
              <div className="hidden md:flex space-x-4">
                <button className={`${currentCategory === 'All' ? 'text-white' : 'text-gray-600'}`} onClick={() => setCurrentCategory('All')}>All</button>
                <button className={`${currentCategory === 'Cloths' ? 'text-white' : 'text-white'}`} onClick={() => setCurrentCategory('Cloths')}>Cloths</button>
                <button className={`${currentCategory === 'Accessories' ? 'text-white' : 'text-white'}`} onClick={() => setCurrentCategory('Accessories')}>Accessories</button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-yellow-50 px-4 py-2 rounded-lg">
                <Coins className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-600">{points} points</span>
              </div>
              <div className="relative ">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Heart className="h-6 w-6 text-gray-600" />
              </button>
              <div className="relative">
                <button className="p-2 hover:bg-gray-100 rounded-full" onClick={() => setCartOpen(!cartOpen)}>
                  <ShoppingCart className="h-6 w-6 text-gray-600" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cart.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  )}
                </button>
                {cartOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50">
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">Shopping Cart</h3>
                        <div className="text-sm text-yellow-600">
                          Available Points: {points}
                        </div>
                      </div>
                      {cart.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Your cart is empty</p>
                      ) : (
                        <div className="space-y-3">
                          {cart.map(item => (
                            <div key={item.id} className="flex items-center space-x-3">
                              <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded" />
                              <div className="flex-1">
                                <h4 className="text-sm font-medium">{item.name}</h4>
                                <div className="flex items-center justify-between mt-1">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      ${item.price} × {item.quantity}
                                    </p>
                                    <p className="text-xs text-yellow-600">
                                      {item.points} points each
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <button 
                                      onClick={() => updateQuantity(item.id, -1)}
                                      className="p-1 hover:bg-gray-100 rounded"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="text-sm font-medium">{item.quantity}</span>
                                    <button 
                                      onClick={() => updateQuantity(item.id, 1)}
                                      className={`p-1 rounded ${
                                        item.quantity < item.stock && (!usePoints || points >= cartPoints + item.points)
                                          ? 'hover:bg-gray-100'
                                          : 'opacity-50 cursor-not-allowed'
                                      }`}
                                      disabled={item.quantity >= item.stock || (usePoints && points < cartPoints + item.points)}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          <div className="border-t pt-3 mt-3">
                            <div className="flex items-center justify-between mb-2">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={usePoints}
                                  onChange={(e) => setUsePoints(e.target.checked)}
                                  className="rounded text-blue-600"
                                />
                                <span className="text-sm">Pay with points</span>
                              </label>
                              <span className="text-sm text-yellow-600">
                                {cartPoints} points needed
                              </span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Total</span>
                              <span>${cartTotal.toFixed(2)}</span>
                            </div>
                          </div>
                          <button 
                            onClick={handleCheckout}
                            className={`w-full py-2 rounded-lg ${
                              usePoints
                                ? points >= cartPoints
                                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                            disabled={usePoints && points < cartPoints}
                          >
                            {usePoints ? 'Pay with Points' : 'Checkout'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <User className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

<div className='bg-black'> 
      {/* Featured Products Carousel */}
      <div className="max-w-7xl mx-auto px-4 py-8 bg-black">
        <div className="relative">
          <div className="overflow-hidden">
            <div className=" flex transition-transform duration-300" style={{ transform: `translateX(-${carouselIndex * 100}%)` }}>
              {products.map(product => (
                <div key={product.id} className="w-full flex-shrink-0">
                  <div className="relative h-96">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                    <div className="bg-black absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <h2 className= "text-white text-2xl  font-bold">{product.name}</h2>
                      <p className="text-white/90 mt-2">{product.description}</p>
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <span className="text-white text-xl">${product.price}</span>
                          <span className="text-yellow-400 text-sm ml-2">or {product.points} points</span>
                        </div>
                        <button 
                          onClick={() => addToCart(product)}
                          className={`px-6 py-2 rounded-lg ${
                            canAddToCart(product)
                              ? 'bg-white text-black hover:bg-gray-100'
                              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          }`}
                          disabled={!canAddToCart(product)}
                        >
                          {canAddToCart(product) ? 'Add to Cart' : usePoints ? 'Insufficient Points' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setCarouselIndex(i => (i > 0 ? i - 1 : products.length - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => setCarouselIndex(i => (i < products.length - 1 ? i + 1 : 0))}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8  bg-black" >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Products</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <SortDesc className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            <button className="flex items-center space-x-2 bg-white border rounded-lg px-4 py-2 hover:bg-gray-50">
              <Filter className="h-5 w-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="bg-black grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-black rounded-lg shadow-sm overflow-hidden group">
              <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
                <button
                  onClick={() => setQuickViewProduct(product)}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  Quick View
                </button>
              </div>
              <div className="p-4 bg-black">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-white mt-1">{product.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="text-white text-lg font-bold">${product.price}</span>
                    <span className="text-sm text-yellow-600 ml-2">or {product.points} points</span>
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className={`px-4 py-2 rounded-lg ${
                      canAddToCart(product)
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!canAddToCart(product)}
                  >
                    {canAddToCart(product) ? 'Add to Cart' : usePoints ? 'Insufficient Points' : 'Out of Stock'}
                  </button>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Stock: {product.stock} units
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-300 mb-8">Get the latest updates on new products and upcoming sales.</p>
          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }} className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900"
              required
            />
            <button type="submit" className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{quickViewProduct.name}</h3>
                <button onClick={() => setQuickViewProduct(null)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full md:w-1/2 h-64 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="text-gray-600 mb-4">{quickViewProduct.description}</p>
                  <div className="mb-4">
                    <p className="text-2xl font-bold">${quickViewProduct.price}</p>
                    <p className="text-sm text-yellow-600">or {quickViewProduct.points} points</p>
                    <p className="text-sm text-gray-500 mt-2">Stock: {quickViewProduct.stock} units</p>
                  </div>
                  <button 
                    onClick={() => {
                      addToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className={`w-full py-2 rounded-lg ${
                      canAddToCart(quickViewProduct)
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!canAddToCart(quickViewProduct)}
                  >
                    {canAddToCart(quickViewProduct) ? 'Add to Cart' : usePoints ? 'Insufficient Points' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default App;



