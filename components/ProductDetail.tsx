
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { generateDescription } from '../services/geminiService';
import Spinner from './Spinner';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const foundProduct = PRODUCTS.find(p => p.id === parseInt(id || ''));
    setProduct(foundProduct);
    setDescription(foundProduct?.description || '');
  }, [id]);

  const handleGenerateDescription = async () => {
    if (!product) return;
    setIsLoading(true);
    const newDesc = await generateDescription(product);
    setDescription(newDesc);
    setIsLoading(false);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Link to="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
          &larr; Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
      <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover object-center" />
      </div>

      <div className="flex flex-col justify-center">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">{product.name}</h1>
        <p className="mt-3 text-3xl text-gray-900">${product.price.toFixed(2)}</p>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900">Description</h3>
          <div className="mt-2 text-base text-gray-600 space-y-4">
             <p>{description}</p>
          </div>
          <button
            onClick={handleGenerateDescription}
            disabled={isLoading}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-gray-400"
          >
            {isLoading ? <Spinner className="w-5 h-5 mr-2" /> : 
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
            }
            {isLoading ? 'Generating...' : 'Generate AI Description'}
          </button>
        </div>

        <div className="mt-8">
          <div className="flex items-center">
             <label htmlFor="quantity" className="mr-4 font-medium text-gray-700">Quantity</label>
             <input 
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
             />
          </div>
          <button
            onClick={handleAddToCart}
            className="mt-6 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {addedToCart ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
