import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <OrderProvider>
            <RouterProvider router={router} />
          </OrderProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
