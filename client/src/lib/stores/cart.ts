import create from 'zustand';

export type Cart = {
  productId: string;
  productTitle: string;
  productImage: string;
  variantId: number;
  variantTitle: string;
  variantPrice: number;
  variantQuantity: number;
};

type CartStore = {
  cart: Cart[];
  addToCart: (newItem: Cart) => void;
  updateCartItemQuantity: (id: number, quantity: number) => void;
};

const getLocalStorage = (key: string) => JSON.parse(localStorage.getItem(key) || '[]');
const setLocalStorage = (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value));

const useCartStore = create<CartStore>((set, get) => ({
  cart: getLocalStorage('cart') || [],
  addToCart: (newItem) => {
    // empty cart
    const { cart } = get();
    if (cart.length === 0) {
      setLocalStorage('cart', [...cart, newItem]);

      set((state) => ({
        ...state,
        cart: [...cart, newItem],
      }));
    } else {
      let newCart = [...cart];
      let itemAdded = false;
      // loop through all cart items to check if variant
      // already exists and update quantity
      newCart.forEach((item) => {
        if (item.variantId === newItem.variantId) {
          item.variantQuantity += newItem.variantQuantity;
          itemAdded = true;
        }
      });

      let newCartWithItem: Cart[] = [...newCart];
      if (!itemAdded) {
        // if its a new item than add it to the end
        newCartWithItem = [...newCart, newItem];
      }

      setLocalStorage('cart', newCartWithItem);

      set((state) => ({
        ...state,
        cart: newCartWithItem,
      }));
    }
  },
  updateCartItemQuantity: (id: number, quantity: number) => {
    let newQuantity = Math.floor(quantity);
    if (quantity === null) {
      newQuantity = 1;
    }
    const { cart } = get();
    let newCart = [...cart];
    newCart.forEach((item) => {
      if (item.variantId === id) {
        item.variantQuantity = newQuantity;
      }
    });

    // take out zeroes items
    newCart = newCart.filter((i) => i.variantQuantity !== 0);
    setLocalStorage('cart', newCart);
    set((state) => ({
      ...state,
      cart: newCart,
    }));
  },
}));

export default useCartStore;
